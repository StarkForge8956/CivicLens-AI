function Sidebar({
  activeSection,
  onNavigate,
  collapsed,
  onToggle,
}) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "⌂",
    },
    {
      id: "upload",
      label: "Upload / Analyze",
      icon: "＋",
    },
    {
      id: "results",
      label: "Results",
      icon: "◉",
    },
    {
      id: "history",
      label: "History",
      icon: "◷",
    },
    {
      id: "statistics",
      label: "Statistics",
      icon: "▥",
    },
    {
      id: "map",
      label: "Map",
      icon: "⌖",
    },
    {
      id: "reports",
      label: "Reports",
      icon: "▤",
    },
  ]

  return (
    <aside
      className={`sidebar ${
        collapsed ? "sidebar-collapsed" : ""
      }`}
    >
      <div className="sidebar-top">
        {!collapsed && (
          <div className="sidebar-brand">
  <img
    src="/civiclens-sidebar-icon.png"
    alt="CivicLens AI"
    className="sidebar-brand-logo"
  />

  {!collapsed && (
    <div>
      <h2>CivicLens</h2>
      <span>AI MONITORING</span>
    </div>
  )}
</div>
        )}

        <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
      </div>

      <nav className="sidebar-nav">
        {!collapsed && (
          <p className="nav-label">
            MAIN MENU
          </p>
        )}

        <ul>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`nav-item ${
                activeSection === item.id
                  ? "active"
                  : ""
              }`}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : ""}
            >
              <span className="nav-icon">
                {item.icon}
              </span>

              {!collapsed && (
                <span>{item.label}</span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {!collapsed && (
        <div className="sidebar-footer">
          <div className="sidebar-footer-icon">
            ✓
          </div>

          <div>
            <strong>AI Model Ready</strong>
            <span>YOLO11n • Online</span>
          </div>
        </div>
      )}
    </aside>
  )
}

export default Sidebar