import MarkdownRenderer from "./MarkdownRenderer";

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * A single chat message bubble.
 * - User messages: plain text, accent-colored bubble
 * - AI messages: rendered with markdown formatting
 */
export default function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  const isError = !isUser && msg.content?.startsWith("Error:");

  return (
    <div className={`message-row ${msg.role}`}>
      <div className="msg-wrap">
        <div className={`msg-avatar ${isUser ? "user" : "ai"}`}>
          {isUser ? "👤" : "✦"}
        </div>
        <div className="msg-body">
          <div className={`msg-bubble ${isError ? "msg-error" : ""}`}>
            {isUser ? (
              msg.content
            ) : (
              <MarkdownRenderer content={msg.content} />
            )}
          </div>
          <span className="msg-time">{formatTime(msg.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}
