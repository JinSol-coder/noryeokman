// 페이지 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
  console.log('노력맨 버블쇼 웹사이트가 로드되었습니다.');
  
  // 이미지 로드 확인
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('error', function() {
      console.error('이미지 로드 실패:', this.src);
      this.src = '/static/images/placeholder.png'; // 대체 이미지
    });
  });
}); 