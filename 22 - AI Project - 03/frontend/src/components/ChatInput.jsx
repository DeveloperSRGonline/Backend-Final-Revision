import { useRef } from "react";
import { SendIcon } from "./Icons";

/**
 * Chat input area with auto-resizing textarea and send button.
 */
export default function ChatInput({ inputValue, setInputValue, onSend, disabled }) {
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    setInputValue(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleSend = () => {
    onSend();
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  return (
    <div className="chat-input-area">
      <div className="input-box">
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          placeholder="Message AI Assistant..."
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!inputValue.trim() || disabled}
          title="Send message"
        >
          <SendIcon />
        </button>
      </div>
      <div className="input-hint">
        AI can make mistakes · Shift + Enter for new line
      </div>
    </div>
  );
}
