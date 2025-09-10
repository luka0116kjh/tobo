document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const deadlineInput = document.getElementById('deadline-input');
  const categorySelect = document.getElementById('category-select');
  const addButton = document.getElementById('add-button');
  const scheduleList = document.getElementById('schedule-list');
  const themeToggle = document.getElementById('theme-toggle');

  let schedules = JSON.parse(localStorage.getItem('schedules')) || [];

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    themeToggle.textContent = document.body.classList.contains('light') ? '다크 모드 토글' : '라이트 모드 토글';
    localStorage.setItem('lightMode', document.body.classList.contains('light'));
  });

  if (localStorage.getItem('lightMode') === 'true') {
    document.body.classList.add('light');
    themeToggle.textContent = '다크 모드 토글';
  }

  function renderSchedules() {
    scheduleList.innerHTML = '';
    schedules.forEach((schedule, index) => {
      const item = document.createElement('div');
      item.classList.add('schedule-item');
      const deadlineFormatted = schedule.deadline ? new Date(schedule.deadline).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' }) : '없음';
      item.innerHTML = `
        <span>${schedule.task} (목표 시간: ${deadlineFormatted})</span>
        <span>${schedule.category}</span>
        <button onclick="deleteSchedule(${index})">취소</button>
      `;
      scheduleList.appendChild(item);
    });
  }

  addButton.addEventListener('click', () => {
    const task = taskInput.value.trim();
    const deadline = deadlineInput.value;
    const category = categorySelect.value;

    if (task) {
      schedules.push({ task, deadline, category });
      localStorage.setItem('schedules', JSON.stringify(schedules));
      renderSchedules();
      taskInput.value = '';
      deadlineInput.value = '';
    }
  });

  window.deleteSchedule = function(index) {
    schedules.splice(index, 1);
    localStorage.setItem('schedules', JSON.stringify(schedules));
    renderSchedules();
  };

  renderSchedules();
});