#! /bin/env python

import fiona
from shapely.geometry import LineString
import psycopg2
from psycopg2.extensions import AsIs
import pandas as pd
import numpy as np

db_gta = {"dbname": "gta",
            "port": "5432",
            "user": "gta_p4",
            "password": "[insert_password]",
            "host": "ikgpgis.ethz.ch"}
conn = psycopg2.connect(**db_gta)
cur=conn.cursor()

with fiona.open("swissTLM3D_TLM_EISENBAHN.shp","r") as shpfile:
    for i in shpfile:
        line = LineString(np.array(i['geometry']['coordinates'])[:,:2])
        cur.execute(f"INSERT INTO train_tracks (geometry) VALUES ('{line}');")

conn.commit()
conn.close()
