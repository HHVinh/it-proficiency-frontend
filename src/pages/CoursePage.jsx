import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, BookOpen, Star, Play, ChevronRight, ChevronDown, MessageSquare, Send, Search, Trash2
} from 'lucide-react';

const cn = (...cls) => cls.filter(Boolean).join(" ");

function CoursePage({ courseType }) {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);
  const [openSections, setOpenSections] = useState({});

  // State cho Bình luận
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  const location = useLocation();

  // 1. Lấy danh sách Video khi vào trang
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`https://it-proficiency-backend.onrender.com/api/videos?courseType=${courseType}`);
        setVideos(response.data);
        if (response.data.length > 0) {
          const queryParams = new URLSearchParams(location.search);
          const videoIdFromUrl = queryParams.get('videoId');
          if (videoIdFromUrl) {
            const targetVideo = response.data.find(v => v._id === videoIdFromUrl);
            setActiveVideo(targetVideo || response.data[0]);
          } else {
            setActiveVideo(response.data[0]);
          }
        } else {
          setActiveVideo(null);
        }
      } catch (error) {
        console.error("Lỗi lấy video:", error);
      }
    };
    fetchVideos();
  }, [courseType, location.search]);

  // 2. Lấy danh sách Bình luận MỖI KHI ĐỔI BÀI HỌC
  useEffect(() => {
    if (!activeVideo) return;
    
    // Tự động mở section chứa video đang xem
    if (activeVideo.section) {
      setOpenSections(prev => ({ ...prev, [activeVideo.section]: true }));
    }

    const fetchComments = async () => {
      try {
        const res = await axios.get(`https://it-proficiency-backend.onrender.com/api/comments/${activeVideo._id}`);
        setComments(res.data);
      } catch (error) {
        console.error("Lỗi lấy bình luận:", error);
      }
    };
    fetchComments();
  }, [activeVideo]);

  // Toggle Accordion Section
  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // 3. Gửi Bình luận mới
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.content.trim()) return;
    setSubmitting(true);
    try {
      await axios.post('https://it-proficiency-backend.onrender.com/api/comments', {
        videoId: activeVideo._id,
        name: newComment.name,
        content: newComment.content
      });
      setNewComment({ name: '', content: '' });
      const res = await axios.get(`https://it-proficiency-backend.onrender.com/api/comments/${activeVideo._id}`);
      setComments(res.data);
    } catch (error) {
      console.error("Lỗi đăng bình luận:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Xóa Bình luận (Admin)
  const handleDeleteComment = async (commentId) => {
    const pass = prompt("Vui lòng nhập Mật Khẩu để xóa bình luận này:");
    if (!pass) return;
    try {
      await axios.delete(`https://it-proficiency-backend.onrender.com/api/comments/${commentId}`, {
        headers: { 'x-admin-password': pass }
      });
      const res = await axios.get(`https://it-proficiency-backend.onrender.com/api/comments/${activeVideo._id}`);
      setComments(res.data);
      alert("✅ Đã xóa bình luận thành công!");
    } catch (error) {
      alert(error.response?.data?.message || "❌ Lỗi: Bạn không có quyền xóa!");
    }
  };

  const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const filteredVideos = videos.filter((vid) => {
    const tenVideoKhongDau = removeAccents(vid.title.toLowerCase());
    const chuTimKiemKhongDau = removeAccents(searchTerm.toLowerCase());
    return tenVideoKhongDau.includes(chuTimKiemKhongDau);
  });

  const groupedVideos = filteredVideos.reduce((acc, video) => {
    const section = video.section || "Chưa phân loại";
    if (!acc[section]) acc[section] = [];
    acc[section].push(video);
    return acc;
  }, {});

  // Tùy chỉnh thông tin theo khóa học
  const getCourseMeta = () => {
    switch(courseType) {
      case "A": return { 
        title: "TIN A (Phần 1)", sub: "Word, PowerPoint & Excel", 
        color: "blue", docLink: "https://drive.google.com/file/d/1Lr1i028NQ9SQYEluo61I4AAijGC_DvQl/view", quizLink: "https://docs.google.com/document/d/1m5H_RnO3Yh06Nu3liRsAyF_QW5EkiQj1oHHRj6SzhmE/edit"
      };
      case "B": return { 
        title: "TIN B (Phần 2)", sub: "Excel nâng cao", 
        color: "green", docLink: "https://drive.google.com/file/d/1ATK7dDKnj-9GDd-wwdT8PXCixA6SlGr8/view", quizLink: "https://docs.google.com/document/d/1_I7d0nwGqQrVJLBzqr22pmh85S0feMshyFJw3cP4WS8/edit"
      };
      case "ACCESS": return { 
        title: "ACCESS", sub: "Quản trị CSDL", 
        color: "red", docLink: "https://drive.google.com/file/d/1Lr1i028NQ9SQYEluo61I4AAijGC_DvQl/view", quizLink: ""
      };
      default: return { title: courseType, sub: "", color: "indigo", docLink: "", quizLink: "" };
    }
  };

  const meta = getCourseMeta();

  // Bảng màu tự động dựa trên color (Dành cho Header & Viền Video)
  const colorMap = {
    blue: { badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300", glow: "ring-blue-400/30", btn: "from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600" },
    green: { badge: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300", glow: "ring-green-400/30", btn: "from-green-600 to-green-500 hover:from-green-700 hover:to-green-600" },
    red: { badge: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300", glow: "ring-red-400/30", btn: "from-red-500 to-red-400 hover:from-red-600 hover:to-red-500" },
  };
  const colors = colorMap[meta.color];

  // Bảng màu đồng bộ cho Danh sách bài học (Sidebar) - Màu Vàng (Amber)
  const sidebarColors = {
    activeBg: "bg-amber-50 dark:bg-amber-900/20",
    activeText: "text-amber-700 dark:text-amber-400",
    iconBg: "bg-gradient-to-br from-amber-400 to-amber-600",
    sectionActiveBg: "bg-amber-50/80 dark:bg-amber-900/10",
    sectionActiveBorder: "border-amber-500"
  };

  const activeVideoIndex = videos.findIndex(v => v._id === activeVideo?._id);

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Course header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-150">
              <ArrowLeft className="w-3.5 h-3.5" /> Trở về
            </Link>
            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
            <div>
              <h1 className="font-bold text-slate-900 dark:text-white text-sm leading-tight uppercase" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Khóa {meta.title}
              </h1>
              <span className={cn("text-xs font-medium", colors.badge.split(" ").slice(-2).join(" "))}>
                {meta.sub}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {meta.docLink && (
              <a href={meta.docLink} target="_blank" rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
                <BookOpen className="w-3.5 h-3.5" /> Tải tài liệu
              </a>
            )}
            {meta.quizLink && (
              <a href={meta.quizLink} target="_blank" rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors border border-amber-200 shadow-sm">
                <Star className="w-3.5 h-3.5 fill-amber-500" /> Ôn trắc nghiệm
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Sidebar — lesson list */}
          <aside className="md:w-72 lg:w-80 shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex flex-col gap-3">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex justify-between" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <span>Danh sách bài học</span>
                  <span className="text-slate-400 font-normal">{videos.length}</span>
                </h3>
                {/* Search Bar được phục hồi */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm bài học..." 
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="overflow-y-auto max-h-72 md:max-h-[calc(100vh-300px)] divide-y divide-slate-50 dark:divide-slate-700/50">
                {Object.entries(groupedVideos).map(([section, sectionVideos]) => {
                  const isOpen = openSections[section] || searchTerm.trim() !== ""; // Tự động mở nếu đang tìm kiếm
                  const activeCount = sectionVideos.filter(v => v._id === activeVideo?._id).length;
                  const isSectionActive = activeCount > 0;

                  return (
                    <div key={section} className="flex flex-col bg-white dark:bg-slate-800">
                      <button 
                        onClick={() => toggleSection(section)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3 bg-slate-50/60 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors border-l-4 text-left",
                          isSectionActive ? `${sidebarColors.sectionActiveBg} ${sidebarColors.sectionActiveBorder}` : "border-slate-200 dark:border-slate-700"
                        )}
                      >
                        <div className="flex flex-col items-start gap-0.5 pr-2">
                          <span className={cn("text-[13px] font-bold leading-tight", isSectionActive ? sidebarColors.activeText : "text-slate-800 dark:text-slate-200")}>{section}</span>
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">{sectionVideos.length} bài học</span>
                        </div>
                        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0", isOpen && "rotate-180")} />
                      </button>
                      
                      {isOpen && (
                        <div className="flex flex-col divide-y divide-slate-50 dark:divide-slate-700/30 bg-white dark:bg-slate-800">
                          {sectionVideos.map((vid) => {
                            const isActive = activeVideo?._id === vid._id;
                            const actualIndex = videos.findIndex(v => v._id === vid._id);
                            
                            return (
                              <button key={vid._id} onClick={() => setActiveVideo(vid)}
                                className={cn(
                                  "w-full text-left px-4 py-3 pl-5 flex items-start gap-3 transition-colors",
                                  isActive
                                    ? `${sidebarColors.activeBg} border-l-2 ${sidebarColors.sectionActiveBorder}`
                                    : "hover:bg-slate-50 dark:hover:bg-slate-700/30 border-l-2 border-transparent"
                                )}>
                                <div className={cn(
                                  "w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold transition-colors",
                                  isActive
                                    ? `${sidebarColors.iconBg} text-white shadow-sm`
                                    : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                                )}>
                                  {isActive ? <Play className="w-2.5 h-2.5 fill-current" /> : actualIndex + 1}
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center min-h-[24px]">
                                  <p className={cn(
                                    "text-[12px] font-semibold leading-snug truncate",
                                    isActive ? sidebarColors.activeText : "text-slate-600 dark:text-slate-300"
                                  )}>
                                    {vid.title}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                {filteredVideos.length === 0 && (
                  <div className="p-4 text-center text-sm text-slate-500">Không tìm thấy bài học nào!</div>
                )}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {activeVideo ? (
              <>
                {/* Video player */}
                <div className={cn("relative rounded-2xl overflow-hidden bg-black shadow-2xl ring-4 mb-4", colors.glow)}>
                  <div className="relative" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      key={activeVideo.youtubeId}
                      src={`https://www.youtube.com/embed/${activeVideo.youtubeId}`}
                      title={activeVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>

                {/* Video info */}
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-xl text-slate-900 dark:text-white mb-2 leading-snug" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {activeVideo.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold", colors.badge)}>
                        Bài {activeVideoIndex + 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Q&A Section */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
                  <div className="flex items-center gap-2.5 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Bình luận & Hỏi đáp
                    </h3>
                    <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-medium">
                      {comments.length}
                    </span>
                  </div>

                  {/* Comment form */}
                  <form onSubmit={handlePostComment} className="mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <input
                      className="w-full px-4 py-3 mb-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                      placeholder="Nhập tên của bạn..."
                      value={newComment.name}
                      onChange={e => setNewComment(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                    <textarea
                      className="w-full px-4 py-3 mb-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition resize-none"
                      rows={3}
                      placeholder="Bạn có câu hỏi gì về bài học này? 💬"
                      value={newComment.content}
                      onChange={e => setNewComment(p => ({ ...p, content: e.target.value }))}
                      required
                    />
                    <button type="submit" disabled={submitting}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-900 text-sm font-bold transition-all duration-150 hover:scale-105 active:scale-95 shadow-sm disabled:opacity-60 disabled:hover:scale-100">
                      <Send className="w-3.5 h-3.5" />
                      {submitting ? "Đang gửi..." : "Đăng Bình Luận"}
                    </button>
                  </form>

                  {/* Comments list */}
                  {comments.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-2" />
                      <p className="text-slate-400 dark:text-slate-500 text-sm">Chưa có bình luận nào. Hãy là người đầu tiên đặt câu hỏi!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {comments.map(c => (
                        <div key={c._id} className="flex gap-3 group">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300 text-xs font-bold shadow-sm">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl px-4 py-3">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-xs text-slate-900 dark:text-white">{c.name}</span>
                                <span className="text-xs text-slate-400 dark:text-slate-500">{new Date(c.createdAt).toLocaleString('vi-VN')}</span>
                              </div>
                              <button onClick={() => handleDeleteComment(c._id)}
                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-md transition-all">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{c.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm">
                <Play className="w-12 h-12 text-slate-200 dark:text-slate-700 mb-4 animate-pulse" />
                <h2 className="text-slate-500 dark:text-slate-400 font-medium">Đang tải danh sách bài học...</h2>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
