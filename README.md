# orcasa-review4c
Static Orcasa project code to work as documentation or template for the Review4c website

## Installation

Rename env.example.js to env.js and fill the variables with the correct values

## Main data endpoints

### /data/charts

index.json will contain the information about each land-use and also the main-interventions order for each one

Tree structure: Each land use will be represented by a folder and inside each main intervention will also have one with a dedicated json file for each chart. The land uses don't have a dedicated json file, as we only have charts for main interventions.


### /data/pubications

Tree structure with index.json

### /filters/

country.json: countries with iso_2digit and name. iso_2digit will be used for filters
journal.json: journal_id will be used for filters.

date.json: years with name and value. Currently not used. Filters will use the available years

### /layers

Tree structure with index.json

## Data classification