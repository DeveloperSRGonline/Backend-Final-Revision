// ============================================================
// SRGpt — Home Page (Chat Interface)
// Wire Socket.IO and API calls to the TODO markers below.
// ============================================================

import { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/main.scss';

// ── Static Mock Data (replace with API calls) ─────────────────
const MOCK_USER = { name: 'Shivam Garade', initials: 'SG', plan: 'Pro' };

const MOCK_CHATS = [
  { id: '1', title: 'Build REST API with Express v5', time: '2h ago' },
  { id: '2', title: 'Pinecone vector memory flow',    time: 'Yesterday' },
  { id: '3', title: 'Socket.IO auth middleware fix',  time: '2d ago' },
  { id: '4', title: 'Zustand + NEXUS App setup',     time: '3d ago' },
  { id: '5', title: 'Sarvam AI alternation bug',     time: '5d ago' },
];

const MOCK_PROJECTS = [
  { id: 'p1', title: 'NEXUS App',     color: '#6366f1' },
  { id: 'p2', title: 'SRGpt Backend', color: '#10b981' },
  { id: 'p3', title: 'IoT FlameAlert',color: '#f59e0b' },
];

const AI_PROVIDERS = ['groq', 'gemini', 'sarvam'];

const SUGGESTION_CARDS = [
  { icon: '⚡', title: 'Generate Code',    desc: 'Write or debug code across any language or framework.' },
  { icon: '🧠', title: 'Deep Research',    desc: 'Synthesize complex topics with long-term memory.' },
  { icon: '✍️', title: 'Draft & Edit',     desc: 'Write, refine, or summarize any piece of content.' },
];

// ── Icons (inline SVG components — no icon library dependency) ─
const Icon = {
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Search: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  ),
  ChevronRight: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  CollapseLeft: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  ExpandRight: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  Chat: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  Folder: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  ),
  Send: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
    </svg>
  ),
  Attach: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
};

// ── TypingDots ────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="typing-indicator">
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
  );
}

// ── Provider color map ─────────────────────────────────────────
const PROVIDER_COLORS = {
  groq:   'var(--provider-groq)',
  gemini: 'var(--provider-gemini)',
  sarvam: 'var(--provider-sarvam)',
};

// ── Sidebar ───────────────────────────────────────────────────
function Sidebar({ open, onToggle, activeChat, onSelectChat, onNewChat }) {
  const [searchQuery, setSearchQuery]   = useState('');
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [recentsOpen, setRecentsOpen]   = useState(true);

  const filteredChats = MOCK_CHATS.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <aside className={`sidebar ${open ? '' : 'sidebar--collapsed'}`}>
      {/* Header */}
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <div className="sidebar__logo-mark">SR</div>
          <span className="sidebar__logo-text">SRGpt</span>
        </div>
        <button
          className="sidebar__collapse-btn"
          onClick={onToggle}
          title={open ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {open ? <Icon.CollapseLeft /> : <Icon.ExpandRight />}
        </button>
      </div>

      {/* New Chat */}
      <button className="sidebar__new-chat" onClick={onNewChat}>
        <Icon.Plus />
        <span className="sidebar__new-chat-text">New Chat</span>
      </button>

      {/* Search */}
      <div className="sidebar__search-wrapper">
        <div className="sidebar__search">
          <Icon.Search />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar__nav">
        {/* Projects */}
        <div className="sidebar__section">
          <div
            className="sidebar__section-header"
            onClick={() => setProjectsOpen((p) => !p)}
          >
            <span className="sidebar__section-label">Projects</span>
            <span className={`sidebar__section-toggle-icon ${projectsOpen ? 'sidebar__section-toggle-icon--open' : ''}`}>
              <Icon.ChevronRight />
            </span>
          </div>

          {projectsOpen && (
            <div className="sidebar__section-body">
              {MOCK_PROJECTS.map((project) => (
                <div key={project.id} className="sidebar__item">
                  {/* Dynamic color — only acceptable inline */}
                  <span
                    className="sidebar__item-icon sidebar__item-icon--dot"
                    style={{ backgroundColor: project.color }}
                  />
                  <div className="sidebar__item-content">
                    <span className="sidebar__item-text">{project.title}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Chats */}
        <div className="sidebar__section">
          <div
            className="sidebar__section-header"
            onClick={() => setRecentsOpen((p) => !p)}
          >
            <span className="sidebar__section-label">Recent</span>
            <span className={`sidebar__section-toggle-icon ${recentsOpen ? 'sidebar__section-toggle-icon--open' : ''}`}>
              <Icon.ChevronRight />
            </span>
          </div>

          {recentsOpen && (
            <div className="sidebar__section-body">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`sidebar__item ${activeChat?.id === chat.id ? 'sidebar__item--active' : ''}`}
                  onClick={() => onSelectChat(chat)}
                >
                  <span className="sidebar__item-icon">
                    <Icon.Chat />
                  </span>
                  <div className="sidebar__item-content">
                    <span className="sidebar__item-text">{chat.title}</span>
                    <div className="sidebar__item-meta">
                      <span className="sidebar__item-time">{chat.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Account */}
      <div className="sidebar__account-wrapper">
        <div className="sidebar__account">
          <div className="sidebar__avatar">{MOCK_USER.initials}</div>
          <div className="sidebar__account-info">
            <div className="sidebar__account-name">{MOCK_USER.name}</div>
            <div className="sidebar__account-plan">{MOCK_USER.plan} Plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ── Provider Selector ─────────────────────────────────────────
function ProviderSelector({ selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="provider-selector" onClick={() => setOpen((p) => !p)}>
        <span className={`provider-dot provider-dot--${selected}`} />
        <span className="provider-label">{selected}</span>
        <span className="provider-arrow"><Icon.ChevronDown /></span>
      </button>

      {open && (
        <div className="provider-menu">
          {AI_PROVIDERS.map((p) => (
            <div
              key={p}
              className={`provider-menu__item ${selected === p ? 'provider-menu__item--active' : ''}`}
              onClick={() => { onSelect(p); setOpen(false); }}
            >
              <span className={`provider-dot provider-dot--${p}`} />
              <span>{p.charAt(0).toUpperCase() + p.slice(1)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────
function EmptyState({ onSuggestion }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';

  return (
    <div className="empty-state">
      <div className="empty-state__heading">
        <h1 className="empty-state__title">
          {greeting}, <span>Shivam</span>
        </h1>
        <p className="empty-state__subtitle">How can I assist your flow today?</p>
      </div>

      <div className="empty-state__cards">
        {SUGGESTION_CARDS.map((card) => (
          <div
            key={card.title}
            className="empty-card"
            onClick={() => onSuggestion(card.title)}
          >
            <div className="empty-card__icon">{card.icon}</div>
            <div className="empty-card__title">{card.title}</div>
            <div className="empty-card__desc">{card.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Message ───────────────────────────────────────────────────
function Message({ role, content, provider }) {
  return (
    <div className={`message message--${role}`}>
      {role === 'assistant' && (
        <div className="message__meta">
          <span className="message__sender">SRGpt</span>
          {provider && (
            <span className="message__provider-tag">{provider}</span>
          )}
        </div>
      )}
      <div className="message__bubble">{content}</div>
    </div>
  );
}

// ── Home (Main Page) ──────────────────────────────────────────
export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeChat, setActiveChat]   = useState(null);
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [provider, setProvider]       = useState('groq');
  const [sending, setSending]         = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef    = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleNewChat = () => {
    setActiveChat(null);
    setMessages([]);
    textareaRef.current?.focus();
  };

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    // TODO: fetch real messages — GET /api/chat/:id/messages
    setMessages([
      { role: 'user',      content: chat.title,  provider: null },
      { role: 'assistant', content: 'Sure! Here's a breakdown of that topic. Ask me anything more specific.', provider },
    ]);
  };

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;

    const content = input.trim();
    setInput('');
    setSending(true);
    setTimeout(() => setSending(false), 380);

    setMessages((prev) => [...prev, { role: 'user', content, provider: null }]);
    setLoading(true);

    // ──────────────────────────────────────────────────────────
    // TODO: Replace mock below with real Socket.IO emit:
    //
    // socket.emit('ai-message', { chatId: activeChat?.id, content, ai: provider });
    // socket.on('ai-response', ({ content: aiContent }) => {
    //   setMessages((prev) => [...prev, { role: 'assistant', content: aiContent, provider }]);
    //   setLoading(false);
    // });
    // ──────────────────────────────────────────────────────────
    await new Promise((r) => setTimeout(r, 1600));
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: `[${provider.toUpperCase()}] This is a mock response. Wire Socket.IO to replace this.\n\nYou said: "${content}"`,
        provider,
      },
    ]);
    setLoading(false);
  }, [input, loading, provider, activeChat]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  };

  const handleSuggestion = (title) => {
    setInput(title);
    textareaRef.current?.focus();
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="app">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((p) => !p)}
        activeChat={activeChat}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />

      {/* Main */}
      <main className="main">
        {/* Top Bar */}
        <div className="topbar">
          <span className={`topbar__title ${!hasMessages ? 'topbar__title--empty' : ''}`}>
            {activeChat?.title ?? 'New Conversation'}
          </span>

          <div className="topbar__actions">
            <ProviderSelector selected={provider} onSelect={setProvider} />
          </div>
        </div>

        {/* Messages / Empty */}
        {hasMessages ? (
          <div className="messages">
            {messages.map((msg, i) => (
              <Message key={i} {...msg} />
            ))}
            {loading && <TypingDots />}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <EmptyState onSuggestion={handleSuggestion} />
        )}

        {/* Input */}
        <div className="input-area">
          <div className="input-wrapper">
            <button className="input-icon-btn" title="Attach file">
              <Icon.Attach />
            </button>

            <textarea
              ref={textareaRef}
              className="input-textarea"
              placeholder="Message SRGpt..."
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              rows={1}
            />

            <div className="input-actions">
              <button
                className={`send-btn ${sending ? 'send-btn--sending' : ''}`}
                onClick={handleSend}
                disabled={!input.trim() || loading}
                title="Send (Enter)"
              >
                {loading ? (
                  <svg
                    className="send-btn__spinner"
                    width="16" height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="12" r="10" strokeDasharray="30 70" />
                  </svg>
                ) : (
                  <Icon.Send />
                )}
              </button>
            </div>
          </div>

          <p className="input-footer">
            SRGpt may make mistakes. Verify important info.
          </p>
        </div>
      </main>
    </div>
  );
}