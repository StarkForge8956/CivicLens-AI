function Header({ collapsed }) {
  return (
    <header
      className={`top-header ${
        collapsed ? "sidebar-collapsed" : ""
      }`}
    >
      <img
        src="/civiclens-logo.png"
        alt="CivicLens AI"
        className="civiclens-header-logo"
      />
    </header>
  )
}

export default Header