from flask import Flask, request, abort
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user
import time
import logging
from functools import wraps
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Change this to a strong secret key

# Setup Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)

# Setup logging
logging.basicConfig(filename='login_attempts.log', level=logging.INFO)

# Rate limiter
limiter = Limiter(get_remote_address, app=app, default_limits=["5 per minute"])

# Dummy user database for demonstration purposes (replace with your DB)
users = {'admin': {'password': 'StrongPassword123!'}}

class User(UserMixin):
    def __init__(self, username):
        self.username = username

@login_manager.user_loader
def load_user(username):
    return User(username) if username in users else None

# Helper function for time delay
def constant_time_response(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        time.sleep(0.5)  # Enforces constant-time responses
        return result
    return wrapper

@app.route('/login', methods=['POST'])
@constant_time_response
@limiter.limit("5 per minute")  # Rate limiting
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    ip_address = request.remote_addr
    timestamp = time.strftime('%Y-%m-%d %H:%M:%S')

    if username in users and users[username]['password'] == password:
        login_user(User(username))
        logging.info(f'[{timestamp}] Successful login for {username} from {ip_address}')
        return 'Logged in successfully!'
    else:
        logging.warning(f'[{timestamp}] Failed login attempt for {username} from {ip_address}')
        return 'Invalid credentials', 401

@app.route('/protected', methods=['GET'])
@login_required
def protected():
    return 'Logged in as: ' + request.form.get('username')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return 'Logged out successfully!'

if __name__ == '__main__':
    app.run(port=5001)  # Run on port 5001 for testing