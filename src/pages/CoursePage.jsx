import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function CoursePage({ courseType }) {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);

  // V2: State cho Bình luận
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: '', content: '' });

  // 1. Lấy danh sách Video khi vào trang
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`https://it-proficiency-backend.onrender.com/api/videos?courseType=${courseType}`);
        setVideos(response.data);
        if (response.data.length > 0) {
          setActiveVideo(response.data[0]); // Mặc định mở bài đầu tiên
        }
      } catch (error) {
        console.error("Lỗi lấy video:", error);
      }
    };
    fetchVideos();
  }, [courseType]);

  // 2. Lấy danh sách Bình luận MỖI KHI ĐỔI BÀI HỌC (Đổi activeVideo)
  useEffect(() => {
    if (!activeVideo) return; // Nếu chưa có video thì không làm gì cả
    const fetchComments = async () => {
      try {
        const res = await axios.get(`https://it-proficiency-backend.onrender.com/api/comments/${activeVideo._id}`);
        setComments(res.data);
      } catch (error) {
        console.error("Lỗi lấy bình luận:", error);
      }
    };
    fetchComments();
  }, [activeVideo]); // <-- Quan trọng: Khi khách bấm sang Video khác, hàm này tự chạy lại

  // 3. Xử lý Gửi Bình luận mới
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.name || !newComment.content) return;
    try {
      await axios.post('https://it-proficiency-backend.onrender.com/api/comments', {
        videoId: activeVideo._id, // Gắn ID của video đang xem vào bình luận
        name: newComment.name,
        content: newComment.content
      });
      setNewComment({ name: '', content: '' }); // Xóa form cho sạch sẽ
      
      // Load lại bình luận để hiện ngay lên màn hình
      const res = await axios.get(`https://it-proficiency-backend.onrender.com/api/comments/${activeVideo._id}`);
      setComments(res.data);
    } catch (error) {
      console.error("Lỗi đăng bình luận:", error);
    }
  };

  // 4. Xử lý Xóa Bình luận (Dành cho Admin)
  const handleDeleteComment = async (commentId) => {
    const pass = prompt("Vui lòng nhập Mật Khẩu để xóa bình luận này:");
    if (!pass) return;
    try {
      await axios.delete(`https://it-proficiency-backend.onrender.com/api/comments/${commentId}`, {
        headers: { 'x-admin-password': pass }
      });
      // Load lại bình luận
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

  // TÙY CHỈNH LINK THEO KHÓA HỌC
  let docLink = "#"; // Thay link Drive thật vào đây
  let quizLink = "#"; // Thay link Form thật vào đây
  
  if (courseType === "A") {
    docLink = "https://drive.google.com/file/d/1Lr1i028NQ9SQYEluo61I4AAijGC_DvQl/view?usp=sharing"; // VD Link thật
    quizLink = "https://docs.google.com/document/d/1m5H_RnO3Yh06Nu3liRsAyF_QW5EkiQj1oHHRj6SzhmE/edit?usp=sharing";
  } else if (courseType === "B") {
    docLink = "https://drive.google.com/file/d/1ATK7dDKnj-9GDd-wwdT8PXCixA6SlGr8/view?usp=sharing";
    quizLink = "https://docs.google.com/document/d/1_I7d0nwGqQrVJLBzqr22pmh85S0feMshyFJw3cP4WS8/edit?tab=t.0";
  } else if (courseType === "ACCESS") {
    docLink = "https://drive.google.com/file/d/1Lr1i028NQ9SQYEluo61I4AAijGC_DvQl/view?usp=sharing"; // Chung tài liệu Tin A
    quizLink = ""; // Access không có trắc nghiệm
  }

  return (
    <div className="course-container">
      {/* THANH ĐIỀU HƯỚNG & LINK TÀI LIỆU (V2) */}
      <div className="course-header">
        <div className="header-left">
          <Link to="/" className="back-btn" style={{ fontSize: '1.5rem' }}>🏠 Trang chủ</Link>
        </div>
        <div className="header-center">
          <h2 className="course-title">Khóa {courseType === "A" || courseType === "B" ? `TIN ${courseType}` : courseType}</h2>
        </div>
        
        {/* BANNER 2 NÚT TÀI LIỆU & TRẮC NGHIỆM */}
        <div className="header-right">
          <a href={docLink} target="_blank" rel="noreferrer" className="btn-doc">📥 Tải Tài Liệu</a>
          {/* Chỉ hiện nút Trắc nghiệm nếu quizLink có nội dung */}
          {quizLink !== "" && (
            <a href={quizLink} target="_blank" rel="noreferrer" className="btn-quiz">📝 Ôn Trắc Nghiệm</a>
          )}
        </div>
      </div>

      <div className="course-layout">
        {/* BÊN TRÁI: DANH SÁCH BÀI HỌC */}
        <div className="sidebar">
          <div className="sidebar-header">
            <h3>📚 Danh sách bài học</h3>
            <input 
              type="text" className="search-bar" 
              placeholder="🔍 Tìm bài học..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ul className="video-list">
            {filteredVideos.map((vid) => (
              <li 
                key={vid._id} 
                className={`video-item ${activeVideo?._id === vid._id ? 'active' : ''}`}
                onClick={() => setActiveVideo(vid)} // Bấm vào là đổi activeVideo ngay lập tức
              >
                ▶ {vid.title}
              </li>
            ))}
            {filteredVideos.length === 0 && <p className="no-result">Không tìm thấy bài nào!</p>}
          </ul>
        </div>

        {/* BÊN PHẢI: VIDEO & BÌNH LUẬN (V2) */}
        <div className="main-content">
          {activeVideo ? (
            <>
              {/* V2: Đã xóa cụm nút Tab Bài tập */}
              <div className="iframe-container">
                <iframe 
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}`} 
                  title="YouTube video player" allowFullScreen
                ></iframe>
              </div>
              <h2 className="current-title">{activeVideo.title}</h2>

              {/* KHU VỰC BÌNH LUẬN (V2) */}
              <div className="comments-section">
                <h3>💬 Bình luận & Hỏi đáp</h3>
                
                {/* Form Đăng Comment */}
                <form className="comment-form" onSubmit={handlePostComment}>
                  <input 
                    type="text" placeholder="Nhập tên của bạn..." required
                    value={newComment.name} onChange={e => setNewComment({...newComment, name: e.target.value})} 
                  />
                  <textarea 
                    placeholder="Bạn có câu hỏi gì về bài học này?" required rows="3"
                    value={newComment.content} onChange={e => setNewComment({...newComment, content: e.target.value})}
                  ></textarea>
                  <button type="submit" className="btn btn-post">Gửi Bình Luận</button>
                </form>

                {/* Danh sách Comment */}
                <div className="comment-list">
                  {comments.map(c => (
                    <div key={c._id} className="comment-item">
                      <div className="comment-header">
                        <strong>👤 {c.name}</strong>
                        <div>
                          <span className="comment-date">{new Date(c.createdAt).toLocaleString('vi-VN')}</span>
                          <button 
                            onClick={() => handleDeleteComment(c._id)} 
                            className="btn-delete" 
                            style={{marginLeft: '15px'}} 
                            title="Xóa bình luận này"
                          >🗑️ Xóa</button>
                        </div>
                      </div>
                      <p className="comment-text">{c.content}</p>
                    </div>
                  ))}
                  {comments.length === 0 && <p className="no-comment">Chưa có bình luận nào. Hãy là người đầu tiên đặt câu hỏi!</p>}
                </div>
              </div>
            </>
          ) : (
            <h2>Đang tải bài học...</h2>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
