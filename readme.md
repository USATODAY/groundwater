#Groundwater data conversion and analysis

##What is this?

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

And you'll need to enable the postgis extension on your database. Let's create a database balled `gwater` with
```
createdb gwater
```
and then enable postgis with
```
psql -d gwater -c 'CREATE EXTENSION postgis'
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

### Getting data into and out of the database
First step is to import the us counties and states shapefiles from the USGS into the database. SQL files are already generated in the [psql](psql/) directory. If you need to regenerate these files for any reason, or want to add more geographic data use postgis' shp2pgsql command line tool like:

```
shp2pgsql -I -s 4269 shapefiles/2010_counties/counties.shp gwater > counties.sql
```

Once you have SQL files for counties, states and aquifers, load them into the database with

```
psql -d gwater -f psql/counties.sql
psql -d gwater -f psql/states.sql
psql -d gwater -f psql/aquifers.sql
```

Raw data for USGS water measurement sites is included at [input_data/USGS_data_for_map_1020.csv](input_data/USGS_data_for_map_1020.csv). Convert this file to the format we need by running
```
python convert.py input_data/USGS_data_for_map_1020.csv
```

This will generate sites.csv in the output_data folder. This is what we'll use to import into our database.

Now open up the [input.sql](psql/input.sql) file and connect to your database with psql -d gwater. Follow each step of input.sql taking care to change the absolute filepath to the correct equivelant for your filestructure.

Once this is done, we should have all of our sites data imported and connected to our geographic tables via postgis queries.

The [output.sql](/psql/output.sql) file has instructions for outputting csv's of county data as well as aquifer data. 

###Creating topojson to use for maps
Once you have county_averages.csv, you can use that file directly in our mapping setup. To create a topojson file of the aquifer data, we will combine our aquifer_averages.csv with the aquifer shapefiles with the topojson command line utility:
```
topojson \
-o output_data/aquifers_topo.json \
-e output_data/aquifer_averages.csv \
-p aquifer,avg_decrease \
--id-property aquifer,AQ_NAME \
-- shapefiles/aquifers_us/us_aquifers.shp
```

## TO DO

Add map code
