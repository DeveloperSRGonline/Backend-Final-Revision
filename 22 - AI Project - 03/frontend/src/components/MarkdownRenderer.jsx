import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

/**
 * Renders raw markdown text as formatted HTML.
 * - Code blocks get syntax highlighting
 * - Inline code gets styled
 * - Lists, headings, bold, italic, links all render properly
 */
export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  // Strip <think>...</think> tags that some models add
  const cleaned = content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  if (!cleaned) return <p className="text-muted">Thinking...</p>;

  return (
    <ReactMarkdown
      components={{
        // ── Code blocks with syntax highlighting ──
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");

          if (!inline && match) {
            return (
              <div className="code-block-wrap">
                <div className="code-block-header">
                  <span className="code-lang">{match[1]}</span>
                  <button
                    className="copy-btn"
                    onClick={() => navigator.clipboard.writeText(codeString)}
                  >
                    Copy
                  </button>
                </div>
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: "0 0 8px 8px",
                    fontSize: "13px",
                  }}
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            );
          }

          // Inline code or no language specified
          if (!inline && !match) {
            return (
              <div className="code-block-wrap">
                <SyntaxHighlighter
                  style={oneDark}
                  language="text"
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            );
          }

          return (
            <code className="inline-code" {...props}>
              {children}
            </code>
          );
        },

        // ── Links open in new tab ──
        a({ href, children, ...props }) {
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
              {children}
            </a>
          );
        },
      }}
    >
      {cleaned}
    </ReactMarkdown>
  );
}
