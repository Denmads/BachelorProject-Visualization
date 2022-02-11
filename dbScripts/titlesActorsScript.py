import mysql.connector

def actorInTable(actorID):
    cur.execute(get_actor_query %actorID)
    if len(cur.fetchall()) > 0:
        return True
    else:
        return False

def movieInTable(movieID):
    cur.execute(get_movie_query % movieID)
    if len(cur.fetchall()) > 0:
        return True
    else:
        return False

def movieActorInTable(movieID, actorID):
    cur.execute(movie_and_actor_query.format(movieID,actorID))
    if len(cur.fetchall()) > 0:
        return True
    else:
        return False

conn = mysql.connector.connect(
    host="88.211.101.188",
    port="3306",
    database="qrrgxfgq_moviedata",
    user="qrrgxfgq_admin",
    password="Støvsuger123")

cur = conn.cursor(prepared=True)
titles_actors_insert_query = "INSERT INTO title_actor_relation (titleid, actorid) VALUES (%s,%s)"
get_actor_query = "SELECT * FROM actors WHERE id = '%s'"
get_movie_query = "SELECT * FROM titles WHERE id = '%s'"
movie_and_actor_query = "SELECT actors.id FROM actors, titles WHERE titles.id = '{}' and actors.id = '{}'"

f = open("C:/Users/patri/OneDrive - Syddansk Universitet/6. semester/Bachelor/title.principals.tsv", "r", encoding="utf-8")


try:
    #Counter used as progress indicator
    counter = 0
    f.readline()
    #while f.readline().split("\t")[0] != "nm10001010":
    #   continue
    while 1:
        line = f.readline()
        #filter out all people that aren't actors/actresses or starring as themselves e.g. in a documentary
        if "actor" in line or "actress" in line or "self" in line:
            data = line.split("\t")
            if movieActorInTable(data[0],data[2]):
                dataTuple = (data[0],data[2]) #tconst, nconst
                cur.execute(titles_actors_insert_query, dataTuple)
                counter += 1
                if counter % 100 == 0:
                    print(str(counter))
                    conn.commit()
except Exception as e:
    print(line)
    print(e)

conn.commit()
conn.close()
f.close()

