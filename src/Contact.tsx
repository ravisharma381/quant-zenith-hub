import React, { useState } from "react";
import { Clipboard, Check } from "lucide-react";
import EmailSVG from "@/assets/email.svg";

const EMAIL = "contact@example.com";
const ACCENT = "#29FB32";

export default function ContactUs() {
    const [copied, setCopied] = useState(false);

    async function copyEmail() {
        try {
            await navigator.clipboard.writeText(EMAIL);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (_) { }
    }

    return (
        <div
            className="
        fixed inset-0 
        flex items-center justify-center
        bg-background 
        text-white
        overflow-hidden
      "
        >

            {/* Gradient background */}
            <div
                className="absolute inset-0 -z-10"
                style={{
                    background: `
            linear-gradient(
              135deg,
              rgba(41, 251, 50, 0.10) 0%,
              rgba(0, 0, 0, 0.85) 40%,
              rgba(0, 0, 0, 1) 100%
            )
          `,
                }}
            />

            {/* Soft center glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle at center, rgba(41,251,50,0.12) 0%, rgba(0,0,0,0.9) 70%)",
                }}
            />

            {/* Center Content */}
            <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-md px-4">

                {/* Title */}
                <div>
                    <h1 className="text-4xl font-semibold text-white">Contact Us</h1>
                    <p className="text-sm md:text-base text-gray-400 mt-2">
                        We'd love to hear from you. Reach out anytime.
                    </p>
                </div>

                {/* Wider SVG */}
                <div
                    className="p-6 rounded-2xl bg-black/40 backdrop-blur-md shadow-xl"
                    style={{ boxShadow: `0 0 40px ${ACCENT}40` }}
                >
                    <img
                        src={EmailSVG}
                        alt="Contact Icon"
                        className="w-[280px] md:w-[320px] h-auto"
                    />
                </div>

                {/* Email & copy */}
                <div className="flex flex-col items-center gap-4 mt-2">
                    <a
                        href={`mailto:${EMAIL}`}
                        className="text-xl text-white font-medium hover:underline"
                    >
                        {EMAIL}
                    </a>

                    <button
                        onClick={copyEmail}
                        className="flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:bg-white/10 transition text-sm text-gray-300"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 text-green-400" />
                                <span className="text-white">Copied</span>
                            </>
                        ) : (
                            <>
                                <Clipboard className="w-4 h-4" />
                                <span>Copy email</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="text-xs text-gray-400">
                    We usually respond within 24–48 hours.
                </div>
            </div>
        </div>
    );
}
