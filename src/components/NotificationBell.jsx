import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NotificationBell.css';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // Chỉ đếm cho vui để tạo màu đỏ
  const navigate = useNavigate();
  const containerRef = useRef(null); // Dùng để xác định vùng của cái chuông

  // Load thông báo
  const fetchNotifications = async () => {
    try {
      const res = await axios.get('https://it-proficiency-backend.onrender.com/api/notifications');
      setNotifications(res.data);
      
      // Tính toán số lượng chưa đọc thông qua localStorage
      if (res.data.length > 0) {
        const lastSeenId = localStorage.getItem('lastSeenNotifId');
        if (!lastSeenId) {
          setUnreadCount(res.data.length); // Chưa từng mở chuông -> Coi như chưa đọc hết
        } else {
          // Đếm xem có bao nhiêu thông báo mới hơn cái đã xem
          const newIndex = res.data.findIndex(n => n._id === lastSeenId);
          if (newIndex === -1) {
            setUnreadCount(res.data.length); // Không tìm thấy cái cũ -> Toàn đồ mới
          } else {
            setUnreadCount(newIndex); // Có newIndex cái nằm trước (tức là mới hơn)
          }
        }
      }
    } catch (error) {
      console.error("Lỗi tải thông báo:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Có thể set interval để 1 phút tải lại 1 lần nếu thích
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Tính năng: Bấm ra ngoài vùng chuông thì tự động tắt
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Nếu có bảng đang mở VÀ vị trí bấm chuột không nằm trong container của chuông
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0); // Khi mở ra thì tắt số đếm
      // Lưu cái ID mới nhất vào máy để lần sau không báo đỏ nữa
      if (notifications.length > 0) {
        localStorage.setItem('lastSeenNotifId', notifications[0]._id);
      }
    }
  };

  const handleItemClick = (link) => {
    setIsOpen(false);
    navigate(link);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Ngăn không cho click nhầm vào item
    const pass = prompt("Vui lòng nhập Mật Khẩu Admin để xóa thông báo này:");
    if (!pass) return;
    try {
      await axios.delete(`https://it-proficiency-backend.onrender.com/api/notifications/${id}`, {
        headers: { 'x-admin-password': pass }
      });
      fetchNotifications();
      alert("✅ Xóa thành công!");
    } catch (error) {
      alert("❌ Lỗi: Bạn không có quyền xóa!");
    }
  };

  return (
    <div className="notification-container" ref={containerRef}>
      {/* Nút Chuông */}
      <button className="bell-button" onClick={handleToggle}>
        🔔
        {unreadCount > 0 && <span className="badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {/* Bảng xổ xuống */}
      {isOpen && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <h4>Hoạt động cộng đồng</h4>
          </div>
          <div className="dropdown-body">
            {notifications.length === 0 ? (
              <p className="no-notif">Chưa có thông báo nào.</p>
            ) : (
              notifications.map((n) => (
                <div key={n._id} className="notif-item" onClick={() => handleItemClick(n.link)}>
                  <div className="notif-content">
                    <p className="notif-message">{n.message}</p>
                    <span className="notif-date">{new Date(n.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                  <button className="btn-del-notif" onClick={(e) => handleDelete(e, n._id)} title="Xóa">🗑️</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
