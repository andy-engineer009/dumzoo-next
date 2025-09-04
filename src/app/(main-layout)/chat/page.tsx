'use client';

import { api } from '@/common/services/rest-api/rest-api';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { API_ROUTES } from '@/appApi';

const mockChatUsers = [
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

export default function ChatList() {
    const router = useRouter();
    const [chatUsers, setChatUsers] = useState<any>([]);
    const [selectedChat, setSelectedChat] = useState<any>(null);


    useEffect(() => {
      const userId = JSON.parse(localStorage.getItem('activeUser') || '{}').id;
        const fetchChatUsers = async () => {
            api.get(`${API_ROUTES.getChatConversationsList}${userId}`).then((res) => {
              if(res.status == 1){
                setChatUsers(res.data);
              }
              else{
                  // showError(res.message, 2000);
              }
                // setChatUsers(res.data);
            });
            // setChatUsers(response.data);
        };
        fetchChatUsers();
    }, []);

    // Handle chat selection
    const handleChatSelect = (user: any) => {
        setSelectedChat(user);
        router.push(`/chat/${user?.id}`);
    };

    // Handle delete single chat
    const handleDeleteSingleChat = (userId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering chat selection
        if (confirm('Are you sure you want to delete this chat?')) {
            setChatUsers((prev: any[]) => prev.filter((user: any) => user.id !== userId));
        }
    };

    // Handle delete all chats
    const handleDeleteAllChats = () => {
        if (confirm('Are you sure you want to delete all chats?')) {
            setChatUsers([]);
        }
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
        className="bg-[#1fb036] hover:bg-[#1fb036]/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Explore Users
      </button>
    </div>
  );

    return (
    <div className="flex flex-col h-full">
    {/* Header */}
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 pr-4 py-3">
        <div className="flex items-center justify-center relative">
          <button 
            onClick={() => router.push('/')}
            className="p-2 rounded-full hover:bg-gray-100 absolute left-0 top-1/2 -translate-y-1/2"
          >
            <svg className="w-5 h-5" fill="none" stroke="#ccc" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-medium text-gray-900"> Messages</h1>
        </div>
      </header>

    {chatUsers.length > 0 && (
          <button
            onClick={handleDeleteAllChats}
            className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
          >
            Delete All
          </button>
        )}

    {/* Chat list */}
    <div className="flex-1 overflow-y-auto">
      {chatUsers.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="divide-y divide-gray-100">
          {chatUsers.map((user : any) => (
            <div
              key={user?.id}
              onClick={() => handleChatSelect(user)}
              className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedChat?.id === user?.id ? 'bg-[#1fb036]/10 border-r-2 border-[#1fb036]' : ''
              }`}
            >
              <div className='mb-3'>{user?.id}</div>
              {/* User avatar */}
              {/* <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  <Image
                    src={user?.image}
                    alt={user?.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-full h-full bg-[#1fb036] flex items-center justify-center text-white font-semibold">
                    {user?.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                </div>
                {user?.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div> */}

              {/* Chat info */}
              {/* <div className="flex-1 min-w-0 ml-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{user?.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{user?.lastMessageTime}</span>  
                    <button
                      onClick={(e) => handleDeleteSingleChat(user?.id, e)}
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
                  <p className="text-sm text-gray-500 truncate">{user?.lastMessage}</p>
                  {user?.unreadCount > 0 && (
                    <span className="bg-[#1fb036] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {user?.unreadCount}
                    </span>
                  )}
                </div>
              </div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
    )
};