import { useEffect } from "react";
import { httpsCallable } from "firebase/functions";

import { functions } from "@/firebase/config";

const LAST_IP_SYNC_KEY = "last-ip-sync";

const DAY_MS = 24 * 60 * 60 * 1000;

export function useTrackUserIp(userId?: string | null) {
    useEffect(() => {
        /**
         * Only run for authenticated users
         */
        if (!userId) return;

        const trackIp = async () => {
            try {
                const lastSync =
                    localStorage.getItem(LAST_IP_SYNC_KEY);

                const now = Date.now();

                /**
                 * Skip if synced within 24h
                 */
                if (
                    lastSync &&
                    now - Number(lastSync) < DAY_MS
                ) {
                    return;
                }

                const trackUserIp = httpsCallable(
                    functions,
                    "trackUserIp"
                );

                await trackUserIp();

                localStorage.setItem(
                    LAST_IP_SYNC_KEY,
                    String(now)
                );
            } catch (err) {
                console.error(
                    "useTrackUserIp error:",
                    err
                );
            }
        };

        trackIp();
    }, [userId]);
}