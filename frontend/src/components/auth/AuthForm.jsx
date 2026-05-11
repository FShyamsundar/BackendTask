function AuthForm({
  mode,
  authTitle,
  authDescription,
  authForm,
  isAuthLoading,
  onAuthChange,
  onSubmit,
  onToggleMode,
}) {
  return (
    <section className="auth-panel">
      <div className="auth-copy">
        <p className="eyebrow">{mode === "register" ? "New User" : "Login"}</p>
        <h2>{authTitle}</h2>
        <p>{authDescription}</p>
      </div>

      <form className="auth-form" onSubmit={onSubmit}>
        {mode === "register" ? (
          <label>
            <span>Full name</span>
            <input
              name="name"
              type="text"
              placeholder="Alex Johnson"
              value={authForm.name}
              onChange={onAuthChange}
            />
          </label>
        ) : null}

        <label>
          <span>Email address</span>
          <input
            name="email"
            type="email"
            placeholder="alex@example.com"
            value={authForm.email}
            onChange={onAuthChange}
          />
        </label>

        <label>
          <span>Password</span>
          <input
            name="password"
            type="password"
            placeholder="Minimum 6 characters"
            value={authForm.password}
            onChange={onAuthChange}
          />
        </label>

        <button type="submit" disabled={isAuthLoading}>
          {isAuthLoading
            ? mode === "register"
              ? "Creating account..."
              : "Signing in..."
            : mode === "register"
              ? "Register"
              : "Login"}
        </button>

        <button type="button" className="ghost-button" onClick={onToggleMode}>
          {mode === "register" ? "Already have an account? Login" : "Need an account? Register"}
        </button>
      </form>
    </section>
  );
}

export default AuthForm;
