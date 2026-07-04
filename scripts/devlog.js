document.addEventListener('DOMContentLoaded', async () => {
    const adminSection = document.getElementById('devlog-admin-section');
    const postsContainer = document.getElementById('devlog-posts-container');
    const addForm = document.getElementById('add-devlog-form');

    let currentUserId = null;

    // 1. ПРОВЕРКА РОЛИ И ОТОБРАЖЕНИЕ АДМИН-ПАНЕЛИ
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (session) {
        currentUserId = session.user.id;

        // Делаем запрос к профилю, чтобы узнать роль
        const { data: profile } = await supabaseClient
            .from('profiles')
            .select('role')
            .eq('id', currentUserId)
            .single();

        if (profile && (profile.role === 'owner' || profile.role === 'co-owner')) {
            // Если вошел владелец, показываем форму публикации
            adminSection.style.display = 'block';
        }
    }

    // 2. ФУНКЦИЯ ЗАГРУЗКИ ПОСТОВ ИЗ БАЗЫ ДАННЫХ
    async function loadDevlogPosts() {
        // Запрашиваем посты из таблицы devlogs, а также подтягиваем имя автора из таблицы profiles
        const { data: posts, error } = await supabaseClient
            .from('devlogs')
            .select('*, profiles(username)')
            .order('created_at', { ascending: false }); // Сортировка: сначала новые

        if (error) {
            console.error('Ошибка при загрузке девлогов:', error);
            postsContainer.innerHTML = `<div class="error-text">Не удалось загрузить посты. Попробуйте обновить страницу.</div>`;
            return;
        }

        if (!posts || posts.length === 0) {
            postsContainer.innerHTML = `<div class="empty-text">Пока нет ни одной записи в блоге разработки.</div>`;
            return;
        }

        // Очищаем контейнер и выводим посты
        postsContainer.innerHTML = '';

        posts.forEach(post => {
            // Форматируем дату (превращаем в человеческий вид, например "22 июня 2026")
            const postDate = new Date(post.created_at).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            // Безопасно форматируем текст (переносы строк превращаем в абзацы <p>)
            const formattedContent = post.content
                .split('\n')
                .filter(paragraph => paragraph.trim() !== '')
                .map(paragraph => `<p>${paragraph}</p>`)
                .join('');

            // Имя автора берем из связанной таблицы profiles
            const authorName = post.profiles ? post.profiles.username : 'Разработчик';

            const card = document.createElement('article');
            card.className = 'devlog-card';
            card.innerHTML = `
                <div class="devlog-meta">
                    <span class="devlog-date">${postDate}</span>
                    <span class="devlog-tag">${post.tag}</span>
                    <span class="devlog-author" style="font-size: 0.85rem; color: var(--accent); font-weight: 600;">Автор: ${authorName}</span>
                </div>
                <h2 class="devlog-title">${post.title}</h2>
                <div class="devlog-text">
                    ${formattedContent}
                </div>
            `;
            postsContainer.appendChild(card);
        });
    }

    // Сразу запускаем загрузку постов при входе на страницу
    await loadDevlogPosts();

    // 3. ОБРАБОТКА ОТПРАВКИ ФОРМЫ (ДОБАВЛЕНИЕ НОВОГО ПОСТА)
    if (addForm) {
        addForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Предотвращаем перезагрузку страницы

            const title = document.getElementById('post-title').value;
            const tag = document.getElementById('post-tag').value;
            const content = document.getElementById('post-content').value;

            if (!currentUserId) return;

            // Отправляем запись в таблицу devlogs
            const { error } = await supabaseClient
                .from('devlogs')
                .insert([
                    {
                        title: title,
                        tag: tag,
                        content: content,
                        author_id: currentUserId
                    }
                ]);

            if (error) {
                console.error('Ошибка при публикации поста:', error);
                alert('Не удалось опубликовать пост. Проверьте права доступа в базе данных.');
                return;
            }

            // Очищаем форму
            addForm.reset();

            // Мгновенно перезагружаем список постов из базы, чтобы новая запись появилась сверху
            await loadDevlogPosts();
        });
    }
});