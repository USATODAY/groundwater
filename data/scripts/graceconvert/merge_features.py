import sys
import envoy

def main(database_name, region_num):
    """
    Takes a database_name and a region number, and runs queries to merge all features in a similar range
    and inserts them into a new table.
    """
    command_1 = ['psql',
                         '-d', database_name, 
                         '-c', '"DROP TABLE IF EXISTS region_{0}_merged;"'.format(region_num)]
    command_2 = ['psql', 
                        '-d', database_name, 
                        '-c', '"CREATE TABLE region_{0}_merged AS SELECT * from region_{0}_extracted LIMIT 0; ALTER TABLE region_{0}_merged DROP COLUMN gid;"'.format(region_num)]
    command_3 =['psql', 
                        '-d', database_name, 
                        '-c', '\"INSERT INTO region_{0}_merged (dn,geom) SELECT ROUND(AVG(dn)),ST_Union(geom) from region_{0}_extracted WHERE dn<=-10; INSERT INTO region_{0}_merged (dn,geom) SELECT ROUND(AVG(dn)),ST_Union(geom) from region_{0}_extracted WHERE dn>-10 AND dn<=-5; INSERT INTO region_{0}_merged (dn,geom) SELECT ROUND(AVG(dn)),ST_Union(geom) from region_{0}_extracted WHERE dn>-5 AND dn<0; INSERT INTO region_{0}_merged (dn,geom) SELECT ROUND(AVG(dn)),ST_Union(geom) from region_{0}_extracted WHERE dn>=0;\"'.format(region_num)]
    r_one = envoy.run(' '.join(command_1))
    r_two = envoy.run(' '.join(command_2))
    r_three = envoy.run(' '.join(command_3))

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])