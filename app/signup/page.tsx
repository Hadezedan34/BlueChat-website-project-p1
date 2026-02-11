'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [agreeToLocation, setAgreeToLocation] = useState(false); // الحالة الجديدة للموافقة
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeToLocation) return; // منع الإرسال إذا لم يتم التحديد

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await res.json();

      if (res.ok) {
        router.push('/success');
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
            <p className="text-gray-500 text-sm font-light">أنشئ حسابك وانضم إلى فضاء جديد</p>
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

            {/* الإضافة الجديدة: الموافقة على الموقع بنفس ستايلك */}
            <div 
              className="flex items-center gap-3 px-2 py-2 cursor-pointer select-none group"
              onClick={() => setAgreeToLocation(!agreeToLocation)}
            >
              <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all duration-300 ${agreeToLocation ? 'bg-[#5288c1] border-[#5288c1] shadow-[0_0_10px_rgba(82,136,193,0.3)]' : 'border-white/10 bg-white/5'}`}>
                {agreeToLocation && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
              <span className="text-[11px] text-gray-500 font-medium group-hover:text-gray-300 transition-colors">
                أوافق على مشاركة موقعي الجغرافي على الخريطة
              </span>
            </div>

            <button 
              type="submit" 
              disabled={loading || !agreeToLocation}
              className={`w-full font-bold py-4 rounded-2xl transition-all mt-4 flex items-center justify-center gap-2 ${
                agreeToLocation && !loading
                ? 'bg-[#5288c1] hover:bg-[#6499d3] text-white shadow-[0_0_20px_rgba(82,136,193,0.3)] active:scale-95' 
                : 'bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed'
              }`}
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