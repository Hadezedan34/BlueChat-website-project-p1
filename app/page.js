import Link from 'next/link';
export default function Home() {
  return (
   
    <div className="min-h-screen bg-[#0a0f14] flex flex-col items-center justify-between text-white px-4 py-8 relative overflow-hidden font-sans">
      
      <div className="absolute top-[-10%] left-[-10%] w-[60%] md:w-[40%] h-[40%] bg-[#5288c1]/10 blur-[100px] md:blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] md:w-[40%] h-[40%] bg-[#5288c1]/10 blur-[100px] md:blur-[120px] rounded-full"></div>

      <div className="z-10 text-center space-y-6 md:space-y-8 max-w-2xl flex-grow flex flex-col justify-center w-full">
        <div className="inline-block px-4 py-1.5 border border-[#5288c1]/30 rounded-full bg-[#5288c1]/5 backdrop-blur-sm mx-auto">
          <span className="text-[#5288c1] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">v1.0 Blue Edition</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white">
          Blue<span className="text-[#5288c1]">Chat</span>
        </h1>
        
        <p className="text-gray-400 text-base md:text-xl leading-relaxed font-light px-2">
        ابنِ روابطك الحقيقية، وكن جزءاً من نبض الخريطة العالمي 
          <span className="block mt-2 italic text-gray-500 font-serif text-sm md:text-lg">
            Your Map, Your People, Your Private Space for Real-Time Connection
          </span>
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-5 pt-4 md:pt-8 w-full max-w-sm mx-auto md:max-w-none">
          <button  className="w-full md:w-auto px-10 py-4 bg-[#5288c1] text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(82,136,193,0.3)] active:scale-95 text-lg">
            <Link href="/login">
              ابدأ الآن
            </Link>
          </button>
          
          <button className="w-full md:w-auto px-10 py-4 border border-gray-800 text-gray-400 font-medium rounded-2xl transition-all duration-300 bg-white/5 backdrop-blur-md hover:text-white">
           <Link href="/About-us">
            المميزات
             </Link>
          </button>
        </div>
      </div>

      <footer className="w-full max-w-6xl py-6 md:py-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 z-10">
        <div className="text-gray-500 text-xs md:text-sm font-medium tracking-tight order-3 md:order-1">
          © 2026 BlueChat. جميع الحقوق محفوظة.
        </div>
        
        <div className="flex items-center gap-2 group cursor-default order-1 md:order-2">
          <span className="text-gray-600 text-[10px] md:text-xs tracking-widest uppercase">Developed with ❤️ by</span>
          <span className="text-[#5288c1] font-bold tracking-widest uppercase transition-colors duration-500 underline decoration-[#5288c1]/30 decoration-2 underline-offset-8">
            Hadi
          </span>
        </div>

        <div className="flex gap-6 text-gray-500 text-[10px] md:text-xs font-bold tracking-widest uppercase order-2 md:order-3">
          <span className="hover:text-[#5288c1] cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-[#5288c1] cursor-pointer transition-colors">Terms</span>
        </div>
      </footer>
    </div>
  );
}