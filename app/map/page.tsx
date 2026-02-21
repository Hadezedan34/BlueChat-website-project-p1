"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const ZoomControl = dynamic(() => import('react-leaflet').then(mod => mod.ZoomControl), { ssr: false });

export default function GlobalExplorersMap() {
  const [user, setUser] = useState<any>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [explorers, setExplorers] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [L, setL] = useState<any>(null);
  const [showExplorersPanel, setShowExplorersPanel] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    import('leaflet').then(leaflet => setL(leaflet));
  }, []);

  useEffect(() => {
    if (!user) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        try {
          await fetch('/api/users/update-location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id || user.id, lat: latitude, lng: longitude })
          });
        } catch (err) { console.error(err); }
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );

    const fetchExplorers = async () => {
      try {
        const res = await fetch('/api/users/locations');
        const data = await res.json();
        if (Array.isArray(data)) setExplorers(data);
      } catch (err) { console.error(err); }
    };
    fetchExplorers();
  }, [user]);

  const handleAddFriend = async (friendId: string) => {
    try {
      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: user._id || user.id, receiverId: friendId }),
      });
      if (res.ok) {
        setSentRequests(prev => [...prev, friendId]);
      }
    } catch (err) { console.error(err); }
  };

  if (!position || !L) return (
    <div className="min-h-screen bg-[#020406] flex items-center justify-center">
       <div className="text-[#3390ec] font-black italic animate-pulse tracking-[0.4em] uppercase text-xs">Calibrating Satellite...</div>
    </div>
  );

  return (
    <div className="h-screen w-full bg-[#020406] relative overflow-hidden font-sans">
      
      {/* 1. Left Sidebar - Explorers List (Above Zoom) */}
      <div className="absolute top-24 left-6 z-[1000] w-64 max-h-[60vh] flex flex-col gap-4 pointer-events-none">
        <div className="bg-[#0a0c10]/80 backdrop-blur-2xl border border-white/10 p-5 rounded-[2.5rem] shadow-2xl pointer-events-auto overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-[#3390ec] font-black italic text-[10px] tracking-[0.3em] uppercase">Explorers Nearby</h2>
            <button 
              onClick={() => setShowExplorersPanel(!showExplorersPanel)} 
              className="text-slate-500 hover:text-[#3390ec] transition-colors"
            >
              {showExplorersPanel ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              )}
            </button>
          </div>
          {showExplorersPanel && (
            <div className="overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {explorers.map((exp) => (
                <div key={exp._id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-2xl transition-all group">
                  <div className="w-8 h-8 rounded-xl border border-[#3390ec]/30 overflow-hidden">
                    <img src={exp.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${exp.username}`} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-300 group-hover:text-white transition-colors">{exp.username}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Header UI */}
      <div className="absolute top-8 left-8 right-8 z-[1000] flex justify-between items-center pointer-events-none">
        <div className="bg-[#0a0c10]/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/5 pointer-events-auto">
             <span className="text-[#3390ec] font-black italic text-[10px] tracking-widest uppercase">BlueChat Map Protocol</span>
        </div>
        <button onClick={() => window.history.back()} className="bg-[#3390ec] text-white p-4 rounded-2xl shadow-lg shadow-[#3390ec]/20 pointer-events-auto active:scale-90 transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
      </div>

      {/* Map Content */}
      <div className="h-full w-full">
        <MapContainer center={position} zoom={4} zoomControl={false} style={{ height: "100%", width: "100%", background: "#020406" }}>
          <ZoomControl position="bottomleft" />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; BlueChat'
          />

          {explorers.map((explorer) => {
            const isMe = explorer._id === (user?._id || user?.id);
            const isFriend = user?.friends?.some((f: any) => (f._id || f.id) === explorer._id);
            const requestSent = sentRequests.includes(explorer._id);

            return (
              <Marker 
                key={explorer._id} 
                position={[explorer.location.lat, explorer.location.lng]}
                icon={new L.DivIcon({
                  className: 'custom-marker',
                  html: `
                    <div class="relative">
                      <div class="absolute inset-0 bg-[#3390ec] rounded-2xl blur-md opacity-30"></div>
                      <div class="relative w-10 h-10 rounded-2xl border-2 ${isMe ? 'border-white' : 'border-[#3390ec]'} overflow-hidden bg-[#0a0c10] shadow-2xl">
                        <img src="${explorer.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + explorer.username}" class="w-full h-full object-cover" />
                      </div>
                    </div>
                  `,
                  iconSize: [40, 40],
                  iconAnchor: [20, 40]
                })}
              >
                <Popup className="custom-popup">
                  <div className="bg-[#0a0c10] text-white p-4 rounded-[1.5rem] border border-white/10 min-w-[150px] text-center">
                    <p className="font-black italic text-[11px] uppercase tracking-widest text-[#3390ec] mb-3">
                      {isMe ? "Station Master" : explorer.username}
                    </p>
                    
                    {!isMe && !isFriend && (
                      <button 
                        onClick={() => handleAddFriend(explorer._id)}
                        disabled={requestSent}
                        className={`w-full py-2.5 rounded-xl font-black text-[9px] uppercase tracking-tighter transition-all ${
                          requestSent 
                          ? 'bg-white/5 text-green-500 border border-green-500/30' 
                          : 'bg-[#3390ec] text-white hover:brightness-125'
                        }`}
                      >
                        {requestSent ? '✓ Signal Sent' : 'Transmit Friend Request'}
                      </button>
                    )}

                    {isFriend && (
                       <div className="py-2 px-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                          <span className="text-green-500 font-black text-[8px] uppercase tracking-widest">Linked Explorer</span>
                       </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
