
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add URL parameter to hide Lovable badge
const url = new URL(window.location.href);
if (!url.searchParams.has('forceHideBadge')) {
  url.searchParams.append('forceHideBadge', 'true');
  window.history.replaceState({}, '', url.toString());
}

createRoot(document.getElementById("root")!).render(<App />);
