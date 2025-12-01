from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
import os

load_dotenv()

app = Flask(__name__)

CORS(app)

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")

app.config['SQLALCHEMY_DATABASE_URI'] = \
  f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}'
  
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Task(db.Model):
  __tablename__ = 'tasks'
  id = db.Column(db.Integer, primary_key=True)
  title = db.Column(db.String(100), nullable=False)
  description = db.Column(db.Text)
  done = db.Column(db.Boolean, default=False) 
 
  def to_dict(self):
    """Converte o objeto Task em um dicionário pra retornar em JSON."""
    return {
      'id': self.id,
      'title': self.title,
      'description': self.description,
      'done': self.done
    }
  
@app.route('/api/tasks', methods=['POST'])
def create_task():
  """Cria uma nova tarefa."""
  data = request.get_json()
  new_task = Task(
    title=data['title'],
    description=data.get('description', ''),
    done=data.get('done', False)
  )
  
  task = db.session.query(Task).filter_by(title=new_task.title).first()
  
  if task: return { "error": f"Tarefa com o titulo {new_task.title} já existe" }, 400
  
  db.session.add(new_task)
  db.session.commit()
  return jsonify(new_task.to_dict()), 201

@app.route("/api/tasks", methods=['GET'])
def get_tasks():
  """Retorna todas as tarefas."""
  tasks = Task.query.all()
  return jsonify([task.to_dict() for task in tasks])

@app.route("/api/tasks/<int:id>", methods=['PUT'])
def update_task(id):
  """Atualiza uma tarefa pelo id."""
  task = Task.query.get_or_404(id)
  data = request.get_json()
  
  if 'title' in data:
    task.title = data['title']
  if 'description' in data:
    task.description = data["description"]
  if 'done' in data:
    task.done = data["done"]
    
  db.session.commit()
  return jsonify(task.to_dict())

@app.route("/api/tasks/<int:id>", methods=['DELETE'])
def delete_task(id):
  """Deleta uma tarefa pelo id."""
  task = Task.query.get_or_404(id)
  db.session.delete(task)
  db.session.commit()
  
  return jsonify({"message": "Task deletada com sucesso."}), 204
  

with app.app_context():
  db.create_all()