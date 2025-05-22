document.addEventListener('DOMContentLoaded', function() {
  // 대시보드 통계 생성
  createDashboardStats();
  
  // 최근 활동 목록 생성
  createRecentActivities();
  
  // 빠른 액션 버튼 생성
  createQuickActions();
});

// 대시보드 통계 생성 함수
function createDashboardStats() {
  const statsContainer = document.querySelector('.dashboard-stats');
  if (!statsContainer) return;
  
  // 통계 데이터 가져오기
  fetch('/api/admin/stats')
    .then(response => response.json())
    .then(stats => {
      // 통계 아이템 생성
      const statsItems = [
        {
          title: '갤러리 이미지',
          value: stats.gallery_count || 0,
          icon: 'bi-images'
        },
        {
          title: '공연 영상',
          value: stats.videos_count || 0,
          icon: 'bi-film'
        },
        {
          title: '예약 문의',
          value: stats.reservations_count || 0,
          icon: 'bi-calendar-check'
        },
        {
          title: '방문자 수',
          value: stats.visitors_count || 0,
          icon: 'bi-people'
        }
      ];
      
      // 통계 아이템 생성
      statsItems.forEach(item => {
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';
        statsContainer.appendChild(statItem);
        
        const icon = document.createElement('i');
        icon.className = `bi ${item.icon}`;
        statItem.appendChild(icon);
        
        const content = document.createElement('div');
        content.className = 'stat-content';
        statItem.appendChild(content);
        
        const value = document.createElement('h3');
        value.textContent = item.value;
        content.appendChild(value);
        
        const title = document.createElement('p');
        title.textContent = item.title;
        content.appendChild(title);
      });
    })
    .catch(error => {
      console.error('통계 데이터 로드 중 오류 발생:', error);
      statsContainer.innerHTML = '<div class="alert alert-danger">통계 데이터를 불러오는 중 오류가 발생했습니다.</div>';
    });
}

// 최근 활동 목록 생성 함수
function createRecentActivities() {
  const activitiesContainer = document.querySelector('.recent-activities');
  if (!activitiesContainer) return;
  
  // 최근 활동 데이터 가져오기
  fetch('/api/admin/recent-activities')
    .then(response => response.json())
    .then(activities => {
      if (activities.length === 0) {
        activitiesContainer.innerHTML = '<div class="alert alert-info">최근 활동이 없습니다.</div>';
        return;
      }
      
      // 활동 목록 생성
      const activityList = document.createElement('ul');
      activityList.className = 'activity-list';
      activitiesContainer.appendChild(activityList);
      
      // 활동 아이템 생성
      activities.forEach(activity => {
        const activityItem = document.createElement('li');
        activityItem.className = 'activity-item';
        activityList.appendChild(activityItem);
        
        const icon = document.createElement('i');
        icon.className = `bi ${getActivityIcon(activity.type)}`;
        activityItem.appendChild(icon);
        
        const content = document.createElement('div');
        content.className = 'activity-content';
        activityItem.appendChild(content);
        
        const description = document.createElement('p');
        description.textContent = activity.description;
        content.appendChild(description);
        
        const time = document.createElement('small');
        time.textContent = formatDate(activity.timestamp);
        content.appendChild(time);
      });
    })
    .catch(error => {
      console.error('활동 데이터 로드 중 오류 발생:', error);
      activitiesContainer.innerHTML = '<div class="alert alert-danger">활동 데이터를 불러오는 중 오류가 발생했습니다.</div>';
    });
}

// 빠른 액션 버튼 생성 함수
function createQuickActions() {
  const actionsContainer = document.querySelector('.quick-actions');
  if (!actionsContainer) return;
  
  const actions = [
    {
      title: '이미지 업로드',
      icon: 'bi-upload',
      url: '/admin/upload'
    },
    {
      title: '갤러리 관리',
      icon: 'bi-images',
      url: '/admin/gallery'
    },
    {
      title: '영상 관리',
      icon: 'bi-film',
      url: '/admin/videos'
    },
    {
      title: '사이트로 돌아가기',
      icon: 'bi-house',
      url: '/'
    }
  ];
  
  // 액션 버튼 생성
  actions.forEach(action => {
    const actionButton = document.createElement('a');
    actionButton.href = action.url;
    actionButton.className = 'action-button';
    actionsContainer.appendChild(actionButton);
    
    const icon = document.createElement('i');
    icon.className = `bi ${action.icon}`;
    actionButton.appendChild(icon);
    
    const title = document.createElement('span');
    title.textContent = action.title;
    actionButton.appendChild(title);
  });
}

// 활동 유형에 따른 아이콘 반환 함수
function getActivityIcon(type) {
  switch (type) {
    case 'upload':
      return 'bi-upload';
    case 'delete':
      return 'bi-trash';
    case 'edit':
      return 'bi-pencil';
    case 'login':
      return 'bi-box-arrow-in-right';
    default:
      return 'bi-activity';
  }
}

// 날짜 포맷팅 함수
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) {
    return '방금 전';
  } else if (diffMin < 60) {
    return `${diffMin}분 전`;
  } else if (diffHour < 24) {
    return `${diffHour}시간 전`;
  } else if (diffDay < 7) {
    return `${diffDay}일 전`;
  } else {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  }
} 