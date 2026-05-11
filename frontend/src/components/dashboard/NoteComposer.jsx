function NoteComposer({
  isEditing,
  noteForm,
  isSavingNote,
  isNotesLoading,
  onNoteChange,
  onSubmit,
  onCancelEdit,
  onRefreshNotes,
}) {
  return (
    <section className="composer-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">CRUD Form</p>
          <h2>{isEditing ? "Update note" : "Create note"}</h2>
        </div>
        {isEditing ? (
          <button className="ghost-button compact-button" type="button" onClick={onCancelEdit}>
            Cancel edit
          </button>
        ) : null}
      </div>

      <form className="note-form" onSubmit={onSubmit}>
        <label>
          <span>Title</span>
          <input
            name="title"
            placeholder="Sprint planning notes"
            value={noteForm.title}
            onChange={onNoteChange}
          />
        </label>

        <label>
          <span>Content</span>
          <textarea
            name="content"
            placeholder="Capture important details, action items, or reminders..."
            value={noteForm.content}
            onChange={onNoteChange}
          />
        </label>

        <div className="button-row">
          <button type="submit" disabled={isSavingNote}>
            {isSavingNote ? (isEditing ? "Saving..." : "Creating...") : isEditing ? "Save changes" : "Create note"}
          </button>
          <button
            className="secondary-button"
            type="button"
            onClick={onRefreshNotes}
            disabled={isNotesLoading}
          >
            {isNotesLoading ? "Refreshing..." : "Refresh notes"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default NoteComposer;
