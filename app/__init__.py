from flask import Flask, render_template

from .blueprints.health import health_bp
from .blueprints.l5x_replicator import l5x_bp

# Initialize the Flask application with a static folder
app = Flask(__name__, static_folder='./static')

# Set maximum file upload size to 10 MB
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10 MB file upload limit


@app.route('/')
def index():
    """
    Render the index.html template when the root URL is accessed.
    """
    return render_template('index.html')


@app.route('/docs')
def docs():
    """
    Render the help.html template when the /help URL is accessed.
    """
    return render_template('docs.html')


# Register the health blueprint
app.register_blueprint(health_bp)


# Register the l5x_replicator blueprint with the Flask application
app.register_blueprint(l5x_bp)
