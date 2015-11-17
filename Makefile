DBNAME="gwater" # the name of the database you're using. you can name this whatever you want.

topojson_files: map/app/data/county_usage_average_2010.topojson.json map/app/data/county_usage_change.topojson.json map/app/data/county_usage_2010.json map/app/data/ogallala.topojson.json map/app/data/india.topo.json

map/app/data/india.topo.json: data/shapefiles/IND_adm/IND_adm3.shp data/output_data/india_levels.csv
	topojson \
	-o $@ \
	-e output_data/india_levels.csv \
	-p district=District,differece=Difference_Feet \
	--id-property=District,NAME_2 \
	-- $<

map/app/data/county_usage_change.topojson.json: data/output_data/county_usage_change.csv data/shapefiles/counties/counties.shp
	topojson \
	-o $@ \
	--no-pre-quantization \
	--post-quantization=1e6 \
	--simplify=7e-7 \
	-e output_data/county_usage_change.csv \
	--id-property=+FIPS \
	-p usage_difference \
	-- shapefiles/counties/counties.shp

data/output_data/county_usage_change.csv: data/dbtables/county_usage_2000_table data/dbtables/county_usage_2005_table data/dbtables/county_usage_2010_table
	psql -d $(DBNAME) -c "COPY (WITH counties AS (SELECT county_usage_2010.\"FIPS\", county_usage_2010.\"TO-WGWTo\" - county_usage_2005.\"TO-WGWTo\" as usage_difference FROM county_usage_2010 join county_usage_2005 on county_usage_2010.\"FIPS\" = county_usage_2005.\"FIPS\") SELECT * FROM counties ORDER BY usage_difference DESC) TO '$(abspath $@)' HEADER CSV;"
	touch $@

map/app/data/county_usage_average_2010.topojson.json: data/output_data/county_usage_with_percentage.csv data/shapefiles/counties/counties.shp
	topojson \
	-o $@ \
	--no-pre-quantization \
	--post-quantization=1e6 \
	--simplify=7e-7 \
	-e @< \
	--id-property=+FIPS \
	-p pcnt_groundwater \
	-- shapefiles/counties/counties.shp

# convert county shapefile to topojson and join with 2010 county usage data
map/app/data/county_usage_2010.json: data/shapefiles/counties/counties.shp county_usage_csvs_simplified
	topojson \
	-o $@ \
	--no-pre-quantization \
	--post-quantization=1e6 \
	--simplify=7e-7 \
	-e data/output_data/county_usage_2010.csv \
	--id-property=+FIPS \
	-p \
	-- $<

map/app/data/ogallala.topojson.json: data/shapefiles/ogallala/ogallala.shp
	topojson \
	-o $@ \
	--no-pre-quantization \
	--post-quantization=1e6 \
	--simplify=7e-7 \
	-p name=AQ_NAME \
	-- $<

#export CSV file of 2010 data with percentages
data/output_data/county_usage_with_percentage.csv: data/dbtables/county_usage_table_percent_groundwater
	psql -d $(DBNAME) -c "COPY (SELECT * FROM county_usage_2010 WHERE pcnt_groundwater IS NOT NULL ORDER BY \"FIPS\") TO '$(abspath $@)' CSV HEADER;"
	touch $@ 

#calculate percentage of total water usage that is groundwater in each county
data/dbtables/county_usage_table_percent_groundwater: data/dbtables/county_usage_2010_table
	psql -d $(DBNAME) -c "ALTER TABLE county_usage_2010 ADD COLUMN pcnt_groundwater FLOAT;"
	psql -d $(DBNAME) -c "UPDATE county_usage_2010 SET pcnt_groundwater = \"TO-WGWTo\" / \"TO-WTotl\";"
	touch $@

#import county usage data into database table
data/dbtables/county_usage_2000_table:  data/output_data/county_usage_2000.csv data/psql/county_usage_2000_sql_create.sql data/dbtables
	psql -d $(DBNAME) -c "DROP TABLE IF EXISTS county_usage_2000;"
	psql -d $(DBNAME) -f psql/county_usage_2000_sql_create.sql
	psql -d $(DBNAME) -c "\COPY county_usage_2000 FROM '$(abspath $<)' DELIMITER ',' CSV HEADER;"
	touch $@

data/dbtables/county_usage_2005_table:  data/output_data/county_usage_2005.csv data/psql/county_usage_2005_sql_create.sql data/dbtables
	psql -d $(DBNAME) -c "DROP TABLE IF EXISTS county_usage_2005;"
	psql -d $(DBNAME) -f psql/county_usage_2005_sql_create.sql
	psql -d $(DBNAME) -c "\COPY county_usage_2005 FROM '$(abspath $<)' DELIMITER ',' CSV HEADER;"
	touch $@

data/dbtables/county_usage_2010_table:  data/output_data/county_usage_2010.csv data/psql/county_usage_2010_sql_create.sql data/dbtables
	psql -d $(DBNAME) -c "DROP TABLE IF EXISTS county_usage_2010;"
	psql -d $(DBNAME) -f psql/county_usage_2010_sql_create.sql
	psql -d $(DBNAME) -c "\COPY county_usage_2010 FROM '$(abspath $<)' DELIMITER ',' CSV HEADER;"
	touch $@

data/psql/county_usage_2005_sql_create.sql: data/output_data/county_usage_2005.csv
	csvsql -i postgresql --tables county_usage_2005 $< > $@

data/psql/county_usage_2000_sql_create.sql: data/output_data/county_usage_2000.csv
	csvsql -i postgresql --tables county_usage_2000 o$< > $@

data/psql/county_usage_2010_sql_create.sql: data/output_data/county_usage_2010.csv
	csvsql -i postgresql --tables county_usage_2010 $< > $@

data/output_data/county_usage_summary.csv: county_usage_csvs_simplified
	csvstack -g 2000,2005,2010 -n YEAR data/output_data/county_usage_2000.csv data/output_data/county_usage_2005.csv data/output_data/county_usage_2010.csv > $@

county_usage_csvs_simplified: data/output_data/county_usage_2000.csv data/output_data/county_usage_2005.csv data/output_data/county_usage_2010.csv

data/output_data/india_levels.csv:
	in2csv data/input_data/India_district-level_groundwater_data.xlsx > $@

data/output_data/county_usage_2000.csv: data/output_data/usco2000.csv
	csvcut -c STATE,FIPS,"TP-TotPop","TO-WGWTo","TO-WTotl" $< > $@

data/output_data/county_usage_2005.csv: data/output_data/usco2005.csv
	csvcut -c STATE,FIPS,"TP-TotPop","TO-WGWTo","TO-WTotl" $< > $@

data/output_data/county_usage_2010.csv: data/output_data/usco2010.csv
	csvcut -c STATE,FIPS,"TP-TotPop","TO-WGWTo","TO-WTotl" $< > $@

data/county_usage_csvs: data/output_data/usco2000.csv output_data/usco2005.csv data/output_data/usco2010.csv

data/output_data/usco2000.csv: county_usage_raw
	in2csv data/output_data/usco2000.xls > data/output_data/usco2000.csv

data/output_data/usco2005.csv: county_usage_raw
	in2csv data/output_data/usco2005.xls > data/output_data/usco2005.csv

data/output_data/usco2010.csv: county_usage_raw
	in2csv -f xls data/output_data/usco2010.xls > data/output_data/usco2010.csv

county_usage_raw: data/output_data/usco2000.xls data/output_data/usco2010.xls data/output_data/usco2005.xls

data/output_data/usco2010.xls:
	wget http://water.usgs.gov/watuse/data/2010/usco2010.xlsx
	mv usco2010.xlsx data/output_data/usco2010.xls

data/output_data/usco2005.xls:
	wget http://water.usgs.gov/watuse/data/2005/usco2005.xls
	mv usco2005.xls data/output_data

data/output_data/usco2000.xls:
	wget http://water.usgs.gov/watuse/data/2000/usco2000.xls
	mv usco2000.xls data/output_data

data/dbtables/geotables: data/dbtables/counties data/dbtables/states data/dbtables/us_aquifers
	touch $@

data/dbtables/counties: data/psql/counties.sql data/dbtables
	psql -d $(DBNAME) -f $<
	touch $@

data/dbtables/states: data/psql/states.sql data/dbtables
	psql -d $(DBNAME) -f $<
	touch $@

data/dbtables/us_aquifers: data/psql/us_aquifers.sql data/dbtables
	psql -d $(DBNAME) -f $<
	touch $@

data/psql/us_aquifers.sql: data/shapefiles/aquifers_us/us_aquifers.shp
	shp2pgsql -I -s 4269 $< > $@

data/psql/counties.sql: data/shapefiles/counties/counties.shp
	shp2pgsql -I -s 4269 $< > $@

data/psql/states.sql: data/shapefiles/states/states.shp
	shp2pgsql -I -s 4269 $< > $@

data/shapefiles/IND_adm/IND_adm3.shp:
	wget http://biogeo.ucdavis.edu/data/diva/adm/IND_adm.zip
	unzip IND_adm.zip -d data/shapefiles/IND_adm
	rm IND_adm.zip

data/shapefiles/ne_110m_admin_1_states_provinces/ne_110m_admin_1_states_provinces.shp:
	wget http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/110m/cultural/ne_110m_admin_1_states_provinces.zip
	unzip ne_110m_admin_1_states_provinces.zip -d data/shapefiles/ne_110m_admin_1_states_provinces
	rm ne_110m_admin_1_states_provinces.zip

data/shapefiles/ne_110m_admin_0_countries_lakes/ne_110m_admin_0_countries_lakes.shp:
	wget http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/110m/cultural/ne_110m_admin_0_countries_lakes.zip
	unzip ne_110m_admin_0_countries_lakes.zip -d data/shapefiles/ne_110m_admin_0_countries_lakes
	rm ne_110m_admin_0_countries_lakes.zip

data/shapefiles/ogallala/ogallala.shp: data/shapefiles/aquifers_us/us_aquifers.shp
	mkdir -p data/shapefiles/ogallala
	ogr2ogr \
	  -where "AQ_NAME='High Plains aquifer'" \
	  data/shapefiles/ogallala/ogallala.shp \
	  data/shapefiles/aquifers_us/us_aquifers.shp

data/shapefiles/aquifers_us/us_aquifers.shp:
	wget http://water.usgs.gov/GIS/dsdl/aquifers_us.zip
	unzip -d data/shapefiles/aquifers_us aquifers_us.zip
	rm aquifers_us.zip

data/shapefiles/counties/counties.shp: data/shapefiles/countyp010_nt00795/countyp010.shp
	mkdir -p data/shapefiles/counties
	ogr2ogr -f 'ESRI Shapefile' -where "FIPS NOT LIKE '%000'" $@ $<

data/shapefiles/states/states.shp: data/shapefiles/statesp010g/statesp010g.shp
	mkdir -p data/shapefiles/states
	ogr2ogr -f 'ESRI Shapefile' $@ $<

data/shapefiles/statesp010g/statesp010g.shp:
	wget http://dds.cr.usgs.gov/pub/data/nationalatlas/statesp010g.shp_nt00938.tar.gz
	mkdir -p data/shapefiles/statesp010g
	tar xvfz statesp010g.shp_nt00938.tar.gz --directory data/shapefiles/statesp010g
	rm statesp010g.shp_nt00938.tar.gz

#download county shapefile from US ATLAS
data/shapefiles/countyp010_nt00795/countyp010.shp:
	wget http://dds.cr.usgs.gov/pub/data/nationalatlas/countyp010_nt00795.tar.gz
	mkdir -p data/shapefiles/countyp010_nt00795
	mv countyp010_nt00795.tar.gz data/shapefiles/countyp010_nt00795
	tar xvfz data/shapefiles/countyp010_nt00795/countyp010_nt00795.tar.gz --directory data/shapefiles/countyp010_nt00795
	rm data/shapefiles/countyp010_nt00795/countyp010_nt00795.tar.gz

data/btables:
	# currently assumes database is already created
	# createdb "$(DBNAME)"
	mkdir $@