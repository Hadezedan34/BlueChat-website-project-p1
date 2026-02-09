'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const Icons = {
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y2="16.65"></line></svg>,
  Bell: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
  Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Send: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
};

export default function LuxuryDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [toast, setToast] = useState<{show: boolean, msg: string}>({show: false, msg: ''});

  // Messaging States
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const fetchLatestUserData = async () => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) { router.push('/login'); return; }
    const parsedUser = JSON.parse(savedUser);
    try {
      const res = await fetch(`/api/users/${parsedUser._id || parsedUser.id}`);
      const data = await res.json();
      if (data && !data.error) setUser(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchLatestUserData(); }, []);

  // Search Logic
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

  // Messages Refresh Logic
  useEffect(() => {
    let interval: any;
    const getMsgs = async () => {
      if (selectedFriend?._id && user?._id) {
        const res = await fetch(`/api/messages?sender=${user._id}&receiver=${selectedFriend._id}`);
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      }
    };
    if (selectedFriend) {
      getMsgs();
      interval = setInterval(getMsgs, 3000);
    }
    return () => clearInterval(interval);
  }, [selectedFriend?._id, user?._id]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend || !user) return;
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: user._id, receiver: selectedFriend._id, text: newMessage }),
    });
    if (res.ok) {
      const data = await res.json();
      setMessages(prev => [...prev, data]);
      setNewMessage("");
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
        showLuxuryToast("✨ Accepted!");
        fetchLatestUserData();
      }
    } catch (err) { console.error(err); }
  };

  const showLuxuryToast = (msg: string) => {
    setToast({show: true, msg});
    setTimeout(() => setToast({show: false, msg: ''}), 3000);
  };

  if (!user) return <div className="min-h-screen bg-[#020406] flex items-center justify-center text-[#3390ec] font-black italic animate-pulse tracking-[0.5em]">INITIALIZING...</div>;

  return (
    <div className="min-h-screen bg-[#020406] text-slate-200 font-sans flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Toast */}
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

      <div className="w-full max-w-7xl h-[85vh] bg-[#0a0c10]/90 backdrop-blur-3xl border border-white/5 rounded-[3rem] flex overflow-hidden relative z-10">
        
        {/* Sidebar */}
        <aside className="w-20 md:w-80 border-r border-white/5 flex flex-col bg-[#07090c]/50">
          <div className="p-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3390ec] to-[#1c64b0] rounded-2xl flex items-center justify-center font-black text-white text-xl">B</div>
            <h1 className="hidden md:block font-black text-xl tracking-tight uppercase italic">BlueChat</h1>
          </div>

          <div className="px-6 mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center text-slate-500"><Icons.Search /></div>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} type="text" placeholder="Search universe..." className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:border-[#3390ec]/50" />
            </div>
          </div>

          <div className="flex-1 px-4 overflow-y-auto space-y-4 custom-scrollbar">
            {searchResults.length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] font-black text-[#3390ec] uppercase px-4 mb-3 tracking-[0.2em]">Found Explorers</p>
                {searchResults.map(res => (
                  <div key={res._id} className="p-4 bg-[#3390ec]/5 rounded-3xl flex items-center justify-between mb-2 border border-[#3390ec]/20">
                    <span className="text-sm font-bold">{res.username}</span>
                    <button onClick={() => handleAddFriend(res._id)} className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#3390ec]/10 text-[#3390ec] hover:bg-[#3390ec] hover:text-white transition-all">
                      {sentRequests.includes(res._id) ? <Icons.Check /> : <Icons.Plus />}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-[10px] font-black text-slate-500 uppercase px-4 mb-3 tracking-[0.2em]">Friend Network</p>
            {user.friends?.length > 0 ? user.friends.map((f: any) => (
              <div key={f._id} onClick={() => { setSelectedFriend(f); setMessages([]); }} className={`p-4 rounded-3xl flex items-center gap-4 transition-all cursor-pointer border ${selectedFriend?._id === f._id ? 'bg-[#3390ec]/10 border-[#3390ec]/30' : 'border-transparent hover:bg-white/5'}`}>
                <div className="w-11 h-11 rounded-2xl bg-[#3390ec]/10 flex items-center justify-center text-[#3390ec] font-black">{f.username?.[0].toUpperCase()}</div>
                <div className="hidden md:block">
                  <p className="text-sm font-bold tracking-tight">{f.username}</p>
                  <p className="text-[9px] text-green-500 font-bold uppercase tracking-widest">Online</p>
                </div>
              </div>
            )) : <p className="text-center text-[10px] text-slate-600 font-bold py-8 italic tracking-widest">No Signals Detected</p>}
          </div>

          <div className="p-6 border-t border-white/5">
            <button onClick={() => {localStorage.removeItem('user'); router.push('/login');}} className="w-full flex items-center gap-4 p-4 hover:bg-red-500/5 rounded-2xl text-red-400 font-bold transition-all">
              <Icons.Logout /> <span className="hidden md:block text-[10px] uppercase tracking-[0.2em]">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Area */}
        <main className="flex-1 flex flex-col bg-white/[0.01]">
          <header className="px-10 py-8 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_12px_#22c55e]"></div>
              <h2 className="font-black text-xs tracking-[0.3em] uppercase opacity-70">{selectedFriend ? `Comms: ${selectedFriend.username}` : "Command Center"}</h2>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="p-2.5 text-slate-400 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-all">
                  <Icons.Bell />
                  {user.friendRequests?.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#3390ec] text-[9px] font-black text-white flex items-center justify-center rounded-full">{user.friendRequests.length}</span>}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-16 w-80 bg-[#0f1115] border border-white/10 rounded-[2rem] shadow-2xl p-6 z-[100] backdrop-blur-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Requests</p>
                    {user.friendRequests?.map((req: any) => (
                      <div key={req._id} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 mb-2">
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
                  <p className="text-[8px] text-[#3390ec] font-black mt-0.5 opacity-60">STATION MANAGER</p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/10 flex items-center justify-center font-black text-[#3390ec]">{user.username?.[0].toUpperCase()}</div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-hidden flex flex-col">
            {selectedFriend ? (
              <>
                <div className="flex-1 overflow-y-auto p-10 space-y-6 flex flex-col custom-scrollbar bg-[radial-gradient(circle_at_center,rgba(51,144,236,0.03)_0%,transparent_100%)]">
                  {messages.map((m: any, idx: number) => {
                    const isMe = m.sender === user._id || m.sender === user.id;
                    return (
                      <div key={m._id || idx} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`relative max-w-[75%] p-4 shadow-xl ${isMe ? 'bg-[#3390ec] text-white rounded-[1.8rem] rounded-tr-none' : 'bg-white/10 border border-white/5 text-slate-200 rounded-[1.8rem] rounded-tl-none'}`}>
                          <p className="text-sm leading-relaxed">{m.text}</p>
                          <div className={`text-[8px] mt-2 opacity-40 font-black flex gap-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {isMe && <span>✓✓</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-8 bg-[#0a0c10]/80 backdrop-blur-xl border-t border-white/5">
                  <div className="flex gap-4 bg-white/5 p-2 rounded-full border border-white/10 focus-within:border-[#3390ec]/50 transition-all max-w-4xl mx-auto w-full">
                    <input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Type encrypted message..." className="flex-1 bg-transparent border-none outline-none px-6 py-3 text-sm text-white" />
                    <button onClick={handleSendMessage} className="w-12 h-12 bg-[#3390ec] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#3390ec]/20 hover:scale-105 transition-transform active:scale-95"><Icons.Send /></button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                <div className="p-16 rounded-full border-[1px] border-dashed border-slate-500 animate-[spin_30s_linear_infinite]"><Icons.Users /></div>
                <p className="text-[10px] font-black tracking-[1em] mt-8 uppercase italic">Signal Waiting...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}