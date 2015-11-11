DBNAME="gwater" # the name of the database you're using. you can name this whatever you want.

topojson_files: map/app/data/county_usage_average_2010.topojson.json map/app/data/county_usage_change.topojson.json map/app/data/county_usage_2010.json

map/app/data/county_usage_change.topojson.json: output_data/county_usage_change.csv shapefiles/counties/counties.shp
	topojson \
	-o $@ \
	--no-pre-quantization \
	--post-quantization=1e6 \
	--simplify=7e-7 \
	-e output_data/county_usage_change.csv \
	--id-property=+FIPS \
	-p usage_difference \
	-- shapefiles/counties/counties.shp

output_data/county_usage_change.csv: dbtables/county_usage_2000_table dbtables/county_usage_2005_table dbtables/county_usage_2010_table
	psql -d $(DBNAME) -c "COPY (WITH counties AS (SELECT county_usage_2010.\"FIPS\", county_usage_2010.\"TO-WGWTo\" - county_usage_2005.\"TO-WGWTo\" as usage_difference FROM county_usage_2010 join county_usage_2005 on county_usage_2010.\"FIPS\" = county_usage_2005.\"FIPS\") SELECT * FROM counties ORDER BY usage_difference DESC) TO '$(abspath $@)' HEADER CSV;"
	touch $@

map/app/data/county_usage_average_2010.topojson.json: output_data/county_usage_with_percentage.csv shapefiles/counties/counties.shp
	topojson \
	-o $@ \
	--no-pre-quantization \
	--post-quantization=1e6 \
	--simplify=7e-7 \
	-e output_data/county_usage_with_percentage.csv \
	--id-property=+FIPS \
	-p pcnt_groundwater \
	-- shapefiles/counties/counties.shp

# convert county shapefile to topojson and join with 2010 county usage data
map/app/data/county_usage_2010.json: shapefiles/counties/counties.shp county_usage_csvs_simplified
	topojson \
	-o $@ \
	--no-pre-quantization \
	--post-quantization=1e6 \
	--simplify=7e-7 \
	-e input_data/county_usage_2010.csv \
	--id-property=+FIPS \
	-p \
	-- $<

#export CSV file of 2010 data with percentages
output_data/county_usage_with_percentage.csv: dbtables/county_usage_table_percent_groundwater
	psql -d $(DBNAME) -c "COPY (SELECT * FROM county_usage_2010 WHERE pcnt_groundwater IS NOT NULL ORDER BY \"FIPS\") TO '$(abspath $@)' CSV HEADER;"
	touch $@ 

#calculate percentage of total water usage that is groundwater in each county
dbtables/county_usage_table_percent_groundwater: dbtables/county_usage_2010_table
	psql -d $(DBNAME) -c "ALTER TABLE county_usage_2010 ADD COLUMN pcnt_groundwater FLOAT;"
	psql -d $(DBNAME) -c "UPDATE county_usage_2010 SET pcnt_groundwater = \"TO-WGWTo\" / \"TO-WTotl\";"
	touch $@

#import county usage data into database table
dbtables/county_usage_2000_table:  input_data/county_usage_2000.csv psql/county_usage_2000_sql_create.sql dbtables
	psql -d $(DBNAME) -c "DROP TABLE IF EXISTS county_usage_2000;"
	psql -d $(DBNAME) -f psql/county_usage_2000_sql_create.sql
	psql -d $(DBNAME) -c "\COPY county_usage_2000 FROM '$(abspath $<)' DELIMITER ',' CSV HEADER;"
	touch $@

dbtables/county_usage_2005_table:  input_data/county_usage_2005.csv psql/county_usage_2005_sql_create.sql dbtables
	psql -d $(DBNAME) -c "DROP TABLE IF EXISTS county_usage_2005;"
	psql -d $(DBNAME) -f psql/county_usage_2005_sql_create.sql
	psql -d $(DBNAME) -c "\COPY county_usage_2005 FROM '$(abspath $<)' DELIMITER ',' CSV HEADER;"
	touch $@

dbtables/county_usage_2010_table:  input_data/county_usage_2010.csv psql/county_usage_2010_sql_create.sql dbtables
	psql -d $(DBNAME) -c "DROP TABLE IF EXISTS county_usage_2010;"
	psql -d $(DBNAME) -f psql/county_usage_2010_sql_create.sql
	psql -d $(DBNAME) -c "\COPY county_usage_2010 FROM '$(abspath $<)' DELIMITER ',' CSV HEADER;"
	touch $@

psql/county_usage_2005_sql_create.sql: input_data/county_usage_2005.csv
	csvsql -i postgresql --tables county_usage_2005 input_data/county_usage_2005.csv > psql/county_usage_2005_sql_create.sql
psql/county_usage_2000_sql_create.sql: input_data/county_usage_2000.csv
	csvsql -i postgresql --tables county_usage_2000 input_data/county_usage_2000.csv > psql/county_usage_2000_sql_create.sql
psql/county_usage_2010_sql_create.sql: input_data/county_usage_2010.csv
	csvsql -i postgresql --tables county_usage_2010 input_data/county_usage_2010.csv > psql/county_usage_2010_sql_create.sql

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

shapefiles/counties/counties.shp: shapefiles/countyp010_nt00795/countyp010.shp
	mkdir -p shapefiles/counties
	ogr2ogr -f 'ESRI Shapefile' -where "FIPS NOT LIKE '%000'" $@ $<

#download county shapefile from US ATLAS
shapefiles/countyp010_nt00795/countyp010.shp:
	wget http://dds.cr.usgs.gov/pub/data/nationalatlas/countyp010_nt00795.tar.gz
	mkdir -p shapefiles/countyp010_nt00795
	mv countyp010_nt00795.tar.gz shapefiles/countyp010_nt00795
	tar xvfz shapefiles/countyp010_nt00795/countyp010_nt00795.tar.gz --directory shapefiles/countyp010_nt00795
	rm shapefiles/countyp010_nt00795/countyp010_nt00795.tar.gz

dbtables:
	# currently assumes database is already created
	# createdb "$(DBNAME)"
	mkdir $@