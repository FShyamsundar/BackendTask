function AuthHero() {
  return (
    <section className="hero-panel">
      <div className="hero-content">
        <p className="eyebrow">Assignment Highlights</p>
        <h2>Polished frontend, protected routes, dependable CRUD.</h2>
        <p>
          This UI demonstrates registration, login, protected note access, validation feedback,
          and full create, read, update, and delete operations against the API.
        </p>

        <div className="hero-grid">
          <article>
            <strong>Authentication</strong>
            <span>JWT session persistence with protected dashboard access.</span>
          </article>
          <article>
            <strong>Security</strong>
            <span>Clear validation feedback and guarded note actions.</span>
          </article>
          <article>
            <strong>Scalability</strong>
            <span>Composable UI sections ready for new entities and modules.</span>
          </article>
        </div>
      </div>
    </section>
  );
}

export default AuthHero;
