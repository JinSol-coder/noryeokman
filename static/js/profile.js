document.addEventListener('DOMContentLoaded', function() {
  // 프로필 정보 생성
  createProfileInfo();
  
  // 경력 정보 생성
  createCareerInfo();
  
  // 자격증 정보 생성
  createCertificateInfo();
});

// 프로필 정보 생성 함수
function createProfileInfo() {
  const profileContainer = document.querySelector('.profile-info');
  if (!profileContainer) return;
  
  const profileData = {
    name: '노력맨',
    title: '버블 아티스트',
    description: '안녕하세요! 버블 아티스트 노력맨입니다. 다양한 버블쇼 공연과 교육 활동을 통해 많은 분들에게 즐거움을 선사하고 있습니다. 항상 새로운 도전과 노력으로 더 나은 공연을 만들어가고 있습니다.',
    image: '/static/images/profile.jpg'
  };
  
  // 프로필 이미지
  const profileImage = document.createElement('div');
  profileImage.className = 'profile-image';
  profileContainer.appendChild(profileImage);
  
  const img = document.createElement('img');
  img.src = profileData.image;
  img.alt = profileData.name;
  profileImage.appendChild(img);
  
  // 프로필 텍스트
  const profileText = document.createElement('div');
  profileText.className = 'profile-text';
  profileContainer.appendChild(profileText);
  
  const name = document.createElement('h2');
  name.textContent = profileData.name;
  profileText.appendChild(name);
  
  const title = document.createElement('h3');
  title.textContent = profileData.title;
  profileText.appendChild(title);
  
  const description = document.createElement('p');
  description.textContent = profileData.description;
  profileText.appendChild(description);
}

// 경력 정보 생성 함수
function createCareerInfo() {
  const careerContainer = document.querySelector('.career-info');
  if (!careerContainer) return;
  
  const careerData = [
    {
      year: '2020 - 현재',
      title: '노력맨 버블쇼 대표',
      description: '다양한 행사와 이벤트에서 버블쇼 공연 진행'
    },
    {
      year: '2018 - 2020',
      title: '버블 아카데미 강사',
      description: '어린이 및 성인 대상 버블 아트 교육 프로그램 운영'
    },
    {
      year: '2015 - 2018',
      title: '프리랜서 버블 아티스트',
      description: '다양한 공연 및 행사 참여'
    }
  ];
  
  // 경력 아이템 생성
  careerData.forEach(career => {
    const careerItem = document.createElement('div');
    careerItem.className = 'career-item';
    careerContainer.appendChild(careerItem);
    
    const year = document.createElement('div');
    year.className = 'career-year';
    year.textContent = career.year;
    careerItem.appendChild(year);
    
    const content = document.createElement('div');
    content.className = 'career-content';
    careerItem.appendChild(content);
    
    const title = document.createElement('h4');
    title.textContent = career.title;
    content.appendChild(title);
    
    const description = document.createElement('p');
    description.textContent = career.description;
    content.appendChild(description);
  });
}

// 자격증 정보 생성 함수
function createCertificateInfo() {
  const certificateContainer = document.querySelector('.certificate-info');
  if (!certificateContainer) return;
  
  const certificateData = [
    {
      title: '버블 아트 전문가 자격증',
      organization: '한국 버블아트 협회',
      year: '2019'
    },
    {
      title: '어린이 교육 지도사 자격증',
      organization: '한국 교육 협회',
      year: '2018'
    },
    {
      title: '공연 예술 지도사 자격증',
      organization: '문화예술교육진흥원',
      year: '2017'
    }
  ];
  
  // 자격증 아이템 생성
  certificateData.forEach(certificate => {
    const certificateItem = document.createElement('div');
    certificateItem.className = 'certificate-item';
    certificateContainer.appendChild(certificateItem);
    
    const title = document.createElement('h4');
    title.textContent = certificate.title;
    certificateItem.appendChild(title);
    
    const details = document.createElement('p');
    details.textContent = `${certificate.organization} (${certificate.year})`;
    certificateItem.appendChild(details);
  });
} 