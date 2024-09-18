# Importing Pandas library
import pandas as pd
import geopandas as gpd
import json
 
# Skipping rows at specific position
df = pd.read_csv("museums.csv", low_memory=False)
 
aquariums = df[df["Museum Type"].str.contains("ZOO, AQUARIUM, OR WILDLIFE CONSERVATION")]
# Show the dataframe
#print(df[df["Museum Name"].str.contains("AQUARIUM|SEA|RIVER|MARINE|OCEAN|ESTUAR")])
#locations = aquariums[~aquariums["Museum Name"].str.contains("MUSEUM|ZOO")]
aquariums = aquariums[aquariums["Museum Name"].str.contains("AQUARIUM|SEA ") & ~(aquariums["Museum Name"].str.contains("SOCIETY|RESEARCH|SOCIETIES|SEAWORLD|CLUB"))]
#print(aquariums)
aquariums.to_csv("aquariums.csv")
#aquarium_coords = gpd.GeoDataFrame
#print(locations)
#locations.to_csv("locations.csv")
aquariums = aquariums.convert_dtypes()

json_aquariums_string = aquariums.to_json(orient="records")

json_aquariums = json.loads(json_aquariums_string)

geo_json = {
    "type": "FeatureCollection",
    "features": []
}

for record in json_aquariums:
    geo_json["features"].append({
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [record['Longitude'], record["Latitude"]]
        },
        "properties": {
            "name": record['Museum Name'],
            "address": record['Street Address (Administrative Location)']
        }
    })

with open('aquariums.json', 'w') as f:
    f.write(json.dumps(geo_json, indent=2))

print(geo_json)