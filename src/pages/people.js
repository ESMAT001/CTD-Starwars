import "../js/base";
import { fetchData, loading, showError, renderPeople, pagination, getUrlParams } from "../js/utils";

const PEOPLE_CONTAINER = document.querySelector("#people")

async function main() {
    try {

        const [hideLoading, setLoadingText] = loading("loading");

        const page = getUrlParams("page")
        const options = {
            variant: "people",
            setLoadingText: setLoadingText("people"),
            page
        }
        const [people, error] = await fetchData(options);
        if (error) {
            console.log(error);
            return;
        }
        renderPeople(people.results, PEOPLE_CONTAINER);
        pagination('people', people)

        if (page) document.title = `People Page - ${page}`;
        
        hideLoading();
    } catch (error) {
        showError(error);
    }
}
main();