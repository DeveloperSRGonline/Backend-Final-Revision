import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "./constants";

// ── Components ──
import ModelSelector from "./components/ModelSelector";
import MessageBubble from "./components/MessageBubble";
import TypingIndicator from "./components/TypingIndicator";
import WelcomeScreen from "./components/WelcomeScreen";
import ChatInput from "./components/ChatInput";
import { PlusIcon, ArrowDownIcon } from "./components/Icons";

import "./App.css";

function App() {
  // ── State ──
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [selectedModel, setSelectedModel] = useState("groq");
  const [socket, setSocket] = useState(null);

  // ── Refs ──
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // ── Auto-scroll to latest message ──
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // ── Socket connection (once on mount) ──
  useEffect(() => {
    const sock = io(SOCKET_URL);

    sock.on("connect", () => console.log("✅ Connected to server"));
    sock.on("disconnect", () => console.log("❌ Disconnected"));

    sock.on("ai-response", (data) => {
      const content =
        typeof data === "string"
          ? data
          : data?.response || JSON.stringify(data);

      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "assistant", content, timestamp: new Date() },
      ]);
      setIsTyping(false);
    });

    setSocket(sock);
    return () => sock.disconnect();
  }, []);

  // ── Scroll detection ──
  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 200);
  };

  // ── Send message ──
  const sendMessage = (text) => {
    const prompt = (text ?? inputValue).trim();
    if (!prompt || isTyping) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", content: prompt, timestamp: new Date() },
    ]);
    setInputValue("");

    if (socket) {
      setIsTyping(true);
      socket.emit("ai-message", { prompt, model: selectedModel });
    }
  };

  // ── Clear chat ──
  const handleClear = () => {
    setMessages([]);
    setIsTyping(false);
  };

  const hasMessages = messages.length > 0;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Render
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  return (
    <div className="chat-app">
      {/* Header */}
      <header className="chat-header">
        <div className="header-left">
          <ModelSelector selectedModel={selectedModel} onSelect={setSelectedModel} />
        </div>
        <div className="header-actions">
          <button className="icon-btn" title="New chat" onClick={handleClear}>
            <PlusIcon />
          </button>
        </div>
      </header>

      {/* Messages or Welcome */}
      {!hasMessages && !isTyping ? (
        <WelcomeScreen onSuggestionClick={sendMessage} />
      ) : (
        <div className="chat-messages" ref={messagesContainerRef} onScroll={handleScroll}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Scroll-to-bottom */}
      {showScrollBtn && hasMessages && (
        <button className="scroll-bottom-btn" onClick={scrollToBottom} title="Scroll to bottom">
          <ArrowDownIcon />
        </button>
      )}

      {/* Input */}
      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSend={() => sendMessage()}
        disabled={isTyping}
      />
    </div>
  );
}

export default App;
