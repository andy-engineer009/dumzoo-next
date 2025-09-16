'use client';

import { api } from '@/common/services/rest-api/rest-api';
import {  useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { API_ROUTES } from '@/appApi';
import { useSocket } from '@/hooks/useSocket';
import LoginPopup from '@/components/login-popup';
import { useDispatch, useSelector } from 'react-redux';
import { setChatUsers, clearChatUsers, selectChatUsers } from '@/store/apiDataSlice';
import { RootState } from '@/store/store';
import { selectIsLoggedIn } from '@/store/userRoleSlice';
import { getAllLocalStorageData } from '@/helpers/common';

export default function ChatList() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const isLoggedIn = useSelector(selectIsLoggedIn);

    // Get chat users from Redux
    const chatUsers = useSelector((state: RootState) => selectChatUsers(state));
    
    // Initialize socket connection
    const { isConnected, onNewMessage, offNewMessage } = useSocket({
      autoConnect: true
    });

    // Handle page refresh - clear Redux data
    useEffect(() => {
      const handleBeforeUnload = () => {
        dispatch(clearChatUsers());
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, [dispatch]);

    useEffect(() => {
      const userId = getAllLocalStorageData()?.activeUser?.id;
      setCurrentUserId(userId);
      
      // Check if data exists in Redux
      if (chatUsers.length > 0) {
        // Data exists, show it
        setIsLoading(false);
        return;
      }
      
      // No data, call API
      const fetchChatUsers = async () => {
        setIsLoading(true);
        api.get(`${API_ROUTES.getChatConversationsList}${userId}`).then((res) => {
          if(res.status == 1){
            // Store in Redux
            dispatch(setChatUsers(res.data));
          }
          else{
              // showError(res.message, 2000);
          }
          setIsLoading(false);
        }).catch(() => {
          setIsLoading(false);
        });
      };
      if(isLoggedIn){
        fetchChatUsers();
      } else{
        setIsLoading(false);
      }
    }, [dispatch, chatUsers.length]);

    // Listen for new messages and update chat list
    useEffect(() => {
      if (isConnected) {
        const handleNewMessage = (message: any) => {
          console.log('New message received in chat list:', message);
          
          // Update the chat list with the new message
          const updatedChats = chatUsers.map((chat: any) => {
            if (chat.id === message.conversationId) {
              return {
                ...chat,
                lastMessage: message.message,
                lastMessageTime: new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }),
                unreadCount: message.senderId !== currentUserId ? (chat.unreadCount || 0) + 1 : chat.unreadCount
              };
            }
            return chat;
          });
          
          // Update Redux
          dispatch(setChatUsers(updatedChats));
        };

        onNewMessage(handleNewMessage);

        return () => {
          offNewMessage();
        };
      }
    }, [isConnected, currentUserId, onNewMessage, offNewMessage, dispatch, chatUsers]);

    // Handle chat selection
    const handleChatSelect = (user: any) => {
        setSelectedChat(user);
        router.push(`/chat/${user?.id}`);
    };

    // Handle delete single chat
    const handleDeleteSingleChat = (userId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering chat selection
        if (confirm('Are you sure you want to delete this chat?')) {
            const updatedChats = chatUsers.filter((user: any) => user.id !== userId);
            dispatch(setChatUsers(updatedChats));
        }
    };

    // Handle delete all chats
    const handleDeleteAllChats = () => {
        if (confirm('Are you sure you want to delete all chats?')) {
            dispatch(clearChatUsers());
        }
    };

 const skeleton = () => (
    <>
      <div className="flex flex-col h-full">
        {/* Header - same as original */}
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
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-medium text-gray-900">Messages</h1>
            </div>
          </div>
        </header>

        {/* Skeleton Chat Cards */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-100">
            {/* Skeleton for 5 chat cards */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center p-4 animate-pulse">
                {/* Skeleton avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                </div>

                {/* Skeleton chat info */}
                <div className="flex-1 min-w-0 ml-4">
                  <div className="flex items-center justify-between mb-2">
                    {/* Skeleton name */}
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    {/* Skeleton time */}
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    {/* Skeleton last message */}
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                    {/* Skeleton unread count */}
                    <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
 )

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
      <>
        <LoginPopup />
        {isLoading ? (
          skeleton()
        ) : (
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
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-medium text-gray-900">Messages</h1>
                  {/* <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} 
                       title={isConnected ? 'Connected' : 'Disconnected'}></div> */}
                </div>
              </div>
            </header>

            {chatUsers.length > 0 && (
              <button
                onClick={handleDeleteAllChats}
                className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors text-end px-2"
              >
                Delete All
              </button>
            )}

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto">
              {(chatUsers.length === 0 || !isLoggedIn) ? (
                <EmptyState />
              ) : (
                <div className="divide-y divide-gray-100">
                  {chatUsers.map((user : any) => (
                    <div
                      key={user?.id}
                      onClick={() => handleChatSelect(user)}
                      className={`flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedChat?.id === user?.id ? '' : ''
                      }`}
                    >
                      {/* <div className='mb-3'>{user?.id}</div> */}
                      {/* User avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-[40px] h-[40px] rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                          {/* <Image
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
                          /> */}
                          <div className=" w-full h-full bg-[#1fb036] flex items-center justify-center text-white font-semibold">
                            {user?.displayUser?.split(' ').map((n: string) => n[0]).join('') || 'AN'}
                          </div>
                        </div>
                        {user?.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      {/* Chat info */}
                      <div className="flex-1 min-w-0 ml-4">
                        <div className="flex items-center justify-between">
                          <div>
                          <h3 className="text-sm font-medium text-gray-900 truncate " style={{lineHeight: 'normal'}}>{user?.displayUser || 'Andy'}</h3>
                          <span className="text-xs text-gray-500 block">{user?.lastMessageTime || '---'}</span> 
                          </div>
                         
                          <div className="flex items-center space-x-2">

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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </>
    )
};