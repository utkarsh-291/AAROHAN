document.addEventListener('DOMContentLoaded', () => {
    const moodSelector = document.getElementById('mood-selector');
    const playlistContainer = document.getElementById('playlist-container');

    const musicData = {
        Happy: {
            emoji: '😊',
            playlists: [
                {
                    title: 'Feel-Good Indie Rock',
                    description: 'Upbeat tracks to keep your spirits high.',
                    thumbnail: 'https://source.unsplash.com/random/400x300/?concert,happy',
                    link: 'https://www.youtube.com/playlist?list=PL_R-A6-e6_JBIY5nK_5y-yggVzJGnkjB5'
                },
                {
                    title: 'Pop Anthems',
                    description: 'Sing along to these popular hits.',
                    thumbnail: 'https://source.unsplash.com/random/400x300/?music,pop',
                    link: 'https://www.youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmFq4J49kFeV2lG'
                }
            ]
        },
        Sad: {
            emoji: '😞',
            playlists: [
                {
                    title: 'Acoustic Melancholy',
                    description: 'Gentle songs for quiet reflection.',
                    thumbnail: 'https://source.unsplash.com/random/400x300/?guitar,sad',
                    link: 'https://www.youtube.com/playlist?list=PL-4d-0i0b-X9Sj-nL_m-b-L_E8-uY6J7K'
                },
                {
                    title: 'Lofi Hip Hop',
                    description: 'Relax and unwind with these chill beats.',
                    thumbnail: 'https://source.unsplash.com/random/400x300/?lofi,rain',
                    link: 'https://www.youtube.com/watch?v=5qap5aO4i9A'
                }
            ]
        },
        Angry: {
            emoji: '😡',
            playlists: [
                {
                    title: 'Heavy Metal',
                    description: 'Release your frustration with these powerful tracks.',
                    thumbnail: 'https://source.unsplash.com/random/400x300/?metal,concert',
                    link: 'https://www.youtube.com/playlist?list=PLh_sf-A0_M2-sA4hX5tj-k_8-c_uR-x-d'
                },
                {
                    title: 'Punk Rock',
                    description: 'High-energy anthems to channel your anger.',
                    thumbnail: 'https://source.unsplash.com/random/400x300/?punk,rock',
                    link: 'https://www.youtube.com/playlist?list=PL5DA1A3482E21B455'
                }
            ]
        },
        Excited: {
            emoji: '🤩',
            playlists: [
                {
                    title: 'Electronic Dance',
                    description: 'Get pumped with these energetic beats.',
                    thumbnail: 'https://source.unsplash.com/random/400x300/?electronic,music',
                    link: 'https://www.youtube.com/playlist?list=PLw-13hA-n93-ZlT-M8k_b-DLGey9Fjfbz'
                },
                {
                    title: 'Funk & Disco',
                    description: 'Groovy tunes to get you moving.',
                    thumbnail: 'https://source.unsplash.com/random/400x300/?disco,party',
                    link: 'https://www.youtube.com/playlist?list=PLwJjP90J6-No2u_fP7aA6tVa2-Y-0hVzM'
                }
            ]
        }
    };

    // Create mood buttons
    for (const mood in musicData) {
        const button = document.createElement('button');
        button.className = 'mood-btn';
        button.dataset.mood = mood;
        button.innerHTML = `<span class="emoji">${musicData[mood].emoji}</span> ${mood}`;
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');
            displayPlaylists(mood);
        });
        moodSelector.appendChild(button);
    }

    function displayPlaylists(mood) {
        playlistContainer.innerHTML = '';
        const playlists = musicData[mood].playlists;
        const grid = document.createElement('div');
        grid.className = 'playlist-grid';

        playlists.forEach(playlist => {
            const card = document.createElement('a');
            card.href = playlist.link;
            card.target = '_blank'; // Open in a new tab
            card.className = 'playlist-card';
            card.innerHTML = `
                <img src="${playlist.thumbnail}" alt="${playlist.title}">
                <div class="playlist-info">
                    <h3>${playlist.title}</h3>
                    <p>${playlist.description}</p>
                </div>
            `;
            grid.appendChild(card);
        });

        playlistContainer.appendChild(grid);
        playlistContainer.classList.add('visible');
    }
});
