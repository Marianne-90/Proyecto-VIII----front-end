export default function Footer() {
  return (
    <footer className="public-footer">
      <div className="container public-footer__inner">
        <small>© {new Date().getFullYear()} La Nonnesa Pizza Party. Todos los derechos reservados.</small>
      </div>
    </footer>
  );
}