import boto3
import io

rekognition = boto3.client('rekognition')

bucket_name = 'pruebasimg123'
image_name_s3 = 'pasotest.jpg'
s3_object_source = {'Bucket': bucket_name, 'Name': image_name_s3}

# Detectar etiquetas en la imagen de origen
response_source = rekognition.detect_labels(Image={'S3Object': s3_object_source})

print('Etiquetas detectadas en la imagen de origen:')
for label in response_source['Labels']:
    print(f"{label['Name']}: {label['Confidence']}%")

# Verificar si se detectaron caras en la imagen de origen
if 'FaceDetails' in response_source and len(response_source['FaceDetails']) > 0:
    source_face_id = response_source['FaceDetails'][0]['FaceId']
    print(f"cara de la imagen de origen en S3: {source_face_id}")

    # Especificar la ubicaci�n de la segunda imagen en S3
    image_name_s3_target = 'comparacion.jpg'
    s3_object_target = {'Bucket': bucket_name, 'Name': image_name_s3_target}

    # Enviar la solicitud para comparar las caras
    compare_response = rekognition.compare_faces(
        SourceImage={'S3Object': s3_object_source},
        TargetImage={'S3Object': s3_object_target}
    )

    # Verificar los resultados de la comparaci�n
    if compare_response['FaceMatches']:
        confidence = compare_response['FaceMatches'][0]['Similarity']
        print(f'Cara similar encontrada en la segunda imagen: {confidence}%')
    else:
        print('No se encontraron caras similares en la segunda imagen.')

# else:
#     print("No se detectaron caras en la imagen de origen en S3.")