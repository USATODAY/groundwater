DBNAME="gwater" # the name of the database you're using. you can name this whatever you want.

map/data/county_usage_average_2010.topojson.json: output_data/county_usage_percent.topojson.json
	cp output_data/county_usage_percent.topojson.json map/app/data/county_usage_average_2010.topojson.json

output_data/county_usage_percent.topojson.json: output_data/county_usage_with_percentage.csv shapefiles/countyp010_nt00795/countyp010.shp
	topojson \
	-o output_data/county_usage_percent.topojson.json \
	-e output_data/county_usage_with_percentage.csv \
	--id-property=+FIPS \
	-p pcnt_groundwater \
	-- shapefiles/countyp010_nt00795/countyp010.shp

#export CSV file of 2010 data with percentages
output_data/county_usage_with_percentage.csv: dbtables/county_usage_table_percent_groundwater
	psql -d $(DBNAME) -c "COPY (SELECT * FROM county_usage WHERE \"YEAR\" = 2010 AND pcnt_groundwater IS NOT NULL ORDER BY \"FIPS\") TO '$(abspath $@)' CSV HEADER;"
	touch $@ 

#calculate percentage of total water usage that is groundwater in each county
dbtables/county_usage_table_percent_groundwater: dbtables/county_usage_table
	psql -d $(DBNAME) -c "ALTER TABLE county_usage ADD COLUMN pcnt_groundwater FLOAT;"
	psql -d $(DBNAME) -c "UPDATE county_usage SET pcnt_groundwater = \"TO-WGWTo\" / \"TO-WTotl\";"
	touch $@

#import county usage data into database table
dbtables/county_usage_table: input_data/county_usage_summary.csv psql/county_usage_sql_create.sql dbtables
	psql -d $(DBNAME) -c "DROP TABLE IF EXISTS county_usage;"
	psql -d $(DBNAME) -f psql/county_usage_sql_create.sql
	psql -d $(DBNAME) -c "\COPY county_usage FROM '$(abspath $<)' DELIMITER ',' CSV HEADER;"
	touch $@

psql/county_usage_sql_create.sql: input_data/county_usage_summary.csv
	csvsql -i postgresql --tables county_usage input_data/county_usage_summary.csv > psql/county_usage_sql_create.sql

input_data/county_usage_summary.csv: county_usage_csvs_simplified
	csvstack -g 2000,2005,2010 -n YEAR input_data/county_usage_2000.csv input_data/county_usage_2005.csv input_data/county_usage_2010.csv > input_data/county_usage_summary.csv

county_usage_csvs_simplified: input_data/county_usage_2000.csv input_data/county_usage_2005.csv input_data/county_usage_2010.csv

input_data/county_usage_2000.csv:
	csvcut -c STATE,FIPS,"TP-TotPop","TO-WGWTo","TO-WTotl" input_data/usco2000.csv > input_data/county_usage_2000.csv

input_data/county_usage_2005.csv:
	csvcut -c STATE,FIPS,"TP-TotPop","TO-WGWTo","TO-WTotl" input_data/usco2005.csv > input_data/county_usage_2005.csv

input_data/county_usage_2010.csv:
	csvcut -c STATE,FIPS,"TP-TotPop","TO-WGWTo","TO-WTotl" input_data/usco2010.csv > input_data/county_usage_2010.csv

county_usage_csvs: input_data/usco2000.csv input_data/usco2005.csv input_data/usco2010.csv

input_data/usco2000.csv: county_usage_raw
	in2csv input_data/usco2000.xls > input_data/usco2000.csv

input_data/usco2005.csv: county_usage_raw
	in2csv input_data/usco2005.xls > input_data/usco2005.csv

input_data/usco2010.csv: county_usage_raw
	in2csv -f xls input_data/usco2010.xls > input_data/usco2010.csv

county_usage_raw: input_data/usco2000.xls input_data/usco2010.xls input_data/usco2005.xls

input_data/usco2010.xls:
	wget http://water.usgs.gov/watuse/data/2010/usco2010.xlsx
	mv usco2010.xlsx input_data/usco2010.xls

input_data/usco2005.xls:
	wget http://water.usgs.gov/watuse/data/2005/usco2005.xls
	mv usco2005.xls input_data

input_data/usco2000.xls:
	wget http://water.usgs.gov/watuse/data/2000/usco2000.xls
	mv usco2000.xls input_data

# convert county shapefile to topojson and join with 2010 county usage data
output_data/county_usage_2010.json: shapefiles/countyp010_nt00795/countyp010.shp county_usage_csvs_simplified
	topojson \
	-o output_data/county_usage_2010.json \
	-e input_data/county_usage_2010.csv \
	--id-property=+FIPS \
	-p \
	-- shapefiles/countyp010_nt00795/countyp010_nt00795.shp

#download county shapefile from US ATLAS
shapefiles/countyp010_nt00795/countyp010.shp:
	wget http://dds.cr.usgs.gov/pub/data/nationalatlas/countyp010_nt00795.tar.gz
	mkdir shapefiles/countyp010_nt00795
	mv countyp010_nt00795.tar.gz shapefiles/countyp010_nt00795
	tar xvfz shapefiles/countyp010_nt00795/countyp010_nt00795.tar.gz --directory shapefiles/countyp010_nt00795
	rm shapefiles/countyp010_nt00795/countyp010_nt00795.tar.gz

dbtables:
	# currently assumes database is already created
	# createdb "$(DBNAME)"
	mkdir $@