from flask import Flask, render_template, send_from_directory, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash
import os
from flask_cors import CORS
import boto3
import io

# from Subir_Archivo import upload_to_s3
# from Comparador import RekognitionImage

app = Flask(__name__)
CORS(app)

# Configuracion de la base de datos SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///usuarios.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Configuraciones para AWS S3 
AWS_BUCKET_NAME = 'pruebasimg123'
AWS_REGION = 'us-east-1'

# Ruta donde se almacenaran los documentos
DOCUMENTS_FOLDER = 'Documentos'
app.config['UPLOAD_FOLDER'] = DOCUMENTS_FOLDER

# Crear la carpeta si no existe
if not os.path.exists(DOCUMENTS_FOLDER):
    os.makedirs(DOCUMENTS_FOLDER)

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

        nuevo_usuario = Usuario(nombre=nombre, apellido=apellido, email=email, telefono=telefono, contrasena=contrasena)

        db.session.add(nuevo_usuario)
        db.session.commit()

        return jsonify({'success': True}), 200

# Ruta para subir la cedula y la captura de cara
@app.route('/upload_documentos', methods=['POST'])
def upload_documentos():
    from Subir_Archivo import upload_to_s3
    from Comparador import RekognitionImage

    if not hasattr(upload_documentos, 'rekognition_client'):
        # Configurar el cliente de Rekognition si no esta configurado
        upload_documentos.rekognition_client = boto3.client('rekognition')

    if request.method == 'POST':
        cedula = request.files['cedula']
        captura_cara = request.files['captura_cara']

        if not cedula or not captura_cara:
            return jsonify({'error': 'Ambos documentos son requeridos'}), 400

        # Guardar cedula en la carpeta Documentos con formato jpg
        cedula_filename = os.path.join(app.config['UPLOAD_FOLDER'], 'cedula.jpg')
        cedula.save(cedula_filename)

        # Guardar captura de cara en la carpeta Documentos con formato jpg
        captura_cara_filename = os.path.join(app.config['UPLOAD_FOLDER'], 'captura_cara.jpg')
        captura_cara.save(captura_cara_filename)

        # Subir archivos a S3 despues de la validacion exitosa
        upload_to_s3(cedula_filename, AWS_BUCKET_NAME, 'cedula.jpg')
        upload_to_s3(captura_cara_filename, AWS_BUCKET_NAME, 'captura_cara.jpg')

        # Crear instancia de RekognitionImage
        image_source = RekognitionImage(image_name='cedula.jpg', rekognition_client=upload_documentos.rekognition_client)

        # Especificar el nombre de la imagen de destino en el mismo bucket
        target_image_name = 'captura_cara.jpg'

        # Comparar caras
        matches, unmatches = image_source.compare_faces(target_image_name=target_image_name, similarity=80.0)

        if matches:
            # La comparacion fue exitosa
            return jsonify({'success': True, 'message': 'La comparacion fue exitosa'}), 200
        else:
            # La comparacion fallo
            return jsonify({'error': 'La comparacion ha fallado'}), 401    


        
@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        identifier = request.json.get('identifier')  # Puede ser correo electronico o nombre de usuario
        contrasena = request.json.get('password')

        if not identifier or not contrasena:
            return jsonify({'error': 'Correo electronico o nombre de usuario y contrasena son requeridos'}), 400

        # Buscar usuario por correo electronico o nombre de usuario
        usuario = Usuario.query.filter(
            (Usuario.email == identifier) | (Usuario.nombre == identifier)
        ).first()

        if not usuario or not check_password_hash(usuario.contrasena, contrasena):
            return jsonify({'error': 'Credenciales incorrectas'}), 401

        # Iniciar sesion
        session['user_id'] = usuario.id

        return jsonify({'success': True}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
