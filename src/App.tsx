import { useState, useEffect } from 'react';
import { chatService } from '@src/services/chatService';
import type { Chat, CurrChat } from '@src/types/chat';
import SideBar from '@src/components/SideBar';
import ChatArea from '@src/components/ChatArea';
import '@src/styles/App.css';

const App = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<CurrChat>(() => {
    const savedChat = sessionStorage.getItem('ACTIVE_CHAT');
    return savedChat ? JSON.parse(savedChat) : null;
  });
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(
    window.innerWidth > 768
  );

  const getChats = async () => {
    try {
      return await chatService.getChatHistory();
    } catch (error) {
      console.error('(Client) Error calling getChatHistory() API:', error);
    }
  };

  useEffect(() => {
    const initializeChats = async () => {
      const chatHistory = await getChats();
      setChats(chatHistory);
    };
    void initializeChats();
  }, []);

  useEffect(() => {
    sessionStorage.setItem('ACTIVE_CHAT', JSON.stringify(activeChat));
  }, [activeChat]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleUpdateChatTitle = async (chatId: string, newTitle: string) => {
    try {
      await chatService.updateChatTitle(chatId, newTitle);
      setChats(
        chats.map((chat) =>
          chat.id === chatId ? { ...chat, title: newTitle } : chat
        )
      );
      if (activeChat?.id === chatId) {
        setActiveChat({ ...activeChat, title: newTitle });
      }
    } catch (error) {
      console.error('(Client) Error updating chat title:', error);
    }
  };

  return (
    <div className={`app${isMobile && isSidebarOpen ? ' sidebar-open' : ''}`}>
      {(!isMobile || isSidebarOpen) && (
        <div className={`sidebar${isSidebarOpen ? '' : ' hidden'}`}>
          <SideBar
            chats={chats}
            setIsSidebarOpen={setIsSidebarOpen}
            currentChat={activeChat}
            setCurrentChat={setActiveChat}
            onUpdateChatTitle={handleUpdateChatTitle}
          />
        </div>
      )}
      <div className="chat-area">
        <ChatArea
          currentChat={activeChat}
          setCurrentChat={setActiveChat}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
    </div>
  );
};

export default App;
