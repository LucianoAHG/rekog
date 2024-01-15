from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import boto3
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///usuarios.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Configuraciones para AWS S3
# agregar las secret key
AWS_BUCKET_NAME = 'pruebasimg123'
AWS_REGION = 'us-east-1'

# Funcion para subir archivos a S3
def upload_to_s3(local_file, bucket_name, s3_file):
    s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY, region_name=AWS_REGION)
    try:
        s3.upload_file(local_file, bucket_name, s3_file)
        print("Exito al cargar el archivo en S3")
        return True
    except FileNotFoundError:
        print("El archivo no se encontro")
        return False
    except Exception as e:
        print(f"Error al cargar el archivo en S3: {e}")
        return False

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    contrasena = db.Column(db.String(60), nullable=False)

@app.route('/')
def index():
    usuarios = Usuario.query.all()
    return render_template('index.html', usuarios=usuarios)

@app.route('/crear_usuario', methods=['GET', 'POST'])
def crear_usuario():
    if request.method == 'POST':
        nombre = request.form['nombre']
        email = request.form['email']
        contrasena = request.form['nueva_password']

        if not nombre or not email or not contrasena:
            return render_template('crear_usuario.html', error='Todos los campos son requeridos')

        if Usuario.query.filter_by(email=email).first():
            return render_template('crear_usuario.html', error='El usuario ya existe')

        contrasena_hash = generate_password_hash(contrasena, method='pbkdf2:sha256')
        nuevo_usuario = Usuario(nombre=nombre, email=email, contrasena=contrasena_hash)

        db.session.add(nuevo_usuario)
        db.session.commit()

        return redirect(url_for('formulario_carga'))

    return render_template('crear_usuario.html')

@app.route('/formulario_carga', methods=['GET', 'POST'])
def formulario_carga():
    if request.method == 'POST':
        cedula_file = request.files['cedula']
        captura_file = request.files['captura']
        
        cedula_path = 'temp/cedula.jpg'
        captura_path = 'temp/captura.jpg'

        cedula_file.save(cedula_path)
        captura_file.save(captura_path)

        cedula_s3_key = 'cedula_comparar.jpg'
        captura_s3_key = 'captura_comparar.jpg'

        upload_to_s3(cedula_path, AWS_BUCKET_NAME, cedula_s3_key)
        upload_to_s3(captura_path, AWS_BUCKET_NAME, captura_s3_key)

        return "Archivos subidos correctamente"

    return render_template('formulario_carga.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
