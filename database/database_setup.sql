CREATE TABLE antenna_locations(
     antenna_id SERIAL PRIMARY KEY,
     radiated_power VARCHAR(16),
     geom POINT);

CREATE TABLE train_tracks(
     track_id SERIAL PRIMARY KEY,
     geom geometry);


CREATE TABLE user(
     user_id SERIAL PRIMARY KEY,
     name VARCHAR(16),
     password CHAR(256),
     provider VARCHAR(16));

CREATE TABLE user_trajectory_data(
     user_trajectory_id SERIAL PRIMARY KEY,
     distance REAL,
     time TIMESTAMP,
     user_id INTEGER references user(user_id),
     geom geometry);


CREATE TABLE user_point_data(
     data_id SERIAL PRIMARY KEY,
     netspeed VARCHAR(16),
     geom POINT,
     provider VARCHAR(16),
     time TIMESTAMP,
     user_tractory_id INTEGER references user_trajectory_data(user_trajectory_id));
