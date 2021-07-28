// Importing my helper functions
import * as helper from '/static/moviegator/scripts/_helper.js';


// Variables to access globally
let movieOrShowChoice = '';
let genreChoice = '';
let randomTypeChoice = '';


// Dynamic page interactions
document.addEventListener('DOMContentLoaded', () => {
    // Variables for app sections
    const sectionWelcome = document.querySelector('#section-welcome'),
        sectionStart = document.querySelector('#section-start'),
        sectionMoodGenre = document.querySelector('#section-mood-genre'),
        sectionMood = document.querySelector('#section-mood'),
        sectionGenre = document.querySelector('#section-genre'),
        sectionResult = document.querySelector('#section-result'),
        resultContainer = document.querySelector('.result-container');


    // Navbar hide/show
    const navbar = document.querySelector('.navbar');
    const menuArrow = document.querySelector('.menu-arrow');
    menuArrow.addEventListener('click', (e) => {
        if (e.target.dataset.slide == 'down') {
            menuArrow.style.animation = `slideDown 1s linear 0s 1 normal forwards`;
            navbar.style.animation = `enterScreen 1s linear 0s 1 normal forwards`;
            e.target.dataset.slide = 'up';
            menuArrow.innerHTML = "menu &#8593;";
        }
        else if (e.target.dataset.slide == 'up') {
            menuArrow.style.animation = `slideUp 1s linear 0s 1 normal forwards`;
            navbar.style.animation = `exitScreen 1s linear 0s 1 normal forwards`;
            e.target.dataset.slide = 'down';
            menuArrow.innerHTML = "menu &#8595;";
        }
    });


    // Click 'Start' btn to enter start section
    const startBtn = document.querySelector('button[data-action="start"]');
    if (startBtn) {
        startBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Hiding current section and showing next section
            helper.hideWithAnimation(sectionWelcome, 'slideToTop');
            helper.show(sectionStart);
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
                helper.hideWithAnimation(sectionStart, 'disappear');
                helper.showWithAnimation(sectionMoodGenre, 'appear');
            });
        });
    }


    // Start choice (for Random)
    const randomButtons = sectionStart.querySelectorAll('button[data-random]');
    if (randomButtons) {
        randomButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Saving user's choice
                randomTypeChoice = e.target.dataset.random;
                console.log(randomTypeChoice);
                helper.hideWithAnimation(sectionStart, 'slideToTop');
                // Creating example movie card and rendering it (CHANGE TO FETCH LATER)
                let result = new MovieCard('https://upload.wikimedia.org/wikipedia/ru/9/9d/Matrix-DVD.jpg', 'poster', 'Matrix', '2004', 'Neo', 'tt002233', resultContainer);
                result.render();
                // Showing result section
                helper.show(sectionResult);
            });

        });
    }


    // 'Mood or genre' choice
    const moodBtn = sectionMoodGenre.querySelector('button[data-base="mood"]');
    const genreBtn = sectionMoodGenre.querySelector('button[data-base="genre"]');

    if(moodBtn) {
        // Clicking 'mood' button shows section for mood choice
        moodBtn.addEventListener('click', () => {
            // Hiding current section
            helper.hideWithAnimation(sectionMoodGenre, 'disappear');
            // Showing next section
            helper.showWithAnimation(sectionMood, 'appear');
        });
    }

    if(genreBtn) {
        // Clicking 'genre' button shows section for genre choice
        genreBtn.addEventListener('click', () => {
            // Hiding current section
            helper.hideWithAnimation(sectionMoodGenre, 'disappear');
            // Showing next section
            helper.showWithAnimation(sectionGenre, 'appear');
        });
    }

    
    // Genre choice (based on mood or genre itself)
    const moodButtons = sectionMood.querySelectorAll('button[data-genre]');
    const genreButtons = sectionGenre.querySelectorAll('button[data-genre]');

    if (moodButtons) {
        // Choosing mood (clicking button) shows section with movie recommendations
        moodButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Saving genre according to mood choice
                genreChoice = e.target.dataset.genre;
                console.log(genreChoice);
                // Hiding current section
                helper.hideWithAnimation(sectionMood, 'disappear');
                // Creating example movie card and rendering it (CHANGE TO FETCH LATER)
                let result = new MovieCard('https://upload.wikimedia.org/wikipedia/ru/9/9d/Matrix-DVD.jpg', 'poster', 'Matrix', '2004', 'Neo', 'tt002233', resultContainer);
                result.render();
                // Showing next section
                helper.showWithAnimation(sectionResult, 'appear');
            });
        });
    }

    if (genreButtons) {
        // Choosing mood (clicking button) shows section with movie recommendations
        genreButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Saving genre according to mood choice
                genreChoice = e.target.dataset.genre;
                console.log(genreChoice);
                // Hiding current section
                helper.hideWithAnimation(sectionGenre, 'disappear');
                // Creating example movie card and rendering it (CHANGE TO FETCH LATER)
                let result = new MovieCard('https://upload.wikimedia.org/wikipedia/ru/9/9d/Matrix-DVD.jpg', 'poster', 'Matrix', '2004', 'Neo', 'tt002233', resultContainer);
                result.render();
                // Showing next section
                helper.showWithAnimation(sectionResult, 'appear');
            });
        });
    }

    // More results for user's preferences
    const moreButton = sectionResult.querySelector('button[data-action="more"]');
    if (moreButton) {
        moreButton.addEventListener('click', (e) => {
            // Remove previous result element
            const previousResult = sectionResult.querySelector('div.card');
            previousResult.remove();
            // Creating new movie card and rendering it (CHANGE TO FETCH LATER)
            let result = new MovieCard('https://centretownmovies.files.wordpress.com/2015/08/back_to_the_future.jpg', 'poster', 'Back to the Future', '1985', 'Doc', 'tt003333', resultContainer);
            result.render();
        });
    }


});


// Class for movie card
class MovieCard {
    constructor(src, alt, title, year, descr, id, parentElement, ...classes) {
        this.src = src;
        this.alt = alt;
        this.title = title;
        this.year = year;
        this.descr = descr;
        this.id = id;
        this.classes = classes;
        this.parent = parentElement;
        
    }

    render() {
        const movieCardElement = document.createElement('div');

        if (this.classes.length === 0) {
            this.classes = ['card', 'text-center', 'text-white', 'mt-2'];
            this.classes.forEach(className => movieCardElement.classList.add(className)); 
            //adding default class to the element in case they were not specified
        } else {
            this.classes.forEach(className => movieCardElement.classList.add(className)); 
            //adding specified classes to the element
        }
        
        movieCardElement.innerHTML = `
            <img src=${this.src} class="card-img-top" alt=${this.alt}>
            <div class="card-body">
                <h5 class="card-title">${this.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${this.year}</h6>
                <p class="card-text">${this.descr}</p>
                <div class="d-flex flex-row justify-content-center">
                    <button class="btn btn-outline-light btn-sm mx-2" type="button" data-id=${this.id}>Add to Watchlist</button>
                    <button class="btn btn-outline-light btn-sm mx-2" type="button" data-id=${this.id}>Watched</button>
                </div>
            </div>
        `;
        this.parent.append(movieCardElement); // adding to DOM
    }
}