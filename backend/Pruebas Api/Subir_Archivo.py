import boto3
import os  
from botocore.exceptions import NoCredentialsError

# print(os.environ.get('AWS_ACCESS_KEY_ID'))
# print(os.environ.get('AWS_SECRET_ACCESS_KEY'))

def upload_to_s3(local_file, bucket_name, s3_file):
    # Crea un cliente de S3
    os.environ['AWS_DEFAULT_PROFILE'] = 'lu7'  # el usuario debe ser creado en IAM AMAZON 
    s3 = boto3.client('s3')
    try:
        # Sube el archivo al bucket especificado
        s3.upload_file(local_file, bucket_name, s3_file)
        print("Exito al cargar el archivo en S3")
        return True
    except FileNotFoundError:
        print("El archivo no se encontro")
        return False
    except NoCredentialsError: 
        print("Credenciales de AWS no disponibles")
        return False

# Parámetros
local_file_path = "C:/Users/desar/Downloads/test123.jpg" # Ruta local donde se encuentra el archivo
bucket_name = "pruebasimg123" # Nombre del bucket en s3
s3_file_key = "pasotest.jpg" # Nombre con el que se va almacenar el archivo en s3
upload_to_s3(local_file_path, bucket_name, s3_file_key) # Metodo para Subir el archivo

local_file_path = "C:/Users/desar/Downloads/personatest.jpg" # Ruta local donde se encuentra el archivo
bucket_name = "pruebasimg123" # Nombre del bucket en s3
s3_file_key = "comparacion.jpg" # Nombre con el que se va almacenar el archivo en s3
upload_to_s3(local_file_path, bucket_name, s3_file_key) # Metodo para Subir el archivo
