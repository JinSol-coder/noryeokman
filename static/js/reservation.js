document.addEventListener('DOMContentLoaded', function() {
  // 예약 정보 섹션 생성
  createReservationInfo();
  
  // 예약 폼 생성
  createReservationForm();
  
  // 예약 폼 이벤트 리스너 설정
  setupFormListeners();
});

// 예약 정보 섹션 생성 함수
function createReservationInfo() {
  const infoContainer = document.querySelector('.reservation-info');
  if (!infoContainer) return;
  
  const infoData = [
    {
      icon: 'bi-calendar-check',
      title: '예약 가능 시간',
      description: '평일: 오전 10시 ~ 오후 8시<br>주말: 오전 10시 ~ 오후 6시'
    },
    {
      icon: 'bi-geo-alt',
      title: '공연 가능 지역',
      description: '대전 및 충청 지역 (타 지역은 별도 문의)'
    },
    {
      icon: 'bi-people',
      title: '인원 제한',
      description: '최소 20명 이상 권장<br>최대 인원 제한 없음'
    },
    {
      icon: 'bi-cash-coin',
      title: '비용 안내',
      description: '기본 공연 (30분): 30만원부터<br>추가 시간 및 특별 요청은 별도 협의'
    }
  ];
  
  // 정보 아이템 생성
  infoData.forEach(info => {
    const infoItem = document.createElement('div');
    infoItem.className = 'info-item';
    infoContainer.appendChild(infoItem);
    
    const icon = document.createElement('i');
    icon.className = `bi ${info.icon}`;
    infoItem.appendChild(icon);
    
    const title = document.createElement('h4');
    title.textContent = info.title;
    infoItem.appendChild(title);
    
    const description = document.createElement('p');
    description.innerHTML = info.description;
    infoItem.appendChild(description);
  });
}

// 예약 폼 생성 함수
function createReservationForm() {
  const formContainer = document.querySelector('.reservation-form');
  if (!formContainer) return;
  
  // 폼 생성
  const form = document.createElement('form');
  form.id = 'reservationForm';
  form.method = 'POST';
  form.action = '/submit-reservation';
  formContainer.appendChild(form);
  
  // 이름 필드
  const nameGroup = document.createElement('div');
  nameGroup.className = 'mb-3';
  form.appendChild(nameGroup);
  
  const nameLabel = document.createElement('label');
  nameLabel.htmlFor = 'name';
  nameLabel.className = 'form-label';
  nameLabel.textContent = '이름';
  nameGroup.appendChild(nameLabel);
  
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.className = 'form-control';
  nameInput.id = 'name';
  nameInput.name = 'name';
  nameInput.required = true;
  nameGroup.appendChild(nameInput);
  
  // 연락처 필드
  const phoneGroup = document.createElement('div');
  phoneGroup.className = 'mb-3';
  form.appendChild(phoneGroup);
  
  const phoneLabel = document.createElement('label');
  phoneLabel.htmlFor = 'phone';
  phoneLabel.className = 'form-label';
  phoneLabel.textContent = '연락처';
  phoneGroup.appendChild(phoneLabel);
  
  const phoneInput = document.createElement('input');
  phoneInput.type = 'tel';
  phoneInput.className = 'form-control';
  phoneInput.id = 'phone';
  phoneInput.name = 'phone';
  phoneInput.placeholder = '010-0000-0000';
  phoneInput.required = true;
  phoneGroup.appendChild(phoneInput);
  
  // 이메일 필드
  const emailGroup = document.createElement('div');
  emailGroup.className = 'mb-3';
  form.appendChild(emailGroup);
  
  const emailLabel = document.createElement('label');
  emailLabel.htmlFor = 'email';
  emailLabel.className = 'form-label';
  emailLabel.textContent = '이메일';
  emailGroup.appendChild(emailLabel);
  
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.className = 'form-control';
  emailInput.id = 'email';
  emailInput.name = 'email';
  emailInput.required = true;
  emailGroup.appendChild(emailInput);
  
  // 날짜 필드
  const dateGroup = document.createElement('div');
  dateGroup.className = 'mb-3';
  form.appendChild(dateGroup);
  
  const dateLabel = document.createElement('label');
  dateLabel.htmlFor = 'date';
  dateLabel.className = 'form-label';
  dateLabel.textContent = '희망 날짜';
  dateGroup.appendChild(dateLabel);
  
  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.className = 'form-control';
  dateInput.id = 'date';
  dateInput.name = 'date';
  dateInput.required = true;
  dateGroup.appendChild(dateInput);
  
  // 시간 필드
  const timeGroup = document.createElement('div');
  timeGroup.className = 'mb-3';
  form.appendChild(timeGroup);
  
  const timeLabel = document.createElement('label');
  timeLabel.htmlFor = 'time';
  timeLabel.className = 'form-label';
  timeLabel.textContent = '희망 시간';
  timeGroup.appendChild(timeLabel);
  
  const timeInput = document.createElement('input');
  timeInput.type = 'time';
  timeInput.className = 'form-control';
  timeInput.id = 'time';
  timeInput.name = 'time';
  timeInput.required = true;
  timeGroup.appendChild(timeInput);
  
  // 장소 필드
  const locationGroup = document.createElement('div');
  locationGroup.className = 'mb-3';
  form.appendChild(locationGroup);
  
  const locationLabel = document.createElement('label');
  locationLabel.htmlFor = 'location';
  locationLabel.className = 'form-label';
  locationLabel.textContent = '공연 장소';
  locationGroup.appendChild(locationLabel);
  
  const locationInput = document.createElement('input');
  locationInput.type = 'text';
  locationInput.className = 'form-control';
  locationInput.id = 'location';
  locationInput.name = 'location';
  locationInput.required = true;
  locationGroup.appendChild(locationInput);
  
  // 인원 필드
  const attendeesGroup = document.createElement('div');
  attendeesGroup.className = 'mb-3';
  form.appendChild(attendeesGroup);
  
  const attendeesLabel = document.createElement('label');
  attendeesLabel.htmlFor = 'attendees';
  attendeesLabel.className = 'form-label';
  attendeesLabel.textContent = '예상 인원';
  attendeesGroup.appendChild(attendeesLabel);
  
  const attendeesInput = document.createElement('input');
  attendeesInput.type = 'number';
  attendeesInput.className = 'form-control';
  attendeesInput.id = 'attendees';
  attendeesInput.name = 'attendees';
  attendeesInput.min = '1';
  attendeesInput.required = true;
  attendeesGroup.appendChild(attendeesInput);
  
  // 요청사항 필드
  const messageGroup = document.createElement('div');
  messageGroup.className = 'mb-3';
  form.appendChild(messageGroup);
  
  const messageLabel = document.createElement('label');
  messageLabel.htmlFor = 'message';
  messageLabel.className = 'form-label';
  messageLabel.textContent = '요청사항';
  messageGroup.appendChild(messageLabel);
  
  const messageTextarea = document.createElement('textarea');
  messageTextarea.className = 'form-control';
  messageTextarea.id = 'message';
  messageTextarea.name = 'message';
  messageTextarea.rows = '5';
  messageGroup.appendChild(messageTextarea);
  
  // 제출 버튼
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'btn btn-primary';
  submitButton.textContent = '예약 문의하기';
  form.appendChild(submitButton);
}

// 폼 이벤트 리스너 설정 함수
function setupFormListeners() {
  const form = document.getElementById('reservationForm');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const reservationData = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      date: formData.get('date'),
      time: formData.get('time'),
      location: formData.get('location'),
      attendees: formData.get('attendees'),
      message: formData.get('message')
    };
    
    // 폼 데이터 검증
    if (!validateForm(reservationData)) {
      return;
    }
    
    // 서버로 데이터 전송
    fetch('/submit-reservation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reservationData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showAlert('success', '예약 문의가 성공적으로 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.');
        form.reset();
      } else {
        showAlert('danger', '예약 문의 접수 중 오류가 발생했습니다: ' + data.message);
      }
    })
    .catch(error => {
      console.error('예약 문의 접수 중 오류 발생:', error);
      showAlert('danger', '예약 문의 접수 중 오류가 발생했습니다.');
    });
  });
}

// 폼 데이터 검증 함수
function validateForm(data) {
  // 이름 검증
  if (data.name.length < 2) {
    showAlert('warning', '이름을 올바르게 입력해주세요.');
    return false;
  }
  
  // 전화번호 검증
  const phoneRegex = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/;
  if (!phoneRegex.test(data.phone)) {
    showAlert('warning', '전화번호를 올바른 형식(예: 010-0000-0000)으로 입력해주세요.');
    return false;
  }
  
  // 이메일 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showAlert('warning', '올바른 이메일 주소를 입력해주세요.');
    return false;
  }
  
  // 날짜 검증
  const today = new Date();
  const selectedDate = new Date(data.date);
  if (selectedDate < today) {
    showAlert('warning', '오늘 이후의 날짜를 선택해주세요.');
    return false;
  }
  
  // 인원 검증
  if (parseInt(data.attendees) < 1) {
    showAlert('warning', '인원 수는 1명 이상이어야 합니다.');
    return false;
  }
  
  return true;
}

// 알림 표시 함수
function showAlert(type, message) {
  const alertContainer = document.createElement('div');
  alertContainer.className = `alert alert-${type} alert-dismissible fade show`;
  alertContainer.setAttribute('role', 'alert');
  alertContainer.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  // 페이지 상단에 알림 추가
  const container = document.querySelector('.container');
  container.insertBefore(alertContainer, container.firstChild);
  
  // 5초 후 자동으로 알림 닫기
  setTimeout(() => {
    const alert = bootstrap.Alert.getInstance(alertContainer);
    if (alert) alert.close();
    else alertContainer.remove();
  }, 5000);
} 