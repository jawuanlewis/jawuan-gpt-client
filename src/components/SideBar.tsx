import type { Dispatch, SetStateAction } from 'react';
import type { Chat, CurrChat } from '@src/types/chat';
import MenuButton from './MenuButton';
import ChatItem from './ChatItem';
import '@src/styles/SideBar.css';

interface SideBarProps {
  chats: Chat[];
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  currentChat: CurrChat;
  setCurrentChat: Dispatch<SetStateAction<CurrChat>>;
  onUpdateChatTitle?: (chatId: string, newTitle: string) => void;
}

const SideBar = ({
  chats,
  setIsSidebarOpen,
  currentChat,
  setCurrentChat,
  onUpdateChatTitle,
}: SideBarProps) => {
  return (
    <>
      <MenuButton onClick={() => setIsSidebarOpen(false)} />

      <button className="new-chat-btn" onClick={() => setCurrentChat(null)}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginRight: '0.1rem' }}
        >
          <circle
            cx="10"
            cy="10"
            r="9"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <line
            x1="10"
            y1="6"
            x2="10"
            y2="14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="6"
            y1="10"
            x2="14"
            y2="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        New Chat
      </button>

      <span className="sidebar-section-title">Chats</span>
      <div className="recent-chats">
        {chats.length === 0 ? (
          <span className="no-chats-msg">No existing chats</span>
        ) : (
          <ul className="chat-list">
            {chats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={currentChat?.id === chat.id}
                onSelect={setCurrentChat}
                onUpdateTitle={onUpdateChatTitle}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default SideBar;
