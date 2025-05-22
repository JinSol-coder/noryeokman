document.addEventListener('DOMContentLoaded', function() {
  // 아카데미 소개 섹션 생성
  createAcademyIntro();
  
  // 프로그램 섹션 생성
  createProgramsSection();
  
  // 수강생 후기 섹션 생성
  createTestimonialsSection();
  
  // 수강 신청 섹션 생성
  createEnrollSection();
});

// 아카데미 소개 섹션 생성 함수
function createAcademyIntro() {
  const introContainer = document.querySelector('.academy-intro');
  if (!introContainer) return;
  
  const introData = {
    title: '버블 아카데미 소개',
    description: '노력맨 버블 아카데미는 버블 아트에 관심 있는 모든 분들을 위한 교육 프로그램입니다. 초보자부터 전문가까지 다양한 레벨의 수업을 제공하며, 개인 및 단체 수업이 가능합니다. 버블 아트의 기초부터 고급 기술까지 체계적으로 배울 수 있습니다.',
    image: '/static/images/academy/intro.jpg'
  };
  
  // 소개 이미지
  const introImage = document.createElement('div');
  introImage.className = 'intro-image';
  introContainer.appendChild(introImage);
  
  const img = document.createElement('img');
  img.src = introData.image;
  img.alt = '버블 아카데미';
  introImage.appendChild(img);
  
  // 소개 텍스트
  const introText = document.createElement('div');
  introText.className = 'intro-text';
  introContainer.appendChild(introText);
  
  const title = document.createElement('h2');
  title.textContent = introData.title;
  introText.appendChild(title);
  
  const description = document.createElement('p');
  description.textContent = introData.description;
  introText.appendChild(description);
}

// 프로그램 섹션 생성 함수
function createProgramsSection() {
  const programsContainer = document.querySelector('.academy-programs');
  if (!programsContainer) return;
  
  const programsData = [
    {
      title: '어린이 버블 클래스',
      description: '5-12세 어린이를 위한 재미있는 버블 놀이와 기초 기술 교육',
      details: [
        '주 1회, 60분 수업',
        '소규모 그룹 레슨 (최대 10명)',
        '월 8만원 (재료비 포함)',
        '매주 토요일 오전 10시, 오후 2시'
      ],
      image: '/static/images/academy/kids.jpg'
    },
    {
      title: '성인 취미 클래스',
      description: '버블 아트에 관심 있는 성인을 위한 기초부터 중급 기술까지 배우는 과정',
      details: [
        '주 1회, 90분 수업',
        '소규모 그룹 레슨 (최대 8명)',
        '월 12만원 (재료비 포함)',
        '매주 화요일, 목요일 저녁 7시'
      ],
      image: '/static/images/academy/adult.jpg'
    },
    {
      title: '전문가 과정',
      description: '버블 아티스트를 꿈꾸는 분들을 위한 심화 과정',
      details: [
        '주 2회, 120분 수업',
        '소규모 그룹 레슨 (최대 5명)',
        '월 25만원 (재료비 포함)',
        '맞춤형 일정 조율 가능'
      ],
      image: '/static/images/academy/professional.jpg'
    }
  ];
  
  // 프로그램 아이템 생성
  programsData.forEach(program => {
    const programItem = document.createElement('div');
    programItem.className = 'program-item';
    programsContainer.appendChild(programItem);
    
    // 프로그램 이미지
    const imageDiv = document.createElement('div');
    imageDiv.className = 'program-image';
    programItem.appendChild(imageDiv);
    
    const img = document.createElement('img');
    img.src = program.image;
    img.alt = program.title;
    imageDiv.appendChild(img);
    
    // 프로그램 내용
    const contentDiv = document.createElement('div');
    contentDiv.className = 'program-content';
    programItem.appendChild(contentDiv);
    
    const title = document.createElement('h3');
    title.textContent = program.title;
    contentDiv.appendChild(title);
    
    const description = document.createElement('p');
    description.textContent = program.description;
    contentDiv.appendChild(description);
    
    // 프로그램 세부사항
    const detailsList = document.createElement('ul');
    contentDiv.appendChild(detailsList);
    
    program.details.forEach(detail => {
      const detailItem = document.createElement('li');
      detailItem.textContent = detail;
      detailsList.appendChild(detailItem);
    });
  });
}

// 수강생 후기 섹션 생성 함수
function createTestimonialsSection() {
  const testimonialsContainer = document.querySelector('.academy-testimonials');
  if (!testimonialsContainer) return;
  
  const testimonialsData = [
    {
      name: '김지영',
      role: '어린이 클래스 학부모',
      content: '아이가 버블 클래스를 너무 좋아해요. 매주 토요일이 기다려진다고 합니다. 선생님도 친절하시고 아이들의 눈높이에 맞춰 재미있게 가르쳐주셔서 감사합니다.',
      image: '/static/images/academy/testimonial1.jpg'
    },
    {
      name: '이상호',
      role: '성인 취미 클래스 수강생',
      content: '취미로 시작했는데 생각보다 너무 재미있어요. 스트레스도 풀리고 집에서도 연습할 수 있어 좋습니다. 선생님의 꼼꼼한 지도 덕분에 빠르게 실력이 늘고 있어요.',
      image: '/static/images/academy/testimonial2.jpg'
    },
    {
      name: '박미라',
      role: '전문가 과정 수료생',
      content: '전문가 과정을 통해 버블 아티스트로 활동할 수 있는 자신감을 얻었습니다. 체계적인 커리큘럼과 실전 위주의 교육이 큰 도움이 되었어요. 이제 직접 공연도 하고 있습니다!',
      image: '/static/images/academy/testimonial3.jpg'
    }
  ];
  
  // 후기 아이템 생성
  testimonialsData.forEach(testimonial => {
    const testimonialItem = document.createElement('div');
    testimonialItem.className = 'testimonial-item';
    testimonialsContainer.appendChild(testimonialItem);
    
    // 후기 이미지
    const imageDiv = document.createElement('div');
    imageDiv.className = 'testimonial-image';
    testimonialItem.appendChild(imageDiv);
    
    const img = document.createElement('img');
    img.src = testimonial.image;
    img.alt = testimonial.name;
    imageDiv.appendChild(img);
    
    // 후기 내용
    const contentDiv = document.createElement('div');
    contentDiv.className = 'testimonial-content';
    testimonialItem.appendChild(contentDiv);
    
    const quote = document.createElement('blockquote');
    quote.textContent = testimonial.content;
    contentDiv.appendChild(quote);
    
    const author = document.createElement('div');
    author.className = 'testimonial-author';
    contentDiv.appendChild(author);
    
    const name = document.createElement('h4');
    name.textContent = testimonial.name;
    author.appendChild(name);
    
    const role = document.createElement('p');
    role.textContent = testimonial.role;
    author.appendChild(role);
  });
}

// 수강 신청 섹션 생성 함수
function createEnrollSection() {
  const enrollContainer = document.querySelector('.academy-enroll');
  if (!enrollContainer) return;
  
  // 섹션 제목
  const title = document.createElement('h2');
  title.textContent = '수강 신청 안내';
  enrollContainer.appendChild(title);
  
  // 안내 텍스트
  const description = document.createElement('p');
  description.textContent = '버블 아카데미 수강을 원하시는 분은 아래 방법으로 신청해주세요.';
  enrollContainer.appendChild(description);
  
  // 신청 방법 리스트
  const methodsList = document.createElement('ul');
  enrollContainer.appendChild(methodsList);
  
  const methods = [
    '전화 신청: 010-8944-3907',
    '이메일 신청: 05070208@hanmail.net',
    '방문 신청: 대전 서구 둔산로 241, 보라아파트상가 2층'
  ];
  
  methods.forEach(method => {
    const methodItem = document.createElement('li');
    methodItem.textContent = method;
    methodsList.appendChild(methodItem);
  });
  
  // 신청 버튼
  const buttonDiv = document.createElement('div');
  buttonDiv.className = 'text-center mt-4';
  enrollContainer.appendChild(buttonDiv);
  
  const button = document.createElement('a');
  button.href = '/reservation';
  button.className = 'btn btn-primary btn-lg';
  button.textContent = '온라인으로 문의하기';
  buttonDiv.appendChild(button);
} 