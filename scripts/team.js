document.addEventListener('DOMContentLoaded', async () => {
    const teamCards = document.querySelectorAll('.team-card[data-user-id]');
    if (teamCards.length === 0) return;

    const rawIds = Array.from(teamCards).map(card => card.getAttribute('data-user-id'));
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const validIds = rawIds.filter(id => uuidRegex.test(id));

    if (validIds.length === 0) return;

    const { data: profiles, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .in('id', validIds);

    if (error) {
        console.error('Ошибка при загрузке данных команды:', error);
        return;
    }

    profiles.forEach(profile => {
        const card = document.querySelector(`.team-card[data-user-id="${profile.id}"]`);
        if (card) {
            // 1. Обновляем аватарку (из Discord)
            const avatarContainer = card.querySelector('.member-avatar');
            if (avatarContainer) {
                const img = document.createElement('img');
                img.src = profile.avatar_url || 'https://placehold.co/90';
                img.alt = profile.username;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.borderRadius = '50%';
                img.style.objectFit = 'cover';
                avatarContainer.innerHTML = '';
                avatarContainer.appendChild(img);
            }

// 2. Обновляем имя (из Roblox, если заполнено, иначе Discord)
            const nameElement = card.querySelector('.member-name');
            if (nameElement) {
                const displayName = profile.roblox_username || profile.username;
                
                // Просто выводим обычную PNG картинку вместо сложного SVG
                if (profile.roblox_username) {
                    nameElement.innerHTML = `
                        <img class="roblox-icon-png" src="images/roblox.png" alt="Roblox">
                        <span>${displayName}</span>
                    `;
                } else {
                    nameElement.textContent = displayName;
                }
            }

            // 3. Обновляем Discord-тег снизу
            const discordElement = card.querySelector('.member-discord span');
            if (discordElement) {
                discordElement.textContent = `${profile.username}`;
            }
        }
    });
});