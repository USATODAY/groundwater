import sys, datetime
from csvkit import CSVKitDictWriter, CSVKitDictReader

def read_file(filename):
    raw_data = []
    with open(filename) as input_file:
        reader = CSVKitDictReader(input_file)
        for row in reader:
            raw_data.append(dict(row))
        return raw_data

def clean_header(raw_header):
    clean_header = raw_header.strip().replace(" ", "_").replace("[", "").replace("]", "").replace("(", "").replace(")","").replace("/", "_per_").lower()
    return clean_header

def parse_data(raw_data):
    parsed_list = []
    for entry in raw_data:
        parsed_entry = {}
        for k in entry.keys():
            cleaned_header = clean_header(k)
            parsed_entry[cleaned_header] = entry[k]
        parsed_list.append(parsed_entry)

    return parsed_list

def main(filename):
    raw_data = read_file(filename)
    parsed_data = parse_data(raw_data)
    writer = CSVKitDictWriter(sys.stdout, parsed_data[0].keys())
    writer.writeheader()
    for row in parsed_data:
        writer.writerow(row)


if __name__ == '__main__':
    filename = sys.argv[1]
    main(filename)