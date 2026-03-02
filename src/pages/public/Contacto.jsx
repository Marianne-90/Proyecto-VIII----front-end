import { useId, useState } from "react";

export default function Contacto() {
  const formId = useId();
  const [status, setStatus] = useState({ type: "idle", message: "" }); // idle | loading | success | error

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status.type === "loading") return;

    setStatus({ type: "loading", message: "Enviando..." });

    const form = event.target;
    const formData = new FormData(form);
    formData.append("access_key", "ad8ad563-7098-431a-9a9c-d8160b4712e7");

    // Opcional (mejor para Web3Forms): asunto + origen
    formData.append("subject", "Nuevo mensaje desde La Nonnesa Pizza Party");
    formData.append("from_name", "Web La Nonnesa");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data?.success) {
        setStatus({
          type: "success",
          message: "✅ Mensaje enviado. Te responderemos en breve.",
        });
        form.reset();
      } else {
        setStatus({
          type: "error",
          message: "❌ No se pudo enviar. Revisa los datos e intenta de nuevo.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message: "⚠️ Error de conexión. Intenta más tarde.",
      });
    }
  };

  return (
    <section className="contact">
      <div className="contact__wrap">
        <header className="contact__header">
          <span className="contact__badge">🍕 La Nonnesa</span>
          <h1 className="contact__title">Contacto</h1>
          <p className="contact__subtitle">
            Reservas, catering o preguntas: escríbenos y te respondemos pronto.
          </p>
        </header>
        <div className="contact__info">
          <h3 className="contact__info-title">La Nonesa da Gabri</h3>

          <p className="contact__info-text">
            🍕 Pizzería móvil (Food Truck) con local en Ponferrada
          </p>

          <p className="contact__info-text">
            📍 Zona Alta – C/ Obispo Osmundo Nº3
          </p>

          <div className="contact__phones">
            <a href="tel:987197706">📞 987 19 77 06</a>
            <a href="tel:+34603161579">📱 +34 603 16 15 79</a>
            <a href="tel:+34667811548">📱 +34 667 81 15 48</a>
          </div>

          <a
            className="contact__instagram"
            href="https://instagram.com/pizza_gabri"
            target="_blank"
            rel="noopener noreferrer"
          >
            📸 @pizza_gabri
          </a>
        </div>
        <form className="contact__form" onSubmit={onSubmit} aria-describedby={`${formId}-status`}>
          {/* Campo honeypot anti-spam (oculto) */}
          <input className="contact__hp" type="text" name="botcheck" tabIndex="-1" autoComplete="off" />

          <div className="contact__grid">
            <div className="field">
              <label className="field__label" htmlFor={`${formId}-name`}>Nombre</label>
              <input
                id={`${formId}-name`}
                className="field__control"
                type="text"
                name="name"
                placeholder="Tu nombre"
                required
                minLength={2}
                autoComplete="name"
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor={`${formId}-email`}>Email</label>
              <input
                id={`${formId}-email`}
                className="field__control"
                type="email"
                name="email"
                placeholder="tucorreo@email.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor={`${formId}-message`}>Mensaje</label>
            <textarea
              id={`${formId}-message`}
              className="field__control field__control--textarea"
              name="message"
              placeholder="¿En qué podemos ayudarte?"
              required
              minLength={10}
              rows={5}
            />
            <p className="field__hint">Tip: incluye fecha, hora y número de personas si es reserva.</p>
          </div>

          <div className="contact__actions">
            <button className="btn btn--accent" type="submit" disabled={status.type === "loading"}>
              {status.type === "loading" ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Enviando…
                </>
              ) : (
                "Enviar mensaje"
              )}
            </button>

            <p
              id={`${formId}-status`}
              className={`form-status form-status--${status.type}`}
              role="status"
              aria-live="polite"
            >
              {status.message}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}