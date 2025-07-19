<<<<<<< HEAD
from flask import Blueprint, jsonify
from app.models import shoes
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables once when this module is imported

shoe_bp = Blueprint('shoe_bp', __name__, url_prefix='/api')

@shoe_bp.route('/shoes', methods=['GET'])
def get_all_shoes():
    try:
        shoeList = shoes.query.all()
        
        db_host = os.getenv("DB_HOST")
        print("DB Host:", db_host)
        print("data:",  shoeList[0])
        return jsonify([shoe.to_dict() for shoe in shoeList]), 200
    except Exception as e:
        return jsonify({"error": "Failed to retrieve shoes", "message": str(e)}), 500
=======
>>>>>>> main
