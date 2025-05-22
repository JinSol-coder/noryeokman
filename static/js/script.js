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
  
  // 캐러셀 설정 (4초마다 슬라이드 변경)
  const carousel = document.getElementById('heroCarousel');
  if (carousel) {
    const carouselInstance = new bootstrap.Carousel(carousel, {
      interval: 4000, // 4초
      wrap: true,
      pause: 'hover'
    });
  }
  
  // 스크롤 애니메이션
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.card, .performance-item, .equipment-item, .curriculum-item, .option-item');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementPosition < windowHeight - 50) {
        element.classList.add('fade-in');
      }
    });
  };
  
  // 초기 실행 및 스크롤 이벤트에 연결
  animateOnScroll();
  window.addEventListener('scroll', animateOnScroll);

  const uploadForm = document.getElementById('uploadForm');
  
  if (uploadForm) {
    uploadForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const formData = new FormData(uploadForm);
      
      fetch('/upload-image', {
        method: 'POST',
        body: formData
      })
      .then(response => response.text())
      .then(data => {
        console.log('Success:', data);
        location.reload(); // 페이지 새로고침
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    });
  }
}); 