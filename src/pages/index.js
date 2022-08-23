import "../js/base";
import { fetchData, loading, showError, getIdFromUrl } from "../js/utils";

const MOVIES_CONTAINER = document.querySelector("#movies");
const PEOPLE_CONTAINER = document.querySelector("#people");
const PLANETS_CONTAINER = document.querySelector("#planets");
const DIV_STYLES = "card";
const H3_STYLES = "font-star-wars tracking-widest text-2xl";

function renderMovies(movies = []) {
  const directorStyles = "font-semibold";
  const overviewStyles = "text-sm";
  const realeasedDateStyles = "font-semibold text-xs";
  movies.forEach((movie) => {
    const div = document.createElement("div");
    div.setAttribute("class", DIV_STYLES);

    const h3 = document.createElement("h3");
    h3.setAttribute("class", H3_STYLES);
    h3.textContent = movie.title;
    div.append(h3);

    const director = document.createElement("p");
    director.textContent = `Director : ${movie.director}`;
    director.setAttribute("class", directorStyles);
    div.append(director);

    const releasedDate = document.createElement("p");
    releasedDate.textContent = `Released Date : ${new Date(
      movie.release_date
    ).toDateString()}`;
    releasedDate.setAttribute("class", realeasedDateStyles);
    div.append(releasedDate);

    const overview = document.createElement("p");
    overview.textContent = `Overview : ${movie.opening_crawl.substring(
      0,
      150
    )} ...`;
    overview.setAttribute("class", overviewStyles);
    div.append(overview);

    const link = document.createElement("a");
    link.setAttribute("href", `/movie.html?id=${movie.episode_id}`);
    link.textContent = "Read more";
    link.setAttribute("class", "btn");
    div.append(link);

    MOVIES_CONTAINER.append(div);
  });
}

function renderPeople(people = []) {
  people.forEach((person) => {
    const div = document.createElement("div");
    div.setAttribute("class", DIV_STYLES);

    const h3 = document.createElement("h3");
    h3.setAttribute("class", H3_STYLES);
    h3.textContent = person.name;
    div.append(h3);

    ["gender", "height", "mass"].forEach((entity) => {
      const el = document.createElement("p");
      el.textContent = `${entity} : ${person[entity]}`;
      el.setAttribute("class", "font-semibold");
      div.append(el);
    });

    const link = document.createElement("a");
    link.setAttribute("href", `/person.html?id=${getIdFromUrl(person.url)}`);
    link.textContent = "Read more";
    link.setAttribute("class", "btn");
    div.append(link);

    PEOPLE_CONTAINER.append(div);
  });
}

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
    renderMovies(movies.results);

    const [people, error2] = await fetchData({
      variant: "people",
      setLoadingText: setLoadingText("people"),
    });
    if (error2) {
      console.log(error2);
      return;
    }
    renderPeople(people.results);

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
