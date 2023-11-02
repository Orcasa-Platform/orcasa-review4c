const mapStyle = {
  "version": 8,
  "name": "Orcasa",
  "center": [-2.6399654650078617, 39.94542670903479],
  "zoom": 6.243947994328476,
  "bearing": 0,
  "pitch": 0,
  "sources": {
    "labels": {
      "data": "/assets/country_labels.json",
      "type": "geojson"
    }
  },
  "sprite": "https://demotiles.maplibre.org/styles/osm-bright-gl-style/sprite",
  // Fonts generated with https://maplibre.org/font-maker/
  "glyphs": "/assets/glyphs/{fontstack}/{range}.pbf",
  "layers": [
    {
      "id": "background",
      "type": "background",
      "layout": {"visibility": "none"},
    },
    {
      "id": "countries-labels-dark",
      "type": "symbol",
      "paint": {
        "text-color": "#3C4363",
        "text-halo-color": "rgba(255, 255, 255, 0.5)",
        "text-halo-width": 2
      },
      "layout": {
        "visibility": "none",
        "text-field": [
          "get",
          "country_name"
        ],
        "text-anchor": "center",
        "text-padding": 15,
        "text-font": ["Roboto Slab"],
        "text-size": 14
      },
      "source": "labels",
      "metadata": {
        "group": "labels-dark",
        "position": "top"
      }
    },
    {
      "id": "countries-labels-light",
      "type": "symbol",
      "paint": {
        "text-color": "#FFFFFF",
        "text-halo-color": "rgba(29, 33, 51, 0.75)",
        "text-halo-width": 1.25
      },
      "layout": {
        "visibility": "none",
        "text-field": [
          "get",
          "country_name"
        ],
        "text-anchor": "center",
        "text-padding": 15,
        "text-font": ["Roboto Slab"],
        "text-size": 14
      },
      "source": "labels",
      "metadata": {
        "group": "labels-light",
        "position": "top"
      }
    }
  ],
  "id": "orcasa"
};