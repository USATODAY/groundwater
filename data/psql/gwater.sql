# Create sites table
CREATE TABLE sites (id INTEGER, SiteNo VARCHAR(250), total_readings INTEGER, average_95_to_15 DOUBLE PRECISION, first DOUBLE PRECISION, last DOUBLE PRECISION, difference DOUBLE PRECISION, first_year INTEGER, last_year INTEGER, lattitude DOUBLE PRECISION, longitude DOUBLE PRECISION, point VARCHAR(250));

# Copy data from converted CSV into sites table
COPY sites FROM '/Users/mthorson/github/2015/groundwater-data/sites.csv' DELIMITERS ',' CSV;

# Add county_id column to sites table
ALTER TABLE sites ADD COLUMN county_id INTEGER;

# Add county column to sites based on intersection query with counties table
UPDATE sites SET county_id = countyquery.gid
FROM (SELECT gid, geom FROM counties) as countyquery
WHERE ST_Contains(countyquery.geom, ST_GeomFromText(sites.point, 4269));


# Add state foreign key column to sites table
ALTER TABLE sites ADD COLUMN state_id INTEGER;


# Add state_id column to sites based on intersection query with states table
UPDATE sites SET state_id = statequery.gid
FROM (SELECT gid, geom FROM states) as statequery
WHERE ST_Contains(statequery.geom, ST_GeomFromText(sites.point, 4269));

# Add aquifer column to sites table
ALTER TABLE sites ADD COLUMN aquifer_id INTEGER;

UPDATE sites SET aquifer_id = aquiferquery.gid
FROM (SELECT gid, geom FROM aquifers) as aquiferquery
WHERE ST_Contains(aquiferquery.geom, ST_GeomFromText(sites.point, 4269));

# Get county averages
SELECT counties.county, states.state, COUNT(sites.*) as num_sites, AVG(sites.difference) as average_change
FROM sites
JOIN counties ON sites.county_id = counties.gid
JOIN states ON sites.state_id = states.gid
WHERE county IS NOT NULL
GROUP BY counties.county, states.state
ORDER BY states.state, counties.county;

# Get aquifer averages
SELECT aquifers.aq_name as aquifer, COUNT(sites.*) as total_sites, AVG(sites.difference) as avg_decrease
FROM sites
JOIN aquifers ON sites.aquifer_id = aquifers.gid
GROUP BY aquifer
ORDER BY avg_decrease DESC;

# Save to file
COPY(SELECT counties.county, states.state, COUNT(sites.*) as num_sites, AVG(sites.difference) as average_change
FROM sites
JOIN counties ON sites.county_id = counties.gid
JOIN states ON sites.state_id = states.gid
GROUP BY counties.county, states.state
ORDER BY states.state, counties.county) TO '/Users/mthorson/github/2015/groundwater-data/output/data/county_output.csv' DELIMITER ',' CSV HEADER;