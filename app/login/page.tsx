"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // 🔥 التعديل الجوهري هنا يا هادي:
        // عم نخزن بيانات اليوزر (الاسم، الايميل، الـ ID) بالمتصفح
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // هلق لما يروح للـ Dashboard، الكود هنيك رح يلاقي البيانات ويفتح
        router.push('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("تأكد من اتصال الإنترنت أو حالة السيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f14] flex items-center justify-center p-4 relative overflow-hidden font-sans text-right" dir="rtl">
      
      {/* المؤثرات الضوئية */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#5288c1]/10 blur-[130px] rounded-full"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#5288c1]/10 blur-[130px] rounded-full"></div>

      <div className="w-full max-w-md z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
          
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-20 h-20 mb-4">
              <div className="absolute inset-0 bg-[#5288c1] rounded-3xl rotate-12 opacity-20"></div>
              <div className="absolute inset-0 bg-[#5288c1] rounded-2xl flex items-center justify-center shadow-lg shadow-[#5288c1]/40">
                <svg viewBox="0 0 24 24" className="w-12 h-12 text-white fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.534 3.655 1.456 5.155L2 22l4.845-1.456C8.345 21.466 10.109 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.61 0-3.11-.44-4.4-1.21L4.5 19.5l.71-3.1c-.77-1.29-1.21-2.79-1.21-4.4 0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
                  <path d="M10 8h4a2 2 0 0 1 0 4h-4V8zm0 6h4a2 2 0 0 1 0 4h-4v-4z" opacity=".3"/>
                  <text x="7" y="16" fontSize="10" fontWeight="bold" fill="white" style={{fontFamily: 'Arial'}}>B</text>
                </svg>
              </div>
            </div>
            
            <h2 className="text-3xl font-black tracking-tighter text-white mb-2">أهلاً بك مجدداً</h2>
            <p className="text-gray-500 text-sm">سجل دخولك للمتابعة في <span className="text-[#5288c1] font-bold">BlueChat</span></p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl mb-6 text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">البريد الإلكتروني</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-[#5288c1]/50 transition-all text-left"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">كلمة المرور</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-[#5288c1]/50 transition-all text-left"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#5288c1] hover:bg-[#6499d3] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#5288c1]/20 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "جارٍ التحقق..." : "تسجيل الدخول"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              ليس لديك حساب؟ 
              <Link href="/signup" className="text-[#5288c1] font-bold hover:underline mr-1">انضم إلينا</Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center border-t border-white/5 pt-8">
          <Link href="/" className="text-gray-600 text-xs uppercase tracking-[0.2em] hover:text-gray-400 transition-colors">
            ← العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}