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

  // --- DEVELOPER CONSOLE: тройной ~ и привилегии ---
  const consoleEl = document.getElementById('dev-console');
  const consoleOutput = document.getElementById('console-output');
  const consoleInput = document.getElementById('console-input');
  const consoleClose = document.getElementById('console-close');

  let tildeCount = 0;
  let lastTildeTime = 0;
  let isAdmin = false; // Флаг доступа

  // Вспомогательная функция для вывода
  function log(text) {
    const line = document.createElement('div');
    line.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
    consoleOutput.appendChild(line);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  }

  // Список команд (остаётся прежним, но недоступен без доступа)
  const commands = {
    help: () => log('Доступные команды: help, clear, info, konami, cls'),
    clear: () => {
      consoleOutput.innerHTML = '';
      log('Консоль очищена.');
    },
    info: () => log('CriticalSave Studio — команда из 3 разработчиков. Используем UE5, Git, JS, C++.'),
    konami: () => {
      log('Запуск Konami Code...');
      activateKonamiMode();
    },
    echo: (args) => log(args.join(' ')),
    cls: () => commands.clear(),
    debug: () => {
      const debugEl = document.getElementById('debug-info');
      if (debugEl) {
        document.body.removeChild(debugEl);
        if (window.fpsLoop) cancelAnimationFrame(window.fpsLoop);
        if (window.networkTracker) clearInterval(window.networkTracker);
        if (window.pingTracker) clearInterval(window.pingTracker);
        if (window.mouseTracker) window.removeEventListener('mousemove', window.mouseTracker);
        log('🔧 Режим отладки: ВЫКЛ');
      } else {
        const el = document.createElement('div');
        el.id = 'debug-info';
        el.style.cssText = `
          position: fixed; top: 10px; left: 10px;
          background: rgba(0, 0, 0, 0.7);
          color: #0f0; font-family: monospace;
          padding: 8px; font-size: 12px; z-index: 9998;
          border: 1px solid #0f0; border-radius: 4px;
          user-select: none;
          white-space: nowrap;
          min-width: 220px;
        `;

        el.innerHTML = `
          DEBUG: ON<br>
          FPS: ?<br>
          Network: ?<br>
          Ping: ?<br>
          Size: ? × ?<br>
          Mouse: 0, 0<br>
          Browser: ?
        `;
        document.body.appendChild(el);

        // === ОПРЕДЕЛЕНИЕ БРАУЗЕРА С ВЕРСИЕЙ ===
        const getBrowser = () => {
          const ua = navigator.userAgent;

          let name = 'Unknown';
          let version = '?';

          if (ua.includes('YaBrowser')) {
            name = 'Yandex';
            const match = ua.match(/YaBrowser\/([\d.]+)/);
            if (match) version = match[1];
          } else if (ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR') && !ua.includes('YaBrowser')) {
            name = 'Chrome';
            const match = ua.match(/Chrome\/([\d.]+)/);
            if (match) version = match[1];
          } else if (ua.includes('Firefox')) {
            name = 'Firefox';
            const match = ua.match(/Firefox\/([\d.]+)/);
            if (match) version = match[1];
          } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
            name = 'Safari';
            const match = ua.match(/Version\/([\d.]+)/);
            if (match) version = match[1];
          } else if (ua.includes('Edg')) {
            name = 'Edge';
            const match = ua.match(/Edg\/([\d.]+)/);
            if (match) version = match[1];
          } else if (ua.includes('Opera') || ua.includes('OPR')) {
            name = 'Opera';
            const match = ua.match(/(Opera|OPR)\/([\d.]+)/);
            if (match) version = match[2];
          }

          return `${name} ${version}`;
        };

        // === ПИНГ ДО СЕРВЕРА (улучшенная версия) ===
        const measurePing = () => {
          return new Promise((resolve) => {
            const img = new Image();
            const start = performance.now();
            const url = `https://github.com/favicon.ico?t=${Date.now()}`;

            img.onload = () => {
              const end = performance.now();
              resolve(`${Math.round(end - start)}ms`);
            };

            img.onerror = () => {
              // Fallback: используем httpbin (CORS-friendly)
              fetch(`https://httpbin.org/uuid?t=${Date.now()}`, { method: 'HEAD', mode: 'cors' })
                .then(() => {
                  const end = performance.now();
                  resolve(`${Math.round(end - start)}ms`);
                })
                .catch(() => resolve('ERR'));
            };

            img.src = url;
          });
        };



        // === РЕАЛЬНЫЙ FPS ЧЕРЕЗ requestAnimationFrame ===
        let frameCount = 0;
        let fps = 0;
        let lastTime = performance.now();

        const updateFPS = (time) => {
          frameCount++;
          if (time - lastTime >= 1000) {
            fps = Math.round((frameCount * 1000) / (time - lastTime));
            frameCount = 0;
            lastTime = time;
            updateDisplay();
          }
          window.fpsLoop = requestAnimationFrame(updateFPS);
        };

        // === СТАТУС СЕТИ ===
        const updateNetwork = () => {
          const { effectiveType, downlink, rtt } = navigator.connection || {};
          return effectiveType
            ? `${effectiveType} (${downlink} Mbps)`
            : 'Online (no info)';
        };

        // === ОТСЛЕЖИВАНИЕ МЫШИ ===
        let mouseX = 0, mouseY = 0;
        window.mouseTracker = (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
        };
        window.addEventListener('mousemove', window.mouseTracker);

        // === ПИНГ — обновляется раз в 2 сек ===
        let pingTime = '?';
        const updatePing = async () => {
          pingTime = await measurePing();
          updateDisplay();
        };
        updatePing(); // первый замер
        window.pingTracker = setInterval(updatePing, 2000); // каждые 2 сек

        // === ОБНОВЛЕНИЕ ОТЛАДКИ ===
        const updateDisplay = () => {
          const lines = [
            'DEBUG: ON',
            `FPS: ${fps || '?'}`,
            `Network: ${updateNetwork()}`,
            `Ping: <span id="ping-value">${pingTime}</span>`,
            `Size: ${window.innerWidth} × ${window.innerHeight}`,
            `Mouse: ${mouseX}, ${mouseY}`,
            `Browser: ${getBrowser()}`
          ];
          el.innerHTML = lines.join('<br>');
          
          // === УСТАНОВКА ЦВЕТА ПИНГА ===
          const pingSpan = document.getElementById('ping-value');
          if (pingSpan && pingTime && pingTime !== '?' && !pingTime.includes('ERR')) {
            const pingMs = parseInt(pingTime);
            if (pingMs < 50) {
              pingSpan.style.color = '#0f0';
              pingSpan.style.textShadow = '0 0 5px #0f0';
            } else if (pingMs < 150) {
              pingSpan.style.color = '#ff0';
              pingSpan.style.textShadow = '0 0 5px #ff0';
            } else {
              pingSpan.style.color = '#f00';
              pingSpan.style.textShadow = '0 0 5px #f00';
            }
          } else if (pingSpan) {
            pingSpan.style.color = '#888';
            pingSpan.style.textShadow = 'none';
          }
        };


        // Запускаем FPS-петлю
        window.fpsLoop = requestAnimationFrame(updateFPS);

        // Обновляем сеть и размер раз в 400мс
        window.networkTracker = setInterval(updateDisplay, 400);

        log('🔧 Режим отладки: ВКЛ');
      }
    },
    github: () => {
      log('🐙 Открываю GitHub студии...');
      window.open('https://github.com/MorzhPetya/CriticalSaveStudio', '_blank');
    },
    'admin level access': () => {
      // Элемент для анимации взлома
      let overlay = document.getElementById('hack-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'hack-overlay';
        overlay.innerHTML = '<div id="hack-content"></div>';
        document.body.appendChild(overlay);
      }

      const content = document.getElementById('hack-content');

      // Сообщения анимации взлома
      const messages = [
        'INITIATING SECURITY OVERRIDE...',
        'BYPASSING AUTH LAYERS...',
        'DECRYPTING ADMIN PRIVILEGES...',
        'ACCESS LEVEL: [███████] 98%...',
        'FINAL CHECK: USER TRUSTWORTHY?',
        'TRUST VERIFIED. WELCOME, DEVELOPER.',
      ];

      overlay.classList.add('active');
      content.textContent = '';

      let i = 0;
      let line = 0;

      const glitchInterval = setInterval(() => {
        if (line < messages.length) {
          const msg = messages[line];
          if (i < msg.length) {
            content.textContent += msg[i];
            i++;
          } else {
            content.textContent += '\n';
            line++;
            i = 0;
          }
        } else {
          clearInterval(glitchInterval);
          setTimeout(() => {
            overlay.classList.remove('active');
            isAdmin = true;
            log('🎉 Доступ администратора получен. Система разблокирована.');
          }, 800);
        }
      }, Math.random() * 20 + 10);
    }


  };

  // Обработка нажатий тильды
  document.addEventListener('keydown', (e) => {
    if (e.key === '`' || e.key === 'ё') {
      const now = Date.now();
      if (now - lastTildeTime > 500) {
        tildeCount = 0;
      }
      tildeCount++;
      lastTildeTime = now;

      if (tildeCount >= 3) {
        e.preventDefault();
        consoleEl.classList.add('active');
        consoleInput.focus();
        tildeCount = 0;
      }
    }

    // Закрытие по Escape
    if (e.key === 'Escape' && consoleEl.classList.contains('active')) {
      consoleEl.classList.remove('active');
      e.preventDefault();
    }
  });

  // Обработка ввода команд
  consoleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const input = consoleInput.value.trim();
      if (!input) return;

      log(`> ${input}`);

      // Проверяем, введена ли команда для доступа
      if (input.toLowerCase() === 'admin level access') {
        commands['admin level access']();
        consoleInput.value = '';
        return;
      }

      // Если доступ не получен — блокируем всё
      if (!isAdmin) {
        log('❌ Доступ запрещён. Только разработчикам доступна консоль.');
        consoleInput.value = '';
        return;
      }

      // Если доступ есть — выполняем любую команду
      const [cmd, ...args] = input.split(' ');

      if (commands[cmd]) {
        commands[cmd](args);
      } else {
        log(`Неизвестная команда: ${cmd}. Введите 'help' для справки.`);
      }

      consoleInput.value = '';
    }

    
  });

  // Закрытие консоли кнопкой
  consoleClose.addEventListener('click', () => {
    consoleEl.classList.remove('active');
  });



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

// === ОТПРАВКА ФОРМЫ ЧЕРЕЗ EMAILJS ===
(function () {
  // ⚙️ Настройки EmailJS — ЗАМЕНИ НА СВОИ!
  const USER_ID = 'tEQZSiSyUMDqYM35O';           // ← Вставь сюда свой Public Key
  const SERVICE_ID = 'service_9u8ktq5';        // ← service_xxxxx
  const TEMPLATE_ID = 'template_2qg9yjn';      // ← template_xxxxx

  // Инициализация EmailJS
  emailjs.init(USER_ID);

  // Элементы формы
  const modal = document.getElementById('contact-modal');
  const openBtn = document.getElementById('open-contact-btn');
  const closeBtn = document.getElementById('close-modal');
  const form = document.getElementById('contact-form');
  const submitBtn = form.querySelector('button[type="submit"]');

  // === Открытие модалки ===
  openBtn.addEventListener('click', () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // === Закрытие по крестику ===
  closeBtn.addEventListener('click', () => {
    modal.classList.add('closing');
    setTimeout(() => {
      modal.classList.remove('active', 'closing');
      document.body.style.overflow = '';
    }, 300);
  });

  // === Закрытие по клику вне формы ===
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // === Отправка формы ===
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Блокировка кнопки
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      to_email: 'criticalsavestudio@gmail.com', // ← Почта, на которую придут сообщения
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, data)
      .then(() => {
        alert('✅ Ваше сообщение отправлено! Мы ответим в ближайшее время. (~3 суток)');
        form.reset();
        modal.classList.remove('active');
      })
      .catch((error) => {
        console.error('Ошибка EmailJS:', error);
        alert('❌ Не удалось отправить сообщение. Попробуйте позже.');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить';
      });
  });
})();



