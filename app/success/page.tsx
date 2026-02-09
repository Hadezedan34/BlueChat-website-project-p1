'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // أنيميشن لشريط التقدم (بيمتلي خلال 3 ثواني)
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f14] flex items-center justify-center p-4 relative overflow-hidden font-sans text-white">
      
      {/* تأثيرات الإضاءة الخلفية (نفس نمط الساين أب) */}
      <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-[#52c17a]/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-[#5288c1]/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md z-10 text-center">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          {/* أنيميشن علامة الصح */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#52c17a]/20 rounded-full flex items-center justify-center border border-[#52c17a]/30 animate-bounce">
              <svg className="w-10 h-10 text-[#52c17a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-black tracking-tighter mb-4 italic">
            تم بنجاح!
          </h2>
          <p className="text-gray-400 font-light mb-8">
            أهلاً بك في عائلة <span className="text-[#5288c1] font-bold">BlueChat</span>. يتم الآن تجهيز مساحتك الخاصة...
          </p>

          {/* شريط التقدم الفخم */}
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-4">
            <div 
              className="bg-gradient-to-r from-[#5288c1] to-[#52c17a] h-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">
            جاري التحويل تلقائياً
          </p>
        </div>
      </div>
    </div>
  );
}