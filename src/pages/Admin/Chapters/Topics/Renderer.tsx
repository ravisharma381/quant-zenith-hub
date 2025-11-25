// Renderer.tsx
import React, { useState } from "react";
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";
import { fireRandomCelebration } from "@/lib/confetti";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

/* --- Latex Parser --- */
function renderRichText(text: string) {
    if (!text) return null;

    const parts = text.split(
        /(\$\$[\s\S]+?\$\$|\$[^$]+\$|\*[^*]+\*|`[^`]+`)/g
    ).filter(Boolean);

    return parts.map((part, i) => {
        // $$ block math $$
        if (part.startsWith("$$") && part.endsWith("$$")) {
            return <TeX block key={i}>{part.slice(2, -2)}</TeX>;
        }

        // $ inline math $
        if (part.startsWith("$") && part.endsWith("$")) {
            return <TeX key={i}>{part.slice(1, -1)}</TeX>;
        }

        // *bold*
        if (part.startsWith("*") && part.endsWith("*")) {
            return (
                <strong key={i} className="font-bold">
                    {part.slice(1, -1)}
                </strong>
            );
        }

        // `italic`
        if (part.startsWith("`") && part.endsWith("`")) {
            return (
                <em key={i} className="italic">
                    {part.slice(1, -1)}
                </em>
            );
        }

        return <span key={i}>{part}</span>;
    });
}


/* --- Accordion Block --- */
const AccordionBlock = ({ items }: { items: { title: string; content: string }[] }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="space-y-4">
            {items.map((item, idx) => (
                <div key={idx} className="border border-gray-700 rounded-lg overflow-hidden">
                    <button
                        className="w-full flex justify-between px-4 py-3 text-left text-white"
                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    >
                        <span className="font-medium">{renderRichText(item.title)}</span>
                        <span>{openIndex === idx ? "−" : "+"}</span>
                    </button>

                    {openIndex === idx && (
                        <div className="px-4 pb-4 text-white leading-relaxed">
                            {renderRichText(item.content)}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

/* --- Input Question Block --- */
const InputQuestion = ({
    placeholder,
    answer
}: {
    placeholder: string;
    answer: string;
}) => {
    const [val, setVal] = useState("");
    const [status, setStatus] = useState<"correct" | "wrong" | null>(null);
    const [shake, setShake] = useState(false);

    const check = () => {
        if (val.trim() === answer.trim()) {
            setStatus("correct");
            fireRandomCelebration();   // 🎉 CONFETTI
        } else {
            setStatus("wrong");
            setShake(true);            // 😵 SHAKE
            setTimeout(() => setShake(false), 500); // reset after animation
            navigator.vibrate?.(200);  // 📳 VIBRATE (mobile only)
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            check();
        }
    };

    return (
        <div className="space-y-4 mb-4">
            <div className="flex gap-3">
                <Input
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    placeholder={placeholder}
                    onKeyDown={handleKeyDown}
                    className={`flex-1 h-[46px] border-2 focus-visible:ring-0 focus-visible:ring-offset-0 ${status === 'wrong'
                        ? 'border-red-500 animate-shake focus:border-red-500'
                        : status === 'correct'
                            ? 'border-green-500 focus:border-green-500'
                            : 'focus:border-purple-500'
                        }`}
                />
                <Button
                    onClick={check}
                    variant="clean"
                    className="bg-purple-500 hover:bg-purple-600 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] text-white font-semibold px-6 h-[46px] flex items-center gap-2 shadow-lg transition-all duration-300"
                >
                    <Send className="h-4 w-4" />
                    Submit
                </Button>
            </div>
        </div>
    );
};

/* --- Solution Block --- */
const SolutionBlock = ({ steps }: { steps: string[] }) => (
    <div className=" rounded-lg space-y-3">
        <h3 className="text-white text-lg font-semibold">SOLUTION</h3>
        {steps.map((step, i) => (
            <p key={i} className="text-white text-lg">
                {renderRichText(step)}
            </p>
        ))}
    </div>
);


/* --- Callout Block --- */
const Callout = ({
    color,
    customColor,
    heading,
    subheading,
    text,
    children
}: {
    color?: string;
    customColor?: string;
    heading?: string;
    subheading?: string;
    text?: string;
    children?: any;
}) => {

    const preset: any = {
        green: { border: "#22c55e", bg: "rgba(34,197,94,0.12)" },
        purple: { border: "#a855f7", bg: "rgba(168,85,247,0.12)" },
        yellow: { border: "#eab308", bg: "rgba(234,179,8,0.12)" },
        red: { border: "#ef4444", bg: "rgba(239,68,68,0.12)" }
    };

    let style: any = {
        borderLeftWidth: "4px",
        padding: "1.25rem",
        borderRadius: "0 0.5rem 0.5rem 0"
    };

    // ---- CUSTOM COLOR MODE ----
    if (customColor) {
        // convert hex → rgb
        const hex = customColor.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        style.borderLeftColor = `rgb(${r}, ${g}, ${b})`;
        style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.12)`;
    }


    // ---- PRESET COLOR MODE ----
    else if (color && preset[color]) {
        const c = preset[color];
        style.borderLeftColor = c.border;
        style.backgroundColor = c.bg;
    }

    // ---- DEFAULT (green) ----
    else {
        style.borderLeftColor = preset.green.border;
        style.backgroundColor = preset.green.bg;
    }

    return (
        <div style={style}>
            {heading && (
                <span style={{ color: style.borderLeftColor }} className={`block font-medium mb-3 text-lg`}>
                    {renderRichText(heading)}
                </span>
            )}

            {subheading && (
                <p className="text-white text-lg leading-relaxed mb-2">
                    {renderRichText(subheading)}
                </p>
            )}

            {text && (
                <p className="text-white leading-relaxed text-lg whitespace-pre-line">
                    {renderRichText(text)}
                </p>
            )}

            {children}
        </div>
    );
};



/* --- Main Renderer --- */
const Renderer = ({ doc, isChildren }: { doc: any, isChildren?: boolean }) => {
    const blocks = doc.blocks || [];
    return (
        <div className={`${isChildren ? '' : ''}`}>
            {doc.title && (
                <h1 className="text-4xl font-bold text-white mb-6">{doc.title}</h1>
            )}
            <style>{`
                h3 + * {
                    margin-top: 16px !important;
                }
                `}
            </style>

            <div className="space-y-10 text-white leading-relaxed">
                {blocks.map((b: any, i: number) => {
                    switch (b.type) {
                        case "subheading":
                            return (
                                <h3 key={i} className={`text-2xl font-semibold text-white`}>
                                    {renderRichText(b.text)}
                                </h3>
                            );
                        case "paragraph":
                            return (
                                <p key={i} className={`text-lg ${isChildren ? 'text-white' : 'text-white'} whitespace-pre-line`}>
                                    {renderRichText(b.text)}
                                </p>
                            );

                        case "latexBlock":
                            return (
                                <div key={i} className="my-4">
                                    <TeX block>{b.equation}</TeX>
                                </div>
                            );

                        case "image":
                            return (
                                <div key={i} className="flex flex-col items-center">
                                    <img
                                        src={b.url}
                                        className={`max-w-${b.width || 'sm'} w-full rounded`}
                                        alt=""
                                    />
                                    {b.caption && (
                                        <p className="text-gray-400 text-sm italic mt-2">
                                            {renderRichText(b.caption)}
                                        </p>
                                    )}
                                </div>
                            );

                        case "video":
                            return (
                                <div key={i} className="w-[85%] mx-auto">
                                    <div className="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden">
                                        <video controls poster={b.poster} className="w-full h-full object-cover">
                                            <source src={b.url} type="video/mp4" />
                                        </video>
                                    </div>
                                </div>
                            );

                        case "callout":
                            return (
                                <Callout key={i} color={b.color} customColor={b.customColor} heading={b.heading} text={b.text}>
                                    {b.children && <Renderer isChildren={true} doc={{ blocks: b.children }} />}
                                </Callout>
                            );

                        case "inputQuestion":
                            return (
                                <InputQuestion
                                    key={i}
                                    placeholder={b.placeholder}
                                    answer={b.answer}
                                />
                            );

                        case "solution":
                            return <SolutionBlock key={i} steps={b.steps} />;

                        case "accordion":
                            return <AccordionBlock key={i} items={b.items} />;

                        default:
                            return (
                                <div key={i} className="text-red-400">
                                    Unknown block: {b.type}
                                </div>
                            );
                    }
                })}
            </div>
        </div >
    );
};

export default Renderer;
