
// import renderCandidates from "./pages/candidates/candidates.js";
import renderResults from "./pages/results/results.js";


let root = "/";
const router = new Navigo("/", { hash: true });

router
    .on({
        "/": () => {
            renderCandidates();
        },
        
        "/results" : () => {
            renderResults();
        },
    })
    .resolve();