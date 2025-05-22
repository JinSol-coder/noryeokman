document.addEventListener('DOMContentLoaded', function() {
  // 갤러리 이미지 동적 로드
  loadGalleryImages();
  
  // 비디오 동적 로드
  loadVideos();
  
  // 관리자 버튼 이벤트 리스너 설정
  setupAdminButtons();
});

// 갤러리 이미지 로드 함수
function loadGalleryImages() {
  const galleryContainer = document.querySelector('.gallery');
  if (!galleryContainer) return;
  
  // 서버에서 이미지 데이터 가져오기
  fetch('/api/performance-images')
    .then(response => response.json())
    .then(images => {
      if (images.length === 0) {
        // 이미지가 없을 경우 기본 이미지 표시
        const placeholderItem = createGalleryItem({
          path: '/static/images/placeholder.png',
          original_filename: '버블쇼 공연 사진'
        });
        galleryContainer.appendChild(placeholderItem);
      } else {
        // 이미지가 있을 경우 각 이미지 표시
        images.forEach((image, index) => {
          const galleryItem = createGalleryItem(image, index);
          galleryContainer.appendChild(galleryItem);
        });
      }
    })
    .catch(error => {
      console.error('갤러리 이미지 로드 중 오류 발생:', error);
      galleryContainer.innerHTML = '<div class="alert alert-danger">이미지를 불러오는 중 오류가 발생했습니다.</div>';
    });
}

// 갤러리 아이템 생성 함수
function createGalleryItem(image, index) {
  const isLoggedIn = document.body.dataset.loggedIn === 'true';
  
  // 갤러리 아이템 컨테이너
  const galleryItem = document.createElement('div');
  galleryItem.className = 'gallery-item';
  
  // 이미지 요소
  const img = document.createElement('img');
  img.src = image.path;
  img.alt = image.original_filename;
  img.dataset.bsToggle = 'modal';
  img.dataset.bsTarget = `#imageModal${index || 0}`;
  galleryItem.appendChild(img);
  
  // 모달 생성
  if (image._id) {
    const modal = createImageModal(image, index, isLoggedIn);
    galleryItem.appendChild(modal);
  }
  
  return galleryItem;
}

// 이미지 모달 생성 함수
function createImageModal(image, index, isLoggedIn) {
  // 모달 컨테이너
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = `imageModal${index}`;
  modal.tabIndex = '-1';
  modal.setAttribute('aria-hidden', 'true');
  
  // 모달 다이얼로그
  const modalDialog = document.createElement('div');
  modalDialog.className = 'modal-dialog modal-xl';
  modal.appendChild(modalDialog);
  
  // 모달 콘텐츠
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalDialog.appendChild(modalContent);
  
  // 모달 헤더
  const modalHeader = document.createElement('div');
  modalHeader.className = 'modal-header';
  modalContent.appendChild(modalHeader);
  
  // 모달 제목
  const modalTitle = document.createElement('h5');
  modalTitle.className = 'modal-title';
  modalTitle.textContent = image.original_filename;
  modalHeader.appendChild(modalTitle);
  
  // 닫기 버튼
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'btn-close';
  closeButton.dataset.bsDismiss = 'modal';
  closeButton.setAttribute('aria-label', 'Close');
  modalHeader.appendChild(closeButton);
  
  // 모달 바디
  const modalBody = document.createElement('div');
  modalBody.className = 'modal-body text-center';
  modalContent.appendChild(modalBody);
  
  // 모달 이미지
  const modalImg = document.createElement('img');
  modalImg.src = image.path;
  modalImg.alt = image.original_filename;
  modalImg.className = 'img-fluid';
  modalBody.appendChild(modalImg);
  
  // 모달 푸터
  const modalFooter = document.createElement('div');
  modalFooter.className = 'modal-footer';
  modalContent.appendChild(modalFooter);
  
  // 관리자일 경우 삭제 버튼 추가
  if (isLoggedIn) {
    const deleteButton = document.createElement('a');
    deleteButton.href = `/delete-performance-image/${image._id}`;
    deleteButton.className = 'btn btn-danger';
    deleteButton.textContent = '삭제';
    deleteButton.onclick = function(e) {
      if (!confirm('정말 삭제하시겠습니까?')) {
        e.preventDefault();
      }
    };
    modalFooter.appendChild(deleteButton);
  }
  
  // 닫기 버튼
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'btn btn-secondary';
  closeBtn.dataset.bsDismiss = 'modal';
  closeBtn.textContent = '닫기';
  modalFooter.appendChild(closeBtn);
  
  return modal;
}

// 비디오 로드 함수
function loadVideos() {
  const videosContainer = document.querySelector('.videos');
  if (!videosContainer) return;
  
  // 서버에서 비디오 데이터 가져오기
  fetch('/api/performance-videos')
    .then(response => response.json())
    .then(videos => {
      if (videos.length === 0) {
        // 비디오가 없을 경우 안내 메시지 표시
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-info';
        alertDiv.textContent = '아직 등록된 공연 영상이 없습니다. 관리자 계정으로 로그인하여 영상을 추가해보세요.';
        videosContainer.appendChild(alertDiv);
      } else {
        // 비디오가 있을 경우 각 비디오 표시
        videos.forEach(video => {
          const videoItem = createVideoItem(video);
          videosContainer.appendChild(videoItem);
        });
      }
    })
    .catch(error => {
      console.error('비디오 로드 중 오류 발생:', error);
      videosContainer.innerHTML = '<div class="alert alert-danger">영상을 불러오는 중 오류가 발생했습니다.</div>';
    });
}

// 비디오 아이템 생성 함수
function createVideoItem(video) {
  const isLoggedIn = document.body.dataset.loggedIn === 'true';
  
  // 비디오 아이템 컨테이너
  const videoItem = document.createElement('div');
  videoItem.className = 'video-item mb-4';
  
  // 비디오 헤더 (제목 + 관리 버튼)
  const videoHeader = document.createElement('div');
  videoHeader.className = 'd-flex justify-content-between align-items-center mb-2';
  videoItem.appendChild(videoHeader);
  
  // 비디오 제목
  const videoTitle = document.createElement('h4');
  videoTitle.textContent = video.title;
  videoHeader.appendChild(videoTitle);
  
  // 관리자일 경우 수정/삭제 버튼 추가
  if (isLoggedIn) {
    const buttonGroup = document.createElement('div');
    
    // 수정 버튼
    const editButton = document.createElement('button');
    editButton.className = 'btn btn-sm btn-primary me-2';
    editButton.dataset.bsToggle = 'modal';
    editButton.dataset.bsTarget = `#editVideoModal${video._id}`;
    editButton.innerHTML = '<i class="bi bi-pencil"></i> 수정';
    buttonGroup.appendChild(editButton);
    
    // 삭제 버튼
    const deleteButton = document.createElement('a');
    deleteButton.href = `/delete-performance-video/${video._id}`;
    deleteButton.className = 'btn btn-sm btn-danger';
    deleteButton.innerHTML = '<i class="bi bi-trash"></i> 삭제';
    deleteButton.onclick = function(e) {
      if (!confirm('정말 삭제하시겠습니까?')) {
        e.preventDefault();
      }
    };
    buttonGroup.appendChild(deleteButton);
    
    videoHeader.appendChild(buttonGroup);
    
    // 수정 모달 생성
    const editModal = createVideoEditModal(video);
    videoItem.appendChild(editModal);
  }
  
  // 비디오 컨테이너
  const videoContainer = document.createElement('div');
  videoContainer.className = 'video-container';
  videoItem.appendChild(videoContainer);
  
  // 비디오 iframe
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${video.youtube_id}`;
  iframe.frameBorder = '0';
  iframe.allowFullscreen = true;
  videoContainer.appendChild(iframe);
  
  return videoItem;
}

// 비디오 수정 모달 생성 함수
function createVideoEditModal(video) {
  // 모달 컨테이너
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = `editVideoModal${video._id}`;
  modal.tabIndex = '-1';
  modal.setAttribute('aria-hidden', 'true');
  
  // 모달 다이얼로그
  const modalDialog = document.createElement('div');
  modalDialog.className = 'modal-dialog';
  modal.appendChild(modalDialog);
  
  // 모달 콘텐츠
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalDialog.appendChild(modalContent);
  
  // 모달 헤더
  const modalHeader = document.createElement('div');
  modalHeader.className = 'modal-header';
  modalContent.appendChild(modalHeader);
  
  // 모달 제목
  const modalTitle = document.createElement('h5');
  modalTitle.className = 'modal-title';
  modalTitle.textContent = '영상 수정';
  modalHeader.appendChild(modalTitle);
  
  // 닫기 버튼
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'btn-close';
  closeButton.dataset.bsDismiss = 'modal';
  closeButton.setAttribute('aria-label', 'Close');
  modalHeader.appendChild(closeButton);
  
  // 모달 바디
  const modalBody = document.createElement('div');
  modalBody.className = 'modal-body';
  modalContent.appendChild(modalBody);
  
  // 폼 생성
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = `/edit-performance-video/${video._id}`;
  modalBody.appendChild(form);
  
  // 제목 입력 필드
  const titleGroup = document.createElement('div');
  titleGroup.className = 'mb-3';
  form.appendChild(titleGroup);
  
  const titleLabel = document.createElement('label');
  titleLabel.htmlFor = `title${video._id}`;
  titleLabel.className = 'form-label';
  titleLabel.textContent = '제목';
  titleGroup.appendChild(titleLabel);
  
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.className = 'form-control';
  titleInput.id = `title${video._id}`;
  titleInput.name = 'title';
  titleInput.value = video.title;
  titleInput.required = true;
  titleGroup.appendChild(titleInput);
  
  // 유튜브 ID 입력 필드
  const idGroup = document.createElement('div');
  idGroup.className = 'mb-3';
  form.appendChild(idGroup);
  
  const idLabel = document.createElement('label');
  idLabel.htmlFor = `youtube_id${video._id}`;
  idLabel.className = 'form-label';
  idLabel.textContent = '유튜브 ID 또는 URL';
  idGroup.appendChild(idLabel);
  
  const idInput = document.createElement('input');
  idInput.type = 'text';
  idInput.className = 'form-control';
  idInput.id = `youtube_id${video._id}`;
  idInput.name = 'youtube_id';
  idInput.value = video.youtube_id;
  idInput.required = true;
  idGroup.appendChild(idInput);
  
  const helpText = document.createElement('div');
  helpText.className = 'form-text';
  helpText.textContent = '예: https://www.youtube.com/watch?v=kZQoFpixBZM 또는 kZQoFpixBZM';
  idGroup.appendChild(helpText);
  
  // 제출 버튼
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'btn btn-primary';
  submitButton.textContent = '수정';
  form.appendChild(submitButton);
  
  return modal;
}

// 관리자 버튼 설정 함수
function setupAdminButtons() {
  const isLoggedIn = document.body.dataset.loggedIn === 'true';
  if (!isLoggedIn) return;
  
  // 이미지 업로드 버튼 이벤트 리스너
  const uploadForm = document.getElementById('uploadForm');
  if (uploadForm) {
    uploadForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      
      fetch('/upload-performance-image', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('이미지가 성공적으로 업로드되었습니다.');
          window.location.reload();
        } else {
          alert('이미지 업로드 중 오류가 발생했습니다: ' + data.message);
        }
      })
      .catch(error => {
        console.error('이미지 업로드 중 오류 발생:', error);
        alert('이미지 업로드 중 오류가 발생했습니다.');
      });
    });
  }
  
  // 비디오 추가 버튼 이벤트 리스너
  const addVideoForm = document.querySelector('form[action="/add-performance-video"]');
  if (addVideoForm) {
    addVideoForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const videoData = {
        title: formData.get('title'),
        youtube_id: formData.get('youtube_id')
      };
      
      fetch('/add-performance-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(videoData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // 성공 시 모달 닫기
          const modal = bootstrap.Modal.getInstance(document.getElementById('addVideoModal'));
          if (modal) modal.hide();
          
          // 새 비디오 추가
          fetch('/api/performance-videos')
            .then(response => response.json())
            .then(videos => {
              // 비디오 컨테이너 비우기
              const videosContainer = document.querySelector('.videos');
              videosContainer.innerHTML = '';
              
              // 비디오 다시 로드
              if (videos.length > 0) {
                videos.forEach((video, index) => {
                  const videoItem = createVideoItem(video);
                  videosContainer.appendChild(videoItem);
                });
              } else {
                videosContainer.innerHTML = '<div class="alert alert-info">아직 등록된 공연 영상이 없습니다. 관리자 계정으로 로그인하여 영상을 추가해보세요.</div>';
              }
            });
          
          // 알림 표시
          showAlert('success', '영상이 성공적으로 추가되었습니다.');
        } else {
          showAlert('danger', '영상 추가 중 오류가 발생했습니다: ' + data.message);
        }
      })
      .catch(error => {
        console.error('영상 추가 중 오류 발생:', error);
        showAlert('danger', '영상 추가 중 오류가 발생했습니다.');
      });
    });
  }
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
  
  // 3초 후 자동으로 알림 닫기
  setTimeout(() => {
    const alert = bootstrap.Alert.getInstance(alertContainer);
    if (alert) alert.close();
  }, 3000);
} 