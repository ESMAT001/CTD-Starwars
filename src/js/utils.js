export const BASE_API_URL = "https://swapi.dev/api/";

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
  variant = "films",
  id,
  setLoadingText = () => {},
} = {}) {
  setLoadingText();
  if (id) {
    const url = `${BASE_API_URL}${variant}/${id}`;
    return await fetchWithErrorHandling({ url });
  }
  const url = `${BASE_API_URL}${variant}`;
  return await fetchWithErrorHandling({ url });
}

export function loading(id) {
  document.body.classList.add("overflow-hidden");
  const loading = document.getElementById(id);
  const loadingTxt = document.querySelector(`#${id} > p`);
  return [
    () => {
      loading.remove();
      document.body.classList.remove("overflow-hidden");
    },
    (txt) => {
      return () => (loadingTxt.textContent = `Loading ${txt}`);
    },
  ];
}

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

export function getUrlParams(param = "id") {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  return params[param];
}


export function getIdFromUrl(url){
  return url.slice(0, -1).split("/").pop()
}