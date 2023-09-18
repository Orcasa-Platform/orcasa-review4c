const interventionData = {
  "cropland": {
    "name": "Cropland",
    "documents": 5632,
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
    "documents": 3500,
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
    "documents": 1000,
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
    "documents": 900,
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
    "documents": 563,
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
        documents: 23
      },
      "fire": {
        name: "Fire",
        "value": 11,
        "low": -23,
        "high": 31,
        documents: 512
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
        documents: 112
      },
      "cropland-to-grassland": {
        name: "Cropland to Grassland",
        "value": 11,
        "low": -23,
        "high": 31,
        documents: 51
      },
      "cropland-to-other-land": {
        name: "Cropland to Other Land",
        "value": 27,
        "low": 23,
        "high": 91,
        documents: 51
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
        documents: 51
      },
      "agroforestry": {
        name: "Agroforestry",
        "value": 27,
        "low": 23,
        "high": 91,
        documents: 51
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