function AdminUserBrowser({
  users,
  selectedAdminUser,
  isUsersLoading,
  pendingUserDeleteId,
  currentUserId,
  onRefreshUsers,
  onShowAllNotes,
  onViewUserNotes,
  onDeleteUser,
}) {
  return (
    <div className="admin-panel">
      <div className="admin-toolbar">
        <button
          className="secondary-button compact-button"
          type="button"
          onClick={onRefreshUsers}
          disabled={isUsersLoading}
        >
          {isUsersLoading ? "Refreshing users..." : "Refresh users"}
        </button>
        {selectedAdminUser.userId ? (
          <button className="ghost-button compact-button" type="button" onClick={onShowAllNotes}>
            Show all notes
          </button>
        ) : null}
      </div>

      <div className="admin-users-list">
        {users.map((listedUser) => (
          <article
            key={listedUser.id}
            className={`admin-user-card ${
              selectedAdminUser.userId === listedUser.id ? "admin-user-card-active" : ""
            }`}
          >
            <div className="admin-user-header">
              <div>
                <h3>{listedUser.name}</h3>
                <span>{listedUser.email}</span>
              </div>
              <span className="session-role">{listedUser.role}</span>
            </div>

            <p className="admin-user-copy">
              {listedUser.noteCount} note{listedUser.noteCount === 1 ? "" : "s"} created
            </p>

            <div className="note-actions">
              <button
                type="button"
                className="secondary-button compact-button"
                onClick={() => onViewUserNotes(listedUser.id, listedUser.name)}
              >
                View notes
              </button>
              <button
                type="button"
                className="danger-button compact-button"
                onClick={() => onDeleteUser(listedUser)}
                disabled={pendingUserDeleteId === listedUser.id || currentUserId === listedUser.id}
              >
                {currentUserId === listedUser.id
                  ? "Current admin"
                  : pendingUserDeleteId === listedUser.id
                    ? "Deleting..."
                    : "Delete user"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default AdminUserBrowser;
