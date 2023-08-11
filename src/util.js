export default function tagClass(tag, ...string) {
    let div = document.createElement(tag);
    string.forEach( s => div.classList.add(s));

    return div;
}