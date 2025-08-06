'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import Link from 'next/link';
import LoginPopup from '@/components/login-popup';

// Types
interface ChatUser {
  id: string;
  name: string;
  image: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  senderId: string;
}

// Mock data
const mockChatUsers: ChatUser[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    image: '/api/placeholder/40/40',
    lastMessage: 'Hey! How are you doing?',
    lastMessageTime: '2:30 PM',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Mike Chen',
    image: '/api/placeholder/40/40',
    lastMessage: 'The project looks great!',
    lastMessageTime: '1:45 PM',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    image: '/api/placeholder/40/40',
    lastMessage: 'Can we meet tomorrow?',
    lastMessageTime: '11:20 AM',
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: '4',
    name: 'David Brown',
    image: '/api/placeholder/40/40',
    lastMessage: 'Thanks for the help!',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: '1', text: 'Hey! How are you doing?', timestamp: '2:30 PM', isOwn: false, senderId: '1' },
    { id: '2', text: 'I\'m doing great, thanks! How about you?', timestamp: '2:32 PM', isOwn: true, senderId: 'current' },
    { id: '3', text: 'Pretty good! Just working on some projects.', timestamp: '2:35 PM', isOwn: false, senderId: '1' },
  ],
  '2': [
    { id: '1', text: 'The project looks great!', timestamp: '1:45 PM', isOwn: false, senderId: '2' },
    { id: '2', text: 'Thank you! I put a lot of effort into it.', timestamp: '1:47 PM', isOwn: true, senderId: 'current' },
  ],
  '3': [
    { id: '1', text: 'Can we meet tomorrow?', timestamp: '11:20 AM', isOwn: false, senderId: '3' },
    { id: '2', text: 'Sure! What time works for you?', timestamp: '11:25 AM', isOwn: true, senderId: 'current' },
  ],
  '4': [
    { id: '1', text: 'Thanks for the help!', timestamp: 'Yesterday', isOwn: false, senderId: '4' },
    { id: '2', text: 'No problem at all!', timestamp: 'Yesterday', isOwn: true, senderId: 'current' },
  ],
};

// Validation schema
const messageSchema = Yup.object().shape({
  message: Yup.string()
    .min(1, 'Message cannot be empty')
    .max(500, 'Message is too long')
    .required('Message is required'),
});

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;
  
  const [chatUsers, setChatUsers] = useState<ChatUser[]>(mockChatUsers);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [selectedChat, setSelectedChat] = useState<ChatUser | null>(null);
  const [showChatList, setShowChatList] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load initial chat list - you can replace this with an API call
  useEffect(() => {
    // Simulate loading chat list from API
    // Replace this with actual API call to fetch chat users
    // const fetchChatList = async () => {
    //   const response = await fetch('/api/chats');
    //   const data = await response.json();
    //   setChatUsers(data.chats);
    // };
    // fetchChatList();
  }, []);

  // API function to fetch chat messages
  const fetchChatMessages = async (userId: string) => {
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch(`/api/chat/${userId}/messages`);
      if (response.ok) {
        const data = await response.json();
        return data.messages;
      } else {
        // Fallback to mock data if API fails
        return mockMessages[userId] || [];
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Fallback to mock data
      return mockMessages[userId] || [];
    }
  };

  const handleSendMessage = (values: { message: string }, { resetForm }: any) => {
    if (!selectedChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: values.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      senderId: 'current',
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage],
    }));

    // Update last message in chat list
    setChatUsers(prev => 
      prev.map(user => 
        user.id === selectedChat.id 
          ? { ...user, lastMessage: values.message, lastMessageTime: newMessage.timestamp }
          : user
      )
    );

    resetForm();
  };

  const handleDeleteAllChats = () => {
    if (confirm('Are you sure you want to delete all chats? This action cannot be undone.')) {
      setChatUsers([]);
      setMessages({});
      setSelectedChat(null);
    }
  };

  const handleDeleteSingleChat = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering chat selection
    if (confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
      setChatUsers(prev => prev.filter(user => user.id !== userId));
      setMessages(prev => {
        const newMessages = { ...prev };
        delete newMessages[userId];
        return newMessages;
      });
      
      // If the deleted chat was selected, clear selection
      if (selectedChat?.id === userId) {
        setSelectedChat(null);
      }
    }
  };

  const handleChatSelect = async (user: ChatUser) => {
    setSelectedChat(user);
    if (isMobile) {
      setShowChatList(false);
    }
    
    // Fetch messages for this user if not already loaded
    if (!messages[user.id]) {
      const userMessages = await fetchChatMessages(user.id);
      setMessages(prev => ({
        ...prev,
        [user.id]: userMessages
      }));
    }
  };

  const handleBackToList = () => {
    setShowChatList(true);
    setSelectedChat(null);
  };

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Chats</h3>
      <p className="text-gray-500 mb-6 max-w-md">
        You don't have any active conversations yet. Start chatting with other users to see your conversations here.
      </p>
      <button 
        onClick={() => router.push('/')}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Explore Users
      </button>
    </div>
  );

  // Chat list component
  const ChatList = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-gray-200">
        {/* <div className="p-4">
          <Link href="/" className="text-black hover:underline block text-sm md:text-base">
            Back to Home
          </Link>
        </div> */}
        <div className="flex items-center justify-between pr-4 py-4">
          <div className="flex items-center gap-0">
                    <button 
            onClick={() => router.push('/')}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          </div>

          {chatUsers.length > 0 && (
            <button
              onClick={handleDeleteAllChats}
              className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
            >
              Delete All
            </button>
          )}
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {chatUsers.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y divide-gray-100">
            {chatUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => handleChatSelect(user)}
                className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedChat?.id === user.id ? 'bg-[#6f43fe] border-r-2 border-[#6f43fe]' : ''
                }`}
              >
                {/* User avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-full bg-[#6f43fe] flex items-center justify-center text-white font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  {user.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                {/* Chat info */}
                <div className="flex-1 min-w-0 ml-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{user.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{user.lastMessageTime}</span>
                      <button
                        onClick={(e) => handleDeleteSingleChat(user.id, e)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Delete chat"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
                    {user.unreadCount > 0 && (
                      <span className="bg-[#6f43fe] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {user.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Chat detail component
  const ChatDetail = () => {
    if (!selectedChat) return null;

    const currentMessages = messages[selectedChat.id] || [];

    return (
      <div className="flex flex-col h-full">
        {/* Chat header */}
        <div className="flex items-center p-4 border-b border-gray-200">
          {isMobile && (
            <button
              onClick={handleBackToList}
              className="mr-3 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          <div className="flex items-center flex-1">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                <Image
                  src={selectedChat.image}
                  alt={selectedChat.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-full h-full bg-[#6f43fe] flex items-center justify-center text-white font-semibold">
                  {selectedChat.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              {selectedChat.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">{selectedChat.name}</h3>
              <p className="text-sm text-gray-500">
                {selectedChat.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentMessages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            currentMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isOwn
                      ? 'bg-[#6f43fe] text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isOwn ? 'text-orange-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message input */}
        <div className="p-4 border-t border-gray-200">
          <Formik
            initialValues={{ message: '' }}
            validationSchema={messageSchema}
            onSubmit={handleSendMessage}
          >
            {({ isSubmitting }) => (
              <Form className="flex space-x-2">
                <div className="flex-1">
                  <Field
                    name="message"
                    as="textarea"
                    placeholder="Type your message..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg  focus:border-transparent resize-none"
                    rows={1}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        const form = (e.currentTarget as HTMLFormElement).form;
                        if (form) {
                          const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                          if (submitButton) submitButton.click();
                        }
                      }
                    }}
                  />
                  {/* <ErrorMessage name="message" component="div" className="text-red-500 text-xs mt-1" /> */}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[green] hover:bg-orange-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  };

  return (
    <>
    <LoginPopup />
    <div className="h-screen bg-white">
      <div className="flex h-full">
        {/* Chat list - hidden on mobile when chat is selected */}
        <div className={`${isMobile ? (showChatList ? 'w-full' : 'hidden') : 'w-full md:w-80 lg:w-96'} border-r border-gray-200 flex flex-col`}>
          <ChatList />
        </div>

        {/* Chat detail - hidden on mobile when showing chat list */}
        <div className={`${isMobile ? (showChatList ? 'hidden' : 'w-full') : 'flex-1'} flex flex-col`}>
          {selectedChat ? (
            <ChatDetail />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Chat</h3>
                <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
