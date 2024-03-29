from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
from flask_cors import CORS
import boto3
from captura_frame import capture_random_frame_by_fps
from Subir_Archivo import upload_to_s3

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

def compare_faces(rekognition, source_image_name, target_image_name, bucket_name):
    s3_object_source = {'Bucket': bucket_name, 'Name': source_image_name}
    s3_object_target = {'Bucket': bucket_name, 'Name': target_image_name}

    # Enviar la solicitud para comparar las caras
    compare_response = rekognition.compare_faces(
        SourceImage={'S3Object': s3_object_source},
        TargetImage={'S3Object': s3_object_target}
    )

    # Verificar los resultados de la comparacion
    if compare_response.get('FaceMatches'):
        confidence = compare_response['FaceMatches'][0]['Similarity']
        print(f'Cara similar encontrada en la segunda imagen ({target_image_name}): {confidence}%')
        return confidence
    else:
        print(f'No se encontraron caras similares en la segunda imagen ({target_image_name}).')
        return 0

def detect_labels(rekognition, bucket_name, image_name):
    s3_object = {'Bucket': bucket_name, 'Name': image_name}
    response = rekognition.detect_labels(Image={'S3Object': s3_object})
    labels = [{'name': label['Name'], 'confidence': label['Confidence']} for label in response['Labels']]
    return labels

def has_prohibited_labels(labels):
    # Validacion para las etiquetas prohibidas
    prohibited_labels = ['Photography', 'Portrait', 'Selfie']
    return any(label['name'] in prohibited_labels for label in labels)

@app.route('/upload_documentos', methods=['POST'])
def upload_documentos():
    try:
        if not hasattr(upload_documentos, 'rekognition_client'):
            upload_documentos.rekognition_client = boto3.client('rekognition')

        if 'video_cedula' not in request.files or 'video_persona' not in request.files:
            return jsonify({'error': 'Ambos documentos son requeridos'}), 400

        video_cedula = request.files['video_cedula']
        video_persona = request.files['video_persona']

        video_cedula_filename = os.path.join(app.config['UPLOAD_FOLDER'], 'video_cedula.mp4')
        video_cedula.save(video_cedula_filename)

        video_persona_filename = os.path.join(app.config['UPLOAD_FOLDER'], 'video_persona.mp4')
        video_persona.save(video_persona_filename)

        captura_cara_filename_cedula = os.path.join(app.config['UPLOAD_FOLDER'], 'captura_cara_cedula.jpg')
        captura_cara_filename_persona = os.path.join(app.config['UPLOAD_FOLDER'], 'captura_cara_persona.jpg')

        # Llama a la funcion de captura desde captura_frame.py
        capture_random_frame_by_fps(video_cedula_filename, captura_cara_filename_cedula)
        capture_random_frame_by_fps(video_persona_filename, captura_cara_filename_persona)
        
        # Subir archivos a S3 despues de la validacion exitosa
        upload_to_s3(video_cedula_filename, AWS_BUCKET_NAME, 'video_cedula.mp4')
        upload_to_s3(video_persona_filename, AWS_BUCKET_NAME, 'video_persona.mp4')
        upload_to_s3(captura_cara_filename_cedula, AWS_BUCKET_NAME, 'captura_cara_cedula.jpg')
        upload_to_s3(captura_cara_filename_persona, AWS_BUCKET_NAME, 'captura_cara_persona.jpg')

        rekognition = boto3.client('rekognition')

        # Detectar etiquetas en la imagen de origen (cedula)
        labels_source_cedula = detect_labels(rekognition, AWS_BUCKET_NAME, 'captura_cara_cedula.jpg')

        # Detectar etiquetas en la imagen de origen (persona)
        labels_source_persona = detect_labels(rekognition, AWS_BUCKET_NAME, 'captura_cara_persona.jpg')

        # Detectar etiquetas en la segunda imagen (cedula)
        labels_target_cedula = detect_labels(rekognition, AWS_BUCKET_NAME, 'captura_cara_cedula.jpg')

        # Detectar etiquetas en la segunda imagen (persona)
        labels_target_persona = detect_labels(rekognition, AWS_BUCKET_NAME, 'captura_cara_persona.jpg')

        # Comparar caras en la cedula
        similarity_percentage_cedula = compare_faces(
            rekognition, 'captura_cara_cedula.jpg', 'captura_cara_cedula.jpg', AWS_BUCKET_NAME
        )

        # Comparar caras en la persona
        similarity_percentage_persona = compare_faces(
            rekognition, 'captura_cara_persona.jpg', 'captura_cara_persona.jpg', AWS_BUCKET_NAME
        )

        response_data = {
            'resultado_validacion': {
                'success': False,
                'error': 'La comparacion ha fallado',
                'similarityPercentageCedula': similarity_percentage_cedula,
                'similarityPercentagePersona': similarity_percentage_persona,
                'matchMessageCedula': 'No se encontraron caras similares en la cedula.',
                'matchMessagePersona': 'No se encontraron caras similares en la persona.',
                'labelsDataCedula': labels_source_cedula,
                'labelsDataPersona': labels_source_persona
            }
        }

        # Validacion de etiqueta "Id Cards" en la cedula
        if similarity_percentage_cedula >= 90.0:
            if any(label['name'] in ['Id Cards'] for label in labels_source_cedula):
                response_data['resultado_validacion']['matchMessageCedula'] = f'Se valido correctamente la cedula con un {similarity_percentage_cedula}%.'
            else:
                response_data['resultado_validacion']['matchMessageCedula'] = 'Cedula no valida: Etiqueta incorrecta.'
                
        # Validacion de etiqueta "Portrait" en la persona
        if similarity_percentage_persona >= 90.0:
            if any(label['name'] in ['Portrait'] for label in labels_source_persona):
                response_data['resultado_validacion']['matchMessagePersona'] = f'Se valido correctamente la persona con un {similarity_percentage_persona}%.'
            else:
                response_data['resultado_validacion']['matchMessagePersona'] = 'Persona no valida: Etiqueta incorrecta.'

        # Mostrar respuesta segun los resultados de la validacion
        if similarity_percentage_cedula >= 90.0 and similarity_percentage_persona >= 90.0:
            response_data['resultado_validacion']['success'] = True
            response_data['resultado_validacion']['error'] = None
            response_data['resultado_validacion']['message'] = 'La comparacion fue exitosa'
            return jsonify(response_data), 200
        else:
            return jsonify(response_data), 401

    except Exception as e:
        return jsonify({'error': f'Error en la carga y validacion: {str(e)}'}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    # Usar ssl_context para habilitar HTTPS
    app.run('0.0.0.0', debug=True)
