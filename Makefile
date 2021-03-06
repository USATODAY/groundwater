DBNAME=gwater # the name of the database you're using. you can name this whatever you want.

all: topojson_files data/output_data/tulare_dry_wells.csv

#geotiff conversion
.PHONY: geojson topojson_files

geojson: data/output_data/region_1.geo.json data/output_data/region_2.geo.json data/output_data/region_3.geo.json data/output_data/region_4.geo.json

data/output_data/region_4.geo.json: data/output_data/exploded_polygons/region_4.shp
	-rm $@
	ogr2ogr -f 'GeoJSON' $@ $<

data/output_data/region_3.geo.json: data/output_data/exploded_polygons/region_3.shp
	-rm $@
	ogr2ogr -f 'GeoJSON' $@ $<

data/output_data/region_2.geo.json: data/output_data/exploded_polygons/region_2.shp
	-rm $@
	ogr2ogr -f 'GeoJSON' $@ $<

data/output_data/region_1.geo.json: data/output_data/exploded_polygons/region_1.shp
	-rm $@
	ogr2ogr -f 'GeoJSON' $@ $<

data/output_data/exploded_polygons/region_4.shp: data/dbtables/region_4_exploded
	mkdir -p data/output_data/exploded_polygons
	pgsql2shp -f $@ $(DBNAME) "SELECT * FROM region_4_exploded;"

data/output_data/exploded_polygons/region_3.shp: data/dbtables/region_3_exploded
	mkdir -p data/output_data/exploded_polygons
	pgsql2shp -f $@ $(DBNAME) "SELECT * FROM region_3_exploded;"

data/output_data/exploded_polygons/region_2.shp: data/dbtables/region_2_exploded
	mkdir -p data/output_data/exploded_polygons
	pgsql2shp -f $@ $(DBNAME) "SELECT * FROM region_2_exploded;"

data/output_data/exploded_polygons/region_1.shp: data/dbtables/region_1_exploded
	mkdir -p data/output_data/exploded_polygons
	pgsql2shp -f $@ $(DBNAME) "SELECT * FROM region_1_exploded;"

data/dbtables/region_4_exploded: data/dbtables/region_4_merged
	psql -d $(DBNAME) -c "DROP TABLE IF EXISTS region_4_exploded;"
	psql -d $(DBNAME) -c "CREATE TABLE region_4_exploded AS SELECT dn,(ST_Dump(geom)).geom FROM region_4_merged;"
	touch $@;

data/dbtables/region_3_exploded: data/dbtables/region_3_merged
	psql -d $(DBNAME) -c "DROP TABLE IF EXISTS region_3_exploded;"
	psql -d $(DBNAME) -c "CREATE TABLE region_3_exploded AS SELECT dn,(ST_Dump(geom)).geom FROM region_3_merged;"
	touch $@;

data/dbtables/region_2_exploded: data/dbtables/region_2_merged
	psql -d $(DBNAME) -c "DROP TABLE IF EXISTS region_2_exploded;"
	psql -d $(DBNAME) -c "CREATE TABLE region_2_exploded AS SELECT dn,(ST_Dump(geom)).geom FROM region_2_merged;"
	touch $@;

data/dbtables/region_1_exploded: data/dbtables/region_1_merged
	psql -d $(DBNAME) -c "DROP TABLE IF EXISTS region_1_exploded;"
	psql -d $(DBNAME) -c "CREATE TABLE region_1_exploded AS SELECT dn,(ST_Dump(geom)).geom FROM region_1_merged;"
	touch $@;

data/dbtables/region_4_merged: data/dbtables/region_4_extracted
	python data/scripts/graceconvert/merge_features.py $(DBNAME) 4
	touch $@

data/dbtables/region_3_merged: data/dbtables/region_3_extracted
	python data/scripts/graceconvert/merge_features.py $(DBNAME) 3
	touch $@

data/dbtables/region_2_merged: data/dbtables/region_2_extracted
	python data/scripts/graceconvert/merge_features.py $(DBNAME) 2
	touch $@

data/dbtables/region_1_merged: data/dbtables/region_1_extracted
	python data/scripts/graceconvert/merge_features.py $(DBNAME) 1	
	touch $@

data/dbtables/region_4_extracted: data/output_data/extracted_polygons/region_4_extracted.shp data/dbtables 
	psql -d $(DBNAME) -c "DROP TABLE IF EXISTS region_4_extracted;"
	shp2pgsql -I -s 4269 $< | psql -d $(DBNAME)
	touch $@

data/dbtables/region_3_extracted: data/output_data/extracted_polygons/region_3_extracted.shp data/dbtables 
	psql -d $(DBNAME) -c "DROP TABLE IF EXISTS region_3_extracted;"
	shp2pgsql -I -s 4269 $< | psql -d $(DBNAME)
	touch $@

data/dbtables/region_2_extracted: data/output_data/extracted_polygons/region_2_extracted.shp data/dbtables 
	psql -d $(DBNAME) -c "DROP TABLE IF EXISTS region_2_extracted;"
	shp2pgsql -I -s 4269 $< | psql -d $(DBNAME)
	touch $@

data/dbtables/region_1_extracted: data/output_data/extracted_polygons/region_1_extracted.shp data/dbtables 
	psql -d $(DBNAME) -c "DROP TABLE IF EXISTS region_1_extracted;"
	shp2pgsql -I -s 4269 $< | psql -d $(DBNAME)
	touch $@

data/output_data/extracted_polygons/region_4_extracted.shp: data/output_data/masks/region_4_mask.tif
	mkdir -p data/output_data/extracted_polygons
	gdal_polygonize.py \
	-mask $< \
	data/input_data/GRACE_TWS_trends.042002-09-2015.reg_map.4.tif \
	-f 'ESRI Shapefile' \
	$@

data/output_data/extracted_polygons/region_3_extracted.shp: data/output_data/masks/region_3_mask.tif
	mkdir -p data/output_data/extracted_polygons
	gdal_polygonize.py \
	-mask $< \
	data/input_data/GRACE_TWS_trends.042002-09-2015.reg_map.3.tif \
	-f 'ESRI Shapefile' \
	$@

data/output_data/extracted_polygons/region_2_extracted.shp: data/output_data/masks/region_2_mask.tif
	mkdir -p data/output_data/extracted_polygons
	gdal_polygonize.py \
	-mask $< \
	data/input_data/GRACE_TWS_trends.042002-09-2015.reg_map.2.tif \
	-f 'ESRI Shapefile' \
	$@

data/output_data/extracted_polygons/region_1_extracted.shp: data/output_data/masks/region_1_mask.tif
	mkdir -p data/output_data/extracted_polygons
	gdal_polygonize.py \
	-mask $< \
	data/input_data/GRACE_TWS_trends.042002-09-2015.reg_map.1.tif \
	-f 'ESRI Shapefile' \
	$@

data/output_data/masks/region_4_mask.tif:
	mkdir -p data/output_data/masks
	-rm $@
	python data/scripts/graceconvert/create_mask.py 4

data/output_data/masks/region_3_mask.tif:
	mkdir -p data/output_data/masks
	-rm $@
	python data/scripts/graceconvert/create_mask.py 3

data/output_data/masks/region_2_mask.tif:
	mkdir -p data/output_data/masks
	-rm $@
	python data/scripts/graceconvert/create_mask.py 2

data/output_data/masks/region_1_mask.tif:
	mkdir -p data/output_data/masks
	-rm $@
	python data/scripts/graceconvert/create_mask.py 1

#topojson creation
topojson_files: data/output_data/ogallala.topojson.json data/output_data/india.topo.json data/output_data/counties_with_level_changes.json data/output_data/california_wells.topo.json data/output_data/peru.topo.json, data/output_data/world_aquifers.topo.json

data/output_data/africa.topo.json: data/shapefiles/africa/africa.shp
	topojson \
	-o $@ \
	--no-pre-quantization \
	--post-quantization=1e6 \
	--simplify=7e-7 \
	-p name \
	-- $<

# morocco/african shapes
data/shapefiles/africa/africa.shp: data/shapefiles/ne_110m_admin_0_countries_lakes/ne_110m_admin_0_countries_lakes.shp
	mkdir -p data/shapefiles/africa
	ogr2ogr -where "continent = 'Africa'" -f 'ESRI Shapefile' $@ $<

#peru/south american shapes
data/output_data/peru.topo.json: data/shapefiles/PER_adm/PER_adm3.shp data/output_data/south_america.geo.json
	topojson \
	-o $@ \
	--no-pre-quantization \
	--post-quantization=1e6 \
	--simplify=7e-7 \
	-- $< data/output_data/south_america.geo.json

data/output_data/south_america.geo.json: data/shapefiles/ne_110m_land/ne_110m_land.shp
	mkdir -p data/shapefiles/south_america
	ogr2ogr -f 'GeoJSON' -clipsrc -83.0 -55.4 -29.3 13.0 $@ $<

data/output_data/peru_coordinates.csv:
	in2csv data/input_data/Peru_coordinates.xlsx > $@


#world aquifers
data/output_data/world_aquifers.topo.json: data/output_data/aquifer_gw_anomolies.csv data/shapefiles/ne_110m_land/ne_110m_land.shp
	
	topojson \
	-o data/output_data/world_aquifers_w_values.json \
	-e $< \
	-p \
	--id-property=aquifer_id,HYGEO \
	-- data/input_data/world_aquifer_systems_nocoast/world_aquifer_systems_nocoast.shp

	topojson \
	-o $@ \
	--no-pre-quantization \
	--post-quantization=1e6 \
	--simplify=7e-7 \
	-p \
	-- data/shapefiles/ne_110m_land/ne_110m_land.shp data/output_data/world_aquifers_w_values.json

data/output_data/aquifer_gw_anomolies.csv:
	in2csv data/input_data/aquifer_gw_anomalies.xlsx > data/output_data/aquifer_gw_tmp.csv
	python data/scripts/aquifer_clean.py data/output_data/aquifer_gw_tmp.csv > $@
	rm data/output_data/aquifer_gw_tmp.csv



##California wells

data/output_data/tulare_dry_wells.csv:
	in2csv data/input_data/Export_Output_XYCoordinates_Dry_Wells.xlsx | csvcut -c 1,2 > $@	

data/output_data/california_wells.topo.json: data/output_data/california_wells_w_fips.csv data/shapefiles/CA/CA.shp
	topojson \
	-o $@ \
	--no-pre-quantization \
	--post-quantization=1e6 \
	--simplify=7e-7 \
	-e $< \
	-p FIPS,county,reported_outages,cv=central_valley \
	--id-property=+fips,+FIPS \
	-- data/shapefiles/CA/CA.shp

graphics/india-map/app/data/india.topo.json: data/output_data/india.topo.json
	cp $< $@

data/output_data/india.topo.json: data/shapefiles/IND_adm/IND_adm3.shp data/output_data/india_levels.csv
	topojson \
	-o $@ \
	--no-pre-quantization \
	--post-quantization=1e6 \
	--simplify=7e-7 \
	-e data/output_data/india_levels.csv \
	-p district=District,differece=Difference_Feet,st=NAME_1 \
	--id-property=District,NAME_2 \
	-- $< data/input_data/india_disputed/india_disputed_territory.shp

map/app/data/county_usage_change.topojson.json: data/output_data/county_usage_change.topojson.json
	cp $< $@

data/output_data/county_usage_change.topojson.json: data/output_data/county_usage_change.csv data/shapefiles/counties/counties.shp
	topojson \
	-o $@ \
	--no-pre-quantization \
	--post-quantization=1e6 \
	--simplify=7e-7 \
	-e $< \
	--id-property=+FIPS \
	-p usage_difference \
	-- data/shapefiles/counties/counties.shp

data/output_data/county_usage_change.csv: data/dbtables/county_usage_2000_table data/dbtables/county_usage_2005_table data/dbtables/county_usage_2010_table
	psql -d $(DBNAME) -c "COPY (WITH counties AS (SELECT county_usage_2010.\"FIPS\", county_usage_2010.\"TO-WGWTo\" - county_usage_2005.\"TO-WGWTo\" as usage_difference FROM county_usage_2010 join county_usage_2005 on county_usage_2010.\"FIPS\" = county_usage_2005.\"FIPS\") SELECT * FROM counties ORDER BY usage_difference DESC) TO '$(abspath $@)' HEADER CSV;"
	touch $@

map/app/data/county_usage_average_2010.topojson.json: data/output_data/county_usage_with_percentage.csv data/shapefiles/counties/counties.shp
	topojson \
	-o $@ \
	--no-pre-quantization \
	--post-quantization=1e6 \
	--simplify=7e-7 \
	-e $< \
	--id-property=+FIPS \
	-p pcnt_groundwater \
	-- data/shapefiles/counties/counties.shp

# convert county shapefile to topojson and join with county level data
map/app/data/aquifers_with_level_changes.json: data/shapefiles/aquifers_us/us_aquifers.shp data/output_data/aquifer_levels.csv
	topojson \
	-o $@ \
	--no-pre-quantization \
	--post-quantization=1e6 \
	--simplify=7e-7 \
	-e data/output_data/aquifer_levels.csv \
	--id-property=aquifer,AQ_NAME \
	-p aquifer,avg_decrease,total_sites \
	-- $<

# convert county shapefile to topojson and join with county level data
data/output_data/counties_with_level_changes.json: data/shapefiles/counties/counties.shp data/output_data/county_averages_with_ogallala.csv
	topojson \
	-o $@ \
	--no-pre-quantization \
	--post-quantization=1e6 \
	--simplify=7e-7 \
	-e data/output_data/county_averages_with_ogallala.csv \
	--id-property=+fips,+FIPS \
	-p n=name,avg_chg=average_of_change,ogallala=ogallala_overlap,fips \
	-- $<

data/output_data/county_averages_with_ogallala.csv: data/dbtables/county_averages
	psql -d $(DBNAME) -c "COPY(SELECT geoid as fips,name,ogallala_overlap,count_of_change,average_of_change FROM county_averages) TO '$(abspath $@)' DELIMITER ',' CSV HEADER;"	

data/dbtables/county_averages: data/output_data/clean_county_averages.csv data/dbtables/geotables
	psql -d $(DBNAME) -c "DROP TABLE IF EXISTS county_averages;"
	csvsql --db postgresql:///$(DBNAME) --table county_averages --insert $< 
	psql -d $(DBNAME) -c "ALTER TABLE county_averages ADD COLUMN ogallala_overlap BOOLEAN DEFAULT FALSE;"
	psql -d $(DBNAME) -c "UPDATE county_averages SET ogallala_overlap = TRUE FROM (SELECT aq_code,geom FROM us_aquifers WHERE aq_code = 107) AS aquifer_query, (SELECT geom,fips FROM counties) as county_geo WHERE ST_Intersects(county_geo.geom,aquifer_query.geom) AND county_averages.geoid = county_geo.fips;"
	touch $@

# county averages data
data/output_data/clean_county_averages.csv:
	python data/scripts/counties_clean.py data/input_data/USGS_county_level_map.csv > $@

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

data/output_data/ogallala.topojson.json: data/shapefiles/ogallala/ogallala.shp
	topojson \
	-o $@ \
	--no-pre-quantization \
	--post-quantization=1e6 \
	--simplify=7e-7 \
	-p name=AQ_NAME \
	-- $<

data/output_data/aquifer_levels.csv: data/dbtables/sites
	psql -d $(DBNAME) -c "COPY(SELECT us_aquifers.aq_name as aquifer, COUNT(sites.*) as total_sites, AVG(sites.difference) as avg_decrease FROM sites JOIN us_aquifers ON sites.aquifer_id = us_aquifers.gid WHERE us_aquifers.aq_name !='Other rocks' GROUP BY aquifer ORDER BY avg_decrease DESC) TO '$(abspath $@)' DELIMITER ',' CSV HEADER;"

data/output_data/county_levels.csv: data/dbtables/sites
	psql -d $(DBNAME) -c "COPY(SELECT counties.fips, states.state_fips, COUNT(sites.*) as num_sites, AVG(sites.difference) as average_change FROM sites JOIN counties ON sites.county_id = counties.gid JOIN states ON sites.state_id = states.gid GROUP BY counties.fips, states.state_fips ORDER BY states.state_fips, counties.fips) TO '$(abspath $@)' DELIMITER ',' CSV HEADER;"

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
	psql -d $(DBNAME) -f data/psql/county_usage_2000_sql_create.sql
	psql -d $(DBNAME) -c "\COPY county_usage_2000 FROM '$(abspath $<)' DELIMITER ',' CSV HEADER;"
	touch $@

data/dbtables/county_usage_2005_table:  data/output_data/county_usage_2005.csv data/psql/county_usage_2005_sql_create.sql data/dbtables
	psql -d $(DBNAME) -c "DROP TABLE IF EXISTS county_usage_2005;"
	psql -d $(DBNAME) -f data/psql/county_usage_2005_sql_create.sql
	psql -d $(DBNAME) -c "\COPY county_usage_2005 FROM '$(abspath $<)' DELIMITER ',' CSV HEADER;"
	touch $@

data/dbtables/county_usage_2010_table:  data/output_data/county_usage_2010.csv data/psql/county_usage_2010_sql_create.sql data/dbtables
	psql -d $(DBNAME) -c "DROP TABLE IF EXISTS county_usage_2010;"
	psql -d $(DBNAME) -f data/psql/county_usage_2010_sql_create.sql
	psql -d $(DBNAME) -c "\COPY county_usage_2010 FROM '$(abspath $<)' DELIMITER ',' CSV HEADER;"
	touch $@

data/dbtables/sites: data/output_data/sites.csv data/psql/sites.sql data/dbtables data/dbtables/geotables
	psql -d $(DBNAME) -c "DROP TABLE IF EXISTS sites;"
	psql -d $(DBNAME) -f data/psql/sites.sql
	psql -d $(DBNAME) -c "\COPY sites FROM '$(abspath $<)' CSV HEADER;"
	psql -d $(DBNAME) -c "ALTER TABLE sites ADD COLUMN county_id INTEGER;"
	psql -d $(DBNAME) -c "ALTER TABLE sites ADD COLUMN state_id INTEGER;"
	psql -d $(DBNAME) -c "ALTER TABLE sites ADD COLUMN aquifer_id INTEGER;"
	psql -d $(DBNAME) -c "UPDATE sites SET county_id = countyquery.gid FROM (SELECT gid, geom FROM counties) as countyquery WHERE ST_Contains(countyquery.geom, ST_GeomFromText(sites.point, 4269));"
	psql -d $(DBNAME) -c "UPDATE sites SET state_id = statequery.gid FROM (SELECT gid, geom FROM states) as statequery WHERE ST_Contains(statequery.geom, ST_GeomFromText(sites.point, 4269));"
	psql -d $(DBNAME) -c "UPDATE sites SET aquifer_id = aquiferquery.gid FROM (SELECT gid, geom FROM us_aquifers) as aquiferquery WHERE ST_Contains(aquiferquery.geom, ST_GeomFromText(sites.point, 4269));"
	touch $@

data/psql/county_usage_2005_sql_create.sql: data/output_data/county_usage_2005.csv data/psql
	csvsql -i postgresql --tables county_usage_2005 $< > $@

data/psql/county_usage_2000_sql_create.sql: data/output_data/county_usage_2000.csv data/psql
	csvsql -i postgresql --tables county_usage_2000 $< > $@

data/psql/county_usage_2010_sql_create.sql: data/output_data/county_usage_2010.csv data/psql
	csvsql -i postgresql --tables county_usage_2010 $< > $@

data/output_data/county_usage_summary.csv: county_usage_csvs_simplified
	csvstack -g 2000,2005,2010 -n YEAR data/output_data/county_usage_2000.csv data/output_data/county_usage_2005.csv data/output_data/county_usage_2010.csv > $@

county_usage_csvs_simplified: data/output_data/county_usage_2000.csv data/output_data/county_usage_2005.csv data/output_data/county_usage_2010.csv

data/psql/sites.sql: data/output_data/sites.csv data/psql
	csvsql -i postgresql --tables sites $< > $@

data/output_data/sites.csv:
	python data/scripts/convert.py data/input_data/USGS_data_for_map_1020.csv

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

data/output_data/usco2000.xls: data/output_data
	wget http://water.usgs.gov/watuse/data/2000/usco2000.xls
	mv usco2000.xls data/output_data

data/dbtables/geotables: data/dbtables/counties data/dbtables/states data/dbtables/us_aquifers
	touch $@

data/dbtables/counties: data/psql/counties.sql data/dbtables
	psql -d $(DBNAME) -c "DROP TABLE IF EXISTS counties;"
	psql -d $(DBNAME) -f $<
	touch $@

data/dbtables/states: data/psql/states.sql data/dbtables
	psql -d $(DBNAME) -c "DROP TABLE IF EXISTS states;"
	psql -d $(DBNAME) -f $<
	touch $@

data/dbtables/us_aquifers: data/psql/us_aquifers.sql data/dbtables
	psql -d $(DBNAME) -c "DROP TABLE IF EXISTS us_aquifers;"
	psql -d $(DBNAME) -f $<
	touch $@

data/psql/us_aquifers.sql: data/shapefiles/aquifers_us/us_aquifers.shp data/psql
	shp2pgsql -I -s 4269 $< > $@

data/psql/counties.sql: data/shapefiles/counties/counties.shp data/psql
	shp2pgsql -I -s 4269 $< > $@

data/psql/states.sql: data/shapefiles/states/states.shp data/psql
	shp2pgsql -I -s 4269 $< > $@

data/output_data/central_valley_storage.csv:
	in2csv data/input_data/CA_Central_Valley_storage_change_USGS.xlsx > central_valley_temp.csv
	python data/scripts/central_valley.py central_valley_temp.csv > $@
	rm central_valley_temp.csv

#create california_wells csv with fips column
data/output_data/california_wells_w_fips.csv: data/dbtables/california_wells_w_fips
	psql -d $(DBNAME) -c "COPY(SELECT california_wells.*, counties.fips FROM california_wells JOIN counties ON (california_wells.county_id = counties.gid)) TO '$(abspath $@)' DELIMITER ',' CSV HEADER;"


#add fips column and central_valley boolean to dry wells table
data/dbtables/california_wells_w_fips: data/dbtables/california_wells data/shapefiles/aquifers_us/us_aquifers.shp
	psql -d $(DBNAME) -c "ALTER TABLE california_wells DROP COLUMN IF EXISTS county_id;"
	psql -d $(DBNAME) -c "ALTER TABLE california_wells ADD COLUMN county_id INTEGER;"
	psql -d $(DBNAME) -c "UPDATE california_wells SET county_id = countyquery.gid FROM (SELECT gid, state, county FROM counties) as countyquery WHERE countyquery.state = 'CA' AND countyquery.county ILIKE california_wells.county || '%'"	
	psql -d $(DBNAME) -c "ALTER TABLE california_wells ADD COLUMN central_valley BOOLEAN DEFAULT FALSE;"
	psql -d $(DBNAME) -c "UPDATE california_wells SET central_valley = TRUE FROM (SELECT aq_code,geom FROM us_aquifers WHERE aq_code = 106) AS aquifer_query, (SELECT geom,gid,fips FROM counties) as county_geo WHERE ST_Intersects(county_geo.geom,aquifer_query.geom) AND california_wells.county_id = county_geo.gid;"
	touch $@

#import dry wells into postgres
data/dbtables/california_wells: data/output_data/california_dry_wells.csv data/dbtables data/dbtables/geotables
	psql -d $(DBNAME) -c "DROP TABLE IF EXISTS california_wells;"
	csvsql --db postgresql:///$(DBNAME) --table california_wells --insert $<
	touch $@

#convert california wells data to csv
data/output_data/california_dry_wells.csv: data/output_data/california_dry_wells_raw.json
	python data/scripts/california_wells.py $< > $@

#download raw California state data regarding failing wells from https://mydrywatersupply.water.ca.gov/report/publicpage
data/output_data/california_dry_wells_raw.json:
	wget https://mydrywatersupply.water.ca.gov/report/resources/json/tablePage.json
	mv tablePage.json data/output_data/california_dry_wells_raw.json

#download world land shapefiles
data/shapefiles/ne_110m_land/ne_110m_land.shp:
	wget http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/110m/physical/ne_110m_land.zip
	unzip ne_110m_land.zip -d data/shapefiles/ne_110m_land
	rm ne_110m_land.zip

data/shapefiles/CA/CA.shp: data/shapefiles/counties/counties.shp
	mkdir -p data/shapefiles/CA
	ogr2ogr -f 'ESRI Shapefile' -where "FIPS LIKE '06%'" $@ $<

data/shapefiles/PER_adm/PER_adm3.shp:
	wget http://biogeo.ucdavis.edu/data/diva/adm/PER_adm.zip
	unzip PER_adm.zip -d data/shapefiles/PER_adm
	rm PER_adm.zip

data/shapefiles/MOR_adm/MAR_adm3.shp:
	wget http://biogeo.ucdavis.edu/data/diva/adm/MAR_adm.zip
	unzip MAR_adm.zip -d data/shapefiles/MAR_adm
	rm MAR_adm.zip

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

data/psql:
	mkdir $@

data/output_data:
	mkdir $@

data/dbtables:
	createdb $(DBNAME)
	psql -d $(DBNAME) -c 'CREATE EXTENSION postgis'
	mkdir $@
