import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users } from 'lucide-react';

export default function Footer() {
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    const fetchVisit = async () => {
      try {
        const res = await axios.get('https://it-proficiency-backend.onrender.com/api/visits');
        // Because hitVisit is done in HomePage, here we just GET the current count
        setVisitCount(res.data.count);
      } catch (error) { 
        console.error("Lỗi lấy lượt truy cập:", error); 
      }
    };
    fetchVisit();
  }, []);

  return (
    <footer className="py-10 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center gap-3 text-center text-[15px]">
        
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
          <Users className="w-5 h-5 text-indigo-500" />
          <span>Website đã phục vụ <strong>{visitCount}</strong> lượt truy cập học tập</span>
        </div>
        
        <div className="text-slate-600 dark:text-slate-400">
          Được phát triển bởi <a href="https://www.facebook.com/HuynhHuuVinh2101" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-500 hover:text-amber-400 transition-colors">Huỳnh Hữu Vinh</a>
        </div>

        <div className="text-slate-500 dark:text-slate-500 italic">
          Dự án phi lợi nhuận hỗ trợ Sinh viên Nông Lâm
        </div>

      </div>
    </footer>
  );
}
