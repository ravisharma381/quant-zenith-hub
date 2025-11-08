import * as admin from "firebase-admin";
import Razorpay from "razorpay";
import { onCall, HttpsError, CallableRequest, onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { setGlobalOptions } from "firebase-functions/v2";
import { FieldValue } from "firebase-admin/firestore";
import * as crypto from "crypto";

setGlobalOptions({ region: "asia-south1", timeoutSeconds: 30, memory: "256MiB" });
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// 🔒 1️⃣ Define secrets (connected to Secret Manager)
const RAZORPAY_KEY_ID = defineSecret("RAZORPAY_KEY_ID");
const RAZORPAY_KEY_SECRET = defineSecret("RAZORPAY_KEY_SECRET");
const RAZORPAY_WEBHOOK_SECRET = defineSecret("RAZORPAY_WEBHOOK_SECRET");

// ----------------------------------------------------------------------
//  CREATE ORDER
// ----------------------------------------------------------------------
export const createOrder = onCall(
  { secrets: [RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET] },
  async (req: CallableRequest) => {
    try {
      // 1️⃣ Ensure auth
      const uid = req.auth?.uid;
      if (!uid) throw new HttpsError("unauthenticated", "Sign in required.");

      const { courseId, planType } = req.data || {};
      if (!courseId || !planType)
        throw new HttpsError("invalid-argument", "courseId and planType required.");

      // 🔑 2️⃣ Load Razorpay keys securely from Secret Manager
      const key_id = RAZORPAY_KEY_ID.value();
      const key_secret = RAZORPAY_KEY_SECRET.value();

      const razorpay = new Razorpay({ key_id, key_secret });


      const courseSnap = await db.collection("courses").doc(courseId).get();
      if (!courseSnap.exists) {
        throw new HttpsError("not-found", "Course not found.");
      }

      const courseData = courseSnap.data();

      if (!courseData?.price || !courseData?.currency) {
        throw new HttpsError("failed-precondition", "Invalid course data.");
      }
      // 🔹 Determine amount based on selected plan
      const planPrice = courseData.price[planType];

      if (!planPrice) {
        throw new HttpsError("invalid-argument", "Invalid plan selected.");
      }

      // 🔹 Convert to smallest currency unit
      const amount = Math.round(planPrice * 100);

      const currency = courseData.currency;

      // 4️⃣ Create order
      const order = await razorpay.orders.create({
        amount,
        currency,
        receipt: `rcpt_${courseId.substring(0, 6)}_${planType}_${Date.now()}`,
        notes: { userId: uid, courseId, planType },
      });

      // 5️⃣ Save pending transaction
      const now = FieldValue.serverTimestamp();
      await db.collection("transactions").doc(order.id).set({
        userId: uid,
        courseId,
        planType,
        orderId: order.id,
        paymentId: null,
        amount: planPrice,
        currency,
        provider: "razorpay",
        status: "pending",
        createdAt: now,
        updatedAt: now,
      });

      return {
        ok: true,
        data: { orderId: order.id, keyId: key_id, amount, currency, courseId, planType },
      };
    } catch (err: unknown) {
      console.error("❌ createOrder error:", err);
      const msg = err instanceof Error ? err.message : "Failed to create order";
      throw new HttpsError("internal", msg);
    }
  }
);

// ----------------------------------------------------------------------
//  RAZORPAY WEBHOOK
// ----------------------------------------------------------------------

export const razorpayWebhook = onRequest(
  { secrets: [RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET] },
  async (req, res) => {
    try {
      // 1️⃣ Verify the webhook signature
      const webhookSecret = RAZORPAY_WEBHOOK_SECRET.value();
      const razorpaySignature = req.headers["x-razorpay-signature"] as string;

      const body = JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(body)
        .digest("hex");

      if (expectedSignature !== razorpaySignature) {
        console.error("❌ Invalid Razorpay signature");
        res.status(400).send("Invalid signature");
        return;
      }

      // 2️⃣ Extract payment details
      const payment = req.body.payload?.payment?.entity;
      if (!payment) {
        console.error("❌ Missing payment payload");
        res.status(400).send("Invalid payload");
        return;
      }

      const orderId = payment.order_id;
      const paymentId = payment.id;
      const status = payment.status; // 'captured', 'failed', etc.

      // 3️⃣ Update Firestore transaction
      const txnRef = db.collection("transactions").doc(orderId);
      await txnRef.set(
        {
          paymentId,
          status: status === "captured" ? "success" : "failed",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      // 4️⃣ Add purchased course to user record if success
      if (status === "captured") {
        const txnSnap = await txnRef.get();
        const txn = txnSnap.data();

        if (txn?.userId && txn?.courseId) {
          const userRef = db.collection("users").doc(txn.userId);
          await userRef.update({
            purchasedCourses: admin.firestore.FieldValue.arrayUnion(txn.courseId),
          });
          console.log(`✅ Course ${txn.courseId} unlocked for user ${txn.userId}`);
        }
      }

      res.status(200).send("Webhook processed successfully");
    } catch (err) {
      console.error("❌ Webhook error:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
  }
);
