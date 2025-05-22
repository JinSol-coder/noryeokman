document.addEventListener('DOMContentLoaded', function() {
  // 메인 슬라이더 생성
  createMainSlider();
  
  // 서비스 섹션 생성
  createServiceSection();
  
  // 갤러리 섹션 생성
  loadGalleryImages();
  
  // 연락처 섹션 생성
  createContactSection();
});

// 메인 슬라이더 생성 함수
function createMainSlider() {
  const sliderContainer = document.querySelector('.main-slider');
  if (!sliderContainer) return;
  
  const slides = [
    {
      image: '/static/images/slider/slide1.jpg',
      title: '노력맨 버블쇼',
      description: '신비로운 버블 아트의 세계로 초대합니다'
    },
    {
      image: '/static/images/slider/slide2.jpg',
      title: '다양한 공연 프로그램',
      description: '각종 행사와 이벤트에 맞춤형 버블쇼를 제공합니다'
    },
    {
      image: '/static/images/slider/slide3.jpg',
      title: '버블 아카데미',
      description: '버블 아트의 기술을 배우고 싶으신가요?'
    }
  ];
  
  // 캐러셀 구조 생성
  const carousel = document.createElement('div');
  carousel.id = 'mainCarousel';
  carousel.className = 'carousel slide';
  carousel.dataset.bsRide = 'carousel';
  sliderContainer.appendChild(carousel);
  
  // 캐러셀 인디케이터 생성
  const indicators = document.createElement('div');
  indicators.className = 'carousel-indicators';
  carousel.appendChild(indicators);
  
  // 캐러셀 내부 생성
  const inner = document.createElement('div');
  inner.className = 'carousel-inner';
  carousel.appendChild(inner);
  
  // 슬라이드 생성
  slides.forEach((slide, index) => {
    // 인디케이터 버튼
    const indicator = document.createElement('button');
    indicator.type = 'button';
    indicator.dataset.bsTarget = '#mainCarousel';
    indicator.dataset.bsSlideTo = index;
    if (index === 0) indicator.className = 'active';
    indicator.setAttribute('aria-current', index === 0 ? 'true' : 'false');
    indicator.setAttribute('aria-label', `Slide ${index + 1}`);
    indicators.appendChild(indicator);
    
    // 슬라이드 아이템
    const slideItem = document.createElement('div');
    slideItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
    inner.appendChild(slideItem);
    
    // 슬라이드 이미지
    const img = document.createElement('img');
    img.src = slide.image;
    img.className = 'd-block w-100';
    img.alt = slide.title;
    slideItem.appendChild(img);
    
    // 슬라이드 캡션
    const caption = document.createElement('div');
    caption.className = 'carousel-caption d-none d-md-block';
    slideItem.appendChild(caption);
    
    const title = document.createElement('h2');
    title.textContent = slide.title;
    caption.appendChild(title);
    
    const description = document.createElement('p');
    description.textContent = slide.description;
    caption.appendChild(description);
  });
  
  // 이전/다음 버튼 생성
  const prevButton = document.createElement('button');
  prevButton.className = 'carousel-control-prev';
  prevButton.type = 'button';
  prevButton.dataset.bsTarget = '#mainCarousel';
  prevButton.dataset.bsSlide = 'prev';
  carousel.appendChild(prevButton);
  
  const prevIcon = document.createElement('span');
  prevIcon.className = 'carousel-control-prev-icon';
  prevIcon.setAttribute('aria-hidden', 'true');
  prevButton.appendChild(prevIcon);
  
  const prevText = document.createElement('span');
  prevText.className = 'visually-hidden';
  prevText.textContent = '이전';
  prevButton.appendChild(prevText);
  
  const nextButton = document.createElement('button');
  nextButton.className = 'carousel-control-next';
  nextButton.type = 'button';
  nextButton.dataset.bsTarget = '#mainCarousel';
  nextButton.dataset.bsSlide = 'next';
  carousel.appendChild(nextButton);
  
  const nextIcon = document.createElement('span');
  nextIcon.className = 'carousel-control-next-icon';
  nextIcon.setAttribute('aria-hidden', 'true');
  nextButton.appendChild(nextIcon);
  
  const nextText = document.createElement('span');
  nextText.className = 'visually-hidden';
  nextText.textContent = '다음';
  nextButton.appendChild(nextText);
}

// 서비스 섹션 생성 함수
function createServiceSection() {
  const servicesContainer = document.querySelector('.services');
  if (!servicesContainer) return;
  
  const services = [
    {
      icon: 'bi-magic',
      title: '버블쇼 공연',
      description: '다양한 이벤트와 행사에 맞춤형 버블쇼를 제공합니다.',
      link: '/performance'
    },
    {
      icon: 'bi-mortarboard',
      title: '버블 아카데미',
      description: '버블 아트의 기술을 배우고 싶으신 분들을 위한 교육 프로그램을 운영합니다.',
      link: '/academy'
    },
    {
      icon: 'bi-calendar-check',
      title: '공연 예약',
      description: '원하시는 날짜와 장소에 맞춰 버블쇼 공연을 예약하세요.',
      link: '/reservation'
    }
  ];
  
  // 서비스 아이템 생성
  services.forEach(service => {
    const serviceItem = document.createElement('div');
    serviceItem.className = 'service-item';
    servicesContainer.appendChild(serviceItem);
    
    const icon = document.createElement('i');
    icon.className = `bi ${service.icon}`;
    serviceItem.appendChild(icon);
    
    const title = document.createElement('h3');
    title.textContent = service.title;
    serviceItem.appendChild(title);
    
    const description = document.createElement('p');
    description.textContent = service.description;
    serviceItem.appendChild(description);
    
    const link = document.createElement('a');
    link.href = service.link;
    link.className = 'btn btn-primary';
    link.textContent = '자세히 보기';
    serviceItem.appendChild(link);
  });
}

// 갤러리 이미지 로드 함수
function loadGalleryImages() {
  const galleryContainer = document.querySelector('.gallery');
  if (!galleryContainer) return;
  
  // 서버에서 이미지 데이터 가져오기
  fetch('/api/performance-images')
    .then(response => response.json())
    .then(images => {
      // 최대 6개의 이미지만 표시
      const displayImages = images.slice(0, 6);
      
      if (displayImages.length === 0) {
        // 이미지가 없을 경우 기본 이미지 표시
        for (let i = 0; i < 3; i++) {
          const placeholderItem = createGalleryItem({
            path: '/static/images/placeholder.png',
            original_filename: '버블쇼 공연 사진'
          });
          galleryContainer.appendChild(placeholderItem);
        }
      } else {
        // 이미지가 있을 경우 각 이미지 표시
        displayImages.forEach((image, index) => {
          const galleryItem = createGalleryItem(image, index);
          galleryContainer.appendChild(galleryItem);
        });
      }
      
      // 더보기 버튼 추가
      const moreButton = document.createElement('div');
      moreButton.className = 'text-center mt-4';
      galleryContainer.parentElement.appendChild(moreButton);
      
      const link = document.createElement('a');
      link.href = '/performance';
      link.className = 'btn btn-outline-primary';
      link.textContent = '더 많은 사진 보기';
      moreButton.appendChild(link);
    })
    .catch(error => {
      console.error('갤러리 이미지 로드 중 오류 발생:', error);
      galleryContainer.innerHTML = '<div class="alert alert-danger">이미지를 불러오는 중 오류가 발생했습니다.</div>';
    });
}

// 갤러리 아이템 생성 함수
function createGalleryItem(image, index) {
  // 갤러리 아이템 컨테이너
  const galleryItem = document.createElement('div');
  galleryItem.className = 'gallery-item';
  
  // 이미지 요소
  const img = document.createElement('img');
  img.src = image.path;
  img.alt = image.original_filename;
  galleryItem.appendChild(img);
  
  return galleryItem;
}

// 연락처 섹션 생성 함수
function createContactSection() {
  const contactContainer = document.querySelector('.contact-info');
  if (!contactContainer) return;
  
  const contactItems = [
    {
      icon: 'bi-telephone',
      title: '전화',
      content: '010-8944-3907'
    },
    {
      icon: 'bi-envelope',
      title: '이메일',
      content: '05070208@hanmail.net'
    },
    {
      icon: 'bi-geo-alt',
      title: '주소',
      content: '대전 서구 둔산로 241, 보라아파트상가 2층'
    }
  ];
  
  // 연락처 아이템 생성
  contactItems.forEach(item => {
    const contactItem = document.createElement('div');
    contactItem.className = 'contact-item';
    contactContainer.appendChild(contactItem);
    
    const icon = document.createElement('i');
    icon.className = `bi ${item.icon}`;
    contactItem.appendChild(icon);
    
    const title = document.createElement('h4');
    title.textContent = item.title;
    contactItem.appendChild(title);
    
    const content = document.createElement('p');
    content.textContent = item.content;
    contactItem.appendChild(content);
  });
} 