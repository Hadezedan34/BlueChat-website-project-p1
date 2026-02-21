import { useState, useEffect } from 'react';

export function useIsMobile() {
  // بنحدد إن الموبايل هو أي شاشة عرضها أصغر من 768px
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check on client-side only
    setIsMobile(window.innerWidth <= 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // بنراقب تغيير حجم الشاشة (Resize) بشكل حي
    window.addEventListener('resize', handleResize);
    
    // تنظيف الـ Event Listener عند إغلاق الكومبوننت
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}
