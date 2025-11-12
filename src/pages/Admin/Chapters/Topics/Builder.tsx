import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "react-router-dom";

const AdminBuilder = () => {
    const location = useLocation();
    const initialHTML = (location.state as { html?: string })?.html || "";

    const [html, setHtml] = useState(initialHTML);
    const [iframeKey, setIframeKey] = useState(0);

    const generatePreviewDoc = () => {
        const sanitized = html
            .replace(/className=/g, "class=")
            .replace(/{"/g, '"')
            .replace(/"}/g, '"');

        return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { background: #121317; padding: 1.5rem; color: white; }
          </style>
        </head>
        <body>
          ${sanitized}
        </body>
      </html>
    `;
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(html);
        alert("✅ HTML copied to clipboard!");
    };

    return (
        <div className="flex h-screen bg-muted/10">
            {/* Left: Editor */}
            <div className="w-1/2 border-r flex flex-col">
                <div className="flex items-center justify-between p-4 border-b bg-background">
                    <h1 className="font-semibold text-lg">HTML Builder</h1>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setIframeKey((k) => k + 1)}
                        >
                            Refresh Preview
                        </Button>
                        <Button onClick={handleCopy}>Copy HTML</Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <Textarea
                        value={html}
                        onChange={(e) => setHtml(e.target.value)}
                        onPaste={(e) => {
                            const text = e.clipboardData.getData("text");
                            setHtml((prev) => prev + text);
                            e.preventDefault();
                        }}
                        placeholder="<div class='p-4 text-center bg-gray-100 text-black'>My layout</div>"
                        className="w-full h-full resize-none font-mono text-sm"
                        autoFocus
                    />
                </div>
            </div>

            {/* Right: Live Preview */}
            <div className="w-1/2">
                <iframe
                    key={iframeKey}
                    srcDoc={generatePreviewDoc()}
                    className="w-full h-full border-0"
                    title="HTML Preview"
                />
            </div>
        </div>
    );
};

export default AdminBuilder;
