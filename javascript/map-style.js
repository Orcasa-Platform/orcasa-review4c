const mapStyle = {
  "version": 8,
  "name": "OSM Liberty",
  "metadata": {
    "maputnik:license": "https://github.com/maputnik/osm-liberty/blob/gh-pages/LICENSE.md",
    "maputnik:renderer": "mbgljs",
    "openmaptiles:version": "3.x",
  },
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
  "sprite": "https://maputnik.github.io/osm-liberty/sprites/osm-liberty",
  "glyphs": "https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=8k3OpweQg8O0TfOOUwcF",
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