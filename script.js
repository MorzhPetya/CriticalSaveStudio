// Анимация появления секций
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll('section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => {
    observer.observe(section);
  });

  // --- СНЕЖИНКИ ---
  const container = document.getElementById('particles');
  const count = 50;

  const symbols = ['▲', '△', '◆', '◇', '◈'];

  for (let i = 0; i < count; i++) {
    const triangle = document.createElement('div');
    triangle.classList.add('triangle');
    triangle.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    const size = Math.random() * 1.2 + 0.8;
    const xPos = Math.random() * 100;
    const delay = Math.random() * 10;
    const duration = Math.random() * 20 + 20;

    triangle.style.fontSize = `${size}em`;
    triangle.style.left = `${xPos}vw`;
    triangle.style.bottom = '-50px';
    triangle.style.opacity = Math.random() * 0.4 + 0.2;
    triangle.style.animationDuration = `${duration}s`;
    triangle.style.animationDelay = `${delay}s`;
    triangle.style.color = ['#00b3ff', '#bb86fc', '#00e0ff', '#33ccff'][Math.floor(Math.random() * 4)];

    container.appendChild(triangle);
  }


// --- KONAMI CODE: ↑↑↓↓←→←→BA ---
const konamiCode = [
'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'
];
let codePosition = 0;

document.addEventListener('keydown', (e) => {
// Сравниваем нажатую клавишу с текущим шагом
const key = e.key.toLowerCase();
const expected = konamiCode[codePosition].toLowerCase();

if (key === expected) {
    codePosition++;
    // Если введён весь код
    if (codePosition === konamiCode.length) {
    activateKonamiMode();
    codePosition = 0; // Сброс
    }
} else {
    codePosition = 0; // Сброс при ошибке
}
});

function activateKonamiMode() {
// 1. Визуальный эффект — мигание, пиксельный фильтр
document.body.style.transition = 'all 0.3s';
document.body.style.background = '#000';
document.body.style.filter = 'contrast(150%) brightness(120%)';
document.body.style.cursor = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 20 20\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'8\' fill=\'red\'/%3E%3C/svg%3E"), auto';

// 2. Меняем стиль текста
document.body.classList.add('konami-active');

// 3. Добавим стиль для Konami-режима
const style = document.createElement('style');
style.id = 'konami-style';
style.textContent = `
    * {
    font-family: 'Courier New', monospace !important;
    text-shadow: 1px 1px 0 #0f0, -1px -1px 0 #0f0 !important;
    }
    body::before {
    content: 'ACCESS GRANTED';
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 5em;
    font-weight: bold;
    color: #0f0;
    background: rgba(0,0,0,0.7);
    padding: 20px;
    border: 2px solid #0f0;
    z-index: 9999;
            text-shadow: 0 0 10px #0f0;
    animation: blink 1s step-end infinite;
    }
    @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
    }
    section {
    border-color: #0f0 !important;
    box-shadow: 0 0 15px #0f0 !important;
    background: #111 !important;
    color: #0f0 !important;
    }
    .logo {
    color: #0f0 !important;
    text-shadow: 0 0 10px #0f0 !important;
    }
    .btn {
    background: #0f0 !important;
    color: #000 !important;
    box-shadow: 0 0 10px #0f0 !important;
    }
    .card {
    border-color: #0f0 !important;
    box-shadow: 0 0 10px #0f0 !important;
    }
    .frozen-badge {
    color: #ff0 !important;
    text-shadow: 0 0 10px #ff0 !important;
    }
`;
document.head.appendChild(style);

// 4. Звук (если разрешён)
const sound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-complete-or-approved-mission-205.mp3');
sound.volume = 0.5;
sound.play().catch(() => {});

// 5. Через 5 секунд — выключаем
setTimeout(() => {
    document.body.style.cssText = '';
    document.head.removeChild(style);
    document.body.classList.remove('konami-active');
}, 5000);
}
});


// Разная задержка анимации для карточек
document.querySelectorAll('.card').forEach(card => {
  const delay = Math.random() * 3;
  card.style.animationDelay = `${delay}s`;
});

