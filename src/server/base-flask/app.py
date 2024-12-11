from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/health')
def health_check():
    """
    A simple health check endpoint that returns a JSON response 
    indicating if the service is operational.
    
    :return: JSON response with status and message
    """
    return jsonify({"status": "healthy", "message": "The service is running correctly."}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)