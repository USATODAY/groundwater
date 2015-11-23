import sys, datetime
from csvkit import CSVKitDictWriter, CSVKitDictReader

def readfile(filename):
    raw_data = []
    with open(filename) as input_file:
        reader = CSVKitDictReader(input_file)
        for row in reader:
            raw_data.append(dict(row))
        return raw_data

def writefile(parsed_data):
    writer = CSVKitDictWriter(sys.stdout, parsed_data[0].keys())
    writer.writeheader()
    for row in parsed_data:
        writer.writerow(row)

def clean_header(raw_header):
    try:
        header_split = raw_header.split(" ")[0]
        year = header_split.split("-")[0]
        month = header_split.split("-")[1]
        day = header_split.split("-")[2]
        date_header = datetime.date(int(year), int(month), int(day))
        clean_header = date_header.strftime("%b-%y")
    except:
        clean_header = raw_header.replace(" ", "_").replace("[", "_").replace("]", "_").replace("/", "_per_").lower()
    return clean_header

def main(filename):
    raw_data = readfile(filename)
    clean_list = []
    for entry in raw_data:
        clean_entry = {}
        for key in entry.keys():
            #skip empty headers
            if key != "":
                clean_key = clean_header(key)
                clean_entry[clean_key] = entry[key]

        clean_list.append(clean_entry)

    writefile(clean_list)

if __name__ == '__main__':
    filename = sys.argv[1]
    main(filename)