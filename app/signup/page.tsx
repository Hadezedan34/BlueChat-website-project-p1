'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // 1. استيراد الموجه

export default function SignUpPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // 2. تعريف الموجه

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await res.json();

      if (res.ok) {
        // 3. النجاح: التوجه لصفحة success
        router.push('/success');

        // 4. الانتظار 3 ثوانٍ ثم التوجه لـ login
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        alert(data.message || "حدث خطأ أثناء التسجيل");
      }
    } catch (err) {
      alert("حدث خطأ ما، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f14] flex items-center justify-center p-4 relative overflow-hidden font-sans text-white">
      
      {/* تأثيرات الإضاءة الخلفية الفخمة */}
      <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-[#5288c1]/10 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-[#5288c1]/10 blur-[120px] rounded-full animate-pulse"></div>

      <div className="w-full max-w-md z-10 transition-all duration-500">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          <div className="text-center mb-8">
            <div className="inline-block px-3 py-1 mb-4 border border-[#5288c1]/30 rounded-full bg-[#5288c1]/5 backdrop-blur-sm">
              <span className="text-[#5288c1] text-[10px] font-bold tracking-[0.2em] uppercase">Join the blue</span>
            </div>
            <h2 className="text-4xl font-black tracking-tighter mb-2 italic">
              Blue<span className="text-[#5288c1]">Chat</span>
            </h2>
            <p className="text-gray-500 text-sm font-light">أنشئ حسابك وانضم إلى فضاء الخصوصية</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="group">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1 group-focus-within:text-[#5288c1] transition-colors">الاسم الكامل</label>
              <input 
                type="text" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#5288c1]/50 focus:bg-white/[0.08] transition-all placeholder:text-gray-700 mt-1"
                placeholder="Hadi..."
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>

            <div className="group">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1 group-focus-within:text-[#5288c1] transition-colors">البريد الإلكتروني</label>
              <input 
                type="email" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#5288c1]/50 focus:bg-white/[0.08] transition-all placeholder:text-gray-700 mt-1"
                placeholder="name@example.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="group">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1 group-focus-within:text-[#5288c1] transition-colors">كلمة المرور</label>
              <input 
                type="password" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#5288c1]/50 focus:bg-white/[0.08] transition-all placeholder:text-gray-700 mt-1"
                placeholder="••••••••"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-[#5288c1] hover:bg-[#6499d3] text-white font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(82,136,193,0.3)] active:scale-95 mt-6 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  جاري المعالجة...
                </>
              ) : 'إنشاء حسابك الآن'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-gray-500 text-sm">
              لديك حساب بالفعل؟ 
              <Link href="/login" className="text-[#5288c1] font-bold hover:underline ml-1">سجل دخولك</Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-gray-600 text-xs uppercase tracking-[0.2em] hover:text-[#5288c1] transition-colors">
            ← العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}