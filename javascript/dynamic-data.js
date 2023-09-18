const button = ({ slug, name, documents }) =>
`<button
  type="button"
  data-slug=${slug}
  class="btn-filter btn-intervention"
  aria-pressed="false"
>
  <span class="font-semibold">
    ${name}
  </span>
  <span class="text-xs">
   (${documents?.toLocaleString()})
  </span>
  </button>`

const landUseMenu = document.getElementById('land-use-menu');

getData().then(data => {
  if (landUseMenu && data) {
    const landUses = Object.entries(data).map(([key, value]) => ({ slug: key, ...value }));
    console.log(landUses)
    landUses.forEach(landUse => {
      landUseMenu.innerHTML += button(landUse);
    });
  }
});