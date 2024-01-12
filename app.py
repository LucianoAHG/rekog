from flask import Flask, render_template, request, redirect, url_for
from flask_bulma import Bulma
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///usuarios.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

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
        # Obtener datos del formulario
        nombre = request.form['nombre']
        email = request.form['email']
        contrasena = request.form['nueva_password']

        # Validaciones basicas
        if not nombre or not email or not contrasena:
            return render_template('crear_usuario.html', error='Todos los campos son requeridos')

        # Verificar si el usuario ya existe
        if Usuario.query.filter_by(email=email).first():
            return render_template('crear_usuario.html', error='El usuario ya existe')

        # Crear un nuevo usuario
        contrasena_hash = generate_password_hash(contrasena, method='pbkdf2:sha256')
        nuevo_usuario = Usuario(nombre=nombre, email=email, contrasena=contrasena_hash)

        db.session.add(nuevo_usuario)
        db.session.commit()

        # Redirigir al formulario de carga despues de crear el usuario
        return redirect(url_for('formulario_carga'))

    return render_template('crear_usuario.html')

@app.route('/formulario_carga')
def formulario_carga():
    return render_template('formulario_carga.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
