import { useId, useMemo, useState } from "react";

import img1 from "../../assets/img4.jpg";
import img2 from "../../assets/img3.jpg";
import img3 from "../../assets/img1.jpg";
import img4 from "../../assets/img2.jpg";

export default function Reservar() {
  const formId = useId();
  const [status, setStatus] = useState({ type: "idle", message: "" }); // idle | loading | success | error
  const [intent, setIntent] = useState("fiesta"); // fiesta | general

  // Para autocompletar el mensaje cuando el usuario elige “Fiesta privada”
  const defaultMessage = useMemo(() => {
    if (intent !== "fiesta") return "";
    return (
      "Hola, me gustaría reservar la pizzería móvil para una fiesta privada.\n\n" +
      "📅 Fecha:\n" +
      "🕒 Hora:\n" +
      "📍 Dirección:\n" +
      "👥 Nº de personas:\n" +
      "📞 Teléfono de contacto:\n" +
      "📝 Detalles (alergias, preferencias, etc.):\n"
    );
  }, [intent]);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status.type === "loading") return;

    setStatus({ type: "loading", message: "Enviando..." });

    const form = event.target;
    const formData = new FormData(form);

    formData.append("access_key", "ad8ad563-7098-431a-9a9c-d8160b4712e7");

    const subject =
      intent === "fiesta"
        ? "Reserva: Pizzería móvil para fiesta privada / cumpleaños"
        : "Nuevo mensaje desde La Nonnesa Pizza Party";

    formData.append("subject", subject);
    formData.append("from_name", "Web La Nonnesa");

    formData.append("type", intent);

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
        {/* HERO (impacto + CTA) */}
        <header className="contact__header">
          <span className="contact__badge">🍕 La Nonesa da Gabri</span>
          <h1 className="contact__title">Reserva y Contacto</h1>
          <p className="contact__subtitle">
            Food truck + local en Ponferrada. Reservas para fiestas privadas, cumpleaños y eventos.
          </p>
        </header>

        <div className="contact__media" aria-label="Galería La Nonesa da Gabri">
          <figure className="media__hero">
            <img
              src={img2}
              alt="Pizza artesanal recién horneada"
              loading="lazy"
            />
          </figure>

          <div className="media__stack">
            <figure className="media__item">
              <img src={img4} alt="Fachada del local en Ponferrada" loading="lazy" />
            </figure>
            <figure className="media__item">
              <img src={img1} alt="Interior del local" loading="lazy" />
            </figure>
            <figure className="media__item">
              <img src={img3} alt="Pizzería móvil en evento" loading="lazy" />
            </figure>
          </div>
        </div>

        {/* Texto “Fiestas privadas” fusionado */}
        <section className="contact__pitch" aria-label="Reserva de fiestas privadas">
          <h2 className="contact__pitch-title">Fiestas privadas y cumpleaños</h2>
          <p className="contact__pitch-text">
            Nos apasiona llevar la auténtica pizza italiana a cualquier evento o celebración que tengas en mente.
          </p>
          <p className="contact__pitch-text">
            ¿Estás planeando una fiesta privada o un cumpleaños y quieres sorprender a tus invitados con la mejor pizza
            italiana? ¡No te preocupes, nosotros te lo ponemos fácil!
          </p>
          <p className="contact__pitch-text">
            Descubre nuestro servicio de pizzería móvil: llevamos nuestro horno directamente a tu ubicación. Con masa
            artesanal, salsas caseras y una cuidadosa selección de ingredientes de alta calidad importados desde Italia,
            tus invitados se van a acordar de esta fiesta.
          </p>

          <div className="contact__pitch-cta">
            <button
              type="button"
              className={`pill ${intent === "fiesta" ? "is-active" : ""}`}
              onClick={() => setIntent("fiesta")}
            >
              🎉 Quiero reservar fiesta privada
            </button>
            <button
              type="button"
              className={`pill ${intent === "general" ? "is-active" : ""}`}
              onClick={() => setIntent("general")}
            >
              💬 Consulta general
            </button>
          </div>
        </section>

        {/* Info negocio */}
        <div className="contact__info">
          <h3 className="contact__info-title">La Nonesa da Gabri</h3>

          <p className="contact__info-text">🍕 Pizzería móvil (Food Truck) con local en Ponferrada</p>
          <p className="contact__info-text">📍 Zona Alta – C/ Obispo Osmundo Nº3</p>

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

        {/* Form */}
        <form className="contact__form" onSubmit={onSubmit} aria-describedby={`${formId}-status`}>
          <input className="contact__hp" type="text" name="botcheck" tabIndex="-1" autoComplete="off" />

          {/* Campo oculto para saber qué quería el usuario */}
          <input type="hidden" name="intent" value={intent} />

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
            <label className="field__label" htmlFor={`${formId}-phone`}>Teléfono (opcional)</label>
            <input
              id={`${formId}-phone`}
              className="field__control"
              type="tel"
              name="phone"
              placeholder="+34 6xx xxx xxx"
              autoComplete="tel"
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor={`${formId}-message`}>
              {intent === "fiesta" ? "Detalles de la reserva" : "Mensaje"}
            </label>

            <textarea
              id={`${formId}-message`}
              className="field__control field__control--textarea"
              name="message"
              placeholder={intent === "fiesta" ? "Cuéntanos los detalles para tu evento…" : "¿En qué podemos ayudarte?"}
              required
              minLength={10}
              rows={7}
              defaultValue={defaultMessage}
              key={intent} /* fuerza refresco del defaultValue al cambiar intent */
            />

            <p className="field__hint">
              {intent === "fiesta"
                ? "Incluye fecha, hora, dirección y número de personas para confirmarte disponibilidad."
                : "Responderemos lo antes posible."}
            </p>
          </div>

          <div className="contact__actions">
            <button className="btn btn--accent" type="submit" disabled={status.type === "loading"}>
              {status.type === "loading" ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Enviando…
                </>
              ) : intent === "fiesta" ? (
                "Solicitar reserva"
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