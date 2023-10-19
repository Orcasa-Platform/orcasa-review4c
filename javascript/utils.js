const kebabCase = text => text
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

const capitalize = text => text.charAt(0).toUpperCase() + text.slice(1);

const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
}

const ellipsis = (text, length) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

const uniq = (arr) => [...new Set(arr)];

const formatNumber = (value) => {
  // The French number format uses spaces to separate thousands, millions, etc. and a comma to
  // separate the decimals e.g. 1 456 357,45
  const formatter = Intl.NumberFormat('fr');
  return formatter.format(value);
};