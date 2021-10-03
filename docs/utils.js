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

export function vectorMagnitude(ax, ay, bx, by) {
  return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
}

export function shortestVectorIndex(vectors) {
  let min = null;
  let minIndex = -1;
  for (let i = 0; i < vectors.length; i++) {
    if (min == null || vectors[i] < min) {
      min = vectors[i];
      minIndex = i;
    }
  }
  return minIndex;
}
