from flask_limiter import Limiter

# Initialize the Limiter with a global key function
limiter = Limiter(key_func=lambda: 'global')
