import { useId, useMemo, useState } from "react";

import img1 from "../../assets/img4.jpg";
import img2 from "../../assets/img3.jpg";
import img3 from "../../assets/img1.jpg";
import img4 from "../../assets/img2.jpg";
import MapaUsuario from "../../components/public/map";

export default function Reservar() {
  const formId = useId();
  const [status, setStatus] = useState({ type: "idle", message: "" }); // idle | loading | success | error
  const [intent, setIntent] = useState("fiesta"); // fiesta | general

  // Para autocompletar el mensaje cuando el usuario elige “Fiesta privada”
  const defaultMessage = useMemo(() => {
    if (intent !== "fiesta") return "";
    return (
      "Hola, me gustaría reservar la pizzería para un evento privado.\n\n" +
      "Fecha del evento:\n" +
      "Hora aproximada:\n" +
      "Dirección:\n" +
      "Número de personas:\n" +
      "Teléfono de contacto:\n" +
      "Detalles adicionales:\n"
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
          message: "Hemos recibido tu solicitud. Te responderemos lo antes posible.",
        });
        form.reset();
      } else {
        setStatus({
          type: "error",
          message: "No hemos podido enviar tu solicitud. Revisa los datos e inténtalo de nuevo.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message: "Ha habido un problema de conexión. Inténtalo más tarde.",
      });
    }
  };

  return (
    <section className="contact">
      <div className="contact__wrap">
        <header className="contact__header">
          <span className="contact__badge">La Nonnesa Pizza Party</span>
          <h1 className="contact__title">Reservas y eventos con sabor italiano</h1>
          <p className="contact__subtitle">
            Organizamos cenas especiales, celebraciones y eventos privados con nuestra cocina italiana y un servicio cercano.
          </p>
        </header>

        <div className="contact__hero-grid">
          <div className="contact__hero-copy">
            <div className="contact__eyebrow">Reservar en La Nonnesa Pizza Party</div>
            <h2 className="contact__section-title">Una reserva pensada para disfrutar sin prisas</h2>
            <p className="contact__lead">
              Tanto si estás organizando una comida familiar como una celebración especial, queremos que el proceso sea sencillo y claro desde el primer momento.
            </p>

            <div className="contact__feature-list">
              <article className="contact__feature">
                <h3>Eventos a medida</h3>
                <p>Nos adaptamos al número de invitados, al formato del encuentro y a las necesidades del servicio.</p>
              </article>
              <article className="contact__feature">
                <h3>Producto artesano</h3>
                <p>Masa reposada, ingredientes de calidad y una propuesta cuidada para celebraciones con identidad propia.</p>
              </article>
              <article className="contact__feature">
                <h3>Respuesta rápida</h3>
                <p>Cuéntanos la idea general y te confirmaremos disponibilidad, opciones y siguientes pasos.</p>
              </article>
            </div>
          </div>

          <aside className="contact__aside-card">
            <h3>Qué conviene indicarnos</h3>
            <ul className="contact__checklist">
              <li>Fecha aproximada del evento</li>
              <li>Número de personas</li>
              <li>Lugar de celebración</li>
              <li>Horario previsto</li>
              <li>Preferencias o necesidades alimentarias</li>
            </ul>
          </aside>
        </div>

        <div className="contact__media" aria-label="Galería de La Nonnesa Pizza Party">
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

        <section className="contact__pitch" aria-label="Tipos de solicitud">
          <div className="contact__pitch-copy">
            <h2 className="contact__pitch-title">Cuéntanos qué necesitas</h2>
            <p className="contact__pitch-text">
              Puedes escribirnos para una reserva especial, una celebración privada o una consulta general sobre horarios, grupos y disponibilidad.
            </p>
          </div>

          <div className="contact__pitch-cta">
            <button
              type="button"
              className={`pill ${intent === "fiesta" ? "is-active" : ""}`}
              onClick={() => setIntent("fiesta")}
            >
              Reserva para evento privado
            </button>
            <button
              type="button"
              className={`pill ${intent === "general" ? "is-active" : ""}`}
              onClick={() => setIntent("general")}
            >
              Consulta general
            </button>
          </div>
        </section>

        <div className="contact__content-grid">
          <div className="contact__info">
            <h3 className="contact__info-title">La Nonnesa Pizza Party</h3>

            <div className="contact__info-group">
              <span className="contact__info-label">Dirección</span>
              <p className="contact__info-text">Zona Alta, calle Obispo Osmundo, 3. Ponferrada.</p>
            </div>

            <div className="contact__info-group">
              <span className="contact__info-label">Teléfono</span>
              <div className="contact__phones">
                <a href="tel:987197706">987 19 77 06</a>
                <a href="tel:+34603161579">603 16 15 79</a>
                <a href="tel:+34667811548">667 81 15 48</a>
              </div>
            </div>

            <div className="contact__info-group">
              <span className="contact__info-label">Instagram</span>
              <a
                className="contact__instagram"
                href="https://instagram.com/pizza_gabri"
                target="_blank"
                rel="noopener noreferrer"
              >
                @pizza_gabri
              </a>
            </div>

            <div className="contact__info-note">
              Para reservas de grupo o celebraciones, te recomendamos escribirnos con algo de antelación.
            </div>
          </div>

          <form className="contact__form" onSubmit={onSubmit} aria-describedby={`${formId}-status`}>
            <input className="contact__hp" type="text" name="botcheck" tabIndex="-1" autoComplete="off" />
            <input type="hidden" name="intent" value={intent} />

            <div className="contact__form-intro">
              <h3>Escríbenos</h3>
              <p>
                Déjanos tus datos y te responderemos con la mayor brevedad posible.
              </p>
            </div>

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
                <label className="field__label" htmlFor={`${formId}-email`}>Correo electrónico</label>
                <input
                  id={`${formId}-email`}
                  className="field__control"
                  type="email"
                  name="email"
                  placeholder="tucorreo@ejemplo.es"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="field">
              <label className="field__label" htmlFor={`${formId}-phone`}>Teléfono</label>
              <input
                id={`${formId}-phone`}
                className="field__control"
                type="tel"
                name="phone"
                placeholder="600 123 123"
                autoComplete="tel"
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor={`${formId}-message`}>
                {intent === "fiesta" ? "Detalles de la reserva" : "Tu mensaje"}
              </label>

              <textarea
                id={`${formId}-message`}
                className="field__control field__control--textarea"
                name="message"
                placeholder={intent === "fiesta" ? "Cuéntanos el tipo de celebración y los datos principales del evento." : "Escribe aquí tu consulta."}
                required
                minLength={10}
                rows={7}
                defaultValue={defaultMessage}
                key={intent}
              />

              <p className="field__hint">
                {intent === "fiesta"
                  ? "Indícanos fecha, horario aproximado, dirección y número de asistentes."
                  : "Te responderemos por correo o por teléfono lo antes posible."}
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
                  "Enviar consulta"
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

        <section className="location-section" aria-label="Cómo llegar">
          <div className="location-section__copy">
            <span className="location-section__eyebrow">Cómo llegar</span>
            <h2>Ven a vernos o planifica tu visita con antelación</h2>
            <p>
              Si quieres pasar por el local, estamos en la Zona Alta de Ponferrada, en la calle Obispo Osmundo, 3.
              También puedes usar esta referencia para recoger pedidos o concretar detalles antes de una reserva.
            </p>
            <p>
              Si te resulta más cómodo, abre directamente la ubicación en Google Maps y tendrás la ruta lista desde tu
              punto de salida.
            </p>

            <div className="location-section__meta">
              <span>La Nonnesa Pizza Party</span>
              <span>Calle Obispo Osmundo, 3 · Ponferrada</span>
            </div>

            <a
              className="location-section__link"
              href="https://share.google/Xzj0EXY84Vgq1Uymh"
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir en Google Maps
            </a>
          </div>

          <div className="location-section__map">
            <MapaUsuario />
          </div>
        </section>
      </div>
    </section>
  );
}
