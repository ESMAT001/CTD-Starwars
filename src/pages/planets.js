import "../js/base";
import { fetchData, loading, showError, renderPlanets, pagination, getUrlParams } from "../js/utils";

const PLANETS_CONTAINER = document.querySelector("#planets")

async function main() {
    try {

        const [hideLoading, setLoadingText] = loading("loading");

        const page = getUrlParams("page")
        const options = {
            variant: "planets",
            setLoadingText: setLoadingText("planets"),
            page
        }
        const [planet, error] = await fetchData(options);
        if (error) {
            console.log(error);
            return;
        }
        renderPlanets(planet.results, PLANETS_CONTAINER);
        pagination('planets', planet)

        if (page) document.title = `Planets Page - ${page}`;

        hideLoading();
    } catch (error) {
        showError(error);
    }
}
main();