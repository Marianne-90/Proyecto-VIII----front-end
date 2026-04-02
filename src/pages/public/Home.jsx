import img1 from "../../assets/img1.jpg";
import img2 from "../../assets/img2.jpg";
import img3 from "../../assets/img3.jpg";
import img4 from "../../assets/img4.jpg";
import MapaUsuario from "../../components/public/map";

export default function Home() {
  return (
    <section className="editorial-home">
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
              <a href="/contacto#como-llegar" className="editorial-home__cta editorial-home__cta--primary">
                Cómo llegar
              </a>
            </div>
          </div>

          <div className="editorial-home__collage">
            <figure className="editorial-home__photo editorial-home__photo--large">
              <img src={img3} alt="Pizza italiana recién salida del horno" loading="lazy" />
            </figure>
            <figure className="editorial-home__photo">
              <img src={img4} alt="Exterior del local" loading="lazy" />
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
              La Nonnesa Pizza Party es una pizzería móvil especializada en la preparación de auténticas pizzas
              italianas. Trabajamos con ingredientes seleccionados e importados directamente desde Italia para cuidar
              cada detalle del sabor, la textura y la experiencia en mesa.
            </p>
            <p>
              Nuestro equipo vive la pizza con oficio y cercanía. Ya sea para una celebración especial, un evento de
              empresa o una cena en familia, buscamos que cada servicio se sienta cuidado, ágil y lleno de sabor.
            </p>
            <p>
              Elaboramos pizzas al estilo tonda, de perfil clásico, pensadas para compartir y disfrutar con calma. La
              idea es sencilla: llevar una experiencia italiana auténtica allí donde se reúna la gente.
            </p>
          </div>

          <aside className="editorial-home__story-card">
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
                <img src={img2} alt="Pizza artesanal preparada para un evento" loading="lazy" />
              </figure>
              <div className="editorial-card__body">
                <span className="editorial-card__kicker">Entrada destacada</span>
                <h3>Auténtica pizza italiana allí donde haya una celebración</h3>
                <p>
                  Nos enorgullece preparar pizzas con una base artesanal, salsas cuidadas e ingredientes italianos
                  escogidos para ofrecer una experiencia gastronómica honesta y memorable.
                </p>
                <p>
                  Si estás organizando un cumpleaños, una reunión especial o una cena familiar, podemos llevar nuestra
                  propuesta para convertir ese encuentro en algo todavía más especial.
                </p>
                <a href="/contacto" className="editorial-card__link">
                  Leer más
                </a>
              </div>
            </article>

            <article className="editorial-card">
              <figure className="editorial-card__media">
                <img src={img4} alt="Vista del local de La Nonnesa Pizza Party" loading="lazy" />
              </figure>
              <div className="editorial-card__body">
                <span className="editorial-card__kicker">Ponferrada</span>
                <h3>Nuestro local en la Zona Alta</h3>
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
              Estamos en la calle Obispo Osmundo, 3, en una zona cómoda para acercarte a comer, cenar o recoger tu
              pedido. Si vienes por primera vez, puedes abrir la ruta directamente desde Google Maps.
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
              href="hhttps://share.google/Xzj0EXY84Vgq1Uymh"
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
