#Groundwater Interactive Graphics

##What is this?
This repository contains both the raw data and data analysis scripts, as well as the code that powers several interactive graphics

##Graphics
TO DO include template folder and example for each new interactive graphic.

##Groundwater data conversion and analysis

A set of data, tools, and instructions for analyzing and converting groundwater data files

##Requirements
You'll need a few tools intalled to work with this data.

First up, you'll need Postgres running locally. If you don't have it, I reccomend installing via Homebrew with
```
brew install postgresql
```

Because we are working with geographical data, you'll also need postgis installed
```
brew install postgis
```

Now the database is ready to go. Now set up a python environment and install python requirements

```
pip install -r requirements.txt
```

And finally make sure you have topojson installed
```
npm install topojson
```

##Analysis & data conversion steps

Raw data for USGS water measurement sites is included at [data/input_data/USGS_data_for_map_1020.csv](data/input_data/USGS_data_for_map_1020.csv). Also included is raw data for water level changes in India by district.

To process input data, and to creat mapping files from sources, simply run `make`. This will require that postgres is running and set up as described. This we download necessary shapefiles, and generate topojson files for d3 mapping.

