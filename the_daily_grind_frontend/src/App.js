import React, { useEffect, useRef, useState } from 'react';
import './App.css';

// PUBLIC_INTERFACE
export default function App() {
  /**
   * The Daily Grind - Customer Q&A
   * - Single page with a friendly, coffee-themed design
   * - Customers can type a question and receive an answer from backend API
   * - Implements loading and error states
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

  // PUBLIC_INTERFACE
  async function askBackend(questionText) {
    /**
     * Sends the user's question to the backend and returns the answer text.
     * Uses REACT_APP_API_BASE or defaults to '' (same origin).
     * Expects a JSON response: { answer: '...' }
     *
     * If REACT_APP_API_BASE is set:
     * - If it's an absolute URL, use it directly as prefix.
     * - Otherwise, treat it as a path prefix.
     * Ensures we don't end up with double slashes.
     */
    const rawBase = process.env.REACT_APP_API_BASE || '';
    let base = rawBase.trim();

    // Normalize base
    if (base === '/') {
      base = '';
    }
    if (base.endsWith('/')) {
      base = base.slice(0, -1);
    }

    const url = `${base}/api/ask`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // You may add auth headers here if needed in the future.
      body: JSON.stringify({ question: questionText }),
    });

    if (!response.ok) {
      // Try to extract error info if provided
      let details = '';
      try {
        const errJson = await response.json();
        details = errJson?.error || errJson?.message || '';
      } catch {
        // ignore JSON parse errors
      }
      const msg = details ? `${response.status} ${response.statusText}: ${details}` : `${response.status} ${response.statusText}`;
      throw new Error(msg);
    }

    const data = await response.json();
    // Defensive: ensure shape
    if (!data || typeof data.answer !== 'string') {
      throw new Error('Invalid response from server: missing "answer" field.');
    }
    return data.answer;
  }

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

    try {
      const answerText = await askBackend(trimmed);
      const botMsg = {
        id: `b-${Date.now()}`,
        type: 'bot',
        text: answerText,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      // Show a friendly error bubble
      const botMsg = {
        id: `b-${Date.now()}`,
        type: 'bot',
        text:
          `Oops! I couldn't fetch an answer right now. Please try again in a moment. (${err?.message || 'Network error'})`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsSubmitting(false);
      // Focus input for quick follow-up
      inputRef.current?.focus();
    }
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
