const summary = document.getElementById('summary');
if (!summary) throw new Error("Pas d'élément sommaire");

/**
 * @type {NodeListOf<HTMLHeadingElement>}
 */
const titles = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
const liste = document.createElement('ul');

titles.forEach(title => {
    const li = document.createElement('li');
    const text = title.textContent.trim();
    const content = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(/[\ \'\\\/\|\`\~\@\^\(\)\[\]\{\}\#\%\&\:\,\.\_\!\$\*\+]/g, "-");
    title.id = content;

    const a = document.createElement('a');
    a.textContent = text;
    a.href = `#${content}`;

    li.append(a);
    liste.append(li);
})

summary.append(liste);