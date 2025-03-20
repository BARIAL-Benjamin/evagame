/**
 * @type { NodeListOf<HTMLTableRowElement> }
 */
const episodes = document.querySelectorAll('.episode');

episodes.forEach(episode => {
    episode.addEventListener('click', e => {
        e.preventDefault();
        episode.classList.toggle('expend');
    })
})