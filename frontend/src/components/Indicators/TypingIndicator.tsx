// TypingIndicator.jsx
import React from 'react';

const TypingIndicator = () => {
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginBottom: '1rem' }}>
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
      <style>{`
        .typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #bbb;
          animation: bounce 1.2s infinite ease-in-out;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          } 
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator;
