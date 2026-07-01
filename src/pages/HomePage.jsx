import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Star, Globe, BookOpen, Users, ChevronRight, Monitor, 
  FileSpreadsheet, Database, Play, Upload, Filter, Smile, 
  Trash2, Calendar, GraduationCap, Download
} from 'lucide-react';

const cn = (...cls) => cls.filter(Boolean).join(" ");

function SubjectPill({ subject }) {
  const meta = {
    "Tin A": { bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
    "Tin B": { bg: "bg-green-100 dark:bg-green-900/40", text: "text-green-700 dark:text-green-300", dot: "bg-green-500" },
    "Access": { bg: "bg-red-100 dark:bg-red-900/40", text: "text-red-700 dark:text-red-300", dot: "bg-red-500" },
    "Chung": { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-300", dot: "bg-slate-400" },
  };
  const m = meta[subject] || meta["Chung"];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold", m.bg, m.text)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", m.dot)} />
      {subject}
    </span>
  );
}

export default function HomePage() {
  const [updates, setUpdates] = useState([]);
  const [visitCount, setVisitCount] = useState(0);
  const [filter, setFilter] = useState('Tất cả'); 
  const [visibleCount, setVisibleCount] = useState(6);
  const navigate = useNavigate();
  
  const [newUpdate, setNewUpdate] = useState({ content: '', driveLink: '', category: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const hitVisit = async () => {
      try {
        const res = await axios.post('https://it-proficiency-backend.onrender.com/api/visits');
        setVisitCount(res.data.count);
      } catch (error) { console.error("Lỗi đếm truy cập:", error); }
    };
    hitVisit();
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const response = await axios.get('https://it-proficiency-backend.onrender.com/api/updates');
      setUpdates(response.data);
    } catch (error) { console.error("Lỗi lấy thông báo:", error); }
  };

  const handlePostUpdate = async (e) => {
    e.preventDefault();
    if (!newUpdate.content.trim() || !newUpdate.driveLink.trim() || !newUpdate.category) {
      alert("Vui lòng điền đủ thông tin và chọn môn học!");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post('https://it-proficiency-backend.onrender.com/api/updates', newUpdate);
      setNewUpdate({ content: '', driveLink: '', category: '' });
      fetchUpdates();
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2500);
    } catch (error) {
      console.error("Lỗi đăng bài:", error);
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const pass = prompt("Vui lòng nhập Mật Khẩu Admin để xóa bài này:");
    if (!pass) return;
    try {
      await axios.delete(`https://it-proficiency-backend.onrender.com/api/updates/${id}`, {
        headers: { 'x-admin-password': pass }
      });
      fetchUpdates();
      alert("✅ Xóa thành công!");
    } catch (error) {
      alert("❌ Lỗi: Bạn không có quyền quản lý!");
    }
  };

  const filteredUpdates = [...updates].reverse().filter(item => filter === 'Tất cả' ? true : item.category === filter);
  const displayedUpdates = filteredUpdates.slice(0, visibleCount);

  const courseCards = [
    { key: "/tin-a", label: "Tin A (Phần 1)", sub: "Word, PowerPoint & Excel", Icon: Monitor, gradient: "from-blue-500 to-blue-700" },
    { key: "/tin-b", label: "Tin B (Phần 2)", sub: "Excel nâng cao", Icon: FileSpreadsheet, gradient: "from-green-500 to-green-700" },
    { key: "/access", label: "Access", sub: "Quản trị CSDL", Icon: Database, gradient: "from-red-500 to-red-700" },
  ];

  return (
    <div className="pt-16 pb-0">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-green-950/30 dark:via-slate-900 dark:to-blue-950/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-300/10 dark:bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-300/10 dark:bg-blue-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            
            {/* Title */}
            <h1 className="font-black text-4xl sm:text-5xl md:text-6xl text-slate-900 dark:text-white leading-tight mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Chuẩn Đầu Ra <br/>
              <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-400 bg-clip-text text-transparent">
                Tin Học Nông Lâm
              </span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed mb-8">
              Chia sẻ kiến thức, tài liệu và video ôn tập thi chuẩn đầu ra Tin học miễn phí
            </p>

            {/* Course CTA buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              {courseCards.map(({ key, label, sub, Icon, gradient }) => (
                <button key={key} onClick={() => navigate(key)}
                  className={cn(
                    "group flex items-center gap-3 px-6 py-4 bg-gradient-to-br text-white rounded-2xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 active:scale-95",
                    gradient
                  )}>
                  <Icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-bold text-base">{label}</div>
                    <div className="text-xs opacity-80 font-normal">{sub}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>

            {/* External Links */}
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="https://aic.hcmuaf.edu.vn" target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-green-600 hover:border-green-300 transition-colors">
                🏫 Trung tâm Tin học Nông Lâm
              </a>
              <a href="https://aic.hcmuaf.edu.vn/aic-3279-2/vn/quyet-dinh.html" target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-green-600 hover:border-green-300 transition-colors">
                📜 Quyết định về chuẩn đầu ra
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Community Materials Section */}
      <section className="py-12 bg-white dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Cộng Đồng Chia Sẻ Tài Liệu
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Kho tài liệu từ các bạn sinh viên gửi đóng góp. 📚</p>
            </div>
          </div>

          {/* Share form */}
          <div className="mb-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
            <form onSubmit={handlePostUpdate} className="flex flex-col gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  className="sm:col-span-2 w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  placeholder="Tiêu đề (VD: Tổng hợp đề thi Tin B tháng 6)"
                  value={newUpdate.content}
                  onChange={e => setNewUpdate({...newUpdate, content: e.target.value})}
                  required
                />
                <input
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  placeholder="Link Google Drive..."
                  value={newUpdate.driveLink}
                  onChange={e => setNewUpdate({...newUpdate, driveLink: e.target.value})}
                  required
                />
                <select
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  value={newUpdate.category}
                  onChange={e => setNewUpdate({...newUpdate, category: e.target.value})}
                  required>
                  <option value="" disabled>-- Chọn học phần --</option>
                  <option value="Access">Access</option>
                  <option value="Tin A">Tin A (Phần 1)</option>
                  <option value="Tin B">Tin B (Phần 2)</option>
                  <option value="Chung">Chung</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={submitting}
                  className={cn(
                    "flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-150 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
                    submitted ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-amber-400 text-amber-900 hover:bg-amber-500",
                    submitting && "opacity-70 cursor-not-allowed transform-none"
                  )}>
                  {submitting ? "Đang gửi..." : submitted ? "✅ Đã đăng thành công!" : "Đăng Tài Liệu"}
                  {!submitting && !submitted && <Upload className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Filter className="w-4 h-4 text-slate-400 self-center mr-1" />
            {['Tất cả', 'Access', 'Tin A', 'Tin B', 'Chung'].map((cat) => (
              <button key={cat} onClick={() => { setFilter(cat); setVisibleCount(6); }}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 cursor-pointer",
                  filter === cat
                    ? "bg-amber-400 text-amber-900 shadow-md font-bold"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-amber-400"
                )}>
                {cat}
              </button>
            ))}
          </div>

          {/* Materials feed */}
          {displayedUpdates.length === 0 ? (
            <div className="text-center py-16">
              <Smile className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">Chưa có tài liệu nào trong mục này.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedUpdates.map(mat => (
                <div key={mat._id}
                  className="group bg-white dark:bg-slate-800 flex flex-col rounded-2xl border border-slate-100 dark:border-slate-700 p-5 hover:shadow-lg hover:-translate-y-0.5 hover:border-amber-200 transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <SubjectPill subject={mat.category} />
                    <button onClick={() => handleDelete(mat._id)}
                      className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white leading-snug mb-1">
                      {mat.content}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500"><Calendar className="w-3 h-3" /> {new Date(mat.date).toLocaleDateString('vi-VN')}</span>
                    <a href={mat.driveLink} target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-amber-100 hover:text-amber-800 transition-colors">
                      Tải về <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredUpdates.length > visibleCount && (
            <div className="mt-8 text-center">
              <button onClick={() => setVisibleCount(v => v + 6)}
                className="px-6 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-amber-400 hover:text-amber-600 transition-all duration-150 shadow-sm cursor-pointer">
                Tải thêm {Math.min(6, filteredUpdates.length - visibleCount)} tài liệu
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
