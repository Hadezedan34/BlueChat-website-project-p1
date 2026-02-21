"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { pusherClient } from '@/lib/pusher';
import Link from 'next/link';
import { useIsMobile } from '@/app/hooks/useIsMobile';

const Icons = {
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y2="16.65"></line></svg>,
  Bell: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
  Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Send: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
  Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
  Paperclip: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>,
  Chat: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
  MapPin: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  ArrowLeft: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>,
  UserPlus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
};

export default function LuxuryDashboard() {
  const isMobile = useIsMobile();
  const [mobileTab, setMobileTab] = useState<'chats' | 'friends' | 'map'>('chats');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [toast, setToast] = useState<{show: boolean, msg: string}>({show: false, msg: ''});

  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadFriends, setUnreadFriends] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const isImageUrl = (url: string) => {
    return url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null || url.includes('cloudinary.com');
  };

  const fetchLatestUserData = async () => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser || savedUser === 'undefined') { 
      router.push('/login'); 
      return; 
    }
    const parsedUser = JSON.parse(savedUser);
    try {
      const res = await fetch(`/api/users/${parsedUser._id || parsedUser.id}`);
      const data = await res.json();
      if (data && !data.error) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      }
    } catch (err) { console.error("Sync error:", err); }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const confirmAndSendImage = async () => {
    if (!imageFile) return;
    setIsUploading(true);
    const previewToClear = imagePreview;
    setImagePreview(null);
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'bluechat_preset');
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/dokpk76nt/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.secure_url) {
        handleSendMessage(data.secure_url);
      }
    } catch (err) {
      showLuxuryToast("TRANSMISSION FAILED!");
    } finally {
      setIsUploading(false);
      setImageFile(null);
      URL.revokeObjectURL(previewToClear!);
    }
  };

  useEffect(() => { fetchLatestUserData(); }, []);

  useEffect(() => {
    const myId = user?._id || user?.id;
    if (!myId) return;
    const channel = pusherClient.subscribe(`user-${myId.toString()}`);

    channel.bind('new-message', async (data: { sender: string }) => {
      if (selectedFriend?._id === data.sender || selectedFriend?.id === data.sender) {
        const res = await fetch(`/api/messages?sender=${myId}&receiver=${data.sender}`);
        const latestMsgs = await res.json().catch(() => []);
        setMessages(latestMsgs);
        new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3').play().catch(() => {});
      } else {
        setUnreadFriends(prev => [...new Set([...prev, data.sender])]);
        new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3').play().catch(() => {});
      }
    });

    channel.bind('typing', (data: { sender: string }) => {
      if (selectedFriend?._id === data.sender || selectedFriend?.id === data.sender) {
        setIsTyping(data.sender);
        setTimeout(() => setIsTyping(null), 3000);
      }
    });

    return () => { pusherClient.unsubscribe(`user-${myId.toString()}`); };
  }, [user?._id, user?.id, selectedFriend?._id, selectedFriend?.id]);

  useEffect(() => {
    if (selectedFriend?._id) {
      setUnreadFriends(prev => prev.filter(id => id !== selectedFriend._id));
    }
  }, [selectedFriend]);

  const handleTyping = async () => {
    const myId = user?._id || user?.id;
    const friendId = selectedFriend?._id || selectedFriend?.id;
    if (!myId || !friendId) return;
    fetch('/api/messages/typing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: myId, receiver: friendId }),
    }).catch(() => {});
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        const res = await fetch(`/api/users/search?search=${searchQuery}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setSearchResults(data.filter(u => (u._id || u.id) !== (user?._id || user?.id)));
        }
      } else { setSearchResults([]); }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    const getMsgs = async () => {
      if ((selectedFriend?._id || selectedFriend?.id) && (user?._id || user?.id)) {
        try {
          const res = await fetch(`/api/messages?sender=${user._id || user.id}&receiver=${selectedFriend._id || selectedFriend.id}`);
          if (!res.ok) return;
          const data = await res.json().catch(() => []);
          setMessages(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
      }
    };
    if (selectedFriend) getMsgs();
  }, [selectedFriend?._id, selectedFriend?.id, user?._id, user?.id]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSendMessage = async (customText?: string) => {
    const msgToContent = customText || newMessage;
    if (!msgToContent.trim() || !selectedFriend || !user) return;
    const tempId = Date.now().toString();
    const optimisticMsg = {
      _id: tempId,
      sender: user._id || user.id,
      receiver: selectedFriend._id || selectedFriend.id,
      text: msgToContent,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMsg]);
    if (!customText) setNewMessage("");
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: user._id || user.id, receiver: selectedFriend._id || selectedFriend.id, text: msgToContent }),
      });
      const realMsg = await res.json();
      setMessages(prev => prev.map(m => m._id === tempId ? realMsg : m));
    } catch (err) {
      setMessages(prev => prev.filter(m => m._id !== tempId));
      showLuxuryToast("Failed to send!");
    }
  };

  const handleAddFriend = async (friendId: string) => {
    try {
      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: user._id || user.id, receiverId: friendId }),
      });
      if (res.ok) {
        setSentRequests(prev => [...prev, friendId]);
        showLuxuryToast("🚀 Friend Request Sent!");
      }
    } catch (err) { console.error(err); }
  };

  const handleAcceptFriend = async (requestId: string) => {
    try {
      const res = await fetch('/api/friends/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id || user.id, friendId: requestId }),
      });
      if (res.ok) {
        showLuxuryToast("Friend Request Accepted!");
        fetchLatestUserData();
      }
    } catch (err) { console.error(err); }
  };

  const showLuxuryToast = (msg: string) => {
    setToast({show: true, msg});
    setTimeout(() => setToast({show: false, msg: ''}), 3000);
  };

  if (!user) return <div className="min-h-screen bg-[#020406] flex items-center justify-center text-[#3390ec] font-black italic animate-pulse tracking-[0.5em]">INITIALIZING...</div>;

  // Mobile View
  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#020406] text-slate-200 font-sans flex flex-col relative overflow-hidden">
        {toast.show && (
          <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] bg-[#3390ec] text-white px-8 py-4 rounded-2xl shadow-[0_0_50px_rgba(51,144,236,0.5)] font-bold border border-white/20 backdrop-blur-md animate-bounce">
            {toast.msg}
          </div>
        )}

        {/* Mobile Header */}
        <header className="px-4 py-4 flex items-center justify-between border-b border-white/5 bg-[#0a0c10]/90 backdrop-blur-xl z-20">
          {selectedFriend ? (
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedFriend(null)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                <Icons.ArrowLeft />
              </button>
              <div className="w-10 h-10 rounded-xl bg-[#3390ec]/20 flex items-center justify-center text-[#3390ec] font-black overflow-hidden border border-[#3390ec]/20">
                {selectedFriend.image ? <img src={selectedFriend.image} className="w-full h-full object-cover" alt="" /> : selectedFriend.username?.[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold">{selectedFriend.username}</p>
                {isTyping === (selectedFriend?._id || selectedFriend?.id) && (
                  <p className="text-[10px] text-[#3390ec] italic animate-pulse">Typing...</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#3390ec] to-[#1c64b0] rounded-xl flex items-center justify-center font-black text-white">B</div>
              <h1 className="font-black text-lg tracking-tight uppercase italic">BlueChat</h1>
            </div>
          )}
          <div className="flex items-center gap-2">
            {!selectedFriend && (
              <button onClick={() => setShowMobileSearch(!showMobileSearch)} className="p-2 text-slate-400 hover:text-[#3390ec] transition-colors">
                <Icons.Search />
              </button>
            )}
            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-slate-400 hover:text-[#3390ec] transition-colors relative">
              <Icons.Bell />
              {user.friendRequests?.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#3390ec] text-[9px] font-black text-white flex items-center justify-center rounded-full">{user.friendRequests.length}</span>}
            </button>
          </div>
        </header>

        {/* Mobile Search */}
        {showMobileSearch && !selectedFriend && (
          <div className="px-4 py-3 bg-[#0a0c10]/90 border-b border-white/5">
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} type="text" placeholder="Search..." className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#3390ec]/50" />
          </div>
        )}

        {/* Mobile Notifications */}
        {showNotifications && (
          <div className="absolute top-16 left-4 right-4 bg-[#0f1115] border border-white/10 rounded-2xl p-4 z-50 backdrop-blur-2xl">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Requests</p>
            {user.friendRequests?.map((req: any) => (
              <div key={req._id} className="flex items-center justify-between bg-white/5 p-3 rounded-xl mb-2">
                <span className="text-xs font-bold">{req.username}</span>
                <button onClick={() => handleAcceptFriend(req._id)} className="bg-[#3390ec] text-white text-[9px] px-3 py-1.5 rounded-lg font-black">ACCEPT</button>
              </div>
            ))}
          </div>
        )}

        {/* Mobile Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {selectedFriend ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m: any, idx: number) => {
                  const isMe = m.sender === (user._id || user.id);
                  const isImg = isImageUrl(m.text || "");
                  return (
                    <div key={`${m._id || idx}-${idx}`} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${isMe ? 'bg-[#3390ec] text-white rounded-2xl rounded-tr-none' : 'bg-white/10 border border-white/5 text-slate-200 rounded-2xl rounded-tl-none'} p-3`}>
                        {isImg ? (
                          <img src={m.text} alt="" className="max-h-[200px] rounded-xl object-cover" onClick={() => window.open(m.text, '_blank')} />
                        ) : (
                          <p className="text-sm">{m.text}</p>
                        )}
                        <p className="text-[8px] mt-1 opacity-50">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              {imagePreview && (
                <div className="absolute bottom-20 left-4 right-4 bg-[#0f1115]/90 backdrop-blur-2xl border border-[#3390ec]/30 p-3 rounded-2xl z-50 flex items-center gap-3">
                  <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <button onClick={confirmAndSendImage} className="w-full bg-[#3390ec] text-white py-2 rounded-lg font-black text-xs">SEND</button>
                  </div>
                  <button onClick={() => { setImagePreview(null); setImageFile(null); }} className="p-1">✕</button>
                </div>
              )}
              <div className="p-3 bg-[#0a0c10]/90 border-t border-white/5">
                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-full">
                  <label className="p-2 text-slate-400 cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} disabled={isUploading} />
                    <Icons.Paperclip />
                  </label>
                  <input value={newMessage} onChange={e => { setNewMessage(e.target.value); handleTyping(); }} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Message..." className="flex-1 bg-transparent border-none outline-none px-2 py-2 text-sm" disabled={isUploading} />
                  <button onClick={() => handleSendMessage()} className="w-10 h-10 bg-[#3390ec] rounded-full flex items-center justify-center" disabled={isUploading}>
                    <Icons.Send />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {searchResults.length > 0 && searchQuery.length > 2 && (
                <div className="mb-4">
                  <p className="text-[10px] font-black text-[#3390ec] uppercase mb-2">Found</p>
                  {searchResults.map(res => (
                    <div key={res._id} className="p-3 bg-[#3390ec]/5 rounded-xl flex items-center justify-between mb-2">
                      <span className="text-sm font-bold">{res.username}</span>
                      <button onClick={() => handleAddFriend(res._id)} className="p-2 bg-[#3390ec]/20 text-[#3390ec] rounded-lg">
                        {sentRequests.includes(res._id) ? <Icons.Check /> : <Icons.Plus />}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Friends</p>
              {user.friends?.length > 0 ? user.friends.map((f: any) => (
                <div key={f._id} onClick={() => { setSelectedFriend(f); setMessages([]); }} className="p-3 bg-white/5 rounded-xl flex items-center gap-3 cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-[#3390ec]/20 flex items-center justify-center text-[#3390ec] font-black overflow-hidden">
                    {f.image ? <img src={f.image} className="w-full h-full object-cover" alt="" /> : f.username?.[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{f.username}</p>
                    <p className="text-[10px] text-green-500">Online</p>
                  </div>
                  {unreadFriends.includes(f._id) && <div className="w-2 h-2 bg-[#3390ec] rounded-full"></div>}
                </div>
              )) : <p className="text-center text-slate-600 text-xs py-8">No friends yet</p>}
            </div>
          )}
        </div>

        {/* Mobile Bottom Nav */}
        {!selectedFriend && (
          <div className="flex items-center justify-around p-3 border-t border-white/5 bg-[#0a0c10]/90 backdrop-blur-xl">
            <button onClick={() => setMobileTab('chats')} className={`flex flex-col items-center gap-1 p-2 ${mobileTab === 'chats' ? 'text-[#3390ec]' : 'text-slate-500'}`}>
              <Icons.Chat />
              <span className="text-[10px] font-bold">Chats</span>
            </button>
            <button onClick={() => setMobileTab('friends')} className={`flex flex-col items-center gap-1 p-2 ${mobileTab === 'friends' ? 'text-[#3390ec]' : 'text-slate-500'}`}>
              <Icons.Users />
              <span className="text-[10px] font-bold">Friends</span>
            </button>
            <Link href="/map" className="flex flex-col items-center gap-1 p-2 text-slate-500">
              <Icons.MapPin />
              <span className="text-[10px] font-bold">Map</span>
            </Link>
            <Link href="/user-information" className="flex flex-col items-center gap-1 p-2 text-slate-500">
              <Icons.Settings />
              <span className="text-[10px] font-bold">Settings</span>
            </Link>
          </div>
        )}
      </div>
    );
  }

  // Desktop View (Original)
  return (
    <div className="min-h-screen bg-[#020406] text-slate-200 font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {toast.show && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] bg-[#3390ec] text-white px-8 py-4 rounded-2xl shadow-[0_0_50px_rgba(51,144,236,0.5)] font-bold border border-white/20 backdrop-blur-md animate-bounce">
          {toast.msg}
        </div>
      )}

      {/* Stars Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <div key={i} className="absolute bg-white rounded-full animate-pulse shadow-[0_0_8px_white]" 
            style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, width: '1.5px', height: '1.5px', animationDuration: `${Math.random() * 3 + 2}s`, opacity: Math.random() * 0.7 + 0.3 }} 
          />
        ))}
      </div>

      {/* --- Earth Orbit Button --- */}
      <Link href="/map" className="absolute top-10 right-10 z-50 group flex flex-col items-center gap-3">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#3390ec]/20 rounded-full blur-xl group-hover:bg-[#3390ec]/40 transition-all duration-700 animate-pulse"></div>
          <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-[inset_-6px_-6px_15px_rgba(0,0,0,0.9),0_0_20px_rgba(51,144,236,0.4)] border border-[#3390ec]/30 animate-[spin_25s_linear_infinite]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#3390ec_0%,#0a0c10_80%)] opacity-90"></div>
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/grid-me-dot.png')]"></div>
          </div>
          <div className="absolute w-[140%] h-[140%] border border-[#3390ec]/10 rounded-full group-hover:border-[#3390ec]/30 transition-colors duration-700"></div>
        </div>
        <span className="text-[7px] font-black text-[#3390ec] tracking-[0.4em] uppercase opacity-40 group-hover:opacity-100 transition-all duration-500 italic">Global Satellite</span>
      </Link>

      <div className="w-full max-w-7xl h-[85vh] bg-[#0a0c10]/90 backdrop-blur-3xl border border-white/5 rounded-[3rem] flex overflow-hidden relative z-10 shadow-2xl">
        {/* Sidebar */}
        <aside className="w-20 md:w-80 border-r border-white/5 flex flex-col bg-[#07090c]/50">
          <div className="p-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3390ec] to-[#1c64b0] rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-[#3390ec]/20">B</div>
            <h1 className="hidden md:block font-black text-xl tracking-tight uppercase italic">BlueChat</h1>
          </div>
          <div className="px-6 mb-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center text-slate-500 group-focus-within:text-[#3390ec] transition-colors"><Icons.Search /></div>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} type="text" placeholder="Search universe..." className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:border-[#3390ec]/50 transition-all placeholder:text-slate-600" />
            </div>
          </div>
          <div className="flex-1 px-4 overflow-y-auto space-y-4 custom-scrollbar">
            {searchResults.length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] font-black text-[#3390ec] uppercase px-4 mb-3 tracking-[0.2em]">Found Explorers</p>
                {searchResults.map(res => (
                  <div key={res._id} className="p-4 bg-[#3390ec]/5 rounded-3xl flex items-center justify-between mb-2 border border-[#3390ec]/20 group hover:bg-[#3390ec]/10 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#3390ec]/20 flex items-center justify-center text-[10px] overflow-hidden border border-white/5">
                        {res.image ? <img src={res.image} className="w-full h-full object-cover" /> : res.username?.[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-bold">{res.username}</span>
                    </div>
                    <button onClick={() => handleAddFriend(res._id)} className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#3390ec]/10 text-[#3390ec] hover:bg-[#3390ec] hover:text-white transition-all">
                      {sentRequests.includes(res._id) ? <Icons.Check /> : <Icons.Plus />}
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[10px] font-black text-slate-500 uppercase px-4 mb-3 tracking-[0.2em]">Friend Network</p>
            {user.friends?.length > 0 ? user.friends.map((f: any) => (
              <div key={f._id} onClick={() => { setSelectedFriend(f); setMessages([]); }} className={`p-4 rounded-3xl flex items-center gap-4 transition-all cursor-pointer border relative ${selectedFriend?._id === f._id ? 'bg-[#3390ec]/10 border-[#3390ec]/30 shadow-lg shadow-[#3390ec]/5' : 'border-transparent hover:bg-white/5'}`}>
                <div className="w-11 h-11 rounded-2xl bg-[#3390ec]/10 flex items-center justify-center text-[#3390ec] font-black overflow-hidden border border-[#3390ec]/20">
                  {f.image ? <img src={f.image} className="w-full h-full object-cover" alt="" /> : f.username?.[0].toUpperCase()}
                </div>
                <div className="hidden md:block flex-1">
                  <p className="text-sm font-bold tracking-tight">{f.username}</p>
                  <p className="text-[9px] text-green-500 font-bold uppercase tracking-widest">Online</p>
                </div>
                {unreadFriends.includes(f._id) && <div className="w-2.5 h-2.5 bg-[#3390ec] rounded-full shadow-[0_0_10px_#3390ec] animate-pulse absolute right-4"></div>}
              </div>
            )) : <p className="text-center text-[10px] text-slate-600 font-bold py-8 italic tracking-widest">No Signals Detected</p>}
          </div>
          <div className="p-6 border-t border-white/5 space-y-2">
            <Link href="/user-information" className="w-full flex items-center gap-4 p-4 hover:bg-[#3390ec]/10 rounded-2xl text-slate-400 hover:text-[#3390ec] font-bold transition-all group">
              <div className="group-hover:rotate-90 transition-transform duration-500"><Icons.Settings /></div>
              <span className="hidden md:block text-[10px] uppercase tracking-[0.2em]">Profile Settings</span>
            </Link>
            <button onClick={() => {localStorage.removeItem('user'); router.push('/login');}} className="w-full flex items-center gap-4 p-4 hover:bg-red-500/5 rounded-2xl text-red-400 font-bold transition-all">
              <Icons.Logout /> <span className="hidden md:block text-[10px] uppercase tracking-[0.2em]">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-white/[0.01]">
          <header className="px-10 py-8 flex items-center justify-between border-b border-white/5 bg-[#0a0c10]/40">
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_12px_#22c55e]"></div>
                <h2 className="text-[20px] font-black text-xs tracking-[0.3em] uppercase opacity-70">
                  {selectedFriend ? ` ${selectedFriend.username}` : "Command Center"}
                </h2>
              </div>
              {isTyping === (selectedFriend?._id || selectedFriend?.id) && (
                <p className="text-[10px] text-[#3390ec] italic font-bold mt-1 animate-pulse tracking-widest">Typing...</p>
              )}
            </div>
            <div className="flex items-center gap-6">
              <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="p-2.5 text-slate-400 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-all active:scale-95">
                  <Icons.Bell />
                  {user.friendRequests?.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#3390ec] text-[9px] font-black text-white flex items-center justify-center rounded-full border-2 border-[#0a0c10]">{user.friendRequests.length}</span>}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-16 w-80 bg-[#0f1115] border border-white/10 rounded-[2rem] shadow-2xl p-6 z-[100] backdrop-blur-2xl animate-in fade-in slide-in-from-top-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Requests</p>
                    {user.friendRequests?.map((req: any) => (
                      <div key={req._id} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 mb-2 hover:bg-white/10 transition-all">
                        <span className="text-xs font-black italic">{req.username}</span>
                        <button onClick={() => handleAcceptFriend(req._id)} className="bg-[#3390ec] text-white text-[9px] px-4 py-2 rounded-xl font-black hover:scale-105 transition-transform">ACCEPT</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 pl-6 border-l border-white/5">
                <div className="text-right hidden sm:block">
                  <p className="text-[11px] font-black uppercase tracking-widest">{user.username}</p>
                  <p className="text-[8px] text-[#3390ec] font-black mt-0.5 opacity-60 uppercase">Station Manager</p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/10 flex items-center justify-center font-black text-[#3390ec] overflow-hidden shadow-inner">
                  {user.image ? <img src={user.image} className="w-full h-full object-cover" alt="" /> : user.username?.[0].toUpperCase()}
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-hidden flex flex-col relative">
            {selectedFriend ? (
              <>
                <div className="flex-1 overflow-y-auto p-10 space-y-6 flex flex-col custom-scrollbar bg-[radial-gradient(circle_at_center,rgba(51,144,236,0.03)_0%,transparent_100%)]">
                  {messages.map((m: any, idx: number) => {
                    const isMe = m.sender === (user._id || user.id);
                    const isImg = isImageUrl(m.text || "");
                    return (
                      <div key={`${m._id || idx}-${idx}`} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`relative max-w-[75%] shadow-xl ${isMe ? 'bg-[#3390ec] text-white rounded-[1.8rem] rounded-tr-none p-1' : 'bg-white/10 border border-white/5 text-slate-200 rounded-[1.8rem] rounded-tl-none p-4'}`}>
                          {isImg ? (
                            <div className="rounded-[1.5rem] overflow-hidden border border-white/10 bg-black/20">
                               <img src={m.text} alt="Signal Attachment" className="max-h-[300px] w-full object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in" onClick={() => window.open(m.text, '_blank')} />
                            </div>
                          ) : (
                            <p className={`text-sm leading-relaxed ${isMe ? 'p-3' : ''}`}>{m.text}</p>
                          )}
                          <div className={`text-[8px] mt-2 opacity-40 font-black flex items-center gap-1 ${isMe ? 'justify-end pr-3 pb-2' : 'justify-start'}`}>
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {isMe && <span className="text-[#99f6ff]">✓✓</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                {imagePreview && (
                  <div className="absolute bottom-28 left-10 right-10 z-50 animate-in slide-in-from-bottom-10 duration-500">
                    <div className="bg-[#0f1115]/90 backdrop-blur-2xl border border-[#3390ec]/30 p-4 rounded-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] flex items-end gap-6 max-w-xl mx-auto">
                      <div className="relative w-40 h-40 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                        <button onClick={() => { setImagePreview(null); setImageFile(null); }} className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white p-1.5 rounded-full transition-colors">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                      </div>
                      <div className="flex-1 pb-2">
                        <p className="text-[10px] font-black text-[#3390ec] tracking-[.3em] uppercase mb-1">Image Ready</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest italic">Encrypted Satellite Stream</p>
                        <button onClick={confirmAndSendImage} className="mt-4 w-full bg-[#3390ec] hover:bg-[#1c64b0] text-white py-3 rounded-2xl font-black text-[10px] tracking-[.2em] transition-all shadow-lg shadow-[#3390ec]/20">INITIATE TRANSFER 🚀</button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-8 bg-[#0a0c10]/80 backdrop-blur-xl border-t border-white/5">
                  <div className="flex items-center gap-4 bg-white/5 p-2 rounded-full border border-white/10 focus-within:border-[#3390ec]/50 transition-all max-w-4xl mx-auto w-full group relative">
                    <label className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-[#3390ec] cursor-pointer transition-colors relative">
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} disabled={isUploading || !!imagePreview} />
                      <div className={isUploading ? 'animate-spin' : ''}><Icons.Paperclip /></div>
                    </label>
                    <input value={newMessage} onChange={e => { setNewMessage(e.target.value); handleTyping(); }} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder={isUploading ? "Uploading Satellite Image..." : "Type encrypted message..."} className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm text-white placeholder:text-slate-600" disabled={isUploading} />
                    <button onClick={() => handleSendMessage()} className="w-12 h-12 bg-[#3390ec] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#3390ec]/20 hover:scale-105 transition-transform active:scale-95 disabled:opacity-50" disabled={isUploading}><Icons.Send /></button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                <div className="p-16 rounded-full border-[1px] border-dashed border-slate-500 animate-[spin_30s_linear_infinite] shadow-[0_0_50px_rgba(255,255,255,0.05)]"><Icons.Users /></div>
                <p className="text-[10px] font-black tracking-[1em] mt-8 uppercase italic">Signal Waiting...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
