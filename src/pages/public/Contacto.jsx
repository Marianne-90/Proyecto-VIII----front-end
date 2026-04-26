import { useEffect, useId, useState } from "react";
import { useLocation } from "react-router-dom";
import MapaUsuario from "../../components/public/map";
import Seo from "../../components/seo/Seo.jsx";
import { useMarketingAttribution } from "../../hooks/useMarketingAttribution.js";
import {
  buildBreadcrumbSchema,
  buildRestaurantSchema,
  buildWebPageSchema,
} from "../../lib/seo.js";
import { trackEvent } from "../../services/marketing.js";

export default function Contacto() {
  const formId = useId();
  const location = useLocation();
  const [status, setStatus] = useState({ type: "idle", message: "" }); // idle | loading | success | error
  const attribution = useMarketingAttribution();
  const seoDescription =
    "Contacta con La Nonnesa Pizza Party, tu pizzería en Ponferrada, para reservas, grupos, pedidos especiales y eventos privados.";

  useEffect(() => {
    if (location.hash !== "#como-llegar") return;

    const node = document.getElementById("como-llegar");
    if (!node) return;

    requestAnimationFrame(() => {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash]);

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
          message: "Hemos recibido tu mensaje. Te responderemos lo antes posible.",
        });
        trackEvent("generate_lead", { form_name: "contacto", intent: "general" });
        form.reset();
      } else {
        setStatus({
          type: "error",
          message: data?.message || "No hemos podido enviar el mensaje. Revisa los datos e inténtalo de nuevo.",
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
        title="Contacto de pizzería en Ponferrada"
        description={seoDescription}
        path="/contacto"
        keywords={[
          "contacto pizzería Ponferrada",
          "reservas Ponferrada pizza",
          "teléfono pizzería Ponferrada",
          "dónde está La Nonnesa",
          "ubicación La Nonnesa",
          "pedidos pizza Ponferrada",
          "eventos privados Ponferrada",
        ]}
        jsonLd={[
          buildRestaurantSchema(),
          buildWebPageSchema({
            title: "Contacto de pizzería en Ponferrada",
            description: seoDescription,
            path: "/contacto",
          }),
          buildBreadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: "Contacto", path: "/contacto" },
          ]),
        ]}
      />
      <div className="contact__wrap">
        <header className="contact__header">
          <span className="contact__badge">La Nonnesa Pizza Party</span>
          <h1 className="contact__title">Contacto de La Nonnesa en Ponferrada</h1>
          <p className="contact__subtitle">
            Si buscas una pizzería en Ponferrada para reservar, pedir información o preparar una celebración, estamos
            encantados de ayudarte.
          </p>
        </header>
        <div className="contact__hero-grid">
          <div className="contact__hero-copy">
            <div className="contact__eyebrow">Estamos en Ponferrada</div>
            <h2 className="contact__section-title">Un equipo cercano para resolver cualquier duda</h2>
            <p className="contact__lead">
              Te atendemos para consultas sobre reservas, grupos, horarios, pedidos especiales o eventos en el restaurante.
            </p>

            <div className="contact__feature-list">
              <article className="contact__feature">
                <h3>Atención directa</h3>
                <p>Puedes escribirnos desde la web o llamarnos para resolver dudas de forma rápida.</p>
              </article>
              <article className="contact__feature">
                <h3>Reservas de grupo</h3>
                <p>Si vienes con familia, amigos o una celebración, te orientamos según disponibilidad.</p>
              </article>
              <article className="contact__feature">
                <h3>Ubicación clara</h3>
                <p>Estamos en la Zona Alta de Ponferrada, en un entorno cómodo para comidas y cenas con calma.</p>
              </article>
            </div>
          </div>

          <aside className="contact__aside-card">
            <h3>Información útil</h3>
            <ul className="contact__checklist">
              <li>Consultas sobre reservas y grupos</li>
              <li>Horario y disponibilidad</li>
              <li>Pedidos especiales</li>
              <li>Eventos y celebraciones</li>
            </ul>
          </aside>
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
                <a href="tel:987197706" onClick={() => trackEvent("phone_click", { page: "contacto", phone_type: "local" })}>987 19 77 06</a>
                <a href="tel:+34603161579" onClick={() => trackEvent("phone_click", { page: "contacto", phone_type: "pedidos" })}>603 16 15 79</a>
                <a href="tel:+34667811548" onClick={() => trackEvent("phone_click", { page: "contacto", phone_type: "alternativo" })}>667 81 15 48</a>
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
              Si tu mensaje es sobre una reserva, indícanos el día, la hora y el número de personas para ayudarte mejor.
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
            <input type="hidden" name="subject" value="Nuevo mensaje desde La Nonnesa Pizza Party" />
            <input type="hidden" name="from_name" value="Web La Nonnesa" />
            {Object.entries(attribution).map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={value || ""} />
            ))}

            <div className="contact__form-intro">
              <h3>Envíanos tu consulta</h3>
              <p>Te responderemos por correo o por teléfono con la mayor brevedad posible.</p>
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
              <label className="field__label" htmlFor={`${formId}-message`}>Mensaje</label>
              <textarea
                id={`${formId}-message`}
                className="field__control field__control--textarea"
                name="message"
                placeholder="Cuéntanos en qué podemos ayudarte."
                required
                minLength={10}
                rows={6}
              />
              <p className="field__hint">Si es una reserva, añade fecha, hora y número de comensales.</p>
            </div>

            <div className="contact__actions">
              <button className="btn btn--accent" type="submit" disabled={status.type === "loading"}>
                {status.type === "loading" ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    Enviando…
                  </>
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

        <section id="como-llegar" className="location-section" aria-label="Cómo llegar">
          <div className="location-section__copy">
            <span className="location-section__eyebrow">Cómo llegar</span>
            <h2>Te esperamos en nuestro local de Ponferrada</h2>
            <p>
              Si quieres visitarnos, encontrarnos es muy sencillo. Estamos en la Zona Alta, en la calle Obispo
              Osmundo, 3, en una ubicación céntrica y cómoda para venir con calma.
            </p>
            <p>
              Puedes abrir la ruta directamente desde Google Maps o llamarnos antes si necesitas una indicación más
              concreta.
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
              onClick={() => trackEvent("map_open", { page: "contacto" })}
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
