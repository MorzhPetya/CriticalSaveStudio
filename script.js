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
});
// Разная задержка анимации для карточек
document.querySelectorAll('.card').forEach(card => {
  const delay = Math.random() * 3;
  card.style.animationDelay = `${delay}s`;
});
