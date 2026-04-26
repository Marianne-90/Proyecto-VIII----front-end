export default function Footer() {
  return (
    <footer className="public-footer">
      <div className="container public-footer__inner">
        <small>
          © {new Date().getFullYear()} La Nonnesa Pizza Party. Pizza italiana en Ponferrada, Calle Obispo Osmundo, 3.
          Teléfono: <a href="tel:+34987197706">987 19 77 06</a>.
        </small>
      </div>
    </footer>
  );
}
