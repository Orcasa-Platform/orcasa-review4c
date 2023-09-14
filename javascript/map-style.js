const mapStyle = {
  "version": 8,
  "name": "Orcasa",
  "center": [-2.6399654650078617, 39.94542670903479],
  "zoom": 6.243947994328476,
  "bearing": 0,
  "pitch": 0,
  "sources": {
    "labels": {
      "data": "https://raw.githubusercontent.com/Orcasa-Platform/orcasa/main/client/public/country_labels.json",
      "type": "geojson"
    }
  },
  "sprite": "https://demotiles.maplibre.org/styles/osm-bright-gl-style/sprite",
  "glyphs": "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  "layers": [
    {
      "id": "background",
      "type": "background",
      "layout": {"visibility": "visible"},
      "paint": {"background-color": "#f8f4f0"}

    },
    {
      "id": "countries-labels-light",
      "type": "symbol",
      "paint": {
        "text-color": "#fff"
      },
      "layout": {
        "text-field": [
          "get",
          "country_name"
        ],
        "text-anchor": "top"
      },
      "source": "labels",
      "metadata": {
        "position": "top"
      }
    },
    {
      "id": "countries-labels",
      "type": "symbol",
      "layout": {
        "text-field": [
          "get",
          "country_name"
        ],
        "text-anchor": "top"
      },
      "source": "labels",
      "metadata": {
        "position": "top"
      }
    },
  ],
  "id": "orcasa"
};