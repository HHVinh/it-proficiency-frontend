import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Bell, Sun, Moon, Menu, X, ChevronDown, ExternalLink, Globe, GraduationCap, Monitor, FileSpreadsheet, Database, Trash2
} from "lucide-react";

const cn = (...cls) => cls.filter(Boolean).join(" ");

export default function Navbar({ isDark, onToggleDark }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  
  // Logic Thông Báo (Tích hợp từ NotificationBell cũ)
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const bellRef = useRef(null);
  const coursesRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = location.pathname === "/" ? "home" : "course";
  
  // Tự động load thông báo
  const fetchNotifications = async () => {
    try {
      const res = await axios.get('https://it-proficiency-backend.onrender.com/api/notifications');
      setNotifications(res.data);
      if (res.data.length > 0) {
        const lastSeenId = localStorage.getItem('lastSeenNotifId');
        if (!lastSeenId) {
          setUnreadCount(res.data.length);
        } else {
          const newIndex = res.data.findIndex(n => n._id === lastSeenId);
          if (newIndex === -1) setUnreadCount(res.data.length);
          else setUnreadCount(newIndex);
        }
      }
    } catch (error) {
      console.error("Lỗi tải thông báo:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
      if (coursesRef.current && !coursesRef.current.contains(e.target)) setCoursesOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggleBell = () => {
    setBellOpen(!bellOpen);
    if (!bellOpen) {
      setUnreadCount(0);
      if (notifications.length > 0) localStorage.setItem('lastSeenNotifId', notifications[0]._id);
    }
  };

  const handleNotifClick = (link) => {
    setBellOpen(false);
    navigate(link); // Nhảy đến đúng trang có Video
  };

  const handleNotifDelete = async (e, id) => {
    e.stopPropagation();
    const pass = prompt("Vui lòng nhập Mật Khẩu Admin để xóa thông báo này:");
    if (!pass) return;
    try {
      await axios.delete(`https://it-proficiency-backend.onrender.com/api/notifications/${id}`, {
        headers: { 'x-admin-password': pass }
      });
      fetchNotifications();
    } catch (error) {
      alert("❌ Lỗi: Bạn không có quyền xóa!");
    }
  };

  const courseOptions = [
    { key: "/tin-a", label: "Tin A (Phần 1)", sub: "Word, PowerPoint & Excel", Icon: Monitor, color: "text-blue-500" },
    { key: "/tin-b", label: "Tin B (Phần 2)", sub: "Excel nâng cao", Icon: FileSpreadsheet, color: "text-green-500" },
    { key: "/access", label: "Access", sub: "Quản trị CSDL", Icon: Database, color: "text-red-500" },
  ];

  const navLink = (label, path, active) => (
    <Link to={path}
      className={cn(
        "px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150",
        active
          ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30"
          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
      )}>
      {label}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-150">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-slate-900 dark:text-white text-sm sm:text-[15px] leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Nong Lam IT Learning
            </h1>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400">Dự án Hỗ trợ Sinh viên</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLink("Trang Chủ", "/", currentPage === "home")}

          <div className="relative" ref={coursesRef}>
            <button
              onClick={() => setCoursesOpen(!coursesOpen)}
              className={cn(
                "flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150",
                currentPage === "course"
                  ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
              )}>
              Khóa Học
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", coursesOpen && "rotate-180")} />
            </button>
            {coursesOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                {courseOptions.map(({ key, label, sub, Icon, color }) => (
                  <Link key={key} to={key}
                    onClick={() => setCoursesOpen(false)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left",
                      location.pathname === key ? "bg-indigo-50 dark:bg-indigo-900/20" : ""
                    )}>
                    <Icon className={cn("w-4 h-4 shrink-0", color)} />
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">{label}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">{sub}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          {/* Feedback Form Button */}
          <a href="https://forms.gle/Pg4J5cGKrmRcbY1KA" target="_blank" rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-amber-900 text-xs font-bold rounded-full transition-all duration-150 hover:scale-105 shadow hover:shadow-md whitespace-nowrap">
            ✉ Góp ý phát triển
          </a>

          {/* Bell Notification */}
          <div className="relative" ref={bellRef}>
            <button onClick={handleToggleBell} aria-label="Notifications"
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150">
              <Bell className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            {bellOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Thông báo</span>
                  {unreadCount > 0 && <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">{unreadCount} mới</span>}
                </div>
                <div className="overflow-y-auto max-h-72 divide-y divide-slate-50 dark:divide-slate-700/50">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500">Chưa có thông báo nào</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n._id}
                        onClick={() => handleNotifClick(n.link)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group flex justify-between">
                        <div className="flex items-start gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                          <div>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{n.message}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{new Date(n.createdAt).toLocaleString('vi-VN')}</p>
                          </div>
                        </div>
                        <button onClick={(e) => handleNotifDelete(e, n._id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Dark toggle */}
          <button onClick={onToggleDark} aria-label="Toggle dark mode"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150">
            {isDark
              ? <Sun className="w-4 h-4 text-amber-400" />
              : <Moon className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {menuOpen ? <X className="w-4 h-4 text-slate-600" /> : <Menu className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
