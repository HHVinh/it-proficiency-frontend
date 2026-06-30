import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NotificationBell from '../components/NotificationBell';

function HomePage() {
  const [updates, setUpdates] = useState([]);
  const [visitCount, setVisitCount] = useState(0);

  // V2: Các State mới cho Bảng tin thông minh
  const [filter, setFilter] = useState('Tất cả'); // Bộ lọc: Tất cả | Tin A | Tin B | Access | Chung
  const [visibleCount, setVisibleCount] = useState(5); // Load more
  
  // State cho Form Đăng Bài
  const [newUpdate, setNewUpdate] = useState({ content: '', driveLink: '', category: 'Access' });
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    // Gọi API Tăng lượt truy cập
    const hitVisit = async () => {
      try {
        const res = await axios.post('https://it-proficiency-backend.onrender.com/api/visits');
        setVisitCount(res.data.count);
      } catch (error) {
        console.error("Lỗi đếm truy cập:", error);
      }
    };
    hitVisit();

    // Gọi API Lấy danh sách thông báo
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const response = await axios.get('https://it-proficiency-backend.onrender.com/api/updates');
      setUpdates(response.data);
    } catch (error) {
      console.error("Lỗi lấy thông báo:", error);
    }
  };

  // Hàm xử lý Đăng bài
  const handlePostUpdate = async (e) => {
    e.preventDefault();
    if (!newUpdate.content || !newUpdate.driveLink) {
      setToastMessage("❌ Vui lòng nhập đủ Tiêu đề và Link!");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }
    try {
      await axios.post('https://it-proficiency-backend.onrender.com/api/updates', newUpdate);
      setNewUpdate({ content: '', driveLink: '', category: 'Access' }); // Reset form về trống
      fetchUpdates(); // Tải lại bảng tin
      setToastMessage("✅ Đăng bài thành công!");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (error) {
      console.error("Lỗi đăng bài:", error);
    }
  };

  // Hàm xử lý Xóa bài (Có Mật Khẩu)
  const handleDelete = async (id) => {
    // Lệnh prompt sẽ mở ra 1 hộp thoại trên trình duyệt yêu cầu nhập chữ
    const pass = prompt("Vui lòng nhập Mật Khẩu để xóa bài này:");
    if (!pass) return; // Nếu bấm Hủy thì không làm gì cả
    
    try {
      await axios.delete(`https://it-proficiency-backend.onrender.com/api/updates/${id}`, {
        headers: {
          'x-admin-password': pass
        }
      });
      fetchUpdates(); // Tải lại bảng tin
      setToastMessage("✅ Đã xử lý thành công!");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (error) {
      alert(error.response?.data?.message || "❌ Lỗi: Bạn không có quyền quản lý!");
      console.error("Lỗi xóa:", error);
    }
  };

  // LỌC THÔNG BÁO THEO CATEGORY
  // Nếu chọn "Tất cả" thì giữ nguyên (true), nếu không thì so sánh category
  const filteredUpdates = updates.filter(item => filter === 'Tất cả' ? true : item.category === filter);
  
  // LẤY 5 BÀI ĐẦU TIÊN (HOẶC NHIỀU HƠN NẾU BẤM XEM THÊM)
  const displayedUpdates = filteredUpdates.slice(0, visibleCount);

  return (
    <div className="home-container">
      {/* Cái Chuông Thông Báo (Chỉ hiển thị ở Trang Chủ) */}
      <NotificationBell />

      {/* KHU VỰC BÌA (HERO SECTION) */}
      <div className="hero">
        <h1 className="title">Chuẩn đầu ra tin học Nông Lâm</h1>
        <p className="subtitle">Chia sẻ kiến thức và tài liệu chuẩn đầu ra tin học miễn phí</p>
        
        {/* Nút Khóa Học V2: Chia 3 Khóa rõ ràng */}
        <div className="button-group">
          <Link to="/access" className="btn btn-access">Access</Link>
          <Link to="/tin-a" className="btn btn-tina">Tin A (Phần 1)</Link>
          <Link to="/tin-b" className="btn btn-tinb">Tin B (Phần 2)</Link>
        </div>

        {/* Liên kết ngoài */}
        <div className="external-links">
          <a href="https://aic.hcmuaf.edu.vn/" target="_blank" rel="noreferrer" className="btn-external btn-aic">
            🏫 Trung tâm Tin học Nông Lâm
          </a>
          <a href="https://aic.hcmuaf.edu.vn/aic-3279-2/vn/quyet-dinh.html" target="_blank" rel="noreferrer" className="btn-external btn-decision">
            📜 Quyết định về chuẩn đầu ra
          </a>
        </div>
      </div>

      {/* KHU VỰC BẢNG TIN (UPDATES) */}
      <div className="updates-section">
        <h2>Cộng Đồng Chia Sẻ Tài Liệu</h2>

        {/* BỘ LỌC (FILTER) */}
        <div className="filter-group">
          {['Tất cả', 'Access', 'Tin A', 'Tin B', 'Chung'].map(cat => (
            <button 
              key={cat} 
              className={`filter-btn ${filter === cat ? 'active-filter' : ''}`}
              onClick={() => { setFilter(cat); setVisibleCount(5); }} // Đổi bộ lọc thì reset số lượng hiển thị về 5
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FORM ĐĂNG BÀI (Dành cho Sinh Viên) */}
        <form className="post-form" onSubmit={handlePostUpdate}>
          <input 
            type="text" placeholder="Tiêu đề tài liệu..." 
            value={newUpdate.content} onChange={e => setNewUpdate({...newUpdate, content: e.target.value})}
          />
          <input 
            type="text" placeholder="Link Google Drive..." 
            value={newUpdate.driveLink} onChange={e => setNewUpdate({...newUpdate, driveLink: e.target.value})}
          />
          <select 
            value={newUpdate.category} onChange={e => setNewUpdate({...newUpdate, category: e.target.value})}
          >
            <option value="Access">Access</option>
            <option value="Tin A">Tin A (Phần 1)</option>
            <option value="Tin B">Tin B (Phần 2)</option>
            <option value="Chung">Chung</option>
          </select>
          <button type="submit" className="btn btn-post">Đăng Bài</button>
        </form>

        {/* DANH SÁCH BÀI ĐĂNG */}
        <ul className="update-list">
          {displayedUpdates.map((item) => (
            <li key={item._id} className="update-item">
              <div className="update-meta">
                <span className={`update-category tag-${item.category.replace(' ', '')}`}>[{item.category}]</span>
                <span className="update-date">{new Date(item.date).toLocaleDateString('vi-VN')}</span>
              </div>
              
              <p className="update-content">{item.content}</p>
              
              <div className="update-actions">
                <a href={item.driveLink} target="_blank" rel="noreferrer" className="update-link">📥 Tải tài liệu</a>
                {/* Nút Xóa dành cho Giáo viên */}
                <button onClick={() => handleDelete(item._id)} className="btn-delete">❌ Xóa (Admin)</button>
              </div>
            </li>
          ))}
          {displayedUpdates.length === 0 && <p className="no-result">Chưa có thông báo nào trong mục này.</p>}
        </ul>

        {/* NÚT XEM THÊM (LOAD MORE) */}
        {filteredUpdates.length > visibleCount && (
          <button className="btn-load-more" onClick={() => setVisibleCount(visibleCount + 5)}>
            ⬇ Xem thêm 5 bài nữa
          </button>
        )}
      </div>

      {/* GÓC THỐNG KÊ & BẢN QUYỀN (Footer) */}
      <div className="footer-stats" style={{ textAlign: 'center', marginTop: '40px', padding: '20px', borderTop: '1px solid #2c3e50', color: '#bdc3c7', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p>👁️ Website đã phục vụ <strong>{visitCount}</strong> lượt truy cập học tập</p>
        <p style={{ color: '#95a5a6' }}>
          Được phát triển bởi <a href="https://www.facebook.com/HuynhHuuVinh2101" target="_blank" rel="noreferrer" style={{color: '#f1c40f', textDecoration: 'none', fontWeight: 'bold'}}>Huỳnh Hữu Vinh</a>
        </p>
        <p style={{ color: '#95a5a6' }}>
          <em>Dự án phi lợi nhuận hỗ trợ Sinh viên Nông Lâm</em>
        </p>
      </div>

      {/* THÔNG BÁO TOAST UI */}
      {toastMessage && (
        <div className="custom-toast">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default HomePage;
