-- +migrate Up

-- create users table
create table if not exists "users"
    (
    id INT GENERATED ALWAYS AS IDENTITY,
    phone_number VARCHAR ( 50 ) UNIQUE NOT NULL,
    username VARCHAR ( 250 ) UNIQUE NOT NULL,
    created_on TIMESTAMP NOT NULL DEFAULT now(),
    updated_on TIMESTAMP NOT NULL DEFAULT current_timestamp,
    PRIMARY KEY(id)
    );


