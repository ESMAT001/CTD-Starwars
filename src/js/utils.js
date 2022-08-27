export const BASE_API_URL = "https://swapi.dev/api/";
export const DIV_STYLES = "card";
export const H3_STYLES = "font-star-wars tracking-widest text-2xl";

export async function fetchWithErrorHandling({
  url,
  options = { method: "GET" },
  json = true,
} = {}) {
  try {
    const response = await fetch(url, options);
    if (json) {
      return [await response.json(), null];
    }
    return [response, null];
  } catch (error) {
    return [null, error];
  }
}

export async function fetchData({
  variant = "films", //type of data to be fetched
  id,
  setLoadingText = () => { }, // custom function to change loading text while data is loading
  page = 1
} = {}) {
  setLoadingText();
  if (id) {
    const url = `${BASE_API_URL}${variant}/${id}`;
    return await fetchWithErrorHandling({ url });
  }
  const url = `${BASE_API_URL}${variant}/?page=${page === null ? 1 : page}`;
  return await fetchWithErrorHandling({ url });
}

export function loading(id) {
  document.body.classList.add("overflow-hidden");
  const loading = document.getElementById(id);
  const loadingTxt = document.querySelector(`#${id} > p`);
  return [
    () => { //this function is used to remove the loader after the data is loaded
      loading.remove();
      document.body.classList.remove("overflow-hidden");
    },
    (txt) => { // this function is use to change loader text
      return () => (loadingTxt.textContent = `Loading ${txt}`);
    },
  ];
}
//custom function to handle error and show message to use
export function showError(error) {
  console.error(error);
  const errorDiv = document.createElement("div");
  errorDiv.setAttribute(
    "class",
    "min-h-screen min-w-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-blue-900 text-white"
  );

  const errorMessage = document.createElement("p");
  errorMessage.setAttribute("class", "text-4xl font-semibold mb-10 capitalize");
  errorMessage.textContent = "Something went wrong!";
  errorDiv.append(errorMessage);

  const reloadBtn = document.createElement("button");
  reloadBtn.setAttribute("class", "btn");
  reloadBtn.textContent = "Reload";
  reloadBtn.addEventListener("click", () => {
    window.location.reload();
  });
  errorDiv.append(reloadBtn);

  document.body.innerHTML = "";
  document.body.setAttribute("class", "font-raleway");
  document.body.append(errorDiv);
}

//this function is used to get parameters from url
export function getUrlParams(param = "id", url = null) {
  //this function will return the specific "param" from url that is passed to the function or from the current page url
  return new URLSearchParams(url !== null ? url.split("/").pop() : window.location.search).get(param)
}

//this function is use to get id from a url
export function getIdFromUrl(url) {
  //this function first removes the last '/' and creates array based on '/' and returns the last elment which is the id
  return url.slice(0, -1).split("/").pop()
}

export function renderMovies(movies = [], moviesContainer) {
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

    moviesContainer.append(div);
  });
}

export function renderPeople(people = [], peopleContainer) {
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

    peopleContainer.append(div);
  });
}

export function renderPlanets(planets = [], planetsContainer) {
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

    planetsContainer.append(div);
  });
}

//function to create pagination 
export function pagination(varient = "movies", { next = null, previous = null } = {}) {
  const paginationContainer = document.querySelector("#pagination")
  if (next !== null) {
    const link = document.createElement("a")
    link.setAttribute("class", 'btn')
    link.setAttribute('href', `/${varient}.html?page=${getUrlParams("page", next)}`)
    link.textContent = "next"
    paginationContainer.append(link)
  }
  if (previous !== null) {
    const link = document.createElement("a")
    link.setAttribute("class", 'btn')
    link.setAttribute('href', `/${varient}.html?page=${getUrlParams("page", previous)}`)
    link.textContent = 'previous'
    paginationContainer.append(link)
  }
}