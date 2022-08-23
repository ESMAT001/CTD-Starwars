import "../js/base";
import { loading, showError, getUrlParams, fetchData, getIdFromUrl } from "../js/utils";

const PLANET_CONTAINER = document.querySelector("#planet");
const FILMS_CONTAINER = document.querySelector("#films");
const RESIDENTS_CONTAINER = document.querySelector("#residents");
const FILMS_LOADING = document.querySelector("#films-loading");
const RESIDENTS_LOADING = document.querySelector("#residents-loading");

function renderEntities(entities = [], planet = {}) {
  function checkIfFinished(entity) {
    const baseLength = planet[entity].length;
    const container =
      entity === "residents" ? RESIDENTS_CONTAINER : FILMS_CONTAINER;
    if (container.childElementCount === baseLength) {
      (entity === "residents" ? RESIDENTS_LOADING : FILMS_LOADING).remove();
    }
  }
  entities.forEach((entity) => {

    const list = planet[entity];

    if (list.length === 0) {
      checkIfFinished(entity)
      const targetContainer = entity === "residents" ? RESIDENTS_CONTAINER : FILMS_CONTAINER;
      const msg = document.createElement("P");
      msg.setAttribute("class", 'tracking-widest')
      msg.textContent = "No Movie"
      targetContainer.append(msg)
      return;
    }


    list.forEach((link) => {
      const id = getIdFromUrl(link);

      fetchData({ variant: entity === "residents" ? "people" : entity, id }).then(([data, error]) => {

        if (error) return showError(error);

        const targetContainer = entity === "residents" ? RESIDENTS_CONTAINER : FILMS_CONTAINER;
        const entityLink = document.createElement("a");

        entityLink.setAttribute('href', `/${entity === "residents" ? "person" : 'movie'}.html?id=${getIdFromUrl(data.url)}`)
        entityLink.setAttribute('class', `card text-center font-semibold ${entity !== "residents" ? "tracking-widest" : ''}`);
        entityLink.textContent = entity === "residents" ? data.name : data.title;
        targetContainer.append(entityLink);

        checkIfFinished(entity);

      });
    });
  });
}

function renderPlanet(planet) {

  renderEntities(["residents", "films"], planet);

  const { name } = planet;
  const div = document.createElement("div");
  div.setAttribute("class", "md:col-span-3")
  const planetP = document.createElement("p");
  planetP.setAttribute("class", "font-star-wars tracking-widest text-xl");
  planetP.innerText = "Planet";
  const planetName = document.createElement("h1");
  planetName.setAttribute("class", "font-star-wars text-3xl tracking-widest");
  planetName.innerText = name;
  div.append(planetP, planetName);
  PLANET_CONTAINER.append(div);

  ["rotation_period", "orbital_period", "diameter", "climate", "gravity", "terrain", "surface_water", "population"].forEach((key) => {
    const h2 = document.createElement("h2");
    h2.setAttribute("class", "font-semibold capitalize");
    h2.innerText = `${key.replace(/_/g, " ")} : ${planet[key]}`;
    PLANET_CONTAINER.append(h2);
  });
}

async function main() {
  try {
    const [hideLoading, setLoadingText] = loading("loading");
    const id = getUrlParams("id");
    if (id === null) {
      throw new Error("id was not found");
    }
    const [planet, error] = await fetchData({
      variant: "planets",
      id,
      setLoadingText: setLoadingText("planet"),
    });
    if (error || planet?.detail === "Not found") {
      throw error || new Error("id Not found");
    }
    document.title = `Planet ${planet.name}`
    renderPlanet(planet)
    console.log(planet);
    hideLoading();
  } catch (error) {
    showError(error);
  }
}
main();
