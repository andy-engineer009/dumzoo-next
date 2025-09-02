'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';

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

// Mock data for current chat
const mockCurrentUser: ChatUser = {
  id: '1',
  name: 'Sarah Johnson',
  image: '/api/placeholder/40/40',
  isOnline: true,
};

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
  const [currentUser] = useState<ChatUser>(mockCurrentUser);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const handleSendMessage = (values: { message: string }, { resetForm }: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: values.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      senderId: 'current',
    };

    setMessages(prev => [...prev, newMessage]);
    resetForm();
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Chat header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => router.push('/chat')}
              className="p-2 rounded-full hover:bg-gray-100 mr-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex items-center">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  <Image
                    src={currentUser.image}
                    alt={currentUser.name}
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
                    {currentUser.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                </div>
                {currentUser.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-black">{currentUser.name}</h3>
                <p className="text-sm text-gray-500">
                  {currentUser.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isOwn
                    ? 'bg-[#1fb036] text-white'
                    : 'bg-gray-100 text-black'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.isOwn ? 'text-green-100' : 'text-gray-500'
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#1fb036] focus:outline-none resize-none"
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
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#1fb036] hover:bg-[#1fb036]/90 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
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