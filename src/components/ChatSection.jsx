import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function ChatSection() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;

    const currentQuestion = question;

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: currentQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const res = await axios.get(
        "http://localhost:8000/ask",
        {
          params: {
            question: currentQuestion,
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: res.data.answer,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: "Failed to get response from AI.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-card">
      <h2>AI Assistant</h2>

      <div className="chat-history">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.type === "user"
                ? "user-msg"
                : "ai-msg"
            }
          >
            <ReactMarkdown>
            {msg.text}
            </ReactMarkdown>
          </div>
        ))}

        {loading && (
          <div className="ai-msg">
            Thinking...
          </div>
        )}
      </div>

      <input
        className="question-input"
        type="text"
        placeholder="Ask anything about your documents..."
        value={question}
        onChange={(e) =>
          setQuestion(e.target.value)
        }
      />

      <button
        className="ask-btn"
        onClick={askAI}
      >
        Ask AI
      </button>
    </div>
  );
}

export default ChatSection;