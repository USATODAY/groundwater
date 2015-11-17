CREATE TABLE county_usage (
	"YEAR" INTEGER NOT NULL, 
	"STATE" VARCHAR(2) NOT NULL, 
	"FIPS" VARCHAR(5) NOT NULL, 
	"TP-TotPop" FLOAT NOT NULL, 
	"TO-WGWTo" FLOAT, 
	"TO-WTotl" FLOAT
);

COPY county_usage FROM '/Users/mthorson/github/2015/groundwater-data/input_data/counties_usage_simple.csv' DELIMITERS ',' CSV HEADER;
