import csvkit
import sys
from collections import OrderedDict

def read_file(input_file):
    """
    reads an input file and returns a list of dicts
    """
    with open(input_file) as csv_file:
        data_list = []
        reader = csvkit.DictReader(csv_file)
        for row in reader:
            data_list.append(row)

        return data_list

def parse_data(raw_list):
    """
    Takes a raw list and returns a list of 
    dictionaries with the values selected that we need.
    """
    new_list = []
    for row in raw_list:
        new_dict = OrderedDict()
        new_dict["id"] = row["ID"]
        new_dict["site_no"] = str(row["SiteNo"])
        new_dict["total_readings"] = row["TotalReadings"]
        new_dict["average_95_to_15"] = row["Avg95to15"]
        new_dict["first"] = row["First"]
        new_dict["last"] = row["Last"]
        new_dict["difference"] = row["Difference"]
        new_dict["first_year"] = row["FirstYear"]
        new_dict["last_year"] = row["LastYr"]
        new_dict["lattitude"] = row["Field7"]
        new_dict["longitude"] = row["Field8"]
        new_dict["point"] = "Point(%s %s)" %(new_dict["longitude"], new_dict["lattitude"])
        new_list.append(new_dict)

    return new_list

def write_file(data):
    with open("data/output_data/sites.csv", "wb") as writefile:
        keys = data[0].keys()
        writer = csvkit.DictWriter(writefile, fieldnames=keys)
        writer.writeheader()
        for row in data:
            writer.writerow(row)

if __name__ == "__main__":
    filename = sys.argv[1]
    write_file(parse_data(read_file(filename)))
