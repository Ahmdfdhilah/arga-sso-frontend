import { Routes, Route, Navigate } from 'react-router';
import LoginPage from '@/pages/Login';
import PrivacyPolicyPage from '@/pages/PrivacyPolicy';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
