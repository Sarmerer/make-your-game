/**
 * @param {String} elementType element type e.g. div, p, img
 * @param {Object} props target element props
 */
export function NewHTMLElement(elementType, props) {
  let el = document.createElement(elementType);
  if (!el) return null;
  if (props) Object.assign(el, props);
  if (props?.style) Object.assign(el.style, props.style);
  return el;
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function vectorMagnitude(ax, ay, bx, by) {
  return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
}
