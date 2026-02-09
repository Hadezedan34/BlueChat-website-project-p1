"use client";

import Link from 'next/link';

export default function UltraMinimalFeatures() {
  const features = [
    { id: "01", title: "END-TO-END ENCRYPTION", desc: "أمان مطلق لرسائلك بأحدث بروتوكولات التشفير العالمية." },
    { id: "02", title: "HIGH-SPEED SYNC", desc: "تزامن لحظي بين جميع أجهزتك بفضل محرك BlueChat المتطور." },
    { id: "03", title: "MINIMAL INTERFACE", desc: "تجربة مستخدم خالية من المشتتات، تركز فقط على ما يهم: المحادثة." },
    { id: "04", title: "CLOUD INFRASTRUCTURE", desc: "تخزين سحابي ذكي يضمن وصولك لبياناتك في أي وقت ومن أي مكان." }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#fafafa] font-sans antialiased py-24 px-8 selection:bg-[#5288c1] selection:text-white" dir="rtl">
      
      <div className="max-w-6xl mx-auto">
        {/* Header بسيط وفخم */}
        <header className="mb-32 border-r-2 border-[#5288c1] pr-8">
          <h1 className="text-5xl font-extralight tracking-tighter mb-4">
            مميزات <span className="font-bold text-[#5288c1]">BLUECHAT</span>
          </h1>
          <p className="text-gray-500 font-mono text-xs tracking-[0.5em] uppercase">
            Engineering Excellence // v1.0.3
          </p>
        </header>

        {/* Grid يعتمد على الخطوط النحيفة */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-24">
          {features.map((f, i) => (
            <div key={i} className="group flex flex-col space-y-4">
              <div className="flex items-center space-x-4 space-x-reverse">
                <span className="text-[#5288c1] font-mono text-lg font-bold">/ {f.id}</span>
                <div className="h-[1px] w-full bg-white/10 group-hover:bg-[#5288c1]/50 transition-colors duration-500"></div>
              </div>
              
              <h3 className="text-xl font-bold tracking-widest uppercase group-hover:text-[#5288c1] transition-colors duration-300">
                {f.title}
              </h3>
              
              <p className="text-gray-400 text-lg leading-relaxed font-light max-w-md">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Navigation */}
        <footer className="mt-40 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-8 items-center text-[10px] font-mono tracking-[0.3em] text-gray-600 uppercase">
            <span>Built by Hadi</span>
            <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
            <span>2026 Edition</span>
          </div>
          
          <Link href="/" className="text-sm font-bold tracking-widest text-[#5288c1] hover:text-white transition-all border-b border-[#5288c1]/20 hover:border-white pb-1">
            RETURN TO BASE —
          </Link>
        </footer>
      </div>

      {/* لمسة جمالية خفيفة بالخلفية (Shadow Glow) */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#5288c1]/5 blur-[150px] rounded-full pointer-events-none z-0"></div>
    </div>
  );
}