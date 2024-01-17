import boto3

class RekognitionImage:
    def __init__(self, image_name, rekognition_client):
        self.image_name = image_name
        self.rekognition_client = rekognition_client

    def compare_faces(self, target_image_name, similarity):
        try:
            source_image = {'S3Object': {'Bucket': 'pruebasimg123', 'Name': self.image_name}}
            target_image = {'S3Object': {'Bucket': 'pruebasimg123', 'Name': target_image_name}}

            response = self.rekognition_client.compare_faces(
                SourceImage=source_image,
                TargetImage=target_image,
                SimilarityThreshold=similarity,
            )
            matches = [
                RekognitionFace(match["Face"]) for match in response["FaceMatches"]
            ]
            unmatches = [RekognitionFace(face) for face in response["UnmatchedFaces"]]
            print(
                f"Se encontro {len(matches)} cara similar y {len(unmatches)} no identificada."
            )
        except ClientError:
            print(
                f"no se encontraron coincidencias {self.image_name} to {target_image_name}."
            )
            raise
        else:
            return matches, unmatches

# RekognitionFace class 
class RekognitionFace:
    def __init__(self, face):
        self.face = face

# Configurar el cliente de Rekognition
rekognition_client = boto3.client('rekognition')

# Crear instancias de las imagenes que deseas comparar
image_source = RekognitionImage(image_name='cedula.jpg', rekognition_client=rekognition_client)

# Especificar el nombre de la imagen de destino en el mismo bucket
target_image_name = 'captura_cara.jpg'

# Comparar caras
matches, unmatches = image_source.compare_faces(target_image_name=target_image_name, similarity=80.0)

