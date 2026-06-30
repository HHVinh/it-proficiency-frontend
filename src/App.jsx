import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import NotificationBell from './components/NotificationBell';

function App() {
  return (
    <div>
      {/* Khối quản lý tất cả các Ngã Rẽ (Đường dẫn) của Website */}
      <Routes>
        {/* Nếu khách vào đường link gốc "/" -> Dẫn vào Trang Chủ */}
        <Route path="/" element={<HomePage />} />
        
        {/* Nếu khách gõ đuôi "/tin-a" -> Dẫn vào màn hình Lớp Học (Và đưa cho nó cái thẻ tên courseType="A") */}
        <Route path="/tin-a" element={<CoursePage courseType="A" />} />
        
        {/* Tương tự cho Tin B */}
        <Route path="/tin-b" element={<CoursePage courseType="B" />} />
        
        {/* Đường dẫn cho Khóa Access mới thêm ở V2 */}
        <Route path="/access" element={<CoursePage courseType="ACCESS" />} />
      </Routes>
      
      {/* Cái Chuông này nằm ngoài Routes, nên nó sẽ hiển thị ở MỌI TRANG */}
      <NotificationBell />
    </div>
  )
}

export default App;
