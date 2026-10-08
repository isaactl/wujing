// next.config.ts
import type { NextConfig } from "next";
import MonacoEditorWebpackPlugin from "monaco-editor-webpack-plugin";
import path from "path";

const nextConfig: NextConfig = {
    output: "export",
    distDir: "docs",
    basePath: "/wujing",

    webpack(config, { isServer }) {
        config.resolve.alias = {
            ...config.resolve.alias,
            "monaco-editor$": path.resolve(
                __dirname,
                "./node_modules/monaco-editor/esm/vs/editor/editor.api.js"
            ),
            "monaco-editor/esm/vs/editor/editor.api": path.resolve(
                __dirname,
                "./node_modules/monaco-editor/esm/vs/editor/editor.api.js"
            ),
        };

        if (!isServer) {
            config.plugins.push(
                new MonacoEditorWebpackPlugin({
                    languages: [
                        "abap",
                        "apex",
                        "azcli",
                        "bat",
                        "bicep",
                        "cameligo",
                        "clojure",
                        "coffee",
                        "cpp",
                        "csharp",
                        "csp",
                        "css",
                        "cypher",
                        "dart",
                        "dockerfile",
                        "ecl",
                        "elixir",
                        "flow9",
                        "freemarker2",
                        "fsharp",
                        "go",
                        "graphql",
                        "handlebars",
                        "hcl",
                        "html",
                        "ini",
                        "java",
                        "javascript",
                        "json",
                        "julia",
                        "kotlin",
                        "less",
                        "lexon",
                        "liquid",
                        "lua",
                        "m3",
                        "markdown",
                        "mdx",
                        "mips",
                        "msdax",
                        "mysql",
                        "objective-c",
                        "pascal",
                        "pascaligo",
                        "perl",
                        "pgsql",
                        "php",
                        "pla",
                        "postiats",
                        "powerquery",
                        "powershell",
                        "protobuf",
                        "pug",
                        "python",
                        "qsharp",
                        "r",
                        "razor",
                        "redis",
                        "redshift",
                        "restructuredtext",
                        "ruby",
                        "rust",
                        "sb",
                        "scala",
                        "scheme",
                        "scss",
                        "shell",
                        "solidity",
                        "sophia",
                        "sparql",
                        "sql",
                        "st",
                        "swift",
                        "systemverilog",
                        "tcl",
                        "twig",
                        "typescript",
                        "typespec",
                        "vb",
                        "wgsl",
                        "xml",
                        "yaml",
                    ],
                    filename: "static/media/[name].worker.js",
                })
            );
        }

        return config;
    },

    transpilePackages: ["monaco-editor", "react-monaco-editor"],
};

export default nextConfig;
