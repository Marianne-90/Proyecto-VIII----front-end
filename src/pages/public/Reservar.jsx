import { useId, useMemo, useState } from "react";

import MapaUsuario from "../../components/public/map";
import Seo from "../../components/seo/Seo.jsx";
import { useMarketingAttribution } from "../../hooks/useMarketingAttribution.js";
import {
  buildBreadcrumbSchema,
  buildRestaurantSchema,
  buildWebPageSchema,
} from "../../lib/seo.js";
import { trackEvent } from "../../services/marketing.js";

export default function Reservar() {
  const formId = useId();
  const [status, setStatus] = useState({ type: "idle", message: "" }); // idle | loading | success | error
  const [intent, setIntent] = useState("fiesta"); // fiesta | general
  const attribution = useMarketingAttribution();
  const seoDescription =
    "Reserva en La Nonnesa Pizza Party, pizzería en Ponferrada para eventos privados, comidas de grupo, cumpleaños y celebraciones.";

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

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data?.success) {
        setStatus({
          type: "success",
          message: "Hemos recibido tu solicitud. Te responderemos lo antes posible.",
        });
        trackEvent("generate_lead", { form_name: "reservas", intent });
        form.reset();
      } else {
        setStatus({
          type: "error",
          message: data?.message || "No hemos podido enviar tu solicitud. Revisa los datos e inténtalo de nuevo.",
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
      <Seo
        title="Reservas de pizzería en Ponferrada"
        description={seoDescription}
        path="/reservar"
        keywords={[
          "reservar pizzería Ponferrada",
          "reserva restaurante italiano Ponferrada",
          "eventos privados pizza",
          "cumpleaños pizzería Ponferrada",
          "celebraciones con pizza",
          "La Nonnesa reservas",
        ]}
        jsonLd={[
          buildRestaurantSchema(),
          buildWebPageSchema({
            title: "Reservas de pizzería en Ponferrada",
            description: seoDescription,
            path: "/reservar",
          }),
          buildBreadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: "Reservas", path: "/reservar" },
          ]),
        ]}
      />
      <div className="contact__wrap">
        <header className="contact__header">
          <span className="contact__badge">La Nonnesa Pizza Party</span>
          <h1 className="contact__title">Reservas en Ponferrada para cenas, grupos y eventos</h1>
          <p className="contact__subtitle">
            Organizamos cenas especiales, celebraciones y eventos privados para quienes buscan una pizzería en
            Ponferrada con cocina italiana y atención cercana.
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

        <section className="contact__booking" aria-label="Solicitud de reserva o consulta">
          <div className="contact__pitch">
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
                onClick={() => {
                  setIntent("fiesta");
                  trackEvent("reservation_intent_select", { intent: "fiesta" });
                }}
              >
                Reserva para evento privado
              </button>
              <button
                type="button"
                className={`pill ${intent === "general" ? "is-active" : ""}`}
                onClick={() => {
                  setIntent("general");
                  trackEvent("reservation_intent_select", { intent: "general" });
                }}
              >
                Consulta general
              </button>
            </div>
          </div>

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
                <a href="tel:987197706" onClick={() => trackEvent("phone_click", { page: "reservar", phone_type: "local" })}>987 19 77 06</a>
                <a href="tel:+34603161579" onClick={() => trackEvent("phone_click", { page: "reservar", phone_type: "pedidos" })}>603 16 15 79</a>
                <a href="tel:+34667811548" onClick={() => trackEvent("phone_click", { page: "reservar", phone_type: "alternativo" })}>667 81 15 48</a>
              </div>
            </div>

            <div className="contact__info-group">
              <span className="contact__info-label">Instagram</span>
              <a
                className="contact__instagram"
                href="https://www.instagram.com/la_nonesa_pizzaparty/"
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
              <input
                className="contact__hp"
                type="checkbox"
                name="botcheck"
                tabIndex="-1"
                autoComplete="off"
                hidden
                aria-hidden="true"
              />
              <input type="hidden" name="intent" value={intent} />
              <input
                type="hidden"
                name="subject"
                value={
                  intent === "fiesta"
                    ? "Reserva: Pizzería móvil para fiesta privada / cumpleaños"
                    : "Nuevo mensaje desde La Nonnesa Pizza Party"
                }
              />
              <input type="hidden" name="from_name" value="Web La Nonnesa" />
              {Object.entries(attribution).map(([key, value]) => (
                <input key={key} type="hidden" name={key} value={value || ""} />
              ))}

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
        </section>

        <section className="location-section contact__location" aria-label="Cómo llegar">
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
              href="https://maps.app.goo.gl/LZLkXmzETGS89LNM6"
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
