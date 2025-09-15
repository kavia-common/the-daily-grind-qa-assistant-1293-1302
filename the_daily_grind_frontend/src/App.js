import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';

// PUBLIC_INTERFACE
export default function App() {
  /**
   * The Daily Grind - Customer Q&A
   * - Single page with a friendly, coffee-themed design
   * - Customers can type a question and receive a mock answer
   * - Local state only; no backend integration required at this stage
   */

  // UI state
  const [theme, setTheme] = useState('light'); // light | dark
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState(() => {
    // Initialize with a helpful greeting
    return [
      {
        id: 'welcome-1',
        type: 'bot',
        text:
          "Welcome to The Daily Grind! I'm your friendly barista bot ☕️. Ask me anything about our coffee, menu, hours, or specials.",
        timestamp: Date.now(),
      },
    ];
  });

  const inputRef = useRef(null);

  // Apply theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  // Simulated "mock" answer generator
  const mockResponder = useMemo(() => {
    const canned = [
      "Great choice! Our house blend features chocolate and caramel notes. Would you like it hot or iced?",
      "We're open from 7am to 6pm on weekdays, and 8am to 4pm on weekends.",
      "Our current special is the Maple Oat Latte — slightly sweet, super cozy!",
      "We offer whole milk, oat, almond, and soy. Oat milk pairs wonderfully with espresso.",
      "Yes! We have fresh pastries delivered every morning from a local bakery.",
      "We can make almost any drink iced. Just ask! Our cold brew is also a fan favorite.",
      "For a nutty taste, try our hazelnut latte or a cortado for a balanced espresso-forward drink.",
      "You can order ahead using our website or by calling the shop—your drink will be ready when you arrive.",
    ];

    const keywords = [
      { key: ['hour', 'open', 'close', 'time'], msg: "We're open from 7am to 6pm on weekdays, and 8am to 4pm on weekends." },
      { key: ['milk', 'oat', 'almond', 'dairy'], msg: "We offer whole milk, oat, almond, and soy. Oat milk pairs wonderfully with espresso." },
      { key: ['special', 'seasonal', 'feature'], msg: "Our current special is the Maple Oat Latte — slightly sweet, super cozy!" },
      { key: ['cold', 'iced', 'ice'], msg: "We can make almost any drink iced. Our cold brew is bold, smooth, and very popular." },
      { key: ['pastry', 'muffin', 'bagel', 'croissant', 'food'], msg: "Yes! We have fresh pastries delivered every morning from a local bakery." },
      { key: ['order', 'ahead', 'online', 'pickup'], msg: "You can order ahead online or by phone — we’ll have it ready when you arrive!" },
      { key: ['recommend', 'suggest', 'favorite', 'favourite'], msg: "If you enjoy balanced flavors, try a cappuccino. For something cozy, the vanilla latte is wonderful." },
      { key: ['bean', 'blend', 'roast', 'origin'], msg: "Our beans are medium-roasted with notes of chocolate and caramel, sourced from small farms." },
    ];

    // PUBLIC_INTERFACE
    return (q) => {
      const lower = (q || '').toLowerCase();
      for (const item of keywords) {
        if (item.key.some((k) => lower.includes(k))) {
          return item.msg;
        }
      }
      // Fallback randomized helpful response
      return canned[Math.floor(Math.random() * canned.length)];
    };
  }, []);

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }

    // Push user question
    const userMsg = {
      id: `u-${Date.now()}`,
      type: 'user',
      text: trimmed,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setIsSubmitting(true);

    // Simulate API delay
    await new Promise((r) => setTimeout(r, 650));

    const answerText = mockResponder(trimmed);
    const botMsg = {
      id: `b-${Date.now()}`,
      type: 'bot',
      text: answerText,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, botMsg]);
    setIsSubmitting(false);

    // Focus input for quick follow-up
    inputRef.current?.focus();
  };

  return (
    <div className="app-shell">
      <header className="dg-header">
        <div className="brand">
          <span className="brand-icon" role="img" aria-label="coffee">☕</span>
          <div className="brand-text">
            <h1 className="brand-title">The Daily Grind</h1>
            <p className="brand-subtitle">Friendly Q&A Barista</p>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="btn theme-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>

      <main className="dg-main">
        <section className="chat-card">
          <div className="chat-messages" aria-live="polite">
            {messages.map((m) => (
              <MessageBubble key={m.id} type={m.type} text={m.text} />
            ))}
            {isSubmitting && (
              <MessageBubble type="bot" text="Thinking up something delicious..." loading />
            )}
          </div>

          <form className="chat-input" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className="input"
              type="text"
              placeholder="Ask about our menu, hours, or recommendations..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              aria-label="Ask a question"
              disabled={isSubmitting}
            />
            <button className="btn submit-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Brewing…' : 'Ask'}
            </button>
          </form>

          <p className="helper-text">
            Tip: Try “What are your hours?” or “Do you have dairy-free milk?” or “Recommend a drink!”
          </p>
        </section>
      </main>

      <footer className="dg-footer">
        <p>Made with care at The Daily Grind • Est. 2024</p>
      </footer>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * MessageBubble
 * Displays either a user or bot message with styled bubble.
 */
function MessageBubble({ type, text, loading = false }) {
  return (
    <div className={`bubble-row ${type === 'user' ? 'right' : 'left'}`}>
      <div className={`bubble ${type}`}>
        {loading ? <span className="dots" aria-label="loading">● ● ●</span> : text}
      </div>
    </div>
  );
}
