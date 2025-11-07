import * as admin from "firebase-admin";
import Razorpay from "razorpay";
import { onCall, HttpsError, CallableRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { setGlobalOptions } from "firebase-functions/v2";
import { FieldValue } from "firebase-admin/firestore";

setGlobalOptions({ region: "asia-south1", timeoutSeconds: 30, memory: "256MiB" });
admin.initializeApp();
const db = admin.firestore();

// 🔒 1️⃣ Define secrets (connected to Secret Manager)
const RAZORPAY_KEY_ID = defineSecret("RAZORPAY_KEY_ID");
const RAZORPAY_KEY_SECRET = defineSecret("RAZORPAY_KEY_SECRET");

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

      // 3️⃣ Pricing table
      const COURSE_PRICES: Record<string, { yearly: number; lifetime: number; currency: string }> = {
        "course_basic": { yearly: 1000, lifetime: 2500, currency: "INR" },
        "course_pro": { yearly: 2500, lifetime: 5000, currency: "INR" },
      };

      const course = COURSE_PRICES[courseId];
      if (!course) throw new HttpsError("not-found", "Unknown courseId.");

      const amount = course[planType as "yearly" | "lifetime"];
      const currency = course.currency;

      // 4️⃣ Create order
      const order = await razorpay.orders.create({
        amount,
        currency,
        receipt: `rcpt_${courseId}_${planType}_${Date.now()}`,
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
        amount,
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
