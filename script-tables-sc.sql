CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password CHAR(60) NOT NULL
);

CREATE TABLE "show" (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    is_finished BOOLEAN NOT NULL,
    description TEXT,
    poster_path VARCHAR(255) NOT NULL,
    id_user INT NOT NULL,
    api_id INT not null,
    FOREIGN KEY (id_user) REFERENCES "user"(id)
);

CREATE TABLE genre (
    id SERIAL PRIMARY KEY,
    genre VARCHAR(100) NOT NULL
);

CREATE TABLE user_views_show (
    id_user INT NOT NULL,
    id_show INT NOT NULL, 
    PRIMARY KEY (id_user, id_show),
    FOREIGN KEY (id_user) REFERENCES "user"(id),
    FOREIGN KEY (id_show) REFERENCES "show"(id)
);

CREATE TABLE user_wishes_show (
    id_user INT NOT NULL,
    id_show INT NOT NULL, 
    PRIMARY KEY (id_user, id_show),
    FOREIGN KEY (id_user) REFERENCES "user"(id),
    FOREIGN KEY (id_show) REFERENCES "show"(id)
);

CREATE TABLE show_belongs_genre (
    id_show INT NOT NULL, 
    id_genre INT NOT NULL,
    PRIMARY KEY (id_show, id_genre),
    FOREIGN KEY (id_show) REFERENCES "show"(id),
    FOREIGN KEY (id_genre) REFERENCES genre(id)
);