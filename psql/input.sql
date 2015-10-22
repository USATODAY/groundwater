# Create sites table
CREATE TABLE sites (id INTEGER, SiteNo VARCHAR(250), total_readings INTEGER, average_95_to_15 DOUBLE PRECISION, first DOUBLE PRECISION, last DOUBLE PRECISION, difference DOUBLE PRECISION, first_year INTEGER, last_year INTEGER, lattitude DOUBLE PRECISION, longitude DOUBLE PRECISION, point VARCHAR(250));

# Copy data from converted CSV into sites table
COPY sites FROM '/Users/mthorson/github/2015/groundwater-data/output_data/sites.csv' DELIMITERS ',' CSV;

# Add county_id column to sites table
ALTER TABLE sites ADD COLUMN county_id INTEGER;

# Add state foreign key column to sites table
ALTER TABLE sites ADD COLUMN state_id INTEGER;

# Add aquifer column to sites table
ALTER TABLE sites ADD COLUMN aquifer_id INTEGER;

# Add county column to sites based on intersection query with counties table
UPDATE sites SET county_id = countyquery.gid
FROM (SELECT gid, geom FROM counties) as countyquery
WHERE ST_Contains(countyquery.geom, ST_GeomFromText(sites.point, 4269));


# Add state_id column to sites based on intersection query with states table
UPDATE sites SET state_id = statequery.gid
FROM (SELECT gid, geom FROM states) as statequery
WHERE ST_Contains(statequery.geom, ST_GeomFromText(sites.point, 4269));

# Add aquifer_id column to sites based on intersection query with aquifer table
UPDATE sites SET aquifer_id = aquiferquery.gid
FROM (SELECT gid, geom FROM aquifers) as aquiferquery
WHERE ST_Contains(aquiferquery.geom, ST_GeomFromText(sites.point, 4269));