// AdminBuilder.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Renderer from "./Renderer"; // adjust path to where you place Renderer.tsx
import "katex/dist/katex.min.css";
import { useLocation } from "react-router-dom";

const sampleJSON = {
    "title": "Fundamental Definitions",
    "blocks": [
        {
            "type": "subheading",
            "text": "What is Probability?"
        },
        {
            "type": "video",
            "url": "https://www.w3schools.com/html/mov_bbb.mp4",
            "poster": "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
        },
        {
            "type": "paragraph",
            "text": "What is probability? It's a really abstract question to ask."
        },
        {
            "type": "image",
            "url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
            "caption": "Fig 1: Sample space",
            "width": "xl"
        },
        {
            "type": "image",
            "url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
            "caption": "Fig 1: Sample space",
            "width": "sm"
        },
        {
            "type": "callout",
            "heading": "Custom Cyan Box",
            "text": "An experiment is a `repeatable process`. *Display* math below: $\\int_0^1 x^2 dx = 1/3$"
        },
        {
            "type": "callout",
            "heading": "Custom Cyan Box",
            "text": "An experiment is a `repeatable process`. *Display* math below: $$\\int_0^1 x^2 dx = 1/3$$"
        },
        {
            "type": "callout",
            "customColor": "#00eaff",
            "heading": "Custom Cyan Box",
            "text": "This should NOW be cyan with correct border and background."
        },
        {
            "type": "callout",
            "customColor": "#E4949D",
            "heading": "Definition (Experiment, Sample Point, Sample Space)",
            "text": "An experiment produces outcomes called sample points. The set of all sample points is the sample space."
        },
        {
            "type": "paragraph",
            "text": "The sample space of flipping two coins is: $$\\{HH, HT, TH, TT\\}$$"
        },
        {
            "type": "callout",
            "color": "purple",
            "heading": "Problem",
            "children": [
                {
                    "type": "paragraph",
                    "text": "Consider flipping a fair coin twice. How many outcomes are there?"
                },
                {
                    "type": "inputQuestion",
                    "placeholder": "Answer",
                    "answer": "4"
                },
                {
                    "type": "solution",
                    "steps": [
                        "The answer is 4.",
                        "Each flip is Heads or Tails.",
                        "Sample space: $$\\{HH, HT, TH, TT\\}$$"
                    ]
                }
            ]
        }
    ]
};

const AdminBuilder: React.FC = () => {
    const location = useLocation();
    const initial = JSON.stringify((location.state as any)?.json || sampleJSON);
    const [jsonText, setJsonText] = useState(initial);
    const [parsed, setParsed] = useState<any | null>(() => {
        try { return JSON.parse(initial); } catch { return null; }
    });


    const onChange = (v: string) => {
        setJsonText(v);

        try {
            const p = JSON.parse(v);
            setParsed(p);
        } catch {
            setParsed(null);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(jsonText);
        alert("Copied JSON to clipboard!");
    };


    return (
        <div className="flex h-screen bg-muted/10">
            <div className="w-1/2 border-r flex flex-col">
                <div className="flex items-center justify-between p-4 border-b bg-background">
                    <h1 className="font-semibold text-lg">JSON Builder</h1>
                    <div className="space-x-2">
                        <Button variant="outline" onClick={() => setJsonText(JSON.stringify(parsed || {}, null, 2))}>Format</Button>
                        <Button onClick={handleCopy}>Copy JSON</Button>
                    </div>
                </div>

                <div className="flex-1">
                    <Textarea
                        value={jsonText}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full h-full font-mono text-sm resize-none"
                    />
                </div>
            </div>

            <div className="w-1/2 p-6 overflow-y-auto">
                {parsed ? (
                    <Renderer doc={parsed} />
                ) : (
                    <div className="text-red-400">Invalid JSON — fix syntax to preview.</div>
                )}
            </div>
        </div>
    );
};

export default AdminBuilder;
