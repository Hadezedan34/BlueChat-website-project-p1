"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

// أيقونة مخصصة للموقع بتصميم أزرق
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: "hue-rotate-[180deg]" // بنحول اللون للأزرق ليتناسب مع BlueChat
});

export default function UserMap() {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    // الحصول على الموقع الحالي للمستخدم
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => console.error("Error getting location", err),
      { enableHighAccuracy: true }
    );
  }, []);

  if (!position) return (
    <div className="min-h-screen bg-[#020406] flex items-center justify-center text-[#3390ec] font-black animate-pulse tracking-[0.5em]">
      SCANNING COORDINATES...
    </div>
  );

  return (
    <div className="h-screen w-full bg-[#020406] p-8">
      <div className="w-full h-full rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(51,144,236,0.2)] relative">
        
        {/* Overlay للمعلومات */}
        <div className="absolute top-6 left-6 z-[1000] bg-[#0a0c10]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
          <h2 className="text-[#3390ec] font-black italic tracking-widest text-xs uppercase">Location Satellite</h2>
          <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">Lat: {position[0].toFixed(4)} / Long: {position[1].toFixed(4)}</p>
        </div>

        <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%" }}>
          {/* ثيم الخريطة المظلم (Dark Mode) من CartoDB */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} icon={customIcon}>
            <Popup className="custom-popup">
              <span className="font-bold uppercase text-[10px]">Your Current Station</span>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}