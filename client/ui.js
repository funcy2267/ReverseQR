function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const mainApp = document.getElementById("mainApp");
const clientSelect = document.getElementById("clientSelect");
const clients = document.getElementById("clients");

const mainAppTransitionDuration = 500;

async function selectClientMode(id) {
    mainApp.classList.add("mainAppAnimation");
    await sleep(mainAppTransitionDuration);
    clientSelect.style.display = "none";
    clients.style.display = "block";
    switch (id) {
        case (1):
            client1.style.display = "block";
            break;
        case (2):
            client2.style.display = "block";
            break;
        case (3):
            client3.style.display = "block";
            break;
    }
    mainApp.classList.remove("mainAppAnimation");
}

async function backToClientSelect() {
    mainApp.classList.add("mainAppAnimation");
    await sleep(mainAppTransitionDuration);
    clientSelect.style.display = "block";
    clients.style.display = "none";
    for (const child of clients.children) {
        child.style.display = "none";
    }
    mainApp.classList.remove("mainAppAnimation");
    pairStatus3.innerHTML = "";
}
