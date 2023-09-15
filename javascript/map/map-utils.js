
const addSquareIcon = (map) => {
  const width = 64; // The image will be 64 pixels square
  const bytesPerPixel = 4; // Each pixel is represented by 4 bytes: red, green, blue, and alpha.
  const data = new Uint8Array(width * width * bytesPerPixel);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < width; y++) {
      const offset = (y * width + x) * bytesPerPixel;
      data[offset + 0] = 0; // red
      data[offset + 1] = 0; // green
      data[offset + 2] = 0; // blue
      data[offset + 3] = 255; // alpha
    }
  }
  // sdf is needed to be able to change icon color
  map.addImage('square', { width, height: width, data}, { sdf: true } );
}

const zoomButtonStyling = () => {
  const zoomInButton = document.querySelector('button.maplibregl-ctrl-zoom-in .maplibregl-ctrl-icon');
  const zoomOutButton = document.querySelector('button.maplibregl-ctrl-zoom-out .maplibregl-ctrl-icon');

  const zoomInSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="h-[24px] w-[24px]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-full w-full">
    <line x1="12" x2="12" y1="5" y2="19">
    </line>
    <line x1="5" x2="19" y1="12" y2="12"></line>
  </svg>`
  const zoomOutSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="h-[24px] w-[24px]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-full w-full">
    <line x1="5" x2="19" y1="12" y2="12"></line>
  </svg>`;
  zoomInButton.innerHTML = zoomInSVG;
  zoomOutButton.innerHTML = zoomOutSVG;
};
