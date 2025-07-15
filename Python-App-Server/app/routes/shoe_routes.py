from flask import Blueprint, jsonify
from app.models import shoes

shoe_bp = Blueprint('shoe_bp', __name__, url_prefix='/api')

@shoe_bp.route('/shoes', methods=['GET'])
def get_all_shoes():
    try:
        shoeList = shoes.query.all()
        return jsonify([shoe.to_dict() for shoe in shoeList]), 200
    except Exception as e:
        return jsonify({"error": "Failed to retrieve shoes", "message": str(e)}), 500
