/**
 * @type { HTMLInputElement }
 */
const switchDLM = document.getElementById('darkmode');
if (!switchDLM) throw new Error("Impossible de trouver le bouton pour le darkmode");


/**
 * @type { "dark" | "light" }
 */
const mode = localStorage.getItem('mode') ?? "dark";
let modeLink = document.head.querySelector('#mode');
if (!modeLink) {
    modeLink = document.createElement('link');
    modeLink.id = 'mode'
    modeLink.rel = 'stylesheet';
    modeLink.type = 'text/css';
    modeLink.href = `/css/${mode}.css`;
    document.head.appendChild(modeLink);
}
modeLink.href = `/css/${mode}.css`;
switchDLM.checked = mode === "dark";


switchDLM.addEventListener('change', () => {
    const mode = switchDLM.checked ? 'dark' : 'light';
    let modeLink = document.head.querySelector('#mode');
    if (!modeLink) {
        modeLink = document.createElement('link');
        modeLink.id = 'mode'
        modeLink.rel = 'stylesheet';
        modeLink.type = 'text/css';
        modeLink.href = `/css/${mode}.css`;
        document.head.appendChild(modeLink);
    }
    modeLink.href = `/css/${mode}.css`;
    localStorage.setItem('mode', mode);
})