#! /bin/env python

import fiona
from shapely.geometry import LineString
import psycopg2
from psycopg2.extensions import AsIs
import pandas as pd
import numpy as np

with fiona.open("swissTLM3D_TLM_EISENBAHN.shp","r") as shpfile:

db_gta = {"dbname": "gta",
          "port": "5432",
          "user": "gta_p4",
          "password": "***REMOVED***",
          "host": "ikgpgis.ethz.ch"}
conn = psycopg2.connect(**db_gta)
cur=conn.cursor()
for i in range(len(list(shpfile))):
    line = LineString(np.array(structure[i]['geometry']['coordinates'])[:,:2])
    cur.execute(f"INSERT INTO train_tracks (geom) VALUES ('{line}');")

conn.commit()
conn.close()
