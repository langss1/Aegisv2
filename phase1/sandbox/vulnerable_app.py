import os
API_KEY = os.getenv('API_KEY')

import sqlite3
from flask import Flask, request

app = Flask(__name__)

@app.route("/user")
def get_user():
    user_id = request.args.get("id")
    conn = sqlite3.connect("db.sqlite")
    cursor = conn.cursor()

    # Vulnerable SQL Query (Injection)
    query = "SELECT * FROM users WHERE id = ?"
    cursor.execute(query, (user_id,))

    return "done"

if __name__ == "__main__":
    # Vulnerable configuration (Security Misconfiguration)
    app.run(debug=os.getenv('DEBUG', 'False') == 'True')
