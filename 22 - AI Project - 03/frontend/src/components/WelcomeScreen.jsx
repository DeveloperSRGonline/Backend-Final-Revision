import { SUGGESTIONS } from "../constants";

/**
 * Landing screen with greeting + clickable suggestion chips.
 */
export default function WelcomeScreen({ onSuggestionClick }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-logo">✦</div>
      <h1 className="welcome-heading">How can I help you today?</h1>
      <p className="welcome-desc">
        I&apos;m your AI assistant. Ask me anything — from coding questions to
        creative ideas.
      </p>
      <div className="suggestions-grid">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            className="suggestion-btn"
            onClick={() => onSuggestionClick(s.label)}
          >
            <span className="suggestion-icon">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
