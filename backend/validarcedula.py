import cv2
import pytesseract

def detectar_tarjeta_identificacion(imagen):
    # Convierte la imagen a escala de grises
    gris = cv2.cvtColor(imagen, cv2.COLOR_BGR2GRAY)

    # Aplica un umbral para resaltar caracter�sticas
    _, umbral = cv2.threshold(gris, 128, 255, cv2.THRESH_BINARY)

    # Encuentra contornos en la imagen umbralizada
    contornos, _ = cv2.findContours(umbral, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    for contorno in contornos:
        # Aproxima un pol�gono al contorno
        epsilon = 0.02 * cv2.arcLength(contorno, True)
        aproximacion = cv2.approxPolyDP(contorno, epsilon, True)

        # Si el pol�gono tiene cuatro v�rtices, se considera una tarjeta de identificaci�n
        if len(aproximacion) == 4:
            return True

    return False

def extraer_informacion_ocr(imagen):
    # Utiliza Tesseract OCR para extraer texto de la imagen
    texto_extraido = pytesseract.image_to_string(imagen, lang='eng')

    return texto_extraido

# Ejemplo de uso
ruta_imagen = 'documentos/captura_cara_cedula.jpg'
imagen = cv2.imread(ruta_imagen)

if detectar_tarjeta_identificacion(imagen):
    informacion_extraida = extraer_informacion_ocr(imagen)
    print(f"Informaci�n extra�da de la tarjeta de identificaci�n:\n{informacion_extraida}")
else:
    print("No se detect� una tarjeta de identificaci�n en la imagen.")
