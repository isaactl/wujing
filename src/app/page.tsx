"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
    Children,
    isValidElement,
    useState,
    type ComponentProps,
    type ReactNode,
} from "react";
import ReactMarkdown from "react-markdown";
import type { Components, ExtraProps } from "react-markdown";
import remarkGfm from "remark-gfm";
import MermaidDiagram from "./mermaid-diagram";

const MonacoEditor = dynamic(() => import("react-monaco-editor"), {
    ssr: false,
});

const MonacoDiffEditor = dynamic(
    () =>
        import("react-monaco-editor").then(
            (module) => module.MonacoDiffEditor
        ),
    { ssr: false }
);

const languages = [
    { id: "abap", name: "ABAP" },
    { id: "apex", name: "Apex" },
    { id: "azcli", name: "Azure CLI" },
    { id: "bat", name: "Batch" },
    { id: "bicep", name: "Bicep" },
    { id: "cameligo", name: "CameLIGO" },
    { id: "clojure", name: "Clojure" },
    { id: "coffee", name: "CoffeeScript" },
    { id: "cpp", name: "C++" },
    { id: "csharp", name: "C#" },
    { id: "csp", name: "CSP" },
    { id: "css", name: "CSS" },
    { id: "cypher", name: "Cypher" },
    { id: "dart", name: "Dart" },
    { id: "dockerfile", name: "Dockerfile" },
    { id: "ecl", name: "ECL" },
    { id: "elixir", name: "Elixir" },
    { id: "flow9", name: "Flow9" },
    { id: "freemarker2", name: "FreeMarker" },
    { id: "fsharp", name: "F#" },
    { id: "go", name: "Go" },
    { id: "graphql", name: "GraphQL" },
    { id: "handlebars", name: "Handlebars" },
    { id: "hcl", name: "HCL" },
    { id: "html", name: "HTML" },
    { id: "ini", name: "INI" },
    { id: "java", name: "Java" },
    { id: "javascript", name: "JavaScript" },
    { id: "json", name: "JSON" },
    { id: "julia", name: "Julia" },
    { id: "kotlin", name: "Kotlin" },
    { id: "less", name: "Less" },
    { id: "lexon", name: "Lexon" },
    { id: "liquid", name: "Liquid" },
    { id: "lua", name: "Lua" },
    { id: "m3", name: "Modula-3" },
    { id: "markdown", name: "Markdown" },
    { id: "mdx", name: "MDX" },
    { id: "mips", name: "MIPS" },
    { id: "msdax", name: "DAX" },
    { id: "mysql", name: "MySQL" },
    { id: "objective-c", name: "Objective-C" },
    { id: "pascal", name: "Pascal" },
    { id: "pascaligo", name: "PascaLIGO" },
    { id: "perl", name: "Perl" },
    { id: "pgsql", name: "PostgreSQL" },
    { id: "php", name: "PHP" },
    { id: "plaintext", name: "Plain Text" },
    { id: "pla", name: "PLA" },
    { id: "postiats", name: "ATS" },
    { id: "powerquery", name: "Power Query" },
    { id: "powershell", name: "PowerShell" },
    { id: "protobuf", name: "Protocol Buffers" },
    { id: "pug", name: "Pug" },
    { id: "python", name: "Python" },
    { id: "qsharp", name: "Q#" },
    { id: "r", name: "R" },
    { id: "razor", name: "Razor" },
    { id: "redis", name: "Redis" },
    { id: "redshift", name: "Redshift" },
    { id: "restructuredtext", name: "reStructuredText" },
    { id: "ruby", name: "Ruby" },
    { id: "rust", name: "Rust" },
    { id: "sb", name: "Small Basic" },
    { id: "scala", name: "Scala" },
    { id: "scheme", name: "Scheme" },
    { id: "scss", name: "SCSS" },
    { id: "shell", name: "Shell" },
    { id: "solidity", name: "Solidity" },
    { id: "sophia", name: "Sophia" },
    { id: "sparql", name: "SPARQL" },
    { id: "sql", name: "SQL" },
    { id: "st", name: "Structured Text" },
    { id: "swift", name: "Swift" },
    { id: "systemverilog", name: "SystemVerilog" },
    { id: "tcl", name: "Tcl" },
    { id: "twig", name: "Twig" },
    { id: "typescript", name: "TypeScript" },
    { id: "typespec", name: "TypeSpec" },
    { id: "vb", name: "Visual Basic" },
    { id: "wgsl", name: "WGSL" },
    { id: "xml", name: "XML" },
    { id: "yaml", name: "YAML" },
];

const editorOptions = {
    automaticLayout: true,
    fontSize: 14,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    selectOnLineNumbers: true,
    wordWrap: "on" as const,
};

type EditorMode = "code" | "diff" | "markdown";
type MarkdownView = "edit" | "split" | "preview";

const modeLabels: Record<EditorMode, string> = {
    code: "Code",
    diff: "Diff",
    markdown: "Markdown",
};

const markdownViewLabels: Record<MarkdownView, string> = {
    edit: "Edit",
    split: "Split preview",
    preview: "Preview",
};

const markdownComponents: Components = {
    pre({ children, node, ...props }: ComponentProps<"pre"> & ExtraProps) {
        void node;
        const child = Children.toArray(children)[0];
        if (isValidElement<{ className?: string; children?: ReactNode }>(child)) {
            const language = child.props.className
                ?.match(/(?:^|\s)language-([\w-]+)/)?.[1]
                ?.toLowerCase();
            if (language === "mermaid") {
                const chart = String(child.props.children ?? "").replace(
                    /\n$/,
                    ""
                );
                return <MermaidDiagram chart={chart} />;
            }
        }

        return <pre {...props}>{children}</pre>;
    },
};

export default function Home() {
    const [mode, setMode] = useState<EditorMode>("code");
    const [markdownView, setMarkdownView] = useState<MarkdownView>("edit");
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState('console.log("Hello, world!");');
    const [markdown, setMarkdown] = useState(
        "# Welcome to Wujing\n\nWrite and edit **Markdown** with syntax highlighting.\n\n- Headings and lists\n- Links and code\n\n```mermaid\ngraph TD\n  Edit[Write Markdown] --> Preview[See the preview]\n  Preview --> Share[Share your work]\n```\n\n```js\nconst ready = true;\n```"
    );
    const [original, setOriginal] = useState(
        'const greeting = "Hello world";\nconsole.log(greeting);'
    );
    const [modified, setModified] = useState(
        'const greeting = "Hello, world!";\nconsole.log(greeting);\nconsole.info("Ready");'
    );

    return (
        <main className="editor-app">
            <header className="app-header">
                <Link className="brand" href="/" aria-label="Wujing home">
                    <span className="brand-mark" aria-hidden="true">
                        W
                    </span>
                    <span>Wujing</span>
                </Link>
                <span className="header-divider" aria-hidden="true" />
                <span className="workspace-name">Untitled workspace</span>
                <span className="connection-status">
                    <span className="status-dot" aria-hidden="true" />
                    Local workspace
                </span>
            </header>

            <section className="editor-workspace" aria-label="Editor workspace">
                <div className="editor-toolbar">
                    <div className="mode-switch" aria-label="Editor mode">
                        {(Object.keys(modeLabels) as EditorMode[]).map(
                            (editorMode) => (
                                <button
                                    key={editorMode}
                                    type="button"
                                    className={`mode-button${mode === editorMode ? " active" : ""}`}
                                    aria-pressed={mode === editorMode}
                                    onClick={() => setMode(editorMode)}
                                >
                                    {modeLabels[editorMode]}
                                </button>
                            )
                        )}
                    </div>

                    <div className="toolbar-controls">
                        {mode !== "markdown" ? (
                            <label className="language-control">
                                <span className="sr-only">Editor language</span>
                                <select
                                    value={language}
                                    onChange={(event) =>
                                        setLanguage(event.target.value)
                                    }
                                >
                                    {languages.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        ) : (
                            <div
                                className="markdown-view-switch"
                                aria-label="Markdown view"
                            >
                                {(
                                    [
                                        ["edit", "Edit"],
                                        ["split", "Split"],
                                        ["preview", "Preview"],
                                    ] as const
                                ).map(([view, label]) => (
                                    <button
                                        key={view}
                                        type="button"
                                        className={`view-button${markdownView === view ? " active" : ""}`}
                                        aria-pressed={markdownView === view}
                                        onClick={() =>
                                            setMarkdownView(view)
                                        }
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        )}
                        {markdownView !== "preview" && (
                            <>
                                <span
                                    className="toolbar-separator"
                                    aria-hidden="true"
                                />
                                <span className="file-name">
                                    {mode === "diff"
                                        ? "Changes"
                                        : mode === "markdown"
                                          ? "README.md"
                                          : `untitled.${language === "javascript" ? "js" : language}`}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <div
                    className={`editor-canvas${mode === "markdown" ? ` markdown-canvas markdown-${markdownView}` : ""}`}
                >
                    {(mode !== "markdown" || markdownView !== "preview") && (
                        <div
                            className={
                                mode === "markdown"
                                    ? "markdown-editor-pane"
                                    : "code-editor-pane"
                            }
                        >
                            {mode === "diff" ? (
                                <MonacoDiffEditor
                                    height="100%"
                                    language={language}
                                    theme="vs-dark"
                                    original={original}
                                    value={modified}
                                    options={{
                                        ...editorOptions,
                                        originalEditable: true,
                                        renderSideBySide: true,
                                    }}
                                    onChange={(value) =>
                                        setModified(value ?? "")
                                    }
                                    editorWillMount={(monaco) => {
                                        const originalUri = monaco.Uri.parse(
                                            "inmemory://wujing/diff-original"
                                        );
                                        if (
                                            !monaco.editor.getModel(
                                                originalUri
                                            )
                                        ) {
                                            monaco.editor.createModel(
                                                original,
                                                language,
                                                originalUri
                                            );
                                        }
                                    }}
                                    originalUri={(monaco) =>
                                        monaco.Uri.parse(
                                            "inmemory://wujing/diff-original"
                                        )
                                    }
                                    editorDidMount={(editor) => {
                                        const originalModel =
                                            editor.getModel()?.original;
                                        originalModel?.onDidChangeContent(
                                            () => {
                                                setOriginal(
                                                    originalModel.getValue()
                                                );
                                            }
                                        );
                                    }}
                                />
                            ) : (
                                <MonacoEditor
                                    height="100%"
                                    language={
                                        mode === "markdown"
                                            ? "markdown"
                                            : language
                                    }
                                    theme="vs-dark"
                                    value={
                                        mode === "markdown" ? markdown : code
                                    }
                                    options={editorOptions}
                                    onChange={(value) => {
                                        if (mode === "markdown") {
                                            setMarkdown(value ?? "");
                                        } else {
                                            setCode(value ?? "");
                                        }
                                    }}
                                />
                            )}
                        </div>
                    )}
                    {mode === "markdown" &&
                        markdownView !== "edit" && (
                            <article
                                className="markdown-preview"
                                aria-label="Markdown preview"
                            >
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={markdownComponents}
                                >
                                    {markdown}
                                </ReactMarkdown>
                            </article>
                        )}
                </div>

                <footer className="editor-statusbar">
                    <span>{modeLabels[mode]} mode</span>
                    <span className="statusbar-right">
                        {mode === "diff"
                            ? "Original + modified"
                            : mode === "markdown"
                              ? `${modeLabels[mode]} · ${markdownViewLabels[markdownView]}`
                              : languages.find((item) => item.id === language)
                                    ?.name}
                    </span>
                </footer>
            </section>
        </main>
    );
}
