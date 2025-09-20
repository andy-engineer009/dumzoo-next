'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import { API_ROUTES } from '@/appApi';
import { api } from '@/common/services/rest-api/rest-api';
import { useSocket } from '@/hooks/useSocket';

// Types
interface ChatUser {
  id: string;
  name: string;
  image: string;
  isOnline: boolean;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  senderId: string;
}

// // Mock data for current chat
// const mockCurrentUser: ChatUser = {
//   id: '1',
//   name: 'Sarah Johnson',
//   image: '/api/placeholder/40/40',
//   isOnline: true,
// };

const mockMessages: Message[] = [
  { id: '1', text: 'Hey! How are you doing?', timestamp: '2:30 PM', isOwn: false, senderId: '1' },
  { id: '2', text: 'I\'m doing great, thanks! How about you?', timestamp: '2:32 PM', isOwn: true, senderId: 'current' },
  { id: '3', text: 'Pretty good! Just working on some projects.', timestamp: '2:35 PM', isOwn: false, senderId: '1' },
  { id: '4', text: 'That sounds exciting! What kind of projects?', timestamp: '2:36 PM', isOwn: true, senderId: 'current' },
  { id: '5', text: 'I\'m working on a new mobile app for productivity.', timestamp: '2:38 PM', isOwn: false, senderId: '1' },
];

// Validation schema
const messageSchema = Yup.object().shape({
  message: Yup.string()
    .min(1, 'Message cannot be empty')
    .max(500, 'Message is too long')
    .required('Message is required'),
});

export default function ChatPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>();
  const [messages, setMessages] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingUser, setTypingUser] = useState<string>('');
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const { id } = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize socket connection
  const { 
    isConnected, 
    joinConversation, 
    leaveConversation, 
    sendMessage: socketSendMessage, 
    sendTyping, 
    onNewMessage, 
    onTyping, 
    offNewMessage, 
    offTyping 
  } = useSocket({
    autoConnect: true
  });

  // Get current user ID
  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem('activeUser') || '{}').id;
    setCurrentUserId(userId);
  }, []);

  // Join conversation when component mounts
  useEffect(() => {
    if (isConnected && id) {
      joinConversation(id as string);
    }

    return () => {
      if (id) {
        leaveConversation(id as string);
      }
    };
  }, [isConnected, id, joinConversation, leaveConversation]);

  // Fetch initial messages
  useEffect(() => {
    if (!id) return; // Don't fetch if no id
    
    const fetchMessages = async () => {
      api.get(`${API_ROUTES.getChatMessages}${id}`).then((res) => {
        if(res.status == 1){
          setCurrentUser(res.data?.username);
          setMessages(res.data?.messages);
        }
        else{
          // showError(res.message, 2000);
        }
       });
    };
    fetchMessages();
  }, [id]);

  // Listen for new messages
  useEffect(() => {
    if (isConnected) {
      const handleNewMessage = (message: any) => {
        console.log('New message received:', message);
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      };

      onNewMessage(handleNewMessage);

      return () => {
        offNewMessage();
      };
    }
  }, [isConnected, onNewMessage, offNewMessage]);

  // Listen for typing indicators - SIMPLE LOGIC
  useEffect(() => {
    if (isConnected) {
      const handleTyping = (data: { userId: string }) => {
        console.log('Typing data received:', data, 'Current user:', currentUserId);
        
        // Only show typing indicator if it's from a different user
        if (data.userId && data.userId !== currentUserId) {
          console.log('Showing typing indicator for user:', data.userId);
          
          // Show typing immediately
          setIsTyping(true);
          setTypingUser(data.userId);
          
          // Hide typing after 3 seconds - SIMPLE!
          setTimeout(() => {
            setIsTyping(false);
            setTypingUser('');
          }, 3000);
        }
      };

      onTyping(handleTyping);

      return () => {
        offTyping();
      };
    }
  }, [isConnected, currentUserId, onTyping, offTyping]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (values: { message: string }, { resetForm }: any) => {
    if (isConnected && currentUserId) {
      // Send message via Socket.IO for real-time delivery
      // The backend should handle persistence when receiving socket messages
      socketSendMessage(id as string, currentUserId, values.message);
      resetForm();
    } else {
      // Fallback to REST API only if Socket.IO is not connected
      const payload = {
        message: values.message,
        conversationId: id,
        userId: currentUserId
      };
      
      api.post(`${API_ROUTES.sendChatMessage}`, payload).then((res) => {
        if(res.status == 1){
          setMessages(prev => [...prev, res.data]);
          resetForm();
        }
        else{
          // showError(res.message, 2000);
        }
      });
    }
  };

  // Handle typing indicator - send event on every keystroke
  const triggerTyping = () => {
    if (isConnected && currentUserId) {
      // Send typing indicator immediately on every keystroke
      sendTyping(id as string, currentUserId, 'typing...');
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Chat header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
          <svg onClick={() => router.back()} className="w-5 h-5" fill="none" stroke="#ccc" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            
            <div className="flex items-center">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  <Image
                    src={currentUser?.image}
                    alt={currentUser?.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-full h-full bg-[#1fb036] flex items-center justify-center text-white font-semibold">
                    {currentUser?.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                </div>
                {currentUser?.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="ml-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-md font-semibold text-black">{currentUser}</h3>
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} 
                       title={isConnected ? 'Connected' : 'Disconnected'}></div>
                </div>
                <p className="text-sm text-gray-500">
                  {currentUser?.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 messages-wrapper relative">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              console.log(message, 'message'),
              <div
                key={message.id}
                className={`flex ${message.userId === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.userId === currentUserId
                      ? 'bg-[#D9FDD3] text-[#000]'
                      : 'bg-[#fff] text-black shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.userId === currentUserId ? 'text-green-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-black max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">typing...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
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
                <Field name="message">
                  {({ field, form }: any) => (
                    <textarea
                      {...field}
                      placeholder="Type your message..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#1fb036] focus:outline-none resize-none"
                      rows={1}
                      onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          form.submitForm();
                        }
                      }}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        // Update Formik field value
                        field.onChange(e);
                        
                        // Trigger typing indicator when user starts typing
                        if (e.target.value.length > 0) {
                          triggerTyping();
                        }
                      }}
                    />
                  )}
                </Field>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#1A9254] hover:bg-[#1fb036]/90 disabled:bg-gray-400 text-white px-3 py-[10px] h-[42px] rounded-lg transition-colors"
              >
                <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="" fill="none"><title>wds-ic-send-filled</title><path d="M5.4 19.425C5.06667 19.5583 4.75 19.5291 4.45 19.3375C4.15 19.1458 4 18.8666 4 18.5V14L12 12L4 9.99997V5.49997C4 5.1333 4.15 4.85414 4.45 4.66247C4.75 4.4708 5.06667 4.44164 5.4 4.57497L20.8 11.075C21.2167 11.2583 21.425 11.5666 21.425 12C21.425 12.4333 21.2167 12.7416 20.8 12.925L5.4 19.425Z" fill="currentColor"></path></svg>
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};