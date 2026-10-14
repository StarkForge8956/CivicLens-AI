import React from "react"

function Sidebar({
  activeSection,
  onNavigate,
  collapsed,
  onToggle,
  mobileOpen,
  onMobileToggle,
}) {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "⌂",
    },
    {
      id: "upload",
      label: "Upload & Analyze",
      icon: "↑",
    },
    {
      id: "results",
      label: "Results",
      icon: "◉",
    },
    {
      id: "history",
      label: "History",
      icon: "↺",
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

  const handleNavigation = (section) => {
    onNavigate(section)

    // Close the mobile drawer after selecting an option
    if (window.innerWidth <= 700 && mobileOpen) {
      onMobileToggle()
    }
  }

  return (
    <>
      {/* =========================================
          MOBILE MENU BUTTON
      ========================================= */}
      <button
        className="mobile-menu-button"
        onClick={onMobileToggle}
        aria-label="Open navigation"
      >
        ☰
      </button>

      {/* =========================================
          SIDEBAR
      ========================================= */}
      <aside
        className={`sidebar ${
          collapsed ? "sidebar-collapsed" : ""
        } ${
          mobileOpen ? "mobile-open" : ""
        }`}
      >
        {/* Brand + Toggle */}
        <div className="sidebar-top">
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

          {/* Desktop collapse button */}
          <button
            className="sidebar-toggle"
            onClick={onToggle}
            aria-label={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {!collapsed && (
            <p className="nav-label">
              MAIN MENU
            </p>
          )}

          <ul>
            {navItems.map((item) => (
              <li
                key={item.id}
                className={`nav-item ${
                  activeSection === item.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleNavigation(item.id)
                }
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

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-footer-icon">
            ✓
          </div>

          {!collapsed && (
            <div>
              <strong>System Online</strong>
              <span>AI service connected</span>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default Sidebar