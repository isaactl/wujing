"use client";

import { useEffect, useId, useRef, useState } from "react";

let mermaidInitialized = false;

export default function MermaidDiagram({ chart }: { chart: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const diagramId = `mermaid-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function renderDiagram() {
            try {
                const { default: mermaid } = await import("mermaid");
                if (!mermaidInitialized) {
                    mermaid.initialize({
                        startOnLoad: false,
                        securityLevel: "strict",
                        theme: "dark",
                    });
                    mermaidInitialized = true;
                }

                const { svg } = await mermaid.render(diagramId, chart);
                if (cancelled || !containerRef.current) {
                    return;
                }

                const parsedSvg = new DOMParser().parseFromString(
                    svg,
                    "image/svg+xml"
                );
                if (parsedSvg.querySelector("parsererror")) {
                    throw new Error("Mermaid returned invalid SVG output.");
                }

                containerRef.current.replaceChildren(
                    document.importNode(parsedSvg.documentElement, true)
                );
                setError(null);
            } catch (renderError) {
                if (cancelled) {
                    return;
                }

                setError(
                    renderError instanceof Error
                        ? renderError.message
                        : "Unable to render this Mermaid diagram."
                );
            }
        }

        void renderDiagram();

        return () => {
            cancelled = true;
        };
    }, [chart, diagramId]);

    return (
        <figure className="mermaid-figure">
            {error ? (
                <div className="mermaid-error" role="alert">
                    <strong>Could not render Mermaid diagram</strong>
                    <span>{error}</span>
                    <pre>
                        <code>{chart}</code>
                    </pre>
                </div>
            ) : (
                <div
                    ref={containerRef}
                    className="mermaid-output"
                    role="img"
                    aria-label="Mermaid diagram"
                    aria-live="polite"
                />
            )}
            <figcaption>Mermaid diagram</figcaption>
        </figure>
    );
}
