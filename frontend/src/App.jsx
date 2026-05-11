import { useEffect, useState } from "react";
import AuthForm from "./components/auth/AuthForm";
import AuthHero from "./components/auth/AuthHero";
import LoadingPanel from "./components/common/LoadingPanel";
import MessageBanner from "./components/common/MessageBanner";
import DashboardOverview from "./components/dashboard/DashboardOverview";
import NoteComposer from "./components/dashboard/NoteComposer";
import NotesPanel from "./components/dashboard/NotesPanel";
import AppHeader from "./components/layout/AppHeader";
import { authInitial, emptyAdminSelection, noteInitial } from "./constants/appState";
import api from "./services/api";
import { getErrorMessage } from "./utils/errors";
import { getStoredUser } from "./utils/storage";

function App() {
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(getStoredUser);
  const [authForm, setAuthForm] = useState(authInitial);
  const [noteForm, setNoteForm] = useState(noteInitial);
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(localStorage.getItem("token")));
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isNotesLoading, setIsNotesLoading] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedAdminUser, setSelectedAdminUser] = useState(emptyAdminSelection);
  const [selectedUserNotes, setSelectedUserNotes] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isSelectedUserNotesLoading, setIsSelectedUserNotesLoading] = useState(false);
  const [pendingUserDeleteId, setPendingUserDeleteId] = useState(null);

  useEffect(() => {
    if (!token) {
      setIsBootstrapping(false);
      return;
    }

    fetchNotes();
  }, [token]);

  const resetNoteComposer = () => {
    setNoteForm(noteInitial);
    setActiveNoteId(null);
    setIsEditing(false);
  };

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
  };

  const clearSession = () => {
    setToken(null);
    setUser(null);
    setNotes([]);
    setUsers([]);
    setSelectedAdminUser(emptyAdminSelection);
    setSelectedUserNotes([]);
    resetNoteComposer();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const persistSession = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(nextUser));
  };

  const handleAuthChange = ({ target }) => {
    setAuthForm((current) => ({ ...current, [target.name]: target.value }));
  };

  const handleNoteChange = ({ target }) => {
    setNoteForm((current) => ({ ...current, [target.name]: target.value }));
  };

  const fetchNotes = async () => {
    setIsNotesLoading(true);

    try {
      const result = await api.get("/notes");
      setNotes(result.data.notes);
      setMode("dashboard");
    } catch (error) {
      if (error.response?.status === 401) {
        clearSession();
        setMode("login");
      }
      showMessage(getErrorMessage(error, "Unable to load notes"), "error");
    } finally {
      setIsNotesLoading(false);
      setIsBootstrapping(false);
    }
  };

  const fetchUsers = async () => {
    if (user?.role !== "admin") return;

    setIsUsersLoading(true);

    try {
      const result = await api.get("/users");
      setUsers(result.data.users);
    } catch (error) {
      showMessage(getErrorMessage(error, "Unable to load users"), "error");
    } finally {
      setIsUsersLoading(false);
    }
  };

  const fetchUserNotes = async (selectedUserId, selectedUserName) => {
    if (!selectedUserId || user?.role !== "admin") return;

    setSelectedAdminUser({ userId: selectedUserId, userName: selectedUserName });
    setIsSelectedUserNotesLoading(true);

    try {
      const result = await api.get(`/users/${selectedUserId}/notes`);
      setSelectedUserNotes(result.data.notes);
    } catch (error) {
      showMessage(getErrorMessage(error, "Unable to load user notes"), "error");
    } finally {
      setIsSelectedUserNotesLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === "admin") {
      fetchUsers();
    }
  }, [token, user?.role]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsAuthLoading(true);
    setMessage(null);

    try {
      const result = await api.post("/auth/login", {
        email: authForm.email,
        password: authForm.password,
      });

      persistSession(result.data.token, result.data.user);
      setAuthForm(authInitial);
      setMode("dashboard");
      showMessage("Login successful. Your dashboard is ready.", "success");
    } catch (error) {
      showMessage(getErrorMessage(error, "Login failed"), "error");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setIsAuthLoading(true);
    setMessage(null);

    try {
      const result = await api.post("/auth/register", {
        ...authForm,
        role: "user",
      });

      persistSession(result.data.token, result.data.user);
      setAuthForm(authInitial);
      setMode("dashboard");
      showMessage("Registration successful. You can start creating notes now.", "success");
    } catch (error) {
      showMessage(getErrorMessage(error, "Registration failed"), "error");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    setMode("login");
    showMessage("You have been logged out.", "info");
  };

  const handleNoteSubmit = async (event) => {
    event.preventDefault();
    setIsSavingNote(true);
    setMessage(null);

    try {
      if (isEditing && activeNoteId) {
        const result = await api.put(`/notes/${activeNoteId}`, noteForm);
        setNotes((current) =>
          current.map((note) => (note._id === activeNoteId ? result.data.note : note)),
        );
        setSelectedUserNotes((current) =>
          current.map((note) => (note._id === activeNoteId ? result.data.note : note)),
        );
        showMessage("Note updated successfully.", "success");
      } else {
        const result = await api.post("/notes", noteForm);
        setNotes((current) => [result.data.note, ...current]);
        setUsers((current) =>
          current.map((entry) =>
            entry.id === result.data.note.owner?._id
              ? { ...entry, noteCount: entry.noteCount + 1 }
              : entry,
          ),
        );
        showMessage("Note created successfully.", "success");
      }

      resetNoteComposer();
    } catch (error) {
      showMessage(getErrorMessage(error, "Unable to save note"), "error");
    } finally {
      setIsSavingNote(false);
    }
  };

  const startEditing = (note) => {
    setActiveNoteId(note._id);
    setIsEditing(true);
    setNoteForm({
      title: note.title,
      content: note.content,
    });
    setMessage(null);
  };

  const handleDelete = async (id) => {
    setPendingDeleteId(id);
    setMessage(null);
    const targetNote = notes.find((note) => note._id === id);

    try {
      await api.delete(`/notes/${id}`);
      setNotes((current) => current.filter((note) => note._id !== id));
      setSelectedUserNotes((current) => current.filter((note) => note._id !== id));
      setUsers((current) =>
        current.map((entry) =>
          entry.id === targetNote?.owner?._id
            ? { ...entry, noteCount: Math.max(0, entry.noteCount - 1) }
            : entry,
        ),
      );

      if (activeNoteId === id) {
        resetNoteComposer();
      }

      showMessage("Note deleted successfully.", "success");
    } catch (error) {
      showMessage(getErrorMessage(error, "Unable to delete note"), "error");
    } finally {
      setPendingDeleteId(null);
    }
  };

  const handleDeleteUser = async (targetUser) => {
    setPendingUserDeleteId(targetUser.id);
    setMessage(null);

    try {
      await api.delete(`/users/${targetUser.id}`);
      setUsers((current) => current.filter((entry) => entry.id !== targetUser.id));
      setNotes((current) => current.filter((note) => note.owner?._id !== targetUser.id));

      if (selectedAdminUser.userId === targetUser.id) {
        setSelectedAdminUser(emptyAdminSelection);
        setSelectedUserNotes([]);
      }

      showMessage(`Deleted ${targetUser.name} and all of their notes.`, "success");
    } catch (error) {
      showMessage(getErrorMessage(error, "Unable to delete user"), "error");
    } finally {
      setPendingUserDeleteId(null);
    }
  };

  const displayedNotes =
    user?.role === "admin" && selectedAdminUser.userId ? selectedUserNotes : notes;

  const authTitle = mode === "register" ? "Create your account" : "Welcome back";
  const authDescription =
    mode === "register"
      ? "Register a secure user account and jump straight into the protected dashboard."
      : "Sign in with your JWT-backed account to manage notes inside the protected API workspace.";

  return (
    <div className="page-shell">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />

      <div className="app-shell">
        <AppHeader token={token} user={user} onLogout={handleLogout} />
        <MessageBanner message={message} />

        {isBootstrapping ? <LoadingPanel text="Restoring your session and loading notes..." /> : null}

        {!token && !isBootstrapping ? (
          <main className="auth-layout">
            <AuthHero />
            <AuthForm
              mode={mode}
              authTitle={authTitle}
              authDescription={authDescription}
              authForm={authForm}
              isAuthLoading={isAuthLoading}
              onAuthChange={handleAuthChange}
              onSubmit={mode === "register" ? handleRegister : handleLogin}
              onToggleMode={() => {
                setMode((current) => (current === "login" ? "register" : "login"));
                setMessage(null);
              }}
            />
          </main>
        ) : null}

        {token && mode === "dashboard" && !isBootstrapping ? (
          <main className="dashboard-layout">
            <DashboardOverview
              user={user}
              notesCount={notes.length}
              usersCount={users.length}
              isEditing={isEditing}
            />

            <section className="workspace-grid">
              <NoteComposer
                isEditing={isEditing}
                noteForm={noteForm}
                isSavingNote={isSavingNote}
                isNotesLoading={isNotesLoading}
                onNoteChange={handleNoteChange}
                onSubmit={handleNoteSubmit}
                onCancelEdit={resetNoteComposer}
                onRefreshNotes={fetchNotes}
              />

              <NotesPanel
                user={user}
                displayedNotes={displayedNotes}
                activeNoteId={activeNoteId}
                selectedAdminUser={selectedAdminUser}
                users={users}
                isUsersLoading={isUsersLoading}
                isNotesLoading={isNotesLoading}
                isSelectedUserNotesLoading={isSelectedUserNotesLoading}
                pendingDeleteId={pendingDeleteId}
                pendingUserDeleteId={pendingUserDeleteId}
                onRefreshUsers={fetchUsers}
                onShowAllNotes={() => {
                  setSelectedAdminUser(emptyAdminSelection);
                  setSelectedUserNotes([]);
                }}
                onViewUserNotes={fetchUserNotes}
                onDeleteUser={handleDeleteUser}
                onEditNote={startEditing}
                onDeleteNote={handleDelete}
              />
            </section>
          </main>
        ) : null}
      </div>
    </div>
  );
}

export default App;
