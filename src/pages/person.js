import "../js/base";
import { loading, showError, getUrlParams, fetchData, getIdFromUrl } from "../js/utils";

const PERSON_CONTAINER = document.querySelector("#person");
const FILMS_CONTAINER = document.querySelector("#films");
const FILMS_LOADING = document.querySelector("#films-loading");

function renderEntities(entities = [], person = {}) {
  function checkIfFinished(entity) {
    const baseLength = person[entity].length;
    if (FILMS_CONTAINER.childElementCount === baseLength) {
      FILMS_LOADING.remove();
    }
  }

  entities.forEach((entity) => {

    const list = person[entity];
    list.forEach((link) => {
      const id = getIdFromUrl(link);

      fetchData({ variant: entity, id }).then(([data, error]) => {

        if (error) return showError(error);

        const targetContainer = FILMS_CONTAINER ;
        const entityLink = document.createElement("a");

        entityLink.setAttribute('href', `/movie.html?id=${getIdFromUrl(data.url)}`)
        entityLink.setAttribute('class', 'card text-center font-star-wars text-lg tracking-widest');
        entityLink.textContent = data.title;
        targetContainer.append(entityLink);

        checkIfFinished(entity);

      });
    });
  });
}

async function renderPerson(person) {

  renderEntities(["films"], person);

  const { name, homeworld } = person;
  const div = document.createElement("div");
  const personP = document.createElement("p");
  personP.setAttribute("class", "font-star-wars tracking-widest text-xl");
  personP.innerText = "Person";
  const personTitle = document.createElement("h1");
  personTitle.setAttribute("class", "font-star-wars text-3xl tracking-widest");
  personTitle.innerText = name;
  div.append(personP, personTitle);
  PERSON_CONTAINER.append(div);

  const subDiv = document.createElement("div")
  subDiv.setAttribute("class", "grid grid-cols-2 md:grid-cols-3 gap-4 p-4 place-content-between");

  ["height", "mass", "hair_color", "skin_color", "eye_color", "birth_year", "gender"].forEach((key) => {
    const h2 = document.createElement("h2");
    h2.setAttribute("class", "font-semibold capitalize");
    h2.innerText = `${key} : ${person[key]}`;
    subDiv.append(h2);
  });

  const id = getIdFromUrl(homeworld)
  const [planet, error] = await fetchData({
    variant: "planets",
    id
  })
  console.log(planet)
  if (!error) {
    const homePlanetLink = document.createElement("a")
    homePlanetLink.setAttribute("href", `/planet.html?id=${id}`)
    homePlanetLink.setAttribute("class", "card col-span-2 md:col-span-3 justify-self-center md:w-1/2")
    const planetText = document.createElement("p")
    planetText.textContent = `Home Planet :  ${planet.name}`
    planetText.setAttribute("class", "font-star-wars text-xl text-widest text-center")
    homePlanetLink.append(planetText)
    subDiv.append(homePlanetLink);
  }
  PERSON_CONTAINER.append(subDiv)

}


async function main() {
  try {
    const [hideLoading, setLoadingText] = loading("loading");
    const id = getUrlParams("id");
    if (id === null) {
      throw new Error("id was not found");
    }
    const [person, error] = await fetchData({
      variant: "people",
      id,
      setLoadingText: setLoadingText("person"),
    });
    if (error || person?.detail === "Not found") {
      throw error || new Error("id Not found");
    }
    document.title = person.name
    await renderPerson(person)
    console.log(person);
    hideLoading();
  } catch (error) {
    showError(error);
  }
}
main();
