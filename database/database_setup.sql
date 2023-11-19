DROP TABLE IF EXISTS gta_p4.antenna_locations;
DROP TABLE IF EXISTS gta_p4.train_tracks;
DROP TABLE IF EXISTS gta_p4.user_trajectory_data;
DROP TABLE IF EXISTS gta_p4.user_point_data;

CREATE TABLE gta_p4.antenna_locations(
     antenna_id SERIAL PRIMARY KEY,
     radiated_power VARCHAR(16),
     type INTEGER,
     geom GEOMETRY);

CREATE TABLE gta_p4.train_tracks(
     track_id SERIAL PRIMARY KEY,
     geom GEOMETRY);

CREATE TABLE gta_p4.user_trajectory_data(
     user_trajectory_id SERIAL PRIMARY KEY,
     distance REAL,
     time TIMESTAMP,
     username VARCHAR(255),
     geom GEOMETRY);

CREATE TABLE gta_p4.user_point_data(
     data_id SERIAL PRIMARY KEY,
     netspeed VARCHAR(16),
     provider VARCHAR(16),
     time TIMESTAMP,
     username VARCHAR(255),
     geom GEOMETRY);
