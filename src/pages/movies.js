import "../js/base";
import { fetchData, loading, showError, renderMovies } from "../js/utils";

const MOVIES_CONTAINER = document.querySelector("#movies")


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
        hideLoading();

    } catch (error) {
        showError(error);
    }
}
main();