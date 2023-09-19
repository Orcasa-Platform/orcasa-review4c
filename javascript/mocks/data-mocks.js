const interventionData = {
  "cropland": {
    "name": "Cropland",
    "publications": 5632,
    "metaAnalysis": 563,
    "interventions": [
      {
        "slug": "climate-change",
        "URL": "http://review4c.net/files/climate-change.json",
      },
      {
        "slug": "land-use",
        "URL": "http://review4c.net/files/land-use.json",
      },
      {
        "slug": "management",
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
        "slug": "land-use",
        "URL": "http://review4c.net/files/land-use.json",
      },
      {
        "slug": "climate-change",
        "URL": "http://review4c.net/files/climate-change.json",
      },
      {
        "slug": "management",
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
        "slug": "land-use",
        "URL": "http://review4c.net/files/land-use.json",
      },
      {
        "slug": "management",
        "URL": "http://review4c.net/files/management.json",
      },
      {
        "slug": "climate-change",
        "URL": "http://review4c.net/files/climate-change.json",
      },
    ],
  },
  "wetlands": {
    "name": "Wetlands",
    "publications": 900,
    "metaAnalysis": 90,
    "interventions": [
      {
        "slug": "management",
        "URL": "http://review4c.net/files/management.json",
      },
      {
        "slug": "land-use",
        "URL": "http://review4c.net/files/land-use.json",
      },
      {
        "slug": "climate-change",
        "URL": "http://review4c.net/files/climate-change.json",
      },
    ],
  },
  "other-land": {
    "name": "Other Land",
    "publications": 563,
    "metaAnalysis": 56,
    "interventions": [
      {
        "slug": "climate-change",
        "URL": "http://review4c.net/files/climate-change.json",
      },
      {
        "slug": "land-use",
        "URL": "http://review4c.net/files/land-use.json",
      },
    ],
  },
}

// Only because we don't have the API yet. Will not be used

const climateChangeMock = {
  name: "Climate Change",
  slug: "climate-change",
  description: "Soil organic carbon (SOC) change (%)",
  "sub-categories": [
    {
      title: "Warming",
      "value": -5,
      "low": -11,
      "high": 11,
      publications: 23,
      details: [
        {
          title: "sub-type 1",
          "value": 25,
          "low": -11,
          "high": 31,
          publications: 13
        },
        {
          title: "sub-type 2",
          "value": -6,
          "low": -10,
          "high": 11,
          publications: 10
        },
      ]
    },{
      title: "Fire",
      "value": 11,
      "low": -23,
      "high": 31,
      publications: 512,
      details: [
        {
          title: "sub-type 1",
          "value": -20,
          "low": -41,
          "high": -11,
          publications: 413
        },
        {
          title: "sub-type 2",
          "value": -36,
          "low": -70,
          "high": 11,
          publications: 99
        },
      ]
    },
  ]
};

const landUseMock = {
  name: "Land Use Change",
  slug: "land-use-change",
  description: "Soil organic carbon (SOC) change (%)",
  "sub-categories": [
    {
      title: "Cropland to Forestland",
      "value": 37,
      "low": -26,
      "high": 50,
      publications: 112,
      details: [
        {
          title: "sub-type 1",
          "value": -20,
          "low": -41,
          "high": -11,
          publications: 13
        },
        {
          title: "sub-type 2",
          "value": -36,
          "low": -70,
          "high": 11,
          publications: 99
        },
      ]
    },{
      title: "Cropland to Grassland",
      "value": 11,
      "low": -23,
      "high": 31,
      publications: 51,
      details: [
        {
          title: "sub-type 1",
          "value": -20,
          "low": -41,
          "high": -11,
          publications: 43
        },
        {
          title: "sub-type 2",
          "value": -36,
          "low": -70,
          "high": 11,
          publications: 8
        },
      ]
    },{
      title: "Cropland to Other Land",
      "value": 27,
      "low": 23,
      "high": 91,
      publications: 51,
      details: [
        {
          title: "sub-type 1",
          "value": -20,
          "low": -41,
          "high": -11,
          publications: 1
        },
        {
          title: "sub-type 2",
          "value": -36,
          "low": -70,
          "high": 11,
          publications: 25
        },
        {
          title: "sub-type 3",
          "value": -36,
          "low": -70,
          "high": 11,
          publications: 25
        },
      ]
    }
  ]
};

const managementMock = {
  name: "Management",
  slug: "management",
  description: "Soil organic carbon (SOC) change (%)",
  "sub-categories": [{
      title: "Organic Farming",
      "value": 11,
      "low": -23,
      "high": 31,
      publications: 51,
      details: [
        {
          title: "sub-type 1",
          "value": -20,
          "low": -41,
          "high": -11,
          publications: 7
        },
        {
          title: "sub-type 2",
          "value": -36,
          "low": -70,
          "high": 11,
          publications: 44
        },
      ]
    },
    {
      title: "Agroforestry",
      "value": 27,
      "low": 23,
      "high": 91,
      publications: 51,
      details: [
        {
          title: "sub-type 1",
          "value": -20,
          "low": -41,
          "high": -11,
          publications: 50
        },
        {
          title: "sub-type 2",
          "value": -36,
          "low": -70,
          "high": 11,
          publications: 1
        },
      ]
    },
  ]
};


const interventionMocks = {
  "climate-change": climateChangeMock,
  "land-use": landUseMock,
  "management": managementMock,
};