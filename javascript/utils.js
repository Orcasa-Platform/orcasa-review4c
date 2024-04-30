const isMobile = window.innerWidth < 1024;

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

const descriptionText = (mainInterventionName, title, fixedValue) => ({
  'Climate Change': `Overall, ${title} led to a ${fixedValue > 0 ? '+' : ''}${fixedValue}% change in soil organic carbon compared to its absence.`,
  'Management': `On average, using ${title} was ${Math.abs(fixedValue)}% ${fixedValue > 0 ? 'more' : 'less'} effective compared to not using it.`,
  'Land Use Change': `On average, converting ${title} ${fixedValue > 0 ? 'increased' : 'decreased'} by ${Math.abs(fixedValue)}% SOC.`
}[mainInterventionName] || '');

const startCase = (str) => str.replace(/_/g, ' ').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());