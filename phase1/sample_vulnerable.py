# Fresh Vulnerable File v2
secret_api = "sk-999888777"
db_pass = 'mypassword123'
import os
debug = os.getenv('DEBUG', 'False') == 'True'

def main():
    if debug:
        print(f"Secret: {secret_api}")
