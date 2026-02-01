import sqlite3

conn = sqlite3.connect('backend/rentshield.db')
cursor = conn.cursor()

cursor.execute("SELECT * FROM usage_logs ORDER BY id DESC LIMIT 5")
rows = cursor.fetchall()

print("ID | Timestamp | Event | Scenario")
print("-" * 40)
for row in rows:
    print(f"{row[0]} | {row[1]} | {row[2]} | {row[3]}")

conn.close()
