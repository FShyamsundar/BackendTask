function AppHeader({ token, user, onLogout }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Backend Developer Assignment</p>
        <h1>Secure Notes Control Center</h1>
        <p className="subtitle">
          JWT authentication, role-aware access, and a complete notes CRUD interface in one clean
          demo.
        </p>
      </div>

      {token && user ? (
        <div className="session-card">
          <span className="session-role">{user.role}</span>
          <strong>{user.name}</strong>
          <span>{user.email}</span>
          <button className="secondary-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="topbar-badge">React + Express + MongoDB</div>
      )}
    </header>
  );
}

export default AppHeader;
