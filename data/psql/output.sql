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
WHERE aquifers.aq_name !='Other rocks'
GROUP BY aquifer
ORDER BY avg_decrease DESC;

# Save county averages to file
COPY(SELECT counties.county, states.state, COUNT(sites.*) as num_sites, AVG(sites.difference) as average_change
FROM sites
JOIN counties ON sites.county_id = counties.gid
JOIN states ON sites.state_id = states.gid
GROUP BY counties.county, states.state
ORDER BY states.state, counties.county) TO '/Users/mthorson/github/2015/groundwater-data/output/data/county_averages.csv' DELIMITER ',' CSV HEADER;

# Save aquifer averages to file
COPY(SELECT aquifers.aq_name as aquifer, COUNT(sites.*) as total_sites, AVG(sites.difference) as avg_decrease
FROM sites
JOIN aquifers ON sites.aquifer_id = aquifers.gid
WHERE aquifers.aq_name !='Other rocks'
GROUP BY aquifer
ORDER BY avg_decrease DESC) TO '/Users/mthorson/github/2015/groundwater-data/output_data/aquifer_averages.csv' DELIMITER ',' CSV HEADER;