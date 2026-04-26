import img1 from "../../assets/img1.jpg";
import homebanner from "../../assets/homebanner1.png";
import img3 from "../../assets/img15.png";
import img17 from "../../assets/img17.png";
import img4 from "../../assets/img4.jpg";
import img5 from "../../assets/img5.jpeg";
import gabryevento from "../../assets/gabryevento.png";
import MapaUsuario from "../../components/public/map";
import Seo from "../../components/seo/Seo.jsx";
import {
  buildBreadcrumbSchema,
  buildRestaurantSchema,
  buildWebSiteSchema,
  buildWebPageSchema,
} from "../../lib/seo.js";
import { trackEvent } from "../../services/marketing.js";

export default function Home() {
  const seoDescription =
    "La Nonnesa Pizza Party es tu pizzería en Ponferrada para comer pizza italiana artesanal, pedir a domicilio o reservar para eventos y celebraciones.";

  return (
    <section className="editorial-home">
      <Seo
        title="Pizzería en Ponferrada con pizza italiana artesanal"
        description={seoDescription}
        path="/"
        keywords={[
          "pizzería en Ponferrada",
          "pizza italiana Ponferrada",
          "mejor pizza Ponferrada",
          "dónde comer pizza en Ponferrada",
          "reservar pizzería Ponferrada",
          "eventos con pizza Ponferrada",
          "La Nonnesa Pizza Party",
        ]}
        jsonLd={[
          buildWebSiteSchema(),
          buildRestaurantSchema(),
          buildWebPageSchema({
            title: "Pizzería en Ponferrada con pizza italiana artesanal",
            description: seoDescription,
            path: "/",
          }),
          buildBreadcrumbSchema([{ name: "Inicio", path: "/" }]),
        ]}
      />
      <div className="editorial-home__wrap">
        <header className="editorial-home__hero">
          <div className="editorial-home__intro">
            <span className="editorial-home__badge">La Nonnesa Pizza Party</span>
            <h1 className="editorial-home__title">
              Pizza italiana con alma de barrio y espíritu de celebración
            </h1>
            <p className="editorial-home__lead">
              Pizzería móvil y local en Ponferrada. Una propuesta artesanal nacida para llevar el sabor de Italia
              a celebraciones, encuentros y mesas donde se viene a disfrutar sin prisas.
            </p>

            <div className="editorial-home__meta">
              <span>Zona Alta, calle Obispo Osmundo, 3</span>
              <a href="tel:987197706" className="editorial-home__meta-link">987 19 77 06</a>
              <a href="tel:+34603161579" className="editorial-home__meta-link">Pedidos: 603 16 15 79</a>
              <a href="tel:+34667811548" className="editorial-home__meta-link">667 81 15 48</a>
            </div>

            <div className="editorial-home__actions">
              <a
                href="/contacto#como-llegar"
                className="editorial-home__cta editorial-home__cta--primary"
                onClick={() => trackEvent("cta_click", { cta_name: "como_llegar_home", page: "home" })}
              >
                Cómo llegar
              </a>
            </div>
          </div>

          <div className="editorial-home__collage">
            <figure className="editorial-home__photo editorial-home__photo--large">
              <img src={img17} alt="Pizza italiana recién salida del horno" loading="lazy" />
            </figure>
            <figure className="editorial-home__photo">
              <img src={homebanner} alt="Exterior del local" loading="lazy" />
            </figure>
            <figure className="editorial-home__photo">
              <img src={img1} alt="Ambiente interior del restaurante" loading="lazy" />
            </figure>
          </div>
        </header>

        <section className="editorial-home__story">
          <div className="editorial-home__story-copy">
            <span className="editorial-home__eyebrow">Nuestra propuesta</span>
            <h2>Una pizzería pensada para quedarse en la memoria</h2>
            <p>
              La Nonnesa Pizza Party combina local y servicio para eventos en Ponferrada con una idea clara: servir
              pizza italiana de verdad, con ingredientes seleccionados e importados desde Italia y una elaboración
              artesanal que se nota en cada bocado.
            </p>
            <p>
              Nuestro equipo trabaja para quienes buscan dónde cenar pizza en Ponferrada, organizar una comida de
              grupo o reservar una propuesta distinta para una celebración especial.
            </p>
            <p>
              Elaboramos pizzas al estilo tonda, de perfil clásico, pensadas para compartir. La idea es sencilla:
              ofrecer una de las experiencias de pizza italiana más cuidadas de Ponferrada, tanto en el local como en
              eventos privados.
            </p>
          </div>

          <aside className="editorial-home__story-card">
            <figure className="editorial-home__story-card-media">
              <img src={img5} alt="Pizza italiana servida en mesa" loading="lazy" />
            </figure>
            <h3>Lo que define a La Nonnesa</h3>
            <ul className="editorial-home__list">
              <li>Recetas inspiradas en la tradición italiana</li>
              <li>Ingredientes de alta calidad seleccionados con mimo</li>
              <li>Formato flexible para local, eventos y celebraciones</li>
              <li>Servicio cercano y atención personalizada</li>
            </ul>
          </aside>
        </section>

        <section className="editorial-home__articles" aria-label="Entradas destacadas">
          <div className="editorial-home__section-head">
            <span className="editorial-home__eyebrow">Entradas</span>
            <h2>Una historia contada entre horno, carretera y local propio</h2>
          </div>

          <div className="editorial-home__grid">
            <article className="editorial-card editorial-card--feature">
              <figure className="editorial-card__media editorial-card__media--tall">
                <img src={gabryevento} alt="Pizza artesanal preparada para un evento" loading="lazy" />
              </figure>
              <div className="editorial-card__body">
                <span className="editorial-card__kicker">Nosotros</span>
                <h3>Pizza italiana para celebraciones, cenas y eventos en Ponferrada</h3>
                <p>
                  Nos enorgullece preparar pizzas con una base artesanal, salsas cuidadas e ingredientes italianos
                  escogidos para ofrecer una experiencia gastronómica honesta y memorable.
                </p>
                <p>
                  Si estás organizando un cumpleaños, una reunión especial o una cena familiar en Ponferrada,
                  podemos llevar nuestra propuesta para convertir ese encuentro en algo todavía más especial.
                </p>
                <a href="/contacto" className="editorial-card__link">
                  Contacto
                </a>
              </div>
            </article>

            <article className="editorial-card">
              <figure className="editorial-card__media">
                <img src={img4} alt="Vista del local de La Nonnesa Pizza Party" loading="lazy" />
              </figure>
              <div className="editorial-card__body">
                <span className="editorial-card__kicker">Ponferrada</span>
                <h3>Nuestro local en la Zona Alta de Ponferrada</h3>
                <p>
                  La aventura sobre ruedas encontró también su sitio fijo en Ponferrada, en un espacio pensado para
                  disfrutar de la pizza con una atmósfera cercana y tranquila.
                </p>
                <a href="/contacto" className="editorial-card__link">
                  Ver más detalles
                </a>
              </div>
            </article>

            <article className="editorial-card">
              <figure className="editorial-card__media">
                <img src={img1} alt="Interior del restaurante" loading="lazy" />
              </figure>
              <div className="editorial-card__body">
                <span className="editorial-card__kicker">Trayectoria</span>
                <h3>Del éxito en la food truck a ponerle casa al horno</h3>
                <p>
                  Tras recorrer diferentes eventos y consolidar una clientela fiel, La Nonnesa dio un paso más con la
                  apertura de un local en Ponferrada para seguir creciendo sin perder su carácter original.
                </p>
                <a href="/reservar" className="editorial-card__link">
                  Solicitar una reserva
                </a>
              </div>
            </article>
          </div>
        </section>

        <section className="editorial-home__quote">
          <div className="editorial-home__quote-photo">
            <img src={img3} alt="Detalle de pizza italiana con ingredientes frescos" loading="lazy" />
          </div>
          <blockquote className="editorial-home__quote-copy">
            <p>
              “La auténtica pizza italiana es nuestra pasión: llevarla a una celebración, a una cena especial o a una
              mesa de Ponferrada es nuestra forma de compartirla.”
            </p>
            <footer>La Nonnesa Pizza Party</footer>
          </blockquote>
        </section>

        <section className="location-section" aria-label="Cómo llegar">
          <div className="location-section__copy">
            <span className="location-section__eyebrow">Cómo llegar</span>
            <h2>Encuéntranos en la Zona Alta de Ponferrada</h2>
            <p>
              Estamos en la calle Obispo Osmundo, 3, en una zona cómoda para acercarte a comer pizza en Ponferrada,
              cenar con calma o recoger tu pedido. Si vienes por primera vez, puedes abrir la ruta directamente desde Google Maps.
            </p>
            <p>
              Si tienes cualquier duda antes de venir, también puedes llamarnos y te ayudaremos a localizar el local
              sin problema.
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
              onClick={() => trackEvent("map_open", { page: "home" })}
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
