import { useState, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { chatService } from '@src/services/chatService';
import type { CurrChat } from '@src/types/chat';
import MenuButton from './MenuButton';
import Conversation from './Conversation';
import '@src/styles/ChatArea.css';
import { v4 as uuidv4 } from 'uuid';

interface ChatAreaProps {
  currentChat: CurrChat;
  setCurrentChat: Dispatch<SetStateAction<CurrChat>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const ChatArea = ({
  currentChat,
  setCurrentChat,
  isSidebarOpen,
  setIsSidebarOpen,
}: ChatAreaProps) => {
  const [timeOfDay, setTimeOfDay] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>(''); // Stores user's current prompt input
  const [isLoading, setIsLoading] = useState(false); // Message-loading state

  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours();

      if (currentHour >= 5 && currentHour < 12) {
        setTimeOfDay('morning');
      } else if (currentHour >= 12 && currentHour < 17) {
        setTimeOfDay('afternoon');
      } else {
        setTimeOfDay('evening');
      }
    };
    updateGreeting();

    // Update greeting every minute
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateChat = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    try {
      if (currentChat) {
        const tempMessages = [
          ...currentChat.messages,
          { id: 'loading', role: 'assistant' as const, content: '...' },
        ];
        setCurrentChat({ ...currentChat, messages: tempMessages });
        const updatedChat = await chatService.handlePrompt(
          currentChat,
          inputValue
        );
        setCurrentChat(updatedChat);
      } else {
        const tempId = uuidv4();
        setCurrentChat({
          id: tempId,
          userId: '',
          title: '',
          messages: [
            { id: uuidv4(), role: 'user' as const, content: inputValue },
            { id: 'loading', role: 'assistant' as const, content: '...' },
          ],
        });
        const newChat = await chatService.handlePrompt(null, inputValue);
        setCurrentChat(newChat);
      }
      setInputValue('');
    } catch (error) {
      console.error('(Client) Error calling handlePrompt() API:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="chat-area-head">
        {!isSidebarOpen && (
          <MenuButton onClick={() => setIsSidebarOpen(true)} />
        )}
        <label className="main-title">Jawuan&apos;s GPT</label>
      </div>

      {currentChat ? (
        <Conversation chat={currentChat.messages} />
      ) : (
        <label className="greeting">Good {timeOfDay}!</label>
      )}
      <div className="input-container">
        <input
          type="text"
          placeholder="What can I help you with?"
          className="chat-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && updateChat()}
          disabled={isLoading}
        />
        <button
          className="send-button"
          title="Send message"
          onClick={() => updateChat()}
          aria-label="Send message"
          disabled={isLoading}
        >
          ➤
        </button>
      </div>
    </>
  );
};

export default ChatArea;
