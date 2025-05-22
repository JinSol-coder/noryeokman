document.addEventListener('DOMContentLoaded', function() {
  // 갤러리 이미지 로드
  loadGalleryImages();
  
  // 카테고리 필터 이벤트 리스너 설정
  setupCategoryFilter();
  
  // 이미지 삭제 이벤트 리스너 설정
  setupDeleteListeners();
});

// 갤러리 이미지 로드 함수
function loadGalleryImages(category = 'all') {
  const galleryContainer = document.querySelector('.admin-gallery');
  if (!galleryContainer) return;
  
  // 로딩 표시
  galleryContainer.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';
  
  // 서버에서 이미지 데이터 가져오기
  fetch(`/api/admin/gallery?category=${category}`)
    .then(response => response.json())
    .then(images => {
      // 갤러리 컨테이너 비우기
      galleryContainer.innerHTML = '';
      
      if (images.length === 0) {
        galleryContainer.innerHTML = '<div class="alert alert-info">이미지가 없습니다.</div>';
        return;
      }
      
      // 이미지 그리드 생성
      const imageGrid = document.createElement('div');
      imageGrid.className = 'gallery-grid';
      galleryContainer.appendChild(imageGrid);
      
      // 이미지 아이템 생성
      images.forEach(image => {
        const galleryItem = createGalleryItem(image);
        imageGrid.appendChild(galleryItem);
      });
    })
    .catch(error => {
      console.error('갤러리 이미지 로드 중 오류 발생:', error);
      galleryContainer.innerHTML = '<div class="alert alert-danger">이미지를 불러오는 중 오류가 발생했습니다.</div>';
    });
}

// 갤러리 아이템 생성 함수
function createGalleryItem(image) {
  // 갤러리 아이템 컨테이너
  const galleryItem = document.createElement('div');
  galleryItem.className = 'gallery-item';
  galleryItem.dataset.id = image._id;
  
  // 이미지 요소
  const img = document.createElement('img');
  img.src = image.path;
  img.alt = image.original_filename;
  galleryItem.appendChild(img);
  
  // 이미지 정보
  const info = document.createElement('div');
  info.className = 'gallery-item-info';
  galleryItem.appendChild(info);
  
  const filename = document.createElement('p');
  filename.textContent = image.original_filename;
  info.appendChild(filename);
  
  const category = document.createElement('p');
  category.className = 'category-badge';
  category.textContent = image.category || '미분류';
  info.appendChild(category);
  
  const date = document.createElement('p');
  date.className = 'upload-date';
  date.textContent = formatDate(image.uploaded_at);
  info.appendChild(date);
  
  // 액션 버튼
  const actions = document.createElement('div');
  actions.className = 'gallery-item-actions';
  galleryItem.appendChild(actions);
  
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-danger btn-sm delete-image';
  deleteBtn.dataset.id = image._id;
  deleteBtn.innerHTML = '<i class="bi bi-trash"></i> 삭제';
  actions.appendChild(deleteBtn);
  
  return galleryItem;
}

// 카테고리 필터 설정 함수
function setupCategoryFilter() {
  const categoryFilter = document.querySelector('#categoryFilter');
  if (!categoryFilter) return;
  
  categoryFilter.addEventListener('change', function() {
    loadGalleryImages(this.value);
  });
}

// 이미지 삭제 이벤트 리스너 설정 함수
function setupDeleteListeners() {
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-image') || e.target.closest('.delete-image')) {
      const button = e.target.classList.contains('delete-image') ? e.target : e.target.closest('.delete-image');
      const imageId = button.dataset.id;
      
      if (confirm('이 이미지를 삭제하시겠습니까?')) {
        deleteImage(imageId);
      }
    }
  });
}

// 이미지 삭제 함수
function deleteImage(imageId) {
  fetch(`/api/admin/delete-image/${imageId}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // 성공적으로 삭제된 경우 UI에서 이미지 제거
        const galleryItem = document.querySelector(`.gallery-item[data-id="${imageId}"]`);
        if (galleryItem) {
          galleryItem.remove();
        }
        
        // 알림 표시
        showAlert('success', '이미지가 성공적으로 삭제되었습니다.');
        
        // 갤러리가 비었는지 확인
        const galleryGrid = document.querySelector('.gallery-grid');
        if (galleryGrid && galleryGrid.children.length === 0) {
          const galleryContainer = document.querySelector('.admin-gallery');
          galleryContainer.innerHTML = '<div class="alert alert-info">이미지가 없습니다.</div>';
        }
      } else {
        showAlert('danger', '이미지 삭제 중 오류가 발생했습니다: ' + data.message);
      }
    })
    .catch(error => {
      console.error('이미지 삭제 중 오류 발생:', error);
      showAlert('danger', '이미지 삭제 중 오류가 발생했습니다.');
    });
}

// 날짜 포맷팅 함수
function formatDate(timestamp) {
  const date = new Date(timestamp);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
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
    else alertContainer.remove();
  }, 3000);
} 