import { useMemo, useState } from "react";
import { FaCircle } from "react-icons/fa";
import { GiChiliPepper } from "react-icons/gi";
import { GiMilkCarton } from "react-icons/gi";
import { GiWheat } from "react-icons/gi";
import { GiAnglerFish } from "react-icons/gi";
import { GiBigEgg } from "react-icons/gi";
import { GiThreeLeaves } from "react-icons/gi";
import { GiPeanut } from "react-icons/gi";
import { GiPlantSeed } from "react-icons/gi";


import img1 from "../../assets/img1.jpg";
import img2 from "../../assets/img12.jpeg";
import img3 from "../../assets/img20.png";
import img4 from "../../assets/img4.jpg";
import diavola from "../../assets/diavola.png";
import romagnola from "../../assets/romagnola.png";
import goutmet from "../../assets/goutmet.jpg";


const ALLERGENS = {
  chili: { label: "Picante", className: "allergen-dot--chili", icon: GiChiliPepper },
  dairy: { label: "Lácteos", className: "allergen-dot--dairy", icon: GiMilkCarton },
  gluten: { label: "Gluten", className: "allergen-dot--gluten", icon: GiWheat },
  fish: { label: "Pescado", className: "allergen-dot--fish", icon: GiAnglerFish },
  eggs: { label: "Huevos", className: "allergen-dot--eggs", icon: GiBigEgg },
  soy: { label: "Soja", className: "allergen-dot--soy", icon: GiThreeLeaves },
  peanuts: { label: "Cacahuetes y frutos secos", className: "allergen-dot--peanuts", icon: GiPeanut },
  treeNuts: { label: "Fr. de cáscara", className: "allergen-dot--tree-nuts", icon: GiPlantSeed },
};

const classicPizzas = [
  {
    name: "Margherita",
    price: "8 €",
    ingredients: "Tomate, mozzarella, albahaca, parmesano y aceite de oliva virgen extra.",
    allergens: ["dairy", "gluten"],
    // image: img1,
    visualLabel: "La más clásica",
  },
  {
    name: "Prosciutto",
    price: "10 €",
    ingredients: "Tomate, mozzarella, prosciutto, aceite de oliva virgen extra y parmesano.",
    allergens: ["dairy", "gluten"],
  },
  {
    name: "Atún y cebolla",
    price: "11 €",
    ingredients: "Tomate, mozzarella, parmesano, atún, cebolla y aceituna.",
    allergens: ["dairy", "gluten", "fish"],
  },
  {
    name: "Atún y pimiento",
    price: "11 €",
    ingredients: "Tomate, mozzarella, parmesano, atún y pimiento.",
    allergens: ["dairy", "gluten", "fish"],
  },
  {
    name: "Paisanella",
    price: "12 €",
    ingredients: "Tomate, mozzarella, parmesano, champiñones y prosciutto.",
    allergens: ["dairy", "gluten", "soy"],
  },
  {
    name: "Salami napolitano",
    price: "12 €",
    ingredients: "Tomate, mozzarella, parmesano, aceite de oliva virgen extra y salami napolitano.",
    allergens: ["dairy", "gluten", "soy"],
  },
  {
    name: "Salami Napoli picante",
    price: "12 €",
    ingredients: "Tomate, mozzarella, orégano, aceite picante calabrese y salami napolitano picante.",
    allergens: ["chili", "dairy", "gluten"],
  },
  {
    name: "5 Formaggi",
    price: "13 €",
    ingredients: "Tomate, mozzarella, parmesano, gorgonzola, mascarpone y ricotta.",
    allergens: ["dairy", "gluten"],
    // image: img2,
    //visualLabel: "Cremosa e intensa",
  },
  {
    name: "Vegetales",
    price: "13 €",
    ingredients: "Tomate, mozzarella, champiñones, cherrys, cebolla, pimiento, lascas de parmesano, búfala, rúcula y aceite de oliva virgen extra.",
    allergens: ["dairy", "gluten"],
  },
  {
    name: "Diávola",
    price: "13 €",
    ingredients: "Tomate, mozzarella, parmesano, salami picante, pimiento, aceitunas negras, aceite picante calabrese y orégano.",
    allergens: ["chili", "dairy", "gluten"],
    image: diavola,
    visualLabel: "Nuestra DIAVOLA APETECIBLE",
  },
  {
    name: "Capricciosa",
    price: "13 €",
    ingredients: "Tomate, mozzarella, parmesano, champiñones, prosciutto, alcachofa y aceitunas negras.",
    allergens: ["dairy", "gluten", "dairy", "soy"],
  },
  {
    name: "Calzone",
    price: "14 €",
    ingredients: "Tomate, mozzarella, parmesano, ricotta, prosciutto, salami napolitano y mozzarella di búfala.",
    allergens: ["dairy", "gluten", "soy"],
  },
];

const gourmetPizzas = [
  {
    name: "Calabrese",
    price: "12 €",
    ingredients: "Tomate, mozzarella, parmesano, albahaca, n'duja picante calabrese, burrata y aceite picante calabrese.",
    allergens: ["chili", "chili", "dairy", "gluten", "soy"],
    //image: img3,
    //visualLabel: "Toque picante",
  },
  {
    name: "Bufalina",
    price: "12 €",
    ingredients: "Tomate, mozzarella, albahaca, mozzarella di búfala, cherrys, lascas de parmesano y aceite de oliva virgen extra.",
    allergens: ["dairy", "gluten"],
  },
  {
    name: "Mari e Monti",
    price: "13 €",
    ingredients: "Tomate, mozzarella, parmesano, cherrys, queso de cabra, atún, pimientos, burrata y orégano.",
    allergens: ["dairy", "gluten", "fish"],
  },
  {
    name: "Panna e guanciale",
    price: "13 €",
    ingredients: "Mozzarella, nata, ricotta, gorgonzola y guanciale.",
    allergens: ["dairy", "gluten", "soy"],
  },
  {
    name: "Zuffa",
    price: "13 €",
    ingredients: "Tomate, mozzarella, longaniza, salame picante y gorgonzola.",
    allergens: ["dairy", "gluten"],
  },
  {
    name: "Estiva",
    price: "14 €",
    ingredients: "Tomate, mozzarella, albahaca, prosciutto, cherrys y burrata.",
    tag: "Nueva",
    allergens: ["dairy", "gluten"],
  },
  {
    name: "Guanciale e nduja",
    price: "14 €",
    ingredients: "Tomate, mozzarella, guanciale y nduja picante.",
    tag: "Nueva",
    allergens: ["chili", "chili", "dairy", "gluten", "soy", "treeNuts"],
  },
  {
    name: "Italiana",
    price: "14 €",
    ingredients: "Tomate, mozzarella, parmesano, n'duja picante calabrese, cherrys, jamón serrano, mozzarella di bufala y rúcula.",
    allergens: ["chili", "dairy", "gluten", "soy"],
  },
  {
    name: "Gabri",
    price: "14 €",
    ingredients: "Tomate, mozzarella, parmesano, prosciutto, salami picante, salami dulce, bacon, huevo y burrata.",
    allergens: ["chili", "dairy", "gluten", "eggs", "soy"],
  },
  {
    name: "Villa",
    price: "14 €",
    ingredients: "Tomate, mozzarella, ricotta, cebolla, salami picante napolitano, lascas de parmesano y aceite picante calabrese.",
    allergens: ["chili", "dairy", "gluten"],
  },
  {
    name: "Koko",
    price: "15 €",
    ingredients: "Tomate, mozzarella, cecina, rúcula, mozzarella de búfala, lascas de parmesano y aceite de oliva virgen extra.",
    allergens: ["dairy", "gluten", "soy"],
  },
  {
    name: "Ele",
    price: "15 €",
    ingredients: "Tomate, parmesano, mozzarella, queso de cabra, cecina y aceite de oliva virgen extra.",
    allergens: ["dairy", "gluten", "soy"],
  },
  {
    name: "Cantábrica",
    price: "15 €",
    ingredients: "Tomate, ajo, perejil, orégano, cherrys y anchoas reserva del Cantábrico.",
    tag: "Nueva",
    allergens: ["gluten", "fish"],
  },
  {
    name: "Porchetta",
    price: "15 €",
    ingredients: "Tomate, mozzarella y porchetta di Ariccia.",
    tag: "Nueva",
    allergens: ["dairy", "gluten"],
  },
  {
    name: "La Nonesa",
    price: "15 €",
    ingredients: "Tomate, mozzarella, parmigiano, mascarpone, gorgonzola, speck trentino y nueces.",
    allergens: ["dairy", "gluten", "treeNuts", "peanuts"],
  },
  {
    name: "Caprese",
    price: "15 €",
    ingredients: "Tomate, mozzarella, cherrys, jamón serrano, burrata, pesto y lascas de parmesano.",
    allergens: ["dairy", "gluten", "treeNuts"],
  },
  {
    name: "Mortabella",
    price: "15 €",
    ingredients: "Tomate, mozzarella, cherrys, albahaca, mortadella, burrata, pesto, lascas de parmesano y aceite de oliva virgen extra.",
    allergens: ["dairy", "gluten", "treeNuts", "soy"],
  },
  {
    name: "Magica",
    price: "15 €",
    ingredients: "Mozzarella, cherrys, aceitunas, prosciutto di Parma D.O.P., burrata, albahaca, lascas de parmesano y aceite de oliva virgen extra.",

  },
  {
    name: "Romagnola",
    price: "15 €",
    ingredients: "Mozzarella, ricotta, albahaca, mortadella bolognese de pistachos, burrata, lascas de parmesano y pistachos.",
    allergens: ["dairy", "gluten", "treeNuts", "soy"],
    image: romagnola,
    visualLabel: "pizza in teglia bellissima",
  },
  {
    name: "Parma",
    price: "15 €",
    ingredients: "Tomate, mozzarella, albahaca, prosciutto di Parma D.O.P., mozzarella di búfala, lascas de parmesano y aceite de oliva virgen extra.",
    allergens: ["dairy", "gluten", "soy"],
  },
];

const allergenLegend = Object.entries(ALLERGENS).map(([key, value]) => ({
  key,
  ...value,
}));

function getAllergen(item) {
  const allergen = ALLERGENS[item];

  if (!allergen) return null;

  return {
    key: item,
    icon: FaCircle,
    ...allergen,
  };
}

function AllergenIcon({ item }) {
  const allergen = getAllergen(item);

  if (!allergen) return null;

  const Icon = allergen.icon;

  return <Icon className={allergen.className} aria-hidden="true" />;
}

function AllergenDots({ items = [] }) {
  return (
    <div className="menu-card__allergens" aria-label="Alérgenos destacados">
      {items.map((item) => {
        const allergen = getAllergen(item);
        if (!allergen) return null;

        return (
          <span
            key={`${item}-${allergen.key}`}
            className="allergen-dot"
            title={allergen.label}
            aria-label={allergen.label}
            tabIndex={0}
            data-tooltip={allergen.label}
          >
            <AllergenIcon item={item} />
          </span>
        );
      })}
    </div>
  );
}

function PizzaCard({ pizza }) {
  return (
    <article className="menu-card">
      {pizza.image ? (
        <figure className="menu-card__visual">
          <img src={pizza.image} alt={`Imagen de presentación de ${pizza.name}`} loading="lazy" />
          <figcaption className="menu-card__visual-caption">
            <span className="menu-card__visual-kicker">{pizza.visualLabel || pizza.tag || "Pizza italiana"}</span>
            <h3>{pizza.name}</h3>
          </figcaption>
        </figure>
      ) : null}

      <div className="menu-card__content">
        <div className="menu-card__top">
          <div>
            {!pizza.image ? <h3 className="menu-card__title">{pizza.name}</h3> : null}
            {pizza.tag ? <span className="menu-card__tag">{pizza.tag}</span> : ""}
          </div>
          <div className="menu-card__price-block">
            <strong className="menu-card__price">{pizza.price}</strong>
            <AllergenDots items={pizza.allergens} />
          </div>
        </div>

        <p>{pizza.ingredients}</p>
      </div>
    </article>
  );
}

function PizzaSectionGrid({ pizzas, matchesFilters }) {
  const visiblePizzas = pizzas.filter((pizza) => matchesFilters(pizza));

  if (visiblePizzas.length === 0) {
    return (
      <div className="menu-empty-state" role="status">
        <h3>No hay pizzas para esta combinación</h3>
        <p>Prueba a quitar algún alérgeno del filtro para volver a ver más opciones de la carta.</p>
      </div>
    );
  }

  return (
    <div className="menu-grid">
      {visiblePizzas.map((pizza) => (
        <div
          key={pizza.name}
          className={`menu-grid__item${pizza.image ? " menu-grid__item--featured" : ""}`}
        >
          <PizzaCard pizza={pizza} />
        </div>
      ))}
    </div>
  );
}

export default function Carta() {
  const [activeFilters, setActiveFilters] = useState([]);
  const [filterMode, setFilterMode] = useState("contains");

  const filterItems = useMemo(
    () =>
      Object.entries(ALLERGENS).map(([key, value]) => ({
        key,
        ...value,
      })),
    []
  );

  const toggleFilter = (key) => {
    setActiveFilters((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    );
  };

  const matchesFilters = (pizza) => {
    if (activeFilters.length === 0) return true;

    const pizzaAllergens = pizza.allergens || [];

    return filterMode === "not_contains"
      ? activeFilters.every((filter) => !pizzaAllergens.includes(filter))
      : activeFilters.every((filter) => pizzaAllergens.includes(filter));
  };

  const allPizzas = [...classicPizzas, ...gourmetPizzas];
  const filteredCount = allPizzas.filter(matchesFilters).length;
  const summaryText =
    activeFilters.length === 0
      ? `Mostrando toda la carta: ${allPizzas.length} pizzas`
      : filterMode === "not_contains"
        ? `Mostrando ${filteredCount} pizzas que no contienen los alérgenos seleccionados`
        : `Mostrando ${filteredCount} pizzas que contienen los alérgenos seleccionados`;

  return (
    <section className="menu-page">
      <div className="menu-page__wrap">
        <header className="menu-page__hero">
          <div className="menu-page__intro">
            <span className="menu-page__badge">La Nonnesa Pizza Party</span>
            <h1 className="menu-page__title">Carta de pizzas 100% italianas</h1>
            <p className="menu-page__subtitle">
              Una carta pensada para disfrutar de la pizza clásica, las combinaciones gourmet y el sabor italiano con
              producto cuidado y masa artesana.
            </p>

            <div className="menu-page__meta">
              <span>Zona Alta, calle Obispo Osmundo, 3</span>
              <a href="tel:987197706" className="menu-page__meta-link">987 19 77 06</a>
              <a href="tel:+34603161579" className="menu-page__meta-link">Pedidos: 603 16 15 79</a>
              <a href="tel:+34667811548" className="menu-page__meta-link">667 81 15 48</a>
            </div>
          </div>

          <div className="menu-page__gallery">
            <figure className="menu-page__photo menu-page__photo--large">
              <img src={img2} alt="Pizza artesanal recién horneada" loading="lazy" />
            </figure>
            <figure className="menu-page__photo">
              <img src={img3} alt="Pizza servida en mesa" loading="lazy" />
            </figure>
            <figure className="menu-page__photo">
              <img src={img1} alt="Interior del local" loading="lazy" />
            </figure>
          </div>
        </header>

        <section className="menu-page__section">


          <div className="menu-filters" aria-label="Filtros por alérgenos">
            <p className="menu-filters__summary">
              {activeFilters.length === 0 ? summaryText : (
                <>
                  Mostrando <strong>{filteredCount}</strong>{" "}
                  {filterMode === "not_contains"
                    ? "pizzas que no contienen los alérgenos seleccionados"
                    : "pizzas que contienen los alérgenos seleccionados"}
                </>
              )}
            </p>

            <div className="menu-filter-mode" aria-label="Modo de filtrado">
              <button
                type="button"
                className={`menu-filter-mode__button${filterMode === "contains" ? " menu-filter-mode__button--active" : ""}`}
                onClick={() => setFilterMode("contains")}
                aria-pressed={filterMode === "contains"}
              >
                Contiene
              </button>
              <button
                type="button"
                className={`menu-filter-mode__button${filterMode === "not_contains" ? " menu-filter-mode__button--active" : ""}`}
                onClick={() => setFilterMode("not_contains")}
                aria-pressed={filterMode === "not_contains"}
              >
                No contiene
              </button>
            </div>

            {filterItems.map((item) => {
              const isActive = activeFilters.includes(item.key);

              return (
                <button
                  key={item.key}
                  type="button"
                  className={`menu-filter${isActive ? " menu-filter--active" : ""}`}
                  onClick={() => toggleFilter(item.key)}
                  aria-pressed={isActive}
                >
                  <AllergenIcon item={item.key} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {activeFilters.length > 0 ? (
              <button
                type="button"
                className="menu-filter menu-filter--clear"
                onClick={() => setActiveFilters([])}
              >
                Limpiar filtros
              </button>
            ) : null}
          </div>

          <div className="menu-page__section-head">
            <span className="menu-page__eyebrow">Clásicas</span>
            <h2>Las pizzas que sostienen la casa</h2>
            <p>
              Recetas reconocibles, elaboradas con ingredientes italianos y una base pensada para que cada pizza tenga
              equilibrio, carácter y mucha personalidad.
            </p>
          </div>
          <PizzaSectionGrid pizzas={classicPizzas} matchesFilters={matchesFilters} />
        </section>

        <section className="menu-page__split">
          <figure className="menu-page__panel-image">
            <img src={goutmet} alt="Variedad de pizzas listas para servir" loading="lazy" />
          </figure>

          <div className="menu-page__panel">
            <span className="menu-page__eyebrow">Gourmet</span>
            <h2>Combinaciones con más profundidad, matices y producto</h2>
            <p>
              En esta parte de la carta aparecen burratas, curados, nduja, guanciale, quesos intensos y recetas que
              combinan tradición italiana con el estilo propio de La Nonnesa Pizza Party.
            </p>
            <p>
              Son pizzas pensadas para quienes disfrutan probando combinaciones con más contraste, más cremosidad o un
              punto extra de intensidad.
            </p>
          </div>
        </section>

        <section className="menu-page__section">
          <div className="menu-page__section-head">
            <span className="menu-page__eyebrow">Gourmet</span>
            <h2>Nuestra selección más especial</h2>
            <p>
              Una carta con recetas propias, novedades de temporada y sabores más expresivos para quienes quieren ir un
              paso más allá de la pizza clásica.
            </p>
          </div>

          <PizzaSectionGrid pizzas={gourmetPizzas} matchesFilters={matchesFilters} />
        </section>

        <section className="menu-page__legend">
          <article className="menu-note menu-note--accent menu-note--legend">
            <div className="menu-note__heading">
              <div>
                <span className="menu-page__eyebrow">Leyenda de símbolos</span>
              </div>
            </div>

            <ul className="menu-allergens menu-allergens--legend">
              {allergenLegend.map((item) => (
                <li key={item.key}>
                  <AllergenIcon item={item.key} />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="menu-page__service-band">
          <article className="menu-page__service-band-block">
            <span className="menu-page__eyebrow">Pedidos</span>
            <h3>¿Quieres encargar pizzas?</h3>
            <p>Llámanos y te ayudamos con disponibilidad, cantidades y organización del pedido.</p>
            <a className="menu-note__link" href="tel:+34603161579">
              Llamar al 603 16 15 79
            </a>
          </article>

          <article className="menu-page__service-band-block">
            <span className="menu-page__eyebrow">Visítanos</span>
            <h3>Consulta la ubicación del local</h3>
            <p>Encuentra cómo llegar hasta la Zona Alta de Ponferrada y organiza tu visita con antelación.</p>
            <a className="menu-page__service-link" href="/contacto#como-llegar">
              Cómo llegar
            </a>
          </article>

          <article className="menu-page__service-band-block">
            <span className="menu-page__eyebrow">Reservas</span>
            <h3>Reserva tu mesa</h3>
            <p>Si prefieres venir al local, puedes acceder a la página de reservas y dejarnos tu solicitud.</p>
            <a className="menu-page__service-link" href="/reservar">
              Ir a reservas
            </a>
          </article>
        </section>
      </div>
    </section>
  );
}
