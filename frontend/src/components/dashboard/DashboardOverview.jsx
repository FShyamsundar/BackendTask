function DashboardOverview({ user, notesCount, usersCount, isEditing }) {
  return (
    <section className="dashboard-overview">
      <article className="overview-card overview-accent">
        <span className="overview-label">Protected Session</span>
        <strong>{user?.role === "admin" ? "Admin visibility enabled" : "User workspace active"}</strong>
        <p>
          {user?.role === "admin"
            ? "Admins can view every note in the system through the protected notes endpoint."
            : "Users can create and manage only their own notes through the protected notes endpoint."}
        </p>
      </article>

      <article className="overview-card">
        <span className="overview-label">{user?.role === "admin" ? "Users Loaded" : "Notes Loaded"}</span>
        <strong>{user?.role === "admin" ? usersCount : notesCount}</strong>
        <p>
          {user?.role === "admin"
            ? "Browse registered users and inspect their note activity."
            : "Real-time CRUD state synced with your REST API responses."}
        </p>
      </article>

      <article className="overview-card">
        <span className="overview-label">Current Action</span>
        <strong>{isEditing ? "Editing a note" : "Creating a new note"}</strong>
        <p>
          {isEditing
            ? "Update the selected note and save your changes."
            : "Fill the form to add a fresh note to the collection."}
        </p>
      </article>
    </section>
  );
}

export default DashboardOverview;
