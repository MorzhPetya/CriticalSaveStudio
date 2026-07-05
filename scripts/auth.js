document.addEventListener('DOMContentLoaded', async () => {
    const authContainer = document.getElementById('auth-container');
    if (!authContainer) return;

    // 1. Проверяем текущую сессию пользователя в Supabase
    const { data: { session }, error } = await supabaseClient.auth.getSession();

    if (session) {
        // Пользователь авторизован. Берем его Discord ID
        const user = session.user;

        // Получаем профиль пользователя из нашей таблицы public.profiles
        const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profile) {
            // Определяем роль для красивого вывода
            let roleLabel = 'Игрок';
            let roleClass = 'role-player';
            
            if (profile.role === 'owner') {
                roleLabel = 'Владелец';
                roleClass = 'role-owner';
            } else if (profile.role === 'co-owner') {
                roleLabel = 'Со-владелец';
                roleClass = 'role-co-owner';
            }

            // Выводим мини-профиль в шапку сайта
            authContainer.innerHTML = `
                <div class="user-profile-header">
                    <img src="${profile.avatar_url || 'https://placehold.co/32'}" class="user-avatar-mini" alt="avatar">
                    <div class="user-info-mini">
                        <span class="user-name-mini">${profile.username}</span>
                        <span class="user-role-badge ${roleClass}">${roleLabel}</span>
                    </div>
                    <button id="logout-btn" class="logout-btn-mini">Выйти</button>
                </div>
            `;

            // Обработчик кнопки выхода
            document.getElementById('logout-btn').addEventListener('click', async () => {
                await supabaseClient.auth.signOut();
                window.location.reload(); // Перезагружаем страницу после выхода
            });
        }
    } else {
        // Пользователь НЕ авторизован. Показываем кнопку входа
        authContainer.innerHTML = `<button id="login-btn" class="nav-link discord-btn">Войти через Discord</button>`;

        // Обработчик кнопки входа
        document.getElementById('login-btn').addEventListener('click', async () => {
            const { data, error } = await supabaseClient.auth.signInWithOAuth({
                provider: 'discord',
                options: {
                    // Перенаправляем пользователя обратно на ту же страницу, где он находился
                    redirectTo: window.location.origin + window.location.pathname
                }
            });
        });
    }
});

// ==========================================
// ЛОГИКА БУРГЕР-МЕНЮ ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.getElementById('burger-menu');
    const navigation = document.getElementById('navigation');

    if (burgerMenu && navigation) {
        // Открытие/закрытие при клике на бургер
        burgerMenu.addEventListener('click', () => {
            navigation.classList.toggle('active');
            burgerMenu.classList.toggle('open');
        });
        
        // Автоматическое закрытие меню при клике на любую ссылку 
        // (важно для плавной прокрутки к блоку "Команда" или "Об игре")
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navigation.classList.remove('active');
                burgerMenu.classList.remove('open');
            });
        });
    }
});