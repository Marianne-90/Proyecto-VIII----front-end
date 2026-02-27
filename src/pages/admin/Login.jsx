export default function Login() {
  return (
    <section className="page">
      <div className="admin-card">
        <h1>Admin Login</h1>
        <p>Formulario de login (placeholder).</p>

        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span>Email</span>
            <input type="email" placeholder="admin@correo.com" />
          </label>

          <label className="field">
            <span>Password</span>
            <input type="password" placeholder="••••••••" />
          </label>

          <button className="btn" type="submit">
            Ingresar
          </button>
        </form>
      </div>
    </section>
  );
}