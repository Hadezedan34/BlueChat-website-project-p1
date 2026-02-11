"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    
    // تعريف حالة الشبح - تبدأ بـ false لتجنب خطأ الـ null
    const [ghostMode, setGhostMode] = useState(false);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            // تحديث حالة الشبح من بيانات المستخدم المخزنة
            setGhostMode(parsedUser.isGhostMode || false);
        }
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setPreview(URL.createObjectURL(file));
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'bluechat_preset');

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/dokpk76nt/image/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            
            const updateRes = await fetch(`/api/users/${user._id || user.id}/image`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: data.secure_url })
            });

            if (updateRes.ok) {
                showToast("Photo Updated Successfully", "success");
                const updatedUser = { ...user, image: data.secure_url };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
            }
        } catch (err) {
            showToast("ERROR: CONNECTION FAILED", "error");
        } finally {
            setUploading(false);
        }
    };

    // دالة تبديل وضع التخفي
   const toggleGhostMode = async () => {
    // 1. محاولة جلب المستخدم من الـ State أو من الـ Storage مباشرة
    let currentUser = user;
    if (!currentUser) {
        const saved = localStorage.getItem('user');
        if (saved) currentUser = JSON.parse(saved);
    }

    // 2. إذا لسا ما في مستخدم، منوقف العملية
    if (!currentUser) {
        showToast("USER SESSION EXPIRED", "error");
        return;
    }

    const userId = currentUser._id || currentUser.id;
    const newStatus = !ghostMode;

    // تحديث الواجهة فوراً (Optimistic Update)
    setGhostMode(newStatus);

    try {
        // نستخدم المسار الجديد والبسيط اللي اتفقنا عليه
        const res = await fetch(`/api/users/${userId}/settings`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                userId: userId, 
                isGhostMode: newStatus 
            })
        });

        if (res.ok) {
            // تحديث اللوكال ستورج عشان يضل حافظ الوضع
            const updatedUser = { ...currentUser, isGhostMode: newStatus };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            showToast(newStatus ? "GHOST MODE ACTIVATED" : "RADAR BROADCASTING", "success");
        } else {
            throw new Error("Failed to update");
        }
    } catch (err) {
        setGhostMode(!newStatus); // تراجع عن التغيير في حال الخطأ
        showToast("SYNC ERROR", "error");
    }
};

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#020406] text-white p-10 flex flex-col items-center">
            <div className="w-full max-w-2xl bg-[#0a0c10] border border-white/5 rounded-[2.5rem] p-12 shadow-2xl">
                <h1 className="text-3xl font-black italic tracking-widest mb-10 text-[#3390ec]">STATION COMMAND: USER INFO</h1>
                
                <div className="flex flex-col items-center gap-8">
                    {/* مكان الصورة الشخصية */}
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-[2.5rem] bg-slate-800 border-2 border-[#3390ec]/30 overflow-hidden shadow-[0_0_30px_rgba(51,144,236,0.2)]">
                            <img 
                                src={preview || user.image || `https://ui-avatars.com/api/?name=${user.username}&background=3390ec&color=fff&bold=true`} 
                                className="w-full h-full object-cover transition-all duration-500" 
                                alt="Profile" 
                            />
                        </div>
                        <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-[2.5rem]">
                            <span className="text-[10px] font-black tracking-widest">CHANGE PHOTO</span>
                            <input type="file" className="hidden" onChange={handleFileChange} />
                        </label>
                        {uploading && <div className="absolute -bottom-2 bg-[#3390ec] text-[8px] px-3 py-1 rounded-full animate-bounce">UPLOADING...</div>}
                    </div>

                    {/* بيانات المستخدم */}
                    <div className="w-full space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Username</label>
                            <div className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-slate-300 font-bold mt-2 italic">@{user.username}</div>
                        </div>
                        
                        {/* ميزة Ghost Mode */}
                       {/* ميزة Ghost Mode مع تعديل منطقة الكبسة */}
<div className="bg-white/5 border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:border-[#3390ec]/20 transition-all relative">
    <div className="flex-1">
        <label className="text-[10px] font-black text-[#3390ec] uppercase tracking-[0.3em]">Privacy Protocol</label>
        <h3 className="text-sm font-bold text-slate-200 mt-1 uppercase italic">Ghost Mode (Stealth)</h3>
        <p className="text-[8px] text-slate-500 uppercase tracking-tighter mt-1">Disconnect from global radar map</p>
    </div>
    
    {/* تأكدنا إن الزر فوق كل شيء ومساحة الكبسة واضحة */}
    <div className="relative z-[9999]">
        <button 
            type="button" // إضافة النوع لمنع أي Submit غير مقصود
            onClick={(e) => {
                e.stopPropagation(); // منع انتقال الكبسة للعناصر الخلفية
                toggleGhostMode();
            }}
            className={`w-14 h-7 rounded-full transition-all duration-500 relative cursor-pointer active:scale-90 ${ghostMode ? 'bg-[#3390ec] shadow-[0_0_15px_rgba(51,144,236,0.4)]' : 'bg-slate-800'}`}
        >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 pointer-events-none ${ghostMode ? 'left-8' : 'left-1'}`} />
        </button>
    </div>
</div>
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Email</label>
                            <div className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-[#3390ec] font-bold mt-2">{user.email}</div>
                        </div>
                    </div>

                    <button 
                        onClick={() => window.history.back()}
                        className="mt-8 text-[10px] font-black text-slate-500 hover:text-white transition-colors tracking-[0.5em] uppercase"
                    >
                        ← Back to Radar
                    </button>
                </div>
            </div>

            {/* Toast Notification Area */}
            {toast && (
                <div className={`fixed bottom-10 right-10 px-8 py-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-500 transform translate-y-0 animate-in fade-in slide-in-from-bottom-5 z-50 ${
                    toast.type === 'success' 
                    ? 'bg-[#3390ec]/10 border-[#3390ec]/30 text-[#3390ec]' 
                    : 'bg-red-500/10 border-red-500/30 text-red-500'
                }`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${toast.type === 'success' ? 'bg-[#3390ec]' : 'bg-red-500'}`} />
                        <span className="text-[10px] font-black tracking-[0.2em] uppercase">
                            {toast.message}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}