import csv
import json
import pandas as pd

with open("../data/data.csv", "r") as csv_file:
    file = csv.DictReader(csv_file)

    json_dict = {}
    for row in file:
        if row["Year Code"] in json_dict.keys():
            pass
        else:
            json_dict[row["Year Code"]] = {}
        if row["Country"] in json_dict[row["Year"]]:
            pass
        else:
            json_dict[row["Year Code"]][row["Country"]] = {}
        if row["Item"] in json_dict[row["Year Code"]][row["Country"]]:
            pass
        else:
            json_dict[row["Year Code"]][row["Country"]][row["Item"]] = {}
            json_dict[row["Year Code"]][row["Country"]][row["Item"]] = row["Value"]

with open("data.json", "w") as outfile:
    json.dump(json_dict, outfile)




# #
# get right input csv
# INPUT_CSV = "data.csv"
#
# Loads data in dataframe
# data = pd.read_csv(INPUT_CSV)

# print(data)

# data = data.pivot(index="Year Code", columns="Country", values="Value")
#
# print(data)

# cleans data form duplicates and set index right
# data = data.drop_duplicates(subset=["LOCATION"], keep="first")
#data = data.set_index("LOCATION")

# converts data to json file
# data.to_json("data.json", orient = "index")
