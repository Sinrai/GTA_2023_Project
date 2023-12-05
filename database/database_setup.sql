DROP TABLE IF EXISTS gta_p4.antenna_locations;
DROP TABLE IF EXISTS gta_p4.train_tracks;
DROP TABLE IF EXISTS gta_p4.user_point_data;
DROP TABLE IF EXISTS gta_p4.user_trajectory_data;

CREATE TABLE gta_p4.antenna_locations(
    antenna_id SERIAL PRIMARY KEY,
    radiated_power VARCHAR(16),
    type SMALLINT);

CREATE TABLE gta_p4.train_tracks(
    track_id SERIAL PRIMARY KEY);

CREATE TABLE gta_p4.user_trajectory_data(
    user_trajectory_id SERIAL PRIMARY KEY,
    distance REAL,
    time TIMESTAMP,
    username VARCHAR(255));

CREATE TABLE gta_p4.user_point_data(
    data_id SERIAL PRIMARY KEY,
    netspeed SMALLINT,
    ip VARCHAR(255),
    provider VARCHAR(255),
    time TIMESTAMP,
    username VARCHAR(255),
    in_train BOOLEAN,
    user_trajectory_id INTEGER REFERENCES gta_p4.user_trajectory_data(user_trajectory_id));

SELECT AddGeometryColumn('gta_p4', 'antenna_locations', 'geometry', '2056', 'POINT', 2);
SELECT AddGeometryColumn('gta_p4', 'train_tracks', 'geometry', '2056', 'LINESTRING', 2);
SELECT AddGeometryColumn('gta_p4', 'user_trajectory_data', 'geometry', '4326', 'LINESTRING', 2);
SELECT AddGeometryColumn('gta_p4', 'user_point_data', 'geometry', '4326', 'POINT', 2);
