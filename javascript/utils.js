const kebabCase = text => text
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
}