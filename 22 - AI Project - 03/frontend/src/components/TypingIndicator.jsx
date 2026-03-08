/**
 * Animated typing dots shown while waiting for AI response.
 */
export default function TypingIndicator() {
  return (
    <div className="typing-row">
      <div className="msg-avatar ai">✦</div>
      <div className="typing-bubble">
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
      </div>
    </div>
  );
}
