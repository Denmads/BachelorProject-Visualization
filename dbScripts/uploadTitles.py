import mysql.connector

conn = mysql.connector.connect(
    host="88.211.101.188",
    port="3306",
    database="qrrgxfgq_moviedata",
    user="qrrgxfgq_admin",
    password="Støvsuger123")

cur = conn.cursor(prepared=True)
title_insert_query = "INSERT INTO titles (id, titletypeid, primary_title, start_year, end_year, runtime) VALUES (%s, %s, %s, %s, %s, %s)"
genre_insert_query = "INSERT INTO genre (name) VALUES (%s)"
titletype_insert_query = "INSERT INTO titletype (name) VALUES (%s)"
title_genre_relate_query = "INSERT INTO title_genre_relation (titleid, genreid) VALUES (%s, %s)"


titletype_ids = {}
genre_ids = {}


file = open("C:/Users/patri/Desktop/title.basics.tsv", "r", encoding="utf-8")
file.readline()

limit = -1
skip = None

if skip is not None:
    while not file.readline().startwith(skip):
        continue

count = 0
try:
    while limit == -1 or count < limit:
        line = file.readline()
        tokens = line.split("\t")

        # Filter out: tvSpecial, tvEpisode, video, videoGame
        if tokens[1] not in ["tvSpecial", "tvEpisode", "video", "videoGame"]:

            # Title type
            if not tokens[1] in titletype_ids:
                cur.execute(titletype_insert_query, (tokens[1],))
                titletype_ids[tokens[1]] = cur.lastrowid

            # Insert the title information
            title_values = (tokens[0], titletype_ids[tokens[1]], tokens[2], int(tokens[5]) if tokens[5] != "\\N" else "NULL", int(tokens[6]) if tokens[6] != "\\N" else "NULL", int(tokens[7]) if tokens[7] != "\\N" else "NULL")
            cur.execute(title_insert_query, title_values)

            # Genres
            genres = tokens[8].split(",")

            for genre in genres:
                if not genre in genre_ids:
                    cur.execute(genre_insert_query, (genre,))
                    genre_ids[genre] = cur.lastrowid

                cur.execute(title_genre_relate_query, (tokens[0], genre_ids[genre]))

            count += 1

            if count % 100 == 0:
                print(count)
                conn.commit()

except Exception as e:
    print(e)

conn.commit()

file.close()
conn.close()