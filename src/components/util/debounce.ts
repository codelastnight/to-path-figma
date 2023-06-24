/**
 * debounce
 * https://www.joshwcomeau.com/snippets/javascript/debounce/
 * @param callback
 * @param wait
 * @returns
 */
const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
};

export default debounce;
