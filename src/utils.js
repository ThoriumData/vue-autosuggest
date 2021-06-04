/** DOM Utilities */
function hasClass(el, className) {
    return el.classList.contains(className);
}

function addClass(el, className) {
    el.classList.add(className);
}

function removeClass(el, className) {
    el.classList.remove(className);
}

export { addClass, removeClass };
