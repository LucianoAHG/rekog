import cv2
import random

def capture_random_frame_by_fps(video_path, output_path):
    try:
        # Abre el video utilizando OpenCV
        cap = cv2.VideoCapture(video_path)

        # Verifica si la apertura del video fue exitosa
        if not cap.isOpened():
            raise Exception("Error al abrir el video")

        # Obtiene la duracion total del video en segundos
        total_duration = cap.get(cv2.CAP_PROP_POS_MSEC) / 1000.0

        # Obtiene el numero de frames por segundo (FPS)
        fps = cap.get(cv2.CAP_PROP_FPS)

        # Verifica si hay FPS validos
        if fps <= 0:
            raise Exception("El video no tiene FPS validos")

        # Calcula el tiempo aleatorio en segundos
        random_time = random.uniform(0, total_duration)

        # Establece la posicion en el tiempo
        cap.set(cv2.CAP_PROP_POS_MSEC, random_time * 1000)

        # Lee el frame seleccionado
        ret, frame = cap.read()

        # Verifica si la lectura del frame fue exitosa
        if not ret:
            raise Exception("Error al leer el frame")

        # Guarda el frame como imagen
        cv2.imwrite(output_path, frame)

        # Libera el objeto de captura
        cap.release()

    except Exception as e:
        print(f"Error al capturar el frame aleatorio: {str(e)}")

# Uso de la funcion con las rutas absolutas
video_persona_filename = 'C:/Users/desar/OneDrive/Escritorio/rekog/backend/Documentos/video_persona.mp4'
captura_cara_filename = 'C:/Users/desar/OneDrive/Escritorio/rekog/backend/Documentos/captura_cara_persona.jpg'
capture_random_frame_by_fps(video_persona_filename, captura_cara_filename)

# Uso de la funcion para el segundo video y captura
video_cedula_filename = 'C:/Users/desar/OneDrive/Escritorio/rekog/backend/Documentos/video_cedula.mp4'
captura_cedula_filename = 'C:/Users/desar/OneDrive/Escritorio/rekog/backend/Documentos/captura_cara_cedula.jpg'
capture_random_frame_by_fps(video_cedula_filename, captura_cedula_filename)
