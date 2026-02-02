// -------------------- IMPORTS --------------------
import * as admin from "firebase-admin";
import Razorpay from "razorpay";
import {
  onCall,
  HttpsError,
  CallableRequest,
  onRequest,
} from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { setGlobalOptions } from "firebase-functions/v2";
import * as crypto from "crypto";
import {
  onDocumentCreated,
  onDocumentDeleted,
  onDocumentUpdated,
  onDocumentWritten,
} from "firebase-functions/firestore";
import { onSchedule } from "firebase-functions/scheduler";

// -------------------- GLOBAL SETUP --------------------
const BILLING_CURRENCY: "USD" | "INR" = "USD";
setGlobalOptions({ region: "asia-south1", timeoutSeconds: 60, memory: "256MiB" });

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// -------------------- SECRETS --------------------
const RAZORPAY_KEY_ID = defineSecret("RAZORPAY_KEY_ID");
const RAZORPAY_KEY_SECRET = defineSecret("RAZORPAY_KEY_SECRET");
const RAZORPAY_WEBHOOK_SECRET = defineSecret("RAZORPAY_WEBHOOK_SECRET");

const PAYPAL_CLIENT_ID = defineSecret("PAYPAL_CLIENT_ID");
const PAYPAL_CLIENT_SECRET = defineSecret("PAYPAL_CLIENT_SECRET");
const PAYPAL_WEBHOOK_ID = defineSecret("PAYPAL_WEBHOOK_ID");

// -------------------- TYPES --------------------

export interface TopicMeta {
  topicId: string;
  title: string;
  type: "layout" | "question" | "playlist";
  order: number;
}

interface PricingDoc {
  name: string;
  price: number;
  currency?: string;
}

interface RazorpayPaymentEntity {
  id: string;
  order_id: string;
  status: string;
}

interface PayPalWebhookHeaders {
  "paypal-auth-algo": string;
  "paypal-cert-url": string;
  "paypal-transmission-id": string;
  "paypal-transmission-sig": string;
  "paypal-transmission-time": string;
}

interface PayPalVerifyResponse {
  verification_status: "SUCCESS" | "FAILURE";
}

interface PayPalOrderCreateResponse {
  id: string;
  links?: { href: string; rel: string; method: string }[];
}

// -------------------- HELPERS --------------------

function computeExpiryTimestamp(
  purchasedAt: admin.firestore.Timestamp,
  planType: string
): string | null {
  const date = purchasedAt.toDate(); // JS Date object

  const expiry = new Date(date); // Clone date

  if (planType === "Monthly") {
    expiry.setMonth(expiry.getMonth() + 1);
  } else if (planType === "Yearly") {
    expiry.setFullYear(expiry.getFullYear() + 1);
  } else {
    return null; // Lifetime or no-expiry
  }

  return expiry.toISOString();
}

// -------------------- PAYPAL HELPERS --------------------

async function getPayPalAccessToken(): Promise<string> {
  const clientId = PAYPAL_CLIENT_ID.value();
  const clientSecret = PAYPAL_CLIENT_SECRET.value();
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const resp = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`PayPal token error: ${resp.status} ${txt}`);
  }

  const json: unknown = await resp.json();
  if (
    typeof json !== "object" ||
    json === null ||
    !("access_token" in json)
  ) {
    throw new Error("Invalid PayPal token response");
  }

  return (json as { access_token: string }).access_token;
}

async function verifyPayPalWebhook(
  headers: PayPalWebhookHeaders,
  body: unknown
): Promise<boolean> {
  try {
    const accessToken = await getPayPalAccessToken();
    const webhookId = PAYPAL_WEBHOOK_ID.value();

    const resp = await fetch(
      "https://api-m.paypal.com/v1/notifications/verify-webhook-signature",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth_algo: headers["paypal-auth-algo"],
          cert_url: headers["paypal-cert-url"],
          transmission_id: headers["paypal-transmission-id"],
          transmission_sig: headers["paypal-transmission-sig"],
          transmission_time: headers["paypal-transmission-time"],
          webhook_id: webhookId,
          webhook_event: body,
        }),
      }
    );

    if (!resp.ok) return false;

    const json: unknown = await resp.json();
    if (
      typeof json === "object" &&
      json !== null &&
      "verification_status" in json
    ) {
      return (
        (json as PayPalVerifyResponse).verification_status === "SUCCESS"
      );
    }

    return false;
  } catch (err) {
    console.error("verifyPayPalWebhook error:", err);
    return false;
  }
}

// -------------------- TOPIC TRIGGERS (unchanged) --------------------

export const onTopicCreated = onDocumentCreated(
  "topics/{topicId}",
  async (event) => {
    const topic = event.data?.data();
    if (!topic || !topic.chapterId) return;

    const chapterRef = db.collection("chapters").doc(topic.chapterId);
    const snap = await chapterRef.get();
    if (!snap.exists) return;

    const meta: TopicMeta = {
      topicId: event.params.topicId,
      title: topic.title,
      type: topic.type,
      order: topic.order ?? 0,
    };

    await chapterRef.update({
      topicMeta: admin.firestore.FieldValue.arrayUnion(meta),
      totalTopics: admin.firestore.FieldValue.increment(1),
    });
  }
);

export const onTopicUpdated = onDocumentUpdated(
  "topics/{topicId}",
  async (event) => {
    const after = event.data?.after.data();
    if (!after || !after.chapterId) return;

    const chapterRef = db.collection("chapters").doc(after.chapterId);
    const snap = await chapterRef.get();
    if (!snap.exists) return;

    const list = (snap.data()?.topicMeta ?? []) as TopicMeta[];

    const updated = list.map((meta) =>
      meta.topicId === event.params.topicId
        ? { ...meta, title: after.title, type: after.type, order: after.order }
        : meta
    );

    await chapterRef.update({ topicMeta: updated });
  }
);

export const onTopicDeleted = onDocumentDeleted(
  "topics/{topicId}",
  async (event) => {
    const topic = event.data?.data();
    if (!topic || !topic.chapterId) return;

    const chapterRef = db.collection("chapters").doc(topic.chapterId);
    const snap = await chapterRef.get();
    if (!snap.exists) return;

    const list = (snap.data()?.topicMeta ?? []) as TopicMeta[];
    const filtered = list.filter(
      (meta) => meta.topicId !== event.params.topicId
    );

    await chapterRef.update({
      topicMeta: filtered,
      totalTopics: admin.firestore.FieldValue.increment(-1),
    });
  }
);

// -------------------- RAZORPAY & PAYPAL FUNCTIONS (typed, no any) --------------------

type TransactionDoc = {
  userId?: string;
  planType?: string;
  planPrice?: number;
  orderId?: string;
  paymentId?: string | null;
  amountSmallest?: number;
  currency?: string;
  provider?: string;
  status?: string;
  courseId?: string;
  createdAt?: admin.firestore.FieldValue;
  updatedAt?: admin.firestore.FieldValue;
};

/**
 * createPremiumOrder (Razorpay)
 */
export const createPremiumOrder = onCall(
  { secrets: [RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET] },
  async (req: CallableRequest) => {
    try {
      const uid = req.auth?.uid;
      if (!uid) throw new HttpsError("unauthenticated", "Sign in required.");

      const input = req.data;
      if (!input || typeof input !== "object") {
        throw new HttpsError("invalid-argument", "Request data required.");
      }

      const planTypeRaw = (input as { planType?: unknown }).planType;
      if (typeof planTypeRaw !== "string") {
        throw new HttpsError("invalid-argument", "planType must be a string.");
      }
      const planType = planTypeRaw;

      const validPlans = ["Monthly", "Yearly", "Lifetime"];
      if (!validPlans.includes(planType)) {
        throw new HttpsError("invalid-argument", "Invalid planType.");
      }

      // Fetch pricing doc by `name` field
      const pricingSnap = await db.collection("pricing").where("name", "==", planType).limit(1).get();
      if (pricingSnap.empty) {
        throw new HttpsError("not-found", "Pricing not found for planType.");
      }

      const pricingDoc = pricingSnap.docs[0];
      const pricingData = pricingDoc.data();
      if (!pricingData || typeof pricingData.price !== "number") {
        throw new HttpsError("failed-precondition", "Invalid pricing document (missing price).");
      }

      const pricing: PricingDoc = {
        name: pricingData.name,
        price: pricingData.price,
      };

      const key_id = RAZORPAY_KEY_ID.value();
      const key_secret = RAZORPAY_KEY_SECRET.value();
      const razorpay = new Razorpay({ key_id, key_secret });

      const currency = BILLING_CURRENCY;
      const amountSmallest = Math.round(pricing.price * 100);

      const order = await razorpay.orders.create({
        amount: amountSmallest,
        currency,
        receipt: `premium_${uid.substring(0, 6)}_${planType}_${Date.now()}`,
        notes: { userId: uid, planType, pricingDocId: pricingDoc.id },
      });

      const now = admin.firestore.FieldValue.serverTimestamp();

      const txn: TransactionDoc = {
        userId: uid,
        planType,
        planPrice: pricing.price,
        orderId: order.id,
        paymentId: null,
        amountSmallest,
        currency,
        provider: "razorpay",
        status: "pending",
        createdAt: now,
        updatedAt: now,
      };

      await db.collection("transactions").doc(order.id).set(txn);

      return {
        ok: true,
        data: {
          orderId: order.id,
          keyId: key_id,
          amount: amountSmallest,
          currency,
        },
      };
    } catch (err) {
      // Convert unknown → typed error structure
      const errorObj =
        typeof err === "object" && err !== null ? err : { message: String(err) };

      console.error(
        "createPremiumOrder RAW ERROR:",
        JSON.stringify(errorObj, null, 2)
      );

      // Razorpay's error format: { error: { description: string } }
      if (
        typeof (errorObj as { error?: unknown }).error === "object" &&
        (errorObj as { error?: { description?: unknown } }).error !== null
      ) {
        const description = (errorObj as { error?: { description?: unknown } })
          .error?.description;

        if (typeof description === "string") {
          throw new HttpsError("internal", description);
        }
      }

      // Generic JS Error object
      if (
        typeof (errorObj as { message?: unknown }).message === "string"
      ) {
        throw new HttpsError("internal", (errorObj as { message: string }).message);
      }

      // Fallback for unexpected formats
      throw new HttpsError("internal", JSON.stringify(errorObj));
    }
  }
);

/**
 * createPayPalOrder (callable)
 */
export const createPayPalOrder = onCall(
  { secrets: [PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET] },
  async (req: CallableRequest) => {
    try {
      const uid = req.auth?.uid;
      if (!uid) throw new HttpsError("unauthenticated", "Sign in required.");

      const input = req.data;
      if (!input || typeof input !== "object") {
        throw new HttpsError("invalid-argument", "Request data required.");
      }

      const planTypeRaw = (input as { planType?: unknown }).planType;
      if (typeof planTypeRaw !== "string") {
        throw new HttpsError("invalid-argument", "planType must be a string.");
      }
      const planType = planTypeRaw;

      const validPlans = ["Monthly", "Yearly", "Lifetime"];
      if (!validPlans.includes(planType)) {
        throw new HttpsError("invalid-argument", "Invalid planType.");
      }

      const pricingSnap = await db.collection("pricing").where("name", "==", planType).limit(1).get();
      if (pricingSnap.empty) {
        throw new HttpsError("not-found", "Pricing not found for planType.");
      }

      const pricingDoc = pricingSnap.docs[0];
      const pricingData = pricingDoc.data();
      if (!pricingData || typeof pricingData.price !== "number") {
        throw new HttpsError("failed-precondition", "Invalid pricing document (missing price).");
      }

      const pricing: PricingDoc = {
        name: pricingData.name,
        price: pricingData.price,
      };

      const accessToken = await getPayPalAccessToken();
      const value = pricing.price.toFixed(2);
      const currency = BILLING_CURRENCY

      const createResp = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: { currency_code: currency, value },
              description: `${planType} Premium`,
            },
          ],
          application_context: {
            brand_name: "QuantProf",
            user_action: "PAY_NOW",
            return_url: process.env.PAYPAL_RETURN_URL || "https://quantprof.org/paypal/success",
            cancel_url: process.env.PAYPAL_CANCEL_URL || "https://quantprof.org/premium",
          },
        }),
      });

      if (!createResp.ok) {
        const errJson = await createResp.json();
        console.error(
          "PayPal order creation failed:",
          createResp.status,
          JSON.stringify(errJson, null, 2)
        );
        throw new HttpsError("internal", "Failed to create PayPal order");
      }

      const dataJson = (await createResp.json()) as PayPalOrderCreateResponse;
      const approvalLinkObj = (dataJson.links || []).find((l) => l.rel === "approve");
      const approvalUrl = approvalLinkObj?.href;
      const orderId = dataJson.id;

      if (!approvalUrl) {
        console.error("No approval URL from PayPal:", dataJson);
        throw new HttpsError("internal", "No approval URL returned by PayPal");
      }

      const now = admin.firestore.FieldValue.serverTimestamp();
      const txn: TransactionDoc = {
        userId: uid,
        planType,
        planPrice: pricing.price,
        orderId,
        paymentId: null,
        amountSmallest: Math.round(pricing.price * 100),
        currency,
        provider: "paypal",
        status: "pending",
        createdAt: now,
        updatedAt: now,
      };

      await db.collection("transactions").doc(orderId).set(txn);

      return { ok: true, data: { approvalUrl, orderId } };
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      console.error("createPayPalOrder error:", e);
      if (e instanceof HttpsError) throw e;
      throw new HttpsError("internal", e.message || "Failed to create PayPal order");
    }
  }
);

/**
 * razorpayWebhook - HTTP endpoint
 */
export const razorpayWebhook = onRequest(
  { secrets: [RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET] },
  async (req, res) => {
    try {
      const webhookSecret = RAZORPAY_WEBHOOK_SECRET.value();
      const razorpaySignature = (req.headers["x-razorpay-signature"] || "") as string;
      const bodyRaw = req.body ?? {};
      const bodyStr = JSON.stringify(bodyRaw);

      const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(bodyStr).digest("hex");
      if (expectedSignature !== razorpaySignature) {
        console.error("Invalid Razorpay signature");
        res.status(400).send("Invalid signature");
        return;
      }

      const paymentEntity = (bodyRaw as { payload?: { payment?: { entity?: unknown } } }).payload?.payment?.entity;
      if (!paymentEntity || typeof paymentEntity !== "object") {
        res.status(400).send("Missing payment payload");
        return;
      }

      // Narrow paymentEntity
      const payment = paymentEntity as Partial<RazorpayPaymentEntity> & { order_id?: string; id?: string; status?: string };

      const orderId = payment.order_id;
      const paymentId = payment.id;
      const status = payment.status;

      if (!orderId) {
        res.status(400).send("Missing order id in payload");
        return;
      }

      const txnRef = db.collection("transactions").doc(orderId);
      await txnRef.set(
        {
          paymentId: paymentId ?? null,
          status: status === "captured" ? "success" : "failed",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      if (status === "captured") {
        const txnSnap = await txnRef.get();
        const txnData = txnSnap.data() as TransactionDoc | undefined;

        if (txnData && txnData.planType && txnData.userId) {
          const uid = txnData.userId;

          const purchasedAtTs =
            (txnData.createdAt instanceof admin.firestore.Timestamp)
              ? txnData.createdAt
              : admin.firestore.Timestamp.now();
          const expiresAtIso = computeExpiryTimestamp(purchasedAtTs, txnData.planType);

          // NEW: Write expiry to transaction
          await txnRef.set(
            {
              expiresAt: expiresAtIso,
            },
            { merge: true }
          );

          // Update user record
          await db.collection("users").doc(uid).set(
            {
              isPremium: true,
              purchasedAt: purchasedAtTs.toDate().toISOString(),
              expiresAt: expiresAtIso,
              planType: txnData.planType,
              planPrice: txnData.planPrice ?? null,
            },
            { merge: true }
          );
        }
      }

      res.status(200).send("ok");
    } catch (err) {
      console.error("razorpayWebhook error:", err);
      res.status(500).send("internal error");
    }
  }
);

export const capturePayPalOrder = onCall(
  { secrets: [PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET] },
  async (req: CallableRequest) => {
    const uid = req.auth?.uid;
    if (!uid) throw new HttpsError("unauthenticated", "Sign in required.");

    const { orderId } = req.data as { orderId?: string };
    if (!orderId) throw new HttpsError("invalid-argument", "orderId required.");

    const txnRef = db.collection("transactions").doc(orderId);
    const txnSnap = await txnRef.get();

    if (!txnSnap.exists) {
      throw new HttpsError("not-found", "Transaction not found.");
    }

    const txn = txnSnap.data() as TransactionDoc;

    // 🔒 Idempotency guard
    if (txn.status === "success") {
      return { ok: true, alreadyCaptured: true };
    }

    const accessToken = await getPayPalAccessToken();

    const captureResp = await fetch(
      `https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const captureJson = await captureResp.json();

    if (!captureResp.ok) {
      console.error("PayPal capture failed:", captureJson);
      throw new HttpsError("internal", "Payment capture failed.");
    }

    // Validate capture result
    const capture =
      captureJson.purchase_units?.[0]?.payments?.captures?.[0];

    if (!capture || capture.status !== "COMPLETED") {
      console.error("Unexpected capture state:", captureJson);
      throw new HttpsError("internal", "Capture not completed.");
    }

    const purchasedAt = admin.firestore.Timestamp.now();
    if (!txn.planType) {
      console.error("Transaction missing planType:", txn);
      throw new HttpsError(
        "failed-precondition",
        "Transaction missing planType"
      );
    }
    const expiresAtIso = computeExpiryTimestamp(purchasedAt, txn.planType);

    // ✅ Atomic entitlement update
    await Promise.all([
      txnRef.set(
        {
          status: "success",
          paymentId: capture.id,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          expiresAt: expiresAtIso,
        },
        { merge: true }
      ),

      db.collection("users").doc(uid).set(
        {
          isPremium: true,
          purchasedAt: purchasedAt.toDate().toISOString(),
          expiresAt: expiresAtIso,
          planType: txn.planType,
          planPrice: txn.planPrice ?? null,
        },
        { merge: true }
      ),
    ]);

    return { ok: true };
  }
);


/**
 * paypalWebhook - HTTP endpoint
 */
export const paypalWebhook = onRequest(
  { secrets: [PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_WEBHOOK_ID] },
  async (req, res) => {
    try {
      // ---- 1. Verify PayPal signature ----
      const headers: PayPalWebhookHeaders = {
        "paypal-auth-algo": req.headers["paypal-auth-algo"] as string,
        "paypal-cert-url": req.headers["paypal-cert-url"] as string,
        "paypal-transmission-id": req.headers["paypal-transmission-id"] as string,
        "paypal-transmission-sig": req.headers["paypal-transmission-sig"] as string,
        "paypal-transmission-time": req.headers["paypal-transmission-time"] as string,
      };

      const body = req.body;

      const isValid = await verifyPayPalWebhook(headers, body);
      if (!isValid) {
        console.warn("Invalid PayPal webhook signature");
        res.status(400).send("invalid signature");
        return;
      }

      if (!body || typeof body !== "object") {
        res.status(400).send("invalid body");
        return;
      }

      const eventType = (body).event_type as string | undefined;
      if (!eventType) {
        res.status(400).send("missing event_type");
        return;
      }

      // ---- 2. Ignore non-terminal events ----
      if (eventType === "CHECKOUT.ORDER.APPROVED") {
        // approval ≠ capture
        res.status(200).send("ignored");
        return;
      }

      // ---- 3. Handle CAPTURE COMPLETED only ----
      if (eventType !== "PAYMENT.CAPTURE.COMPLETED") {
        res.status(200).send("ignored");
        return;
      }

      const resource = (body).resource;
      if (!resource) {
        res.status(400).send("missing resource");
        return;
      }

      // ---- 4. Extract ORDER ID (ONLY valid source) ----
      const orderId =
        resource?.supplementary_data?.related_ids?.order_id;

      if (!orderId || typeof orderId !== "string") {
        console.warn("Missing order_id in webhook:", resource);
        res.status(400).send("missing order_id");
        return;
      }

      const txnRef = db.collection("transactions").doc(orderId);
      const txnSnap = await txnRef.get();

      // ---- 5. Idempotency guard ----
      if (!txnSnap.exists) {
        console.warn("Transaction not found for order:", orderId);
        res.status(200).send("noop");
        return;
      }

      const txn = txnSnap.data() as TransactionDoc;

      if (txn.status === "success") {
        // already reconciled
        res.status(200).send("noop");
        return;
      }

      // ---- 6. Reconcile transaction ONLY ----
      await txnRef.set(
        {
          status: "success",
          paymentId: resource.id ?? null, // capture id
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      res.status(200).send("ok");
    } catch (err) {
      console.error("paypalWebhook error:", err);
      res.status(500).send("internal error");
    }
  }
);


// ----------ADMIN STATICS----------

export const onTransactionUpdated = onDocumentUpdated(
  "transactions/{orderId}",
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!after) return;

    // Only act on first transition to success
    if (before?.status === "success" || after.status !== "success") {
      return;
    }

    const amount = after.amountSmallest;
    if (typeof amount !== "number") return;

    // Source timestamp
    const baseDate =
      after.createdAt?.toDate?.() ??
      after.updatedAt?.toDate?.() ??
      new Date();

    // Convert to IST (UTC + 5:30)
    const istDate = new Date(baseDate.getTime() + 5.5 * 60 * 60 * 1000);

    const year = istDate.getFullYear().toString();
    const month = `${year}-${String(istDate.getMonth() + 1).padStart(2, "0")}`;
    const day = `${month}-${String(istDate.getDate()).padStart(2, "0")}`;

    const region = after.currency === "INR" ? "IN" : "US";

    const statsRef = db.collection("adminStats").doc("global");

    await statsRef.set(
      {
        lifetimeRevenue: admin.firestore.FieldValue.increment(amount),

        revenueByYear: {
          [year]: admin.firestore.FieldValue.increment(amount),
        },

        revenueByMonth: {
          [month]: admin.firestore.FieldValue.increment(amount),
        },

        revenueByDay: {
          [day]: admin.firestore.FieldValue.increment(amount),
        },

        revenueByRegion: {
          [region]: admin.firestore.FieldValue.increment(amount),
        },

        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  }
);


export const onUserCreated = onDocumentCreated(
  "users/{userId}",
  async () => {
    const statsRef = db.collection("adminStats").doc("global");

    await statsRef.set(
      {
        totalUsers: admin.firestore.FieldValue.increment(1),
      },
      { merge: true }
    );
  }
);


export const onUserUpdated = onDocumentUpdated(
  "users/{userId}",
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!before || !after) return;

    const statsRef = db.collection("adminStats").doc("global");

    // Premium upgrade
    if (!before.isPremium && after.isPremium) {
      await statsRef.set(
        { premiumUsers: admin.firestore.FieldValue.increment(1) },
        { merge: true }
      );
    }

    // Premium downgrade / expiry
    if (before.isPremium && !after.isPremium) {
      await statsRef.set(
        { premiumUsers: admin.firestore.FieldValue.increment(-1) },
        { merge: true }
      );
    }
  }
);

// TOPIC_INDEX REALTIME SYNC

function normalizeTitle(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const syncProblemIndex = onDocumentWritten(
  {
    document: "topics/{problemId}",
    region: "asia-south1",
  },
  async (event) => {
    const problemId = event.params.problemId;
    const after = event.data?.after;

    const indexRef = db.collection("problem_index").doc(problemId);

    /* ---------- DELETE ---------- */
    if (!after?.exists) {
      await indexRef.delete();
      return;
    }

    const data = after.data()!;

    /* ---------- IGNORE NON-QUESTIONS ---------- */
    if (data.type !== "question") {
      await indexRef.delete();
      return;
    }

    /* ---------- HARD VALIDATION ---------- */
    if (
      !data.title ||
      !data.courseId ||
      typeof data.order !== "number"
    ) {
      console.error("Invalid topic document:", problemId);
      return;
    }

    /* ---------- INDEX DOCUMENT ---------- */
    const indexDoc = {
      problemId,
      title: data.title,
      normalizedTitle: normalizeTitle(data.title),
      topic: data.topic ?? "unknown",
      level: Number(data.level ?? 1),
      order: data.order,
      isPrivate: Boolean(data.isPrivate),
      askedIn: Array.isArray(data.askedIn) ? data.askedIn : [],
      courseId: data.courseId,
      updatedAt: new Date(),
    };

    await indexRef.set(indexDoc, { merge: true });
  }
);


// CRON JOBS
// ----------- PROBLEMS INDEX -----------


export const rebuildProblemIndex = onSchedule(
  {
    // 03:30 IST (22:00 UTC)
    // schedule: "0 22 * * *",
    schedule: "55 15 * * *",
    region: "asia-south1",
    memory: "1GiB",
    timeoutSeconds: 540,
  },
  async () => {
    const topicsSnap = await db
      .collection("topics")
      .where("type", "==", "question")
      .get();

    const validIds = new Set<string>();
    const BATCH_SIZE = 400;
    let batch = db.batch();
    let opCount = 0;

    for (const doc of topicsSnap.docs) {
      const d = doc.data();

      if (!d.title || typeof d.order !== "number" || !d.courseId) {
        continue;
      }

      validIds.add(doc.id);

      const indexRef = db.collection("problem_index").doc(doc.id);

      batch.set(
        indexRef,
        {
          problemId: doc.id,
          title: d.title,
          normalizedTitle: normalizeTitle(d.title),
          topic: d.topic ?? "unknown",
          level: Number(d.level ?? 1),
          order: d.order,
          isPrivate: Boolean(d.isPrivate),
          askedIn: Array.isArray(d.askedIn) ? d.askedIn : [],
          courseId: d.courseId,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      opCount++;
      if (opCount % BATCH_SIZE === 0) {
        await batch.commit();
        batch = db.batch();
      }
    }

    if (opCount % BATCH_SIZE !== 0) {
      await batch.commit();
    }

    /* ---------- CLEAN ORPHANS ---------- */
    const indexSnap = await db.collection("problem_index").get();
    const cleanupBatch = db.batch();

    indexSnap.docs.forEach((doc) => {
      if (!validIds.has(doc.id)) {
        cleanupBatch.delete(doc.ref);
      }
    });

    await cleanupBatch.commit();
  }
);




