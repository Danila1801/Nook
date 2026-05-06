import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { setupServiceWorkerMessages } from './lib/notifications/register.js';
import Welcome from './screens/Welcome.jsx';
import FocusAreas from './screens/FocusAreas.jsx';
import Rhythm from './screens/Rhythm.jsx';
import Name from './screens/Name.jsx';
import Today from './screens/Today.jsx';
import Library from './screens/Library.jsx';
import CategoryDetail from './screens/CategoryDetail.jsx';
import RitualBreath from './screens/RitualBreath.jsx';
import RitualStretch from './screens/RitualStretch.jsx';
import RitualEye from './screens/RitualEye.jsx';
import RitualMovement from './screens/RitualMovement.jsx';
import RitualMind from './screens/RitualMind.jsx';
import Progress from './screens/Progress.jsx';
import You from './screens/You.jsx';

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setupServiceWorkerMessages(navigate);
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/focus" element={<FocusAreas />} />
      <Route path="/rhythm" element={<Rhythm />} />
      <Route path="/name" element={<Name />} />
      <Route path="/today" element={<Today />} />
      <Route path="/library" element={<Library />} />
      <Route path="/library/:categoryKey" element={<CategoryDetail />} />
      <Route path="/ritual/breath" element={<RitualBreath />} />
      <Route path="/ritual/stretch" element={<RitualStretch />} />
      <Route path="/ritual/eye" element={<RitualEye />} />
      <Route path="/ritual/movement" element={<RitualMovement />} />
      <Route path="/ritual/mind" element={<RitualMind />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/you" element={<You />} />
    </Routes>
  );
}
