import "../js/base";
import { fetchData, loading, showError, getIdFromUrl, renderMovies, renderPeople, H3_STYLES, DIV_STYLES } from "../js/utils";

const MOVIES_CONTAINER = document.querySelector("#movies");
const PEOPLE_CONTAINER = document.querySelector("#people");
const PLANETS_CONTAINER = document.querySelector("#planets");



function renderPlanets(planets = []) {
  planets.forEach((planet) => {
    const div = document.createElement("div");
    div.setAttribute("class", DIV_STYLES);

    const h3 = document.createElement("h3");
    h3.setAttribute("class", H3_STYLES);
    h3.textContent = planet.name;
    div.append(h3);

    ["diameter", "climate", "population", "terrain"].forEach((entity) => {
      const el = document.createElement("p");
      el.textContent = `${entity} : ${planet[entity]}`;
      el.setAttribute("class", "font-semibold");
      div.append(el);
    });

    const link = document.createElement("a");
    link.setAttribute("href", `/planet.html?id=${getIdFromUrl(planet.url)}`);
    link.textContent = "Read more";
    link.setAttribute("class", "btn");
    div.append(link);

    PLANETS_CONTAINER.append(div);
  });
}

async function main() {
  try {

    const [hideLoading, setLoadingText] = loading("loading");
    const [movies, error] = await fetchData({
      setLoadingText: setLoadingText("films"),
    });
    if (error) {
      console.log(error);
      return;
    }
    renderMovies(movies.results, MOVIES_CONTAINER);

    const [people, error2] = await fetchData({
      variant: "people",
      setLoadingText: setLoadingText("people"),
    });
    if (error2) {
      console.log(error2);
      return;
    }
    renderPeople(people.results, PEOPLE_CONTAINER);

    const [planets, error3] = await fetchData({
      variant: "planets",
      setLoadingText: setLoadingText("planets"),
    });
    if (error3) {
      console.log(error3);
      return;
    }
    renderPlanets(planets.results);
    hideLoading();

  } catch (error) {
    showError(error);
  }
}
main();
