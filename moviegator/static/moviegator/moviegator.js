document.addEventListener('DOMContentLoaded', () => {
    // Variables for app sections
    const sectionWelcome = document.querySelector('#section-welcome'),
        sectionStart = document.querySelector('#section-start'),
        sectionMoodGenre = document.querySelector('#section-mood-genre'),
        sectionMood = document.querySelector('#section-mood'),
        sectionGenre = document.querySelector('#section-genre');


    // Navbar hide/show on hover TODO
    const navbar = document.querySelector('.navbar');


    // Click 'Start' btn to enter start section
    const startBtn = document.querySelector('button[data-action="start"]');
    if (startBtn) {
        startBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Hiding current section and showing next section
            hideWithAnimation(sectionWelcome, 'slideToTop');
            show(sectionStart);
        });
    }

    // Start choice (Movie or TV Show)
    const firstChoiceButtons = sectionStart.querySelectorAll('button[data-type]');
    if (firstChoiceButtons) {
        firstChoiceButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Disabling not clicked button
                if (e.target === firstChoiceButtons[0]) {
                    firstChoiceButtons[1].setAttribute('disabled', true);
                    button.removeAttribute('disabled');
                } else if (e.target === firstChoiceButtons[1]) {
                    firstChoiceButtons[0].setAttribute('disabled', true);
                    button.removeAttribute('disabled');
                }
                // Storing user's choice to variable
                movieOrShowChoice = e.target.dataset.type;
                // Hiding current section's content and showing next section's content
                hideWithAnimation(sectionStart, 'disappear');
                showWithAnimation(sectionMoodGenre, 'appear');
            });
        });
    }

    // Mood or genre choice
    const moodBtn = sectionMoodGenre.querySelector('button[data-base="mood"]');
    const genreBtn = sectionMoodGenre.querySelector('button[data-base="genre"]');

    if(moodBtn) {
        // Clicking 'mood' button shows section for mood choice
        moodBtn.addEventListener('click', () => {
            // Hiding current section
            hideWithAnimation(sectionMoodGenre, 'disappear');
            // Showing next section
            showWithAnimation(sectionMood, 'appear');
        });
    }

    if(genreBtn) {
        // Clicking 'genre' button shows section for genre choice
        genreBtn.addEventListener('click', () => {
            // Hiding current section
            hideWithAnimation(sectionMoodGenre, 'disappear');
            // Showing next section
            showWithAnimation(sectionGenre, 'appear');
        });
    }

});


// Variables to access globally

let movieOrShowChoice = '';


// Helper functions

function hide(element) {
    element.style.display = 'none';
}

function show(element) {
    element.style.display = 'block';
}

function hideWithAnimation(element, animationName) {
    element.style.animation = `${animationName} 1s linear 0s 1 normal forwards`;
    element.addEventListener('animationend', () => {
        hide(element);
    });
}

function showWithAnimation(element, animationName) {
    show(element);
    element.style.animation = `${animationName} 2s linear 0s 1 normal forwards`;
}


// Class for movie cards TODO LATER
class MovieCard {
    constructor(src, alt, title, year, descr, parentSelector, ...classes) {
        this.src = src;
        this.alt = alt;
        this.title = title;
        this.year = year;
        this.descr = descr;
        this.classes = classes;
        this.parent = document.querySelector(parentSelector);
        
    }

    render() {
        const movieCardElement = document.createElement('div');

        if (this.classes.length === 0) {
            this.classes = 'menu__item';
            movieCardElement.classList.add(this.classes);
            //adding default class to the element in case they were not specified
        } else {
            this.classes.forEach(className => menuItemElement.classList.add(className)); 
            //adding specified classes to the element
        }
        
        movieCardElement.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                </div>
        `;
        this.parent.append(movieCardElement); // adding to DOM
    }
}


// Function to make GET-requests
const getResource = async (url) => {
    const result = await fetch(url);

    if(!result.ok) { // in case the request was unsuccessful
        throw new Error(`Could not get resources from ${url}, status: ${result.status}`);
    }

    return await result.json();
};

/* TO USE LATER
getResource('API url...')
    .then(data => {
        data.forEach(({src, alt, title, year, descr}) => { //деструктурируем объекты из массива api.json
            new MovieCard( //передаем классу в качестве аргументов ключи объектов api.json
                src, 
                alt, 
                title,
                year, 
                descr, 
                "parentSelector"
            ).render();
        });
    }); 
*/


// Function for POST-requests
const postData = async (url, data) => {
    const result = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: data
    });

    return await result.json();
};

/* TO USE LATER
postData('django url', json)
    .then(data => { //действия при успешности запроса
        console.log(data); //показываем полученный от сервера ответ для проверки
        ...
    })
    .catch(() => { //действия при неуспешности запроса
        ...
    })
    .finally(() => { //действия при любом исходе запроса
        form.reset(); //например, очистка формы на странице
    });
*/