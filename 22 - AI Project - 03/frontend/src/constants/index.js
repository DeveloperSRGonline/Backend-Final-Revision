// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  App-wide Constants
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SOCKET_URL = "http://localhost:3000";

export const AI_MODELS = [
  {
    id: "groq",
    name: "Fast",
    desc: "Quick answers with Llama 3.3",
    icon: "⚡",
  },
  {
    id: "gemini",
    name: "Gemini",
    desc: "Google Gemini 2.0 Flash",
    icon: "✦",
  },
  {
    id: "sarvam",
    name: "Sarvam",
    desc: "Sarvam AI multilingual model",
    icon: "🌐",
  },
];

export const SUGGESTIONS = [
  { icon: "💡", label: "Explain React hooks simply" },
  { icon: "🛠️", label: "Build a REST API in Node.js" },
  { icon: "🎨", label: "CSS modern layout techniques" },
  { icon: "⚡", label: "Optimize web performance" },
];
