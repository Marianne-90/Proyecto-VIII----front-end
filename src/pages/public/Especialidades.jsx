import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import img1 from "../../assets/img1.jpg";
import img2 from "../../assets/img2.jpg";
import img3 from "../../assets/img3.jpg";
import img4 from "../../assets/img4.jpg";
import MapaUsuario from "../../components/public/map";

export default function Especialidades() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash !== "#como-llegar-especialidades") return;

    const node = document.getElementById("como-llegar-especialidades");
    if (!node) return;

    requestAnimationFrame(() => {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash]);

  return (
    <section className="editorial-specialties">
      <div className="editorial-specialties__wrap">
        <header className="editorial-specialties__hero">
          <div className="editorial-specialties__intro">
            <span className="editorial-specialties__badge">La Nonnesa Pizza Party</span>
            <h1 className="editorial-specialties__title">Nuestras especialidades</h1>
            <p className="editorial-specialties__subtitle">
              Sumérgete en el sabor auténtico de la pizza italiana con una propuesta elaborada a diario en nuestro
              local de Ponferrada y pensada también para celebraciones y encargos especiales.
            </p>

            <div className="editorial-specialties__meta">
              <span>Zona Alta, calle Obispo Osmundo, 3</span>
              <a href="tel:987197706" className="editorial-specialties__meta-link">987 19 77 06</a>
              <a href="tel:+34603161579" className="editorial-specialties__meta-link">Pedidos: 603 16 15 79</a>
              <a href="tel:+34667811548" className="editorial-specialties__meta-link">667 81 15 48</a>
            </div>

            <div className="editorial-specialties__actions">
              <a href="#como-llegar-especialidades" className="editorial-specialties__cta">
                Cómo llegar
              </a>
            </div>
          </div>

          <div className="editorial-specialties__gallery">
            <figure className="editorial-specialties__photo editorial-specialties__photo--large">
              <img src={img2} alt="Pizza italiana artesanal recién horneada" loading="lazy" />
            </figure>
            <figure className="editorial-specialties__photo">
              <img src={img3} alt="Detalle de pizza servida en mesa" loading="lazy" />
            </figure>
            <figure className="editorial-specialties__photo">
              <img src={img1} alt="Interior del local con ambiente cálido" loading="lazy" />
            </figure>
          </div>
        </header>

        <section className="editorial-specialties__section">
          <div className="editorial-specialties__section-head">
            <span className="editorial-specialties__eyebrow">Pizza en teglia romana</span>
            <h2>Nuestra pizza al corte y al peso</h2>
          </div>

          <div className="editorial-specialties__content">
            <div className="editorial-specialties__copy">
              <p>
                La pizza en teglia forma parte de la tradición italiana, especialmente en Roma, y destaca por su masa
                de alta hidratación, su fermentación prolongada y una textura ligera que resulta crujiente por fuera y
                muy aireada por dentro.
              </p>
              <p>
                En La Nonnesa Pizza Party la elaboramos con ingredientes seleccionados y una atención minuciosa al
                proceso, para que cada porción mantenga el equilibrio entre sabor, estructura y frescura.
              </p>
              <p>
                Es una opción perfecta para quienes quieren probar distintas combinaciones, compartir en grupo o
                disfrutar de un formato más informal sin renunciar a una pizza italiana cuidada.
              </p>
            </div>

            <aside className="editorial-specialties__aside">
              <h3>Qué la hace especial</h3>
              <ul className="editorial-specialties__list">
                <li>Masa de alta hidratación</li>
                <li>Fermentación lenta y cuidada</li>
                <li>Formato al corte o al peso</li>
                <li>Ingredientes de primera calidad</li>
              </ul>
            </aside>
          </div>
        </section>

        <section className="editorial-specialties__split">
          <figure className="editorial-specialties__panel-image">
            <img src={img4} alt="Variedades de focaccia y pizza expuestas en mostrador" loading="lazy" />
          </figure>

          <div className="editorial-specialties__panel">
            <span className="editorial-specialties__eyebrow">Focaccia</span>
            <h2>Delicias genovesas reinterpretadas en nuestra cocina</h2>
            <p>
              La focaccia, originaria de Génova, es una de esas elaboraciones que parecen sencillas pero exigen técnica,
              paciencia y una masa bien trabajada. En nuestro obrador la reinterpretamos con un estilo propio para
              lograr un interior esponjoso y una superficie dorada y crujiente.
            </p>
            <p>
              Gracias a una fermentación cuidada y a una elaboración diaria, conseguimos una focaccia llena de matices,
              ideal tanto para tomar sola como para acompañar otras propuestas de la casa.
            </p>
          </div>
        </section>

        <section className="editorial-specialties__cards" aria-label="Variedad y calidad">
          <article className="editorial-specialties__card">
            <span className="editorial-specialties__eyebrow">Variedad y calidad</span>
            <h3>Producto fresco cada día</h3>
            <p>
              Tanto la pizza en teglia como la focaccia se preparan a diario y se exhiben en el local para disfrutarlas
              recién hechas, con una oferta que cambia según la variedad y los ingredientes del día.
            </p>
            <p>
              Trabajamos también por encargo y adaptamos pedidos para grupos o preferencias concretas cuando la ocasión
              lo requiere.
            </p>
          </article>

          <article className="editorial-specialties__card editorial-specialties__card--accent">
            <span className="editorial-specialties__eyebrow">Precios orientativos</span>
            <h3>Venta al peso</h3>
            <p>
              Nuestras especialidades se ofrecen al peso, con precios que suelen moverse entre 18 €/kg y 35 €/kg,
              dependiendo de la receta y de los ingredientes utilizados.
            </p>
            <p>
              Si buscas algo concreto para una celebración o un pedido grande, lo mejor es consultarnos directamente.
            </p>
          </article>

          <article className="editorial-specialties__card">
            <span className="editorial-specialties__eyebrow">Compromiso</span>
            <h3>Experiencia y cercanía</h3>
            <p>
              Nuestro equipo trabaja con oficio, pasión por la pizza y un trato cercano. Ya sea para una comida
              familiar, un evento de empresa o una celebración especial, queremos que la experiencia resulte tan buena
              como el producto.
            </p>
          </article>
        </section>

        <section className="editorial-specialties__closing">
          <div className="editorial-specialties__closing-copy">
            <span className="editorial-specialties__eyebrow">Para tu próximo pedido</span>
            <h2>El auténtico sabor de Italia, también en formato celebración</h2>
            <p>
              Además de nuestras especialidades diarias, seguimos llevando nuestra propuesta a eventos, reuniones y
              celebraciones con pizzas italianas al estilo tonda y una cocina pensada para compartir.
            </p>
            <a href="/contacto" className="editorial-specialties__link">
              Contactar para pedidos y reservas
            </a>
          </div>

          <figure className="editorial-specialties__closing-image">
            <img src={img2} alt="Pizza servida en tabla de madera" loading="lazy" />
          </figure>
        </section>

        <section id="como-llegar-especialidades" className="location-section" aria-label="Cómo llegar">
          <div className="location-section__copy">
            <span className="location-section__eyebrow">Cómo llegar</span>
            <h2>Acércate a probar nuestras especialidades en Ponferrada</h2>
            <p>
              Si quieres venir al local para descubrir la pizza en teglia, la focaccia y las elaboraciones del día,
              estamos en la Zona Alta, en la calle Obispo Osmundo, 3.
            </p>
            <p>
              Puedes abrir la ubicación directamente en Google Maps y llegar con la ruta preparada desde donde estés.
            </p>

            <div className="location-section__meta">
              <span>La Nonnesa Pizza Party</span>
              <span>Calle Obispo Osmundo, 3 · Ponferrada</span>
            </div>

            <a
              className="location-section__link"
              href="https://share.google/wedjWxYyJ1NZDzXbP"
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
