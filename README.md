# 노력맨 버블쇼 웹사이트

노력맨 버블쇼는 다양한 버블 공연과 교육, 장비제작을 전문으로 하는 개인 아티스트 브랜드입니다.
이 웹사이트는 버블쇼 공연 홍보, 교육과정 안내, 장비 정보 공유, 예약 및 문의 접수를 목적으로 제작되었습니다.

## 기능

- **프로필**: 노력맨 아티스트의 정체성과 활동 이력 소개
- **공연소개**: 다양한 버블쇼 공연 프로그램 소개
- **아카데미**: 버블쇼 교육 과정 및 장비 제작 노하우 공유
- **예약문의**: 공연 및 교육, 장비 관련 예약 및 문의 접수

## 설치 방법

### 필수 요구사항

- Python 3.7 이상
- Flask 웹 프레임워크

### 설치 과정

1. 저장소 클론:

   ```
   git clone https://github.com/yourusername/noryeokman-bubbleshow.git
   cd noryeokman-bubbleshow
   ```

2. 필요한 패키지 설치:

   ```
   pip install flask
   ```

3. 웹 서버 실행:

   ```
   python web.py
   ```

4. 웹 브라우저에서 접속:


## 프로젝트 구조
프로젝트/
├── web.py # Flask 애플리케이션 메인 파일
├── templates/ # HTML 템플릿 디렉터리
│ ├── index.html # 메인 페이지
│ ├── profile.html # 프로필 페이지
│ ├── performance.html # 공연소개 페이지
│ ├── academy.html # 아카데미 페이지
│ └── reservation.html # 예약문의 페이지
├── static/ # 정적 파일 디렉터리
│ ├── css/ # CSS 파일
│ │ └── style.css # 메인 스타일시트
│ ├── js/ # JavaScript 파일
│ │ └── script.js # 메인 스크립트
│ └── images/ # 이미지 파일
│ ├── post-noryeokman.png # 프로필 이미지
│ └── (기타 이미지 파일들)
└── README.md # 프로젝트 설명 파일