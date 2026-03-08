import { useState, useRef, useEffect } from "react";
import { AI_MODELS } from "../constants";
import { ChevronIcon } from "./Icons";

/**
 * Dropdown to switch between AI models (Groq / Gemini / Sarvam).
 * Closes automatically when clicking outside.
 */
export default function ModelSelector({ selectedModel, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0];

  return (
    <div className="model-selector" ref={ref}>
      <button className="model-selector-btn" onClick={() => setIsOpen((v) => !v)}>
        <span className="model-selector-icon">{current.icon}</span>
        <span className="model-selector-name">{current.name}</span>
        <ChevronIcon />
      </button>

      {isOpen && (
        <div className="model-dropdown">
          {AI_MODELS.map((model) => (
            <button
              key={model.id}
              className={`model-option ${model.id === selectedModel ? "active" : ""}`}
              onClick={() => { onSelect(model.id); setIsOpen(false); }}
            >
              <span className="model-option-icon">{model.icon}</span>
              <div className="model-option-info">
                <span className="model-option-name">{model.name}</span>
                <span className="model-option-desc">{model.desc}</span>
              </div>
              {model.id === selectedModel && <span className="model-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
