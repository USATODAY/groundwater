import json, sys
from csvkit import CSVKitDictWriter, CSVKitDictReader

def read_file(filename):
    """
    Read file at filename arg and return python dictionary of raw data
    """
    raw_data = []
    with open(filename) as input_file:
        reader = CSVKitDictReader(input_file)
        for row in reader:
            raw_data.append(dict(row))
        return raw_data

def parse_data(raw_data):
    clean_data = list()
    for entry in raw_data:
        clean_entry = dict()
        for k in entry.keys():
            if k != "geometry":
                clean_header = k.replace(" ", "_").replace("/", "_").lower()
                value = entry[k]
                if k == "GEOID":
                    value = "%05d" % (int(value),)
                clean_entry[clean_header] = value

        clean_data.append(clean_entry)

    return clean_data

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