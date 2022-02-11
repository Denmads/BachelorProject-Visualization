import mysql.connector

conn = mysql.connector.connect(
    host="88.211.101.188",
    port="3306",
    database="qrrgxfgq_moviedata",
    user="qrrgxfgq_admin",
    password="Støvsuger123")

cur = conn.cursor(prepared=True)
actors_insert_query = "INSERT INTO actors (id, name, birth_year, death_year) VALUES (%s,%s,%s,%s)"

f = open("C:/Users/Patrick/OneDrive - Syddansk Universitet/6. semester/Bachelor/name.basics.tsv", "r", encoding="utf-8")

try:
    #Counter used as progress indicator
    counter = 0
    f.readline()
    while f.readline().split("\t")[0] != "nm10001010":
        continue
    while 1:
        line = f.readline()
        #filter out all people that aren't actors/actresses or starring as themselves e.g. in a documentary
        if "actor" in line or "actress" in line or "self" in line:
            data = line.split("\t")
            dataTuple = (data[0],data[1],data[2],data[3]) #nconst, primaryName, birthYear, deathYear
            cur.execute(actors_insert_query, dataTuple)
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