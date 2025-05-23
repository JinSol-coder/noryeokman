from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from pymongo import MongoClient
import os
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import datetime
from bson.objectid import ObjectId
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash

# 환경 변수 로드
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'default_secret_key')

# MongoDB 연결
client = MongoClient(os.getenv('MONGO_URI', 'mongodb://localhost:27017/'))
db = client['myconnection']
gallery_collection = db['gallery']
users_collection = db['users']
videos_collection = db['videos']

# 허용된 파일 확장자
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Flask-Login 설정
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# 사용자 모델
class User(UserMixin):
    def __init__(self, id):
        self.id = id

# 사용자 로드 함수
@login_manager.user_loader
def load_user(user_id):
    return User(user_id)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    # 공연 갤러리 이미지 가져오기
    gallery_images = list(gallery_collection.find({'category': 'performance'}).sort('uploaded_at', -1))
    return render_template('index.html', gallery_images=gallery_images)

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/performance')
def performance():
    # 갤러리 이미지 가져오기
    gallery_images = list(gallery_collection.find({'category': 'performance'}).sort('uploaded_at', -1))
    
    # 비디오 가져오기
    videos = list(videos_collection.find({'category': 'performance'}).sort('created_at', -1))
    
    # 디버깅을 위한 출력
    print(f"Found {len(videos)} videos")
    
    return render_template('performance.html', gallery_images=gallery_images, videos=videos)

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

# API 엔드포인트로 통합
@app.route('/upload-performance-image', methods=['POST'])
def upload_performance_image():
    if not session.get('logged_in'):
        if request.headers.get('Content-Type') == 'application/json':
            return jsonify({'success': False, 'message': '로그인이 필요합니다'})
        else:
            flash('로그인이 필요합니다')
            return redirect(url_for('login'))
    
    if 'file' not in request.files:
        if request.headers.get('Content-Type') == 'application/json':
            return jsonify({'success': False, 'message': '파일이 없습니다'})
        else:
            flash('파일이 없습니다')
            return redirect(url_for('performance'))
    
    file = request.files['file']
    
    if file.filename == '':
        if request.headers.get('Content-Type') == 'application/json':
            return jsonify({'success': False, 'message': '선택된 파일이 없습니다'})
        else:
            flash('선택된 파일이 없습니다')
            return redirect(url_for('performance'))
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upload_folder = os.path.join(app.static_folder, 'images', 'gallery')
        os.makedirs(upload_folder, exist_ok=True)
        
        timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
        new_filename = f"{timestamp}_{filename}"
        file_path = os.path.join(upload_folder, new_filename)
        
        file.save(file_path)
        
        image_data = {
            'filename': new_filename,
            'original_filename': filename,
            'path': f'/static/images/gallery/{new_filename}',
            'category': 'performance',
            'uploaded_at': datetime.datetime.now()
        }
        
        result = gallery_collection.insert_one(image_data)
        
        if request.headers.get('Content-Type') == 'application/json':
            if result.inserted_id:
                return jsonify({'success': True, 'message': '이미지가 성공적으로 업로드되었습니다'})
            else:
                return jsonify({'success': False, 'message': '이미지 업로드 중 오류가 발생했습니다'})
        else:
            flash('이미지가 성공적으로 업로드되었습니다')
    else:
        if request.headers.get('Content-Type') == 'application/json':
            return jsonify({'success': False, 'message': '허용되지 않는 파일 형식입니다'})
        else:
            flash('허용되지 않는 파일 형식입니다')
    
    return redirect(url_for('performance'))

# 관리자 계정 정보
ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'admin'

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        # 관리자 계정 확인 (실제 환경에서는 더 안전한 방식으로 구현해야 함)
        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            session['logged_in'] = True
            return redirect(url_for('index'))  # 홈페이지로 리디렉션
        else:
            # 로그인 실패 시 alert 메시지를 전달하여 템플릿에서 표시
            return render_template('login.html', error="아이디 또는 비밀번호가 올바르지 않습니다.")
    
    return render_template('login.html')

@app.route('/admin_dashboard')
def admin_dashboard():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    return "관리자 대시보드에 오신 것을 환영합니다."

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('index'))  # 로그아웃 후 기존 홈페이지로 리디렉션

@app.route('/admin/performance')
def admin_performance():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    # 갤러리 이미지 가져오기
    gallery_images = list(gallery_collection.find({'category': 'performance'}).sort('uploaded_at', -1))
    return render_template('admin/performance.html', gallery_images=gallery_images)

@app.route('/delete-performance-image/<image_id>')
def delete_performance_image(image_id):
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    try:
        # 이미지 정보 가져오기
        image = gallery_collection.find_one({'_id': ObjectId(image_id)})
        if image:
            # 파일 시스템에서 이미지 삭제
            file_path = os.path.join(app.static_folder, image['path'].lstrip('/static/'))
            if os.path.exists(file_path):
                os.remove(file_path)
            
            # 데이터베이스에서 이미지 정보 삭제
            gallery_collection.delete_one({'_id': ObjectId(image_id)})
            flash('이미지가 성공적으로 삭제되었습니다')
        else:
            flash('이미지를 찾을 수 없습니다')
    except Exception as e:
        flash(f'이미지 삭제 중 오류가 발생했습니다: {str(e)}')
    
    return redirect(url_for('performance'))

# 비디오 목록 가져오기 함수
def get_performance_videos():
    return list(videos_collection.find({'category': 'performance'}).sort('created_at', -1))

# 비디오 추가 라우트 수정
@app.route('/add-performance-video', methods=['POST'])
def add_performance_video():
    if not session.get('logged_in'):
        if request.headers.get('Content-Type') == 'application/json':
            return jsonify({'success': False, 'message': '로그인이 필요합니다'})
        else:
            return redirect(url_for('login'))
    
    # JSON 요청 처리
    if request.headers.get('Content-Type') == 'application/json':
        data = request.get_json()
        title = data.get('title', '').strip()
        youtube_id = data.get('youtube_id', '').strip()
    # 폼 데이터 처리
    else:
        title = request.form.get('title', '').strip()
        youtube_id = request.form.get('youtube_id', '').strip()
    
    # 디버깅을 위한 출력
    print(f"Adding video - Title: {title}, YouTube ID: {youtube_id}")
    
    if not title or not youtube_id:
        if request.headers.get('Content-Type') == 'application/json':
            return jsonify({'success': False, 'message': '제목과 유튜브 ID를 모두 입력해주세요'})
        else:
            flash('제목과 유튜브 ID를 모두 입력해주세요')
            return redirect(url_for('performance'))
    
    # 유튜브 ID에서 URL 형식 처리
    if 'youtube.com' in youtube_id or 'youtu.be' in youtube_id:
        if 'v=' in youtube_id:
            youtube_id = youtube_id.split('v=')[1].split('&')[0]
        elif 'youtu.be/' in youtube_id:
            youtube_id = youtube_id.split('youtu.be/')[1]
    
    # 유튜브 ID 형식 검증 (간단한 검증)
    if len(youtube_id) < 5 or len(youtube_id) > 20:
        if request.headers.get('Content-Type') == 'application/json':
            return jsonify({'success': False, 'message': '유효하지 않은 유튜브 ID입니다'})
        else:
            flash('유효하지 않은 유튜브 ID입니다')
            return redirect(url_for('performance'))
    
    video_data = {
        'title': title,
        'youtube_id': youtube_id,
        'category': 'performance',
        'created_at': datetime.datetime.now()
    }
    
    # 디버깅을 위한 출력
    print(f"Video data to insert: {video_data}")
    
    result = videos_collection.insert_one(video_data)
    
    # 디버깅을 위한 출력
    print(f"Insert result: {result.inserted_id}")
    
    if result.inserted_id:
        if request.headers.get('Content-Type') == 'application/json':
            return jsonify({'success': True, 'message': '비디오가 성공적으로 추가되었습니다'})
        else:
            flash('비디오가 성공적으로 추가되었습니다')
    else:
        if request.headers.get('Content-Type') == 'application/json':
            return jsonify({'success': False, 'message': '비디오 추가 중 오류가 발생했습니다'})
        else:
            flash('비디오 추가 중 오류가 발생했습니다')
    
    return redirect(url_for('performance'))

# 비디오 수정 라우트
@app.route('/edit-performance-video/<video_id>', methods=['POST'])
def edit_performance_video(video_id):
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    title = request.form.get('title', '').strip()
    youtube_id = request.form.get('youtube_id', '').strip()
    
    if not title or not youtube_id:
        flash('제목과 유튜브 ID를 모두 입력해주세요')
        return redirect(url_for('performance'))
    
    # 유튜브 ID 형식 검증 (간단한 검증)
    if len(youtube_id) < 5 or len(youtube_id) > 20:
        flash('유효하지 않은 유튜브 ID입니다')
        return redirect(url_for('performance'))
    
    videos_collection.update_one(
        {'_id': ObjectId(video_id)},
        {'$set': {
            'title': title,
            'youtube_id': youtube_id,
            'updated_at': datetime.datetime.now()
        }}
    )
    
    flash('비디오가 성공적으로 수정되었습니다')
    return redirect(url_for('performance'))

# 비디오 삭제 라우트
@app.route('/delete-performance-video/<video_id>')
def delete_performance_video(video_id):
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    try:
        videos_collection.delete_one({'_id': ObjectId(video_id)})
        flash('비디오가 성공적으로 삭제되었습니다')
    except Exception as e:
        flash(f'비디오 삭제 중 오류가 발생했습니다: {str(e)}')
    
    return redirect(url_for('performance'))

# API 엔드포인트 추가
@app.route('/api/performance-images')
def api_performance_images():
    gallery_images = list(gallery_collection.find({'category': 'performance'}).sort('uploaded_at', -1))
    # ObjectId를 문자열로 변환
    for image in gallery_images:
        image['_id'] = str(image['_id'])
    return jsonify(gallery_images)

@app.route('/api/performance-videos')
def api_performance_videos():
    videos = list(videos_collection.find({'category': 'performance'}).sort('created_at', -1))
    # ObjectId를 문자열로 변환
    for video in videos:
        video['_id'] = str(video['_id'])
    return jsonify(videos)

if __name__ == '__main__':
    app.run(debug=True)
