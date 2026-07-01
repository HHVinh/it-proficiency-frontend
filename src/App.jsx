import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  // Trạng thái Dark Mode (Lưu vào localStorage để nhớ thiết lập của người dùng)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleDark = () => setIsDark(!isDark);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Thanh Menu điều hướng hiện ở mọi trang */}
      <Navbar isDark={isDark} onToggleDark={toggleDark} />

      {/* Khối quản lý các Trang của Website */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tin-a" element={<CoursePage courseType="A" />} />
          <Route path="/tin-b" element={<CoursePage courseType="B" />} />
          <Route path="/access" element={<CoursePage courseType="ACCESS" />} />
        </Routes>
      </div>

      {/* Footer hiện ở mọi trang */}
      <Footer />
    </div>
  )
}

export default App;
