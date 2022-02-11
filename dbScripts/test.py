import mysql.connector

conn = mysql.connector.connect(
    host="88.211.101.188",
    port="3306",
    database="qrrgxfgq_moviedata",
    user="qrrgxfgq_test",
    password="Test1234")

cur = conn.cursor()
cur.execute("INSERT INTO test (name, age) VALUES ('ib', 15)")

conn.commit()

conn.close()

