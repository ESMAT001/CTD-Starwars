import "../js/base";
import { loading, showError, getUrlParams, fetchData, getIdFromUrl } from "../js/utils";

const MOVIE_CONTAINEER = document.querySelector("#movie");
const PLANETS_CONTAINER = document.querySelector("#planets");
const PEOPLE_CONTAINER = document.querySelector("#people");
const PLANETS_LOADING = document.querySelector("#planets-loading");
const PEOPLE_LOADING = document.querySelector("#people-loading");

function renderEntities(entities = [], movie = {}) {
  function checkIfFinished(entity) {
    const baseLength = movie[entity].length;
    const container =
      entity === "characters" ? PEOPLE_CONTAINER : PLANETS_CONTAINER;
    if (container.childElementCount === baseLength) {
      (entity === "characters" ? PEOPLE_LOADING : PLANETS_LOADING).remove();
    }
  }
  entities.forEach((entity) => {

    const list = movie[entity];
    list.forEach((link) => {
      const id = getIdFromUrl(link);

      fetchData({ variant: entity === "characters" ? "people" : entity, id }).then(([data, error]) => {

        if (error) return showError(error);

        const targetContainer = entity === "characters" ? PEOPLE_CONTAINER : PLANETS_CONTAINER;
        const entityLink = document.createElement("a");

        entityLink.setAttribute('href', `/${entity === "characters" ? "person" : 'planet'}.html?id=${getIdFromUrl(data.url)}`)
        entityLink.setAttribute('class', 'card text-center font-semibold');
        entityLink.textContent = data.name;
        targetContainer.append(entityLink);

        checkIfFinished(entity);

      });
    });
  });
}

function renderMovie(movie) {
  
  renderEntities(["characters", "planets"], movie);

  const { title, opening_crawl } = movie;
  const div = document.createElement("div");
  const movieP = document.createElement("p");
  movieP.setAttribute("class", "font-star-wars tracking-widest text-xl");
  movieP.innerText = "Movie";
  const movieTitle = document.createElement("h1");
  movieTitle.setAttribute("class", "font-star-wars text-3xl tracking-widest");
  movieTitle.innerText = title;
  div.append(movieP, movieTitle);
  MOVIE_CONTAINEER.append(div);

  ["director", "producer", "release_date"].forEach((key) => {
    const h2 = document.createElement("h2");
    h2.setAttribute("class", "font-semibold capitalize");
    h2.innerText = `${key.replace(/_/g," ")} : ${movie[key]}`;
    MOVIE_CONTAINEER.append(h2);
  });

  const overview = document.createElement("p");
  overview.setAttribute("class", "font-semibold");
  overview.innerText = opening_crawl.replace(/\r?\n/g, " ");
  MOVIE_CONTAINEER.append(overview);
}

async function main() {
  try {
    const [hideLoading, setLoadingText] = loading("loading");
    const id = getUrlParams("id");
    if (id === null) {
      throw new Error("id was not found");
    }
    const [movie, error] = await fetchData({
      variant: "films",
      id,
      setLoadingText: setLoadingText("movie"),
    });
    if (error || movie?.detail === "Not found") {
      throw error || new Error("id Not found");
    }
    document.title = movie.title
    renderMovie(movie);
    console.log(movie);
    hideLoading();
  } catch (error) {
    showError(error);
  }
}
main();
