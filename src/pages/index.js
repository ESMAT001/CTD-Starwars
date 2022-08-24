import "../js/base";
import { fetchData, loading, showError, renderMovies, renderPeople, renderPlanets } from "../js/utils";

const MOVIES_CONTAINER = document.querySelector("#movies");
const PEOPLE_CONTAINER = document.querySelector("#people");
const PLANETS_CONTAINER = document.querySelector("#planets");


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
    renderPlanets(planets.results, PLANETS_CONTAINER);
    hideLoading();

  } catch (error) {
    showError(error);
  }
}
main();
