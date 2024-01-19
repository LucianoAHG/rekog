import cv2
import random

def capture_random_frame(video_path, output_path):
    cap = cv2.VideoCapture(video_path)

    # Obtiene el numero total de frames en el video
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    # Selecciona un frame aleatorio
    random_frame_index = random.randint(0, total_frames - 1)

    # Establece el indice del frame
    cap.set(cv2.CAP_PROP_POS_FRAMES, random_frame_index)

    # Lee el frame seleccionado
    ret, frame = cap.read()

    # Guarda el frame como imagen
    if ret:
        cv2.imwrite(output_path, frame)

    # Libera el objeto de captura
    cap.release()
