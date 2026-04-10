import { useState } from 'react';
import type { Chat } from '@src/types/chat';
import '@src/styles/chat-item.css';

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: (chat: Chat) => void;
  onUpdateTitle?: (chatId: string, newTitle: string) => void;
}

const ChatItem = ({
  chat,
  isActive,
  onSelect,
  onUpdateTitle,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(chat.title);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditTitle(chat.title);
  };

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim() && onUpdateTitle) {
      onUpdateTitle(chat.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  return (
    <li
      className={`chat-item ${isActive ? 'active' : ''}`}
      onClick={() => onSelect(chat)}
    >
      {isEditing ? (
        <form onSubmit={handleTitleSubmit} className="edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
          <button type="submit" className="save-btn">
            ✓
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(false);
            }}
          >
            ✕
          </button>
        </form>
      ) : (
        <>
          <span className="chat-title">{chat.title}</span>
          <button
            className="edit-btn"
            onClick={handleEditClick}
            title="Edit chat title"
          >
            ✎
          </button>
        </>
      )}
    </li>
  );
};

export default ChatItem;
