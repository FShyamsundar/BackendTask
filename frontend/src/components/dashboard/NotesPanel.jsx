import { formatDate } from "../../utils/formatters";
import AdminUserBrowser from "./AdminUserBrowser";

function NotesPanel({
  user,
  displayedNotes,
  activeNoteId,
  selectedAdminUser,
  users,
  isUsersLoading,
  isNotesLoading,
  isSelectedUserNotesLoading,
  pendingDeleteId,
  pendingUserDeleteId,
  onRefreshUsers,
  onShowAllNotes,
  onViewUserNotes,
  onDeleteUser,
  onEditNote,
  onDeleteNote,
}) {
  const isLoading = isNotesLoading || isSelectedUserNotesLoading;

  return (
    <section className="notes-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{user?.role === "admin" ? "Admin Browser" : "Read Notes"}</p>
          <h2>
            {user?.role === "admin" && selectedAdminUser.userId
              ? `${selectedAdminUser.userName}'s notes`
              : "Notes collection"}
          </h2>
        </div>
        <span className="notes-count">
          {displayedNotes.length} item{displayedNotes.length === 1 ? "" : "s"}
        </span>
      </div>

      {user?.role === "admin" ? (
        <AdminUserBrowser
          users={users}
          selectedAdminUser={selectedAdminUser}
          isUsersLoading={isUsersLoading}
          pendingUserDeleteId={pendingUserDeleteId}
          currentUserId={user?.id}
          onRefreshUsers={onRefreshUsers}
          onShowAllNotes={onShowAllNotes}
          onViewUserNotes={onViewUserNotes}
          onDeleteUser={onDeleteUser}
        />
      ) : null}

      {isLoading ? <p className="empty-state">Loading notes...</p> : null}

      {!isLoading && displayedNotes.length === 0 ? (
        <p className="empty-state">
          {user?.role === "admin" && selectedAdminUser.userId
            ? "This user has not created any notes yet."
            : "No notes yet. Create your first one from the form on the left."}
        </p>
      ) : null}

      <div className="notes-list">
        {displayedNotes.map((note) => (
          <article
            key={note._id}
            className={`note-card ${activeNoteId === note._id ? "note-card-active" : ""}`}
          >
            <div className="note-meta">
              <div>
                <h3>{note.title}</h3>
                {user?.role === "admin" && note.owner ? (
                  <span>
                    {note.owner.name} | {note.owner.email}
                  </span>
                ) : null}
              </div>
              <span>Updated {formatDate(note.updatedAt || note.createdAt)}</span>
            </div>

            <p>{note.content}</p>

            <div className="note-actions">
              <button
                type="button"
                className="secondary-button compact-button"
                onClick={() => onEditNote(note)}
              >
                Edit
              </button>
              <button
                type="button"
                className="danger-button compact-button"
                onClick={() => onDeleteNote(note._id)}
                disabled={pendingDeleteId === note._id}
              >
                {pendingDeleteId === note._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default NotesPanel;
