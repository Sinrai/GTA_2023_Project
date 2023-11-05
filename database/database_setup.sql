CREATE TABLE gta23.coverage_map(
    coverage_id SERIAL PRIMARY KEY,
    coverage BOOLEAN,
    net_speed VARCHAR(16),
    provider VARCHAR(16),
    geom POINT);

CREATE TABLE gta23.antenna_locations(
    antenna_id SERIAL PRIMARY KEY,
    radiated_power VARCHAR(16),
    geom POINT);

CREATE TABLE gta23.train_tracks(
    track_id SERIAL PRIMARY KEY,
    geom POINT);

CREATE TABLE gta23.user(
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(16),
    passwort CHAR(256),
    provider VARCHAR(16));

CREATE TABLE gta23.user_data(
    data_id SERIAL PRIMARY KEY,
    user_id INTEGER references gta23.user(user_id),
    net_speed VARCHAR(16),
    geom POINT,
    provider VARCHAR(16));