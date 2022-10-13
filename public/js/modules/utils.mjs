export function toggleClass(elem, clss) {
  if (elem.classList.contains(clss)) {
    elem.classList.remove(clss);
  }
  else {
    elem.classList.add(clss);
  };
}