import "../js/base";
import { fetchData, loading, showError} from "../js/utils";

async function main() {
    try {

        const [hideLoading, setLoadingText] = loading("loading");

        const [people, error] = await fetchData({
            variant: "people",
            setLoadingText: setLoadingText("people"),
        });
        if (error) {
            console.log(error);
            return;
        }
        renderPeople(people.results);

        hideLoading();

    } catch (error) {
        showError(error);
    }
}
main();