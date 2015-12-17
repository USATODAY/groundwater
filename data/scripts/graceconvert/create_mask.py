import sys
import envoy

def create_mask(region_num):
    """
    Takes a region number and generates geotiff masks for that region.
    """
    
    source_filename = "data/input_data/GRACE_TWS_trends.042002-09-2015.reg_map.{0}.tif".format(region_num)
    gdal_calc_command = ['gdal_calc.py',
                                    '-A', source_filename,
                                    '--outfile data/output_data/masks/region_{0}_mask.tif'.format(region_num),
                                    '--calc', '\"A!=0\"']
    r = envoy.run(' '.join(gdal_calc_command))
    if r.status_code != 0:
        sys.stdout.write(r.std_err)

if __name__ == "__main__":
    create_mask(sys.argv[1])
