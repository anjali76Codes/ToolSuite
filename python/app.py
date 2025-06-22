from flask import Flask, render_template, request, jsonify
import sqlite3
from faker import Faker
import random
import os

app = Flask(__name__)

# Initialize Faker
fake = Faker()


# SQLite Database connection setup
def get_db_connection():
    conn = sqlite3.connect("mock_data.db")
    conn.row_factory = sqlite3.Row  # This allows us to access columns by name
    return conn


# Create a table to store users' data (if it doesn't exist)
def create_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name TEXT,
        age INTEGER,
        email TEXT,
        city TEXT,
        country TEXT
    )
    """
    )
    conn.commit()
    conn.close()


# Function to generate and insert mock data into the database
def generate_mock_data(num_records):
    conn = get_db_connection()
    cursor = conn.cursor()
    for _ in range(num_records):
        name = fake.name()
        age = random.randint(18, 65)
        email = fake.email()
        city = fake.city()
        country = fake.country()

        # Insert generated data into the database
        cursor.execute(
            """
        INSERT INTO users (name, age, email, city, country)
        VALUES (?, ?, ?, ?, ?)
        """,
            (name, age, email, city, country),
        )

    # Commit changes and close the connection
    conn.commit()
    conn.close()


# Route to generate mock data
@app.route("/generate_data", methods=["GET"])
def generate_data():
    generate_mock_data(100)  # Generate 100 records
    return 'Mock data generated successfully! <a href="/">Go to Home</a>'


# Route to fetch all users from the database
@app.route("/")
def home():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    conn.close()
    return render_template("index.html", users=users)


@app.route("/query_user", methods=["GET", "POST"])
def query_user():
    if request.method == "POST":
        column = request.form["column"]  # Get selected column
        value = request.form["value"]  # Get value for the column

        # Validate the column to ensure it is a valid column name
        valid_columns = ["name", "age", "email", "city", "country"]
        if column not in valid_columns:
            return "Invalid column selected. Please try again."

        # Perform the query
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(f"SELECT * FROM users WHERE {column} = ?", (value,))
        users = cursor.fetchall()
        conn.close()

        return render_template("query_result.html", users=users)
    return render_template("query_user.html")


# Route to query users by age range
@app.route("/query_users_by_age", methods=["GET", "POST"])
def query_users_by_age():
    if request.method == "POST":
        min_age = int(request.form["min_age"])
        max_age = int(request.form["max_age"])
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM users WHERE age BETWEEN ? AND ?", (min_age, max_age)
        )
        users = cursor.fetchall()
        conn.close()
        return render_template("query_result.html", users=users)
    return render_template("query_age.html")


# Route to execute raw SQL query
@app.route("/execute_sql", methods=["GET", "POST"])
def execute_sql():
    if request.method == "POST":
        query = request.form["query"]
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(query)
            result = cursor.fetchall()
            conn.close()

            # Check if there are results to display
            if len(result) == 0:
                return "No results found for the given query."

            return render_template("query_result.html", users=result)
        except Exception as e:
            return f"Error executing query: {e}"

    return render_template("execute_sql.html")


if __name__ == "__main__":
    create_table()  # Create the table if it doesn't exist
    port = int(
        os.environ.get("PORT", 5000)
    )  # Use the port from Render's environment variable, defaulting to 5000
    app.run(debug=True, host="0.0.0.0", port=port)  # Bind to 0.0.0.0
