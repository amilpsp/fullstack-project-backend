.open database.sqlite
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS forums;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS users_forums;
DROP TABLE IF EXISTS tokens;

CREATE TABLE users(
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
        CHECK (length(password)>=6),
    created TEXT NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE forums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL UNIQUE,
    created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CHECK (length(name)>=1)
);

CREATE TABLE posts (
    id INTEGER PRIMARY KEY ,
    author INTEGER NOT NULL,
    forum INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    last_comment_id INTEGER DEFAULT 0,
    comment_amount INTEGER DEFAULT 0,
    created_date TEXT NOT NULL DEFAULT CURRENT_DATE,
    created_time TEXT NOT NULL DEFAULT CURRENT_TIME,
        FOREIGN KEY(author) REFERENCES users(id),
        FOREIGN KEY(forum) REFERENCES forums(id),
        CHECK (length(content)>=1)
);

CREATE TABLE comments (
    id INTEGER PRIMARY KEY,
    author INTEGER NOT NULL,
    post INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_date TEXT NOT NULL DEFAULT CURRENT_DATE,
    created_time TEXT NOT NULL DEFAULT CURRENT_TIME,
        FOREIGN KEY(author) REFERENCES users(id),
        FOREIGN KEY(post) REFERENCES posts(id)
);


CREATE TABLE users_forums (
    user_id INTEGER NOT NULL,
    forum_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (forum_id) REFERENCES forums(id)
);

CREATE TABLE tokens(
    user_id INTEGER NOT NULL,
    token TEXT PRIMARY KEY,
        FOREIGN KEY(user_id) REFERENCES users(id)
);

INSERT INTO users (username, password) VALUES ('anubisto', 'probando123');
INSERT INTO users (username, password) VALUES ('creycreycrey', 'probando123');
INSERT INTO users (username, password) VALUES ('amilpsp', 'probando123');

INSERT INTO forums (name,description) VALUES ('games', 'place to discuss games');
INSERT INTO forums (name,description) VALUES ('movies', 'all the niche movie references go here, bring your spoons');
INSERT INTO forums (name,description) VALUES ('animals', 'do they deserve us?');

/* INSERT INTO posts (author, forum, title, content) VALUES (1,1,'First post' ,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?

Lorem????!

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.');

INSERT INTO comments (author, post, content) VALUES (2,1,'NAH U ARE WRONG

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.

Destroyed by fax and logix.');
INSERT INTO comments (author, post, content) VALUES (3,1, 'Hello I’m new here, be nice

Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?

Thanks for any help

<3');

UPDATE posts SET comment_amount=2 WHERE id=1;

INSERT INTO posts (author, forum, title, content) VALUES (2,2,'Second post' ,'I just finished catching up with Critical role and I dont know what to do with my life anymoreeeee I dont want to wait for thursdayssssssss I need to know what happens next!!!!');

INSERT INTO comments (author, post, content) VALUES (2,2,'NAH U ARE WRONG

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.

Destroyed by fax and logix.');

INSERT INTO comments (author, post, content) VALUES (3,2, 'Hello I’m new here, be nice

Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?

Thanks for any help

<3');
UPDATE posts SET comment_amount=2 WHERE id=2;

INSERT INTO posts (author, forum, title, content) VALUES (1,3,'Third Post' ,'Post #3! Testing testing, 1,2,3, aölsdkjföalskdjfölasdf.');

INSERT INTO comments (author, post, content) VALUES (2,3,'NAH U ARE WRONG

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.

Destroyed by fax and logix.');

INSERT INTO comments (author, post, content) VALUES (3,3, 'Hello I’m new here, be nice

Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?

Thanks for any help

<3');

UPDATE posts SET comment_amount=2 WHERE id=3;
 */