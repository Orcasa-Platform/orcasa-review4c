// @apply can't be used without the preprocessor, so we need to apply the classes with JS

const customClasses = {
  'btn-primary': 'p-4 font-semibold text-white transition-all border border-mod-sc-ev bg-mod-sc-ev focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:pointer-events-none hover:bg-mod-sc-ev-dark hover:border-mod-sc-ev-dark focus-visible:outline-mod-sc-ev-dark',
  'btn-secondary': 'p-4 font-semibold transition-all bg-transparent border border-mod-sc-ev text-mod-sc-ev focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:pointer-events-none hover:text-mod-sc-ev-dark hover:bg-mod-sc-ev hover:text-white focus-visible:outline-mod-sc-ev-dark',
  'btn-filter': 'p-2 transition-all bg-gray-50 aria-pressed:bg-mod-sc-ev-light aria-pressed:text-mod-sc-ev-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:pointer-events-none hover:text-mod-sc-ev-dark hover:bg-mod-sc-ev-light focus-visible:mod-sc-ev-dark',
  'btn-icon': 'inline-block ml-2 align-middle transition-all rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:pointer-events-none'
};

function applyStyles(selector, classes) {
  const elements = document.querySelectorAll(selector);
  for (const element of elements) {
    element.classList.add(...classes.split(' '));
  }
}


Object.entries(customClasses).forEach(([key, value]) => {
  applyStyles(`.${key}`, value);
});
