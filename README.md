# NETworks

*NETworks* is a application to collect, analyze and visualize cellular network coverage data.

## Folder structure

* **database** Everything related to the database, including a setup script as well as the UML diagram.
  * **upload_to_db** Scripts to upload existing data to the database.
* **api** Main hook for flask get/post requests relevant for moving and analyzing data between actors.
* **user_interface** Everything related to the web application (html/css/js).

## Installation and Usage

To setup the database use the sql script (`database/database_setup.sql`).  
To run a flask development server:
```bash
pip install -r requirements.txt
python app.py
```

## Requirements and dependencies

* Numpy
* GeoPandas
* Shapely
* Pyproj
* GeoAlchemy2
* SqlAlchemy
* Flask

## Contributors

This project was made as a semester project for [GTA HS2023 at ETHZ](https://www.vvz.ethz.ch/Vorlesungsverzeichnis/lerneinheit.view?lerneinheitId=173266&semkez=2023W&lang=en) by:  
Colin Wallimann
Tanja Bialek
Jiaan Tian
Carmela Roth
