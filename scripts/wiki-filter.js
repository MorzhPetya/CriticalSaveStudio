document.addEventListener('DOMContentLoaded', () => {
    // Находим все кнопки фильтрации и все карточки
    const filterButtons = document.querySelectorAll('.filter-btn');
    const wikiCards = document.querySelectorAll('.wiki-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 1. Убираем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 2. Добавляем активный класс нажатой кнопке
            button.classList.add('active');

            // Получаем значение фильтра нажатой кнопки (all, units, buildings, production)
            const filterValue = button.getAttribute('data-filter');

            // 3. Пробегаемся по всем карточкам
            wikiCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                // Если нажата кнопка "Все" или категория карточки совпадает с фильтром
                if (filterValue === 'all' || filterValue === cardCategory) {
                    card.style.display = ''; // Показываем карточку (возвращаем к исходному стилю)
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none'; // Скрываем карточку
                }
            });
        });
    });
});