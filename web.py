from flask import Flask, render_template, request, redirect, url_for, flash
from pymongo import MongoClient
import os
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import datetime
from bson.objectid import ObjectId

# 환경 변수 로드
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'default_secret_key')

# MongoDB 연결
client = MongoClient(os.getenv('MONGO_URI', 'mongodb://localhost:27017/'))
db = client['myconnection']
gallery_collection = db['gallery']

# 허용된 파일 확장자
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/performance')
def performance():
    # 갤러리 이미지 가져오기
    gallery_images = list(gallery_collection.find({'category': 'performance'}).sort('uploaded_at', -1))
    return render_template('performance.html', gallery_images=gallery_images)

@app.route('/academy')
def academy():
    return render_template('academy.html')

@app.route('/reservation')
def reservation():
    return render_template('reservation.html')

# 관리자 페이지 - 이미지 업로드
@app.route('/admin/upload', methods=['GET', 'POST'])
def upload_image():
    if request.method == 'POST':
        # 카테고리 확인
        category = request.form.get('category', 'general')
        
        # 파일이 요청에 포함되어 있는지 확인
        if 'file' not in request.files:
            flash('파일이 없습니다')
            return redirect(request.url)
            
        file = request.files['file']
        
        # 파일이 선택되었는지 확인
        if file.filename == '':
            flash('선택된 파일이 없습니다')
            return redirect(request.url)
            
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            
            # 파일 저장 경로
            upload_folder = os.path.join(app.static_folder, 'images', 'gallery')
            os.makedirs(upload_folder, exist_ok=True)
            
            # 파일명 중복 방지를 위해 타임스탬프 추가
            timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
            new_filename = f"{timestamp}_{filename}"
            file_path = os.path.join(upload_folder, new_filename)
            
            # 파일 저장
            file.save(file_path)
            
            # MongoDB에 이미지 정보 저장
            image_data = {
                'filename': new_filename,
                'original_filename': filename,
                'path': f'/static/images/gallery/{new_filename}',
                'category': category,
                'uploaded_at': datetime.datetime.now()
            }
            
            gallery_collection.insert_one(image_data)
            
            flash('이미지가 성공적으로 업로드되었습니다')
            return redirect(url_for('admin_gallery'))
            
    return render_template('admin/upload.html')

# 관리자 페이지 - 갤러리 관리
@app.route('/admin/gallery')
def admin_gallery():
    # 모든 갤러리 이미지 가져오기
    gallery_images = list(gallery_collection.find().sort('uploaded_at', -1))
    return render_template('admin/gallery.html', gallery_images=gallery_images)

# 관리자 페이지 - 이미지 삭제
@app.route('/admin/gallery/delete/<image_id>')
def delete_image(image_id):
    # 이미지 정보 가져오기
    image = gallery_collection.find_one({'_id': ObjectId(image_id)})
    
    if image:
        # 파일 시스템에서 이미지 삭제
        file_path = os.path.join(app.static_folder, 'images', 'gallery', image['filename'])
        if os.path.exists(file_path):
            os.remove(file_path)
        
        # 데이터베이스에서 이미지 정보 삭제
        gallery_collection.delete_one({'_id': ObjectId(image_id)})
        
        flash('이미지가 삭제되었습니다')
    else:
        flash('이미지를 찾을 수 없습니다')
        
    return redirect(url_for('admin_gallery'))

# 테스트 데이터 삽입 라우트
@app.route('/init-db')
def init_db():
    try:
        # 테스트 이미지 데이터 생성
        test_image = {
            'filename': 'test_image.jpg',
            'original_filename': 'test_image.jpg',
            'path': '/static/images/placeholder.png',  # 실제 존재하는 이미지 경로로 변경
            'category': 'performance',
            'uploaded_at': datetime.datetime.now()
        }
        
        # 데이터 삽입
        result = gallery_collection.insert_one(test_image)
        
        return f"""
        <h1>테스트 데이터 삽입 성공!</h1>
        <p>삽입된 문서 ID: {result.inserted_id}</p>
        <p><a href="/test-mongo">MongoDB 연결 테스트로 이동</a></p>
        <p><a href="/admin/gallery">갤러리 관리로 이동</a></p>
        """
    except Exception as e:
        return f"""
        <h1>테스트 데이터 삽입 실패</h1>
        <p>오류: {str(e)}</p>
        """

if __name__ == '__main__':
    app.run(debug=True)
