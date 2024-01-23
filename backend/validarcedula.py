# Importamos librerias
import cv2
import pytesseract   # Libreria detección de texto
import re

# Variables
cuadro = 100
doc = 0

# Captura de video
cap = cv2.VideoCapture(1)
cap.set(3, 1280)
cap.set(4, 720)

def texto(image):
    global doc
    # Variables
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    # Escala de grises
    gris = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # Umbral
    umbral = cv2.adaptiveThreshold(gris, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 55, 25)

    # Configuracion del OCR
    config = "--psm 1"
    texto = pytesseract.image_to_string(umbral, config=config)

    # Palabras clave Chile
    secchile = r'CHILE'
    secchile2 = r'IDENTIFICACION'

    buschile = re.findall(secchile, texto)
    buschile2 = re.findall(secchile2, texto)

    print(texto)

    # Si es de Chile
    if len(buschile) != 0 and len(buschile2) != 0:
        doc = 1

# Empezamos
while True:
    # Lectura de la VideoCaptura
    ret, frame = cap.read()

    # 'Interfaz'
    cv2.putText(frame, 'Ubique el documento de identidad', (458, 80), cv2.FONT_HERSHEY_SIMPLEX, 0.71, (0, 255, 0), 2)
    cv2.rectangle(frame, (cuadro, cuadro), (1280 - cuadro, 720 - cuadro), (0, 255, 0), 2)

    # Reset ID
    if doc == 0:
        cv2.putText(frame, 'PRESIONA S PARA IDENTIFICAR', (470, 750 - cuadro), cv2.FONT_HERSHEY_SIMPLEX, 0.71, (0, 255, 0), 2)
        # print(" LISTO PARA DETECTAR ID")

    elif doc == 1:
        cv2.putText(frame, 'IDENTIFICACION CHILENA', (470, 750 - cuadro), cv2.FONT_HERSHEY_SIMPLEX, 0.71, (0, 255, 255), 2)
        print('Cédula de Identidad Chilena')

    t = cv2.waitKey(1)
    # Funcion Texto

    # Reset [R] [r]
    if t == 82 or t == 114:
        doc = 0

    # Scan [S] [s]
    if t == 83 or t == 115:
        texto(frame)

    # Mostramos FPS
    cv2.imshow("ID INTELIGENTE", frame)
    if t == 27:
        break

cap.release()
cv2.destroyAllWindows()
