const interventionData = {
  "cropland": {
    "name": "Cropland",
    "publications": 5632,
    "metaAnalysis": 563,
    "interventions": [
      {
        "name": "climate change",
        "URL": "http://review4c.net/files/climate-change.json",
      },
      {
        "name": "land use",
        "URL": "http://review4c.net/files/land-use.json",
      },
      {
        "name": "management",
        "URL": "http://review4c.net/files/management.json",
      },
    ],
  },
  "forest-land": {
    "name": "Forest Land",
    "publications": 3500,
    "metaAnalysis": 350,
    "default": false,
    "interventions": [
      {
        "name": "climate change",
        "URL": "http://review4c.net/files/climate-change.json",
      },
      {
        "name": "land use",
        "URL": "http://review4c.net/files/land-use.json",
      },
      {
        "name": "management",
        "URL": "http://review4c.net/files/management.json",
      },
    ],
  },

  "grassland": {
    "name": "Grassland",
    "publications": 1000,
    "metaAnalysis": 100,
    "interventions": [
      {
        "name": "climate change",
        "URL": "http://review4c.net/files/climate-change.json",
      },
      {
        "name": "land use",
        "URL": "http://review4c.net/files/land-use.json",
      },
      {
        "name": "management",
        "URL": "http://review4c.net/files/management.json",
      },
    ],
  },
  "wetlands": {
    "name": "Wetlands",
    "publications": 900,
    "metaAnalysis": 90,
    "interventions": [
      {
        "name": "Wetlands",
        "URL": "http://review4c.net/files/climate-change.json",
      },
      {
        "name": "land use",
        "URL": "http://review4c.net/files/land-use.json",
      },
      {
        "name": "management",
        "URL": "http://review4c.net/files/management.json",
      },
    ],
  },
  "other-land": {
    "name": "Other Land",
    "publications": 563,
    "metaAnalysis": 56,
    "interventions": [
      {
        "name": "Wetlands",
        "URL": "http://review4c.net/files/climate-change.json",
      },
      {
        "name": "land use",
        "URL": "http://review4c.net/files/land-use.json",
      },
      {
        "name": "management",
        "URL": "http://review4c.net/files/management.json",
      },
    ],
  },
}

const croplandData = {
  "climate-change": {
    name: "Climate Change",
    "sub-categories": {
      "warming": {
        name: "Warming",
        "value": -5,
        "low": -11,
        "high": 11,
        publications: 23
      },
      "fire": {
        name: "Fire",
        "value": 11,
        "low": -23,
        "high": 31,
        publications: 512
      },
    }
  },
  "land-use": {
    name: "Land Use Change",
    "sub-categories": {
      "cropland-to-forestland": {
        name: "Cropland to Forestland",
        "value": 37,
        "low": -26,
        "high": 50,
        publications: 112
      },
      "cropland-to-grassland": {
        name: "Cropland to Grassland",
        "value": 11,
        "low": -23,
        "high": 31,
        publications: 51
      },
      "cropland-to-other-land": {
        name: "Cropland to Other Land",
        "value": 27,
        "low": 23,
        "high": 91,
        publications: 51
      },
    }
  },
  "management": {
    name: "Management",
    "sub-categories": {
      "organic-farming": {
        name: "Organic Farming",
        "value": 11,
        "low": -23,
        "high": 31,
        publications: 51
      },
      "agroforestry": {
        name: "Agroforestry",
        "value": 27,
        "low": 23,
        "high": 91,
        publications: 51
      },
    }
  }
};

// Only because we don't have the API yet. Will not be used
const interventionMocks = {
  cropland: croplandData,
  forest: croplandData,
  grassland: croplandData,
  wetlands: croplandData,
  other: croplandData,
}