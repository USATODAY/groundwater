import json, sys
from csvkit import CSVKitDictWriter

def read_file(filename):
    """
    Read file at filename arg and return python dictionary of raw data
    """
    with open(filename) as input_file:
        raw_data = json.load(input_file)
        return raw_data

def parse_data(raw_data):
    """
    Take raw dictionary and output simple list of entries
    """

    # dictionary to store each individual region as clean dictionary entries
    data_by_region = {}
    # list to hold all entries regardless of region
    all_data = []

    # loop through each key in the raw data (each key is a region)
    for key in raw_data.keys():
        if key != "stateTbl": #ignore the statewide-table as it is in a different format
            #list to store this regions entries
            data_by_region[key] = []
            raw_region_data = raw_data[key]

            #first row in each list is the table headers
            headers = raw_region_data[0]
            #the rest of the rows except the last are the county entries. the last row is the subtotal, which we are ignoring
            rows = raw_region_data[1:len(raw_region_data) - 1]
            for row in rows:
                # make sure that we aren't using subtotal, as one table has an additional row at the end
                if "Subtotal" not in row[0]:
                    # dictionary to store entries key/value pairs
                    row_dict = {}
                    # loop through the header values
                    for index, header in enumerate(headers):
                        # clean header to remove spaces and '/'s
                        new_header = header.replace(" ", "_").replace("/", "_").lower()
                        # add key/value to the row dict row_dict[new_header] = row[index]
                        value = row[index]

                        # clean county value
                        if new_header == "county":
                            value = value.replace("+", "")

                        row_dict[new_header] = value

                    #append row_dict to the region list   
                    data_by_region[key].append(row_dict)

    # now loop through regions and flatten into single list, with region value added to each entry dictionary
    for region in data_by_region.keys():
        region_data = data_by_region[region]

        for entry in region_data:
            entry["region"] = region.replace("Tbl", "")

        all_data = all_data + region_data

    return all_data 

def main(filename):
    raw_json = read_file(filename)
    parsed_data = parse_data(raw_json)
    writer = CSVKitDictWriter(sys.stdout, parsed_data[0].keys())
    writer.writeheader()
    for row in parsed_data:
        writer.writerow(row)


if __name__ == '__main__':
    filename = sys.argv[1]
    main(filename)