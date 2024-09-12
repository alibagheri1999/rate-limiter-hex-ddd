DO
$$
DECLARE
phone_numbers TEXT[] := ARRAY[
        '+989352461483',
        '+989352461484',
        '+989352461485',
        '+989352461486',
        '+989352461487',
        '+989352461488',
        '+989352461489'
    ];
    user_count INT := array_length(phone_numbers, 1);
    i INT;
    random_username VARCHAR;
    current_phone_number TEXT;
BEGIN
    -- Temporarily allow manual insert into the id column
ALTER TABLE users ALTER COLUMN id DROP IDENTITY;

-- Loop through each phone number and insert with specific id
FOR i IN 1..user_count LOOP
        current_phone_number := phone_numbers[i];

        -- Generate a random username
        random_username := 'user_' || substring(md5(random()::text), 1, 8);

        -- Try to insert the record with specific id
BEGIN
INSERT INTO users (id, phone_number, username)
VALUES (i, current_phone_number, random_username);
EXCEPTION WHEN unique_violation THEN
            RAISE NOTICE 'Phone number % already exists, skipping...', current_phone_number;
END;
END LOOP;

    -- Re-enable automatic id generation
ALTER TABLE users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY;
END
$$;