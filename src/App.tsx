import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CreatorPage } from './pages/CreatorPage';
import { RevealPage } from './pages/RevealPage';

/**
 * App routes:
 *   /        → Creator / Landing page (build & download the QR)
 *   /reveal  → Immersive romantic reveal (data comes from URL params)
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreatorPage />} />
        <Route path="/reveal" element={<RevealPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
