from flask import Flask, render_template, send_from_directory, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Agregamos CORS para manejar solicitudes desde diferentes dominios

# Configuracion de la base de datos SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///usuarios.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Configuraciones para AWS S3 
AWS_BUCKET_NAME = 'pruebasimg123'
AWS_REGION = 'us-east-1'

# Funcion para subir archivos a S3
def upload_to_s3(local_file, bucket_name, s3_file):
    # Codigo para subir a S3

# Modelo de Usuario para la base de datos
    class Usuario(db.Model):
     id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)
    apellido = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    telefono = db.Column(db.String(20), nullable=False)
    contrasena = db.Column(db.String(60), nullable=False)

# Ruta para servir archivos estaticos de React
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory(os.path.join('frontend', 'build', 'static'), path)

# Ruta para manejar todas las demas rutas en React
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    return render_template('index.html')

# Ruta para crear usuario
@app.route('/crear_usuario', methods=['POST'])
def crear_usuario():
    if request.method == 'POST':
        nombre = request.json.get('nombre')
        apellido = request.json.get('apellido')
        email = request.json.get('email')
        telefono = request.json.get('telefono')
        contrasena = request.json.get('nueva_password')
        confirmar_contrasena = request.json.get('confirmar_contrasena')

        if not nombre or not apellido or not email or not telefono or not contrasena or not confirmar_contrasena:
            return jsonify({'error': 'Todos los campos son requeridos'}), 400

        if contrasena != confirmar_contrasena:
            return jsonify({'error': 'Las contrasenas no coinciden'}), 400

        if Usuario.query.filter_by(email=email).first():
            return jsonify({'error': 'El usuario ya existe'}), 400

        contrasena_hash = generate_password_hash(contrasena, method='pbkdf2:sha256')
        nuevo_usuario = Usuario(nombre=nombre, apellido=apellido, email=email, telefono=telefono, contrasena=contrasena_hash)

        db.session.add(nuevo_usuario)
        db.session.commit()

        return jsonify({'success': True}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
