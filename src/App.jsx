import { Routes, Route } from 'react-router-dom';
import Welcome from './screens/Welcome.jsx';
import FocusAreas from './screens/FocusAreas.jsx';
import Rhythm from './screens/Rhythm.jsx';
import Placeholder from './components/Placeholder.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/focus" element={<FocusAreas />} />
      <Route path="/rhythm" element={<Rhythm />} />
      <Route path="/today" element={<Placeholder name="Today" />} />
      <Route path="/library" element={<Placeholder name="Library" />} />
      <Route path="/library/breath" element={<Placeholder name="Library / Breath" />} />
      <Route path="/ritual/breath" element={<Placeholder name="Ritual / Breath" />} />
      <Route path="/ritual/stretch" element={<Placeholder name="Ritual / Stretch" />} />
      <Route path="/progress" element={<Placeholder name="Progress" />} />
      <Route path="/you" element={<Placeholder name="You" />} />
    </Routes>
  );
}
