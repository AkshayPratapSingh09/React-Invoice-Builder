import { useState } from 'react';
import './Sidebar.css';

// Placeholder SVG icons (replace with real SVGs or icon library as needed)
const icons = {
  dashboard: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
  ),
  history: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9"/><path d="M3 3v6h6"/></svg>
  ),
  analysis: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="12" width="6" height="8"/><rect x="9" y="8" width="6" height="12"/><rect x="15" y="4" width="6" height="16"/></svg>
  ),
  finances: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/><path d="M2 12h2m16 0h2M12 2v2m0 16v2"/></svg>
  ),
  messages: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/></svg>
  ),
  documents: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
  ),
  products: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>
  ),
  help: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
  ),
  settings: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  ),
};

const sidebarItems = [
  { key: 'dashboard', label: 'Dashboard', section: 'Banking', disabled: true },
  { key: 'history', label: 'History', section: 'Banking', disabled: true },
  { key: 'analysis', label: 'Analysis', section: 'Banking', disabled: true },
  { key: 'finances', label: 'Finances', section: 'Banking', disabled: true },
  { key: 'messages', label: 'Messages', section: 'Services', badge: 9, disabled: true },
  { key: 'documents', label: 'Documents', section: 'Services', disabled: true },
  { key: 'products', label: 'Billings', section: 'Services', active: true },
  { key: 'help', label: 'Help', section: 'Other', disabled: true },
  { key: 'settings', label: 'Settings', section: 'Other', disabled: true },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  // Group items by section
  const sections = Array.from(new Set(sidebarItems.map(i => i.section)));

  return (
    <nav className={`sidebar${collapsed ? ' collapsed' : ''}`}>  
      <div className="sidebar-top">
        <button className="sidebar-avatar" tabIndex={-1} aria-label="User profile">
          <img src="https://randomuser.me/api/portraits/med/women/75.jpg" alt="avatar" />
        </button>
      </div>
      <div className="sidebar-content">
        {sections.map(section => (
          <div className="sidebar-section" key={section}>
            <div className="sidebar-section-label">{!collapsed && section}</div>
            {sidebarItems.filter(i => i.section === section).map(item => (
              <button
                key={item.key}
                className={`sidebar-item${item.active ? ' active' : ''}${item.disabled ? ' disabled' : ''}`}
                disabled={item.disabled}
                tabIndex={item.disabled ? -1 : 0}
                title={item.label}
              >
                <span className="sidebar-icon">{icons[item.key]}</span>
                {!collapsed && <span className="sidebar-label">{item.label}</span>}
                {item.badge && !collapsed && <span className="sidebar-badge">{item.badge}</span>}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="sidebar-bottom">
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </nav>
);
} 