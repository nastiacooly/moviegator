// importing my helper functions
import * as helper from "./_helper.js";


// Variables to access globally
let movieOrShowChoice = '';
let genreChoice = '';
let randomTypeChoice = '';
const userActionsScriptSrc = "/static/moviegator/scripts/user_actions.js";


// Dynamic page scripts
document.addEventListener('DOMContentLoaded', () => {
    // Variables for app sections
    const sectionWelcome = document.querySelector('#section-welcome'),
        sectionStart = document.querySelector('#section-start'),
        sectionMoodGenre = document.querySelector('#section-mood-genre'),
        sectionMood = document.querySelector('#section-mood'),
        sectionGenre = document.querySelector('#section-genre'),
        sectionResult = document.querySelector('#section-result'),
        resultContainer = document.querySelector('.result-container'),
        sectionWatchlist = document.querySelector('#section-watchlist'),
        sectionWatched = document.querySelector('#section-watched'),
        sectionRated = document.querySelector('#section-rated'),
        watchlistContainer = document.querySelector('.watchlist-container');


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


    // Start section
    if (sectionStart) {
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
                    if (randomTypeChoice === 'top-shows') {
                        movieOrShowChoice = 'show';
                    } else {
                        movieOrShowChoice = 'movie';
                    }
                    // Hiding previous section
                    helper.hideWithAnimation(sectionStart, 'slideToTop');
                    // Showing result section
                    helper.show(sectionResult);
                    // Showing spinner while JSON loads
                    const spinner = helper.renderSpinner(resultContainer);
                    // Getting random movie from requested category
                    helper.getResource(`/get_data/${randomTypeChoice}`)
                    .then(data => {
                        if (data.error) {
                            // Displaying error message
                            helper.renderMessageAlert(data.error, "danger");
                            // TO DO HERE AND IN EVERY RESULT RENDERING BELOW:
                            // - render error in result container if no more recommendations available
                            // - remove spinner in this case
                        }
                        else {
                            // Removing any previous error messages
                            helper.removeMessageAlert();
                            // Removing spinner
                            spinner.remove();
                            // Creating movie card and rendering it
                            let result = new MovieCard(data.image, 'poster', data.title, data.year, data.stars, data.id, movieOrShowChoice, resultContainer);
                            // Rendering movie card
                            result.render();
                        }
                    })
                    .then(() => {
                        // Setting status for result section
                        sectionResult.dataset.status = "loaded";
                        // Adding script for user actions
                        helper.append_script(userActionsScriptSrc);
                    });
                });

            });
        }
    }


    // 'Mood or genre' choice
    if (sectionMoodGenre){
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
    }
    

    // Genre choice (based on mood or genre itself)
    if (sectionMood || sectionGenre) {
        const moodButtons = sectionMood.querySelectorAll('button[data-genre]');
        const genreButtons = sectionGenre.querySelectorAll('button[data-genre]');

        if (moodButtons) {
            // Choosing mood (clicking button) shows section with movie recommendation
            moodButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    // Saving genre according to mood choice
                    genreChoice = e.target.dataset.genre;
                    // Hiding current section
                    helper.hideWithAnimation(sectionMood, 'disappear');
                    // Showing section with recommendation
                    helper.showWithAnimation(sectionResult, 'appear');
                    // Showing spinner while JSON loads
                    const spinner = helper.renderSpinner(resultContainer);
                    // Getting random movie/show for chosen mood (genre)
                    helper.getResource(`/get_data/${movieOrShowChoice}/${genreChoice}`)
                    .then(data => {
                        if (data.error) {
                            // Displaying error message
                            helper.renderMessageAlert(data.error, "danger");
                        }
                        else {
                            // Removing any previous error messages
                            helper.removeMessageAlert();
                            // Removing spinner
                            spinner.remove();
                            // Creating movie card and rendering it
                            let result = new MovieCard(data.image, 'poster', data.title, data.year, data.description, data.id, movieOrShowChoice, resultContainer);
                            result.render();                            
                        }
                    })
                    .then(() => {
                        // Setting status for result section
                        sectionResult.dataset.status = "loaded";
                        // Adding script for user actions
                        helper.append_script(userActionsScriptSrc);
                    });
                });
            });
        }
    
        if (genreButtons) {
            // Choosing mood (clicking button) shows section with movie recommendation
            genreButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    // Saving genre according to mood choice
                    genreChoice = e.target.dataset.genre;
                    // Hiding current section
                    helper.hideWithAnimation(sectionGenre, 'disappear');
                    // Showing section with recommendation
                    helper.showWithAnimation(sectionResult, 'appear');
                    // Showing spinner while JSON loads
                    const spinner = helper.renderSpinner(resultContainer);
                    // Getting random movie/show for chosen genre
                    helper.getResource(`/get_data/${movieOrShowChoice}/${genreChoice}`)
                    .then(data => {
                        if (data.error) {
                            // Displaying error message
                            helper.renderMessageAlert(data.error, "danger");
                        }
                        else {
                            // Removing any previous error messages
                            helper.removeMessageAlert();
                            // Removing spinner
                            spinner.remove();
                            // Creating movie card and rendering it
                            let result = new MovieCard(data.image, 'poster', data.title, data.year, data.description, data.id, movieOrShowChoice, resultContainer);
                            result.render();
                        }
                    })
                    .then(() => {
                        // Setting status for result section
                        sectionResult.dataset.status = "loaded";
                        // Adding script for user actions
                        helper.append_script(userActionsScriptSrc);
                    });
                });
            });
        }
    }
    

    // More results for user's preferences
    if (sectionResult) {
        const moreButton = sectionResult.querySelector('button[data-action="more"]');
        if (moreButton) {
            moreButton.addEventListener('click', (e) => {
                // Remove previous result element
                const previousResult = sectionResult.querySelector('div.card');
                previousResult.remove();
                // Fetching for another random movie and rendering its card
                if (randomTypeChoice) {
                    // If user chose "random buttons" in start section
                    helper.getResource(`/get_data/${randomTypeChoice}`)
                    .then(data => {
                        if (data.error) {
                            // Displaying error message
                            helper.renderMessageAlert(data.error, "danger");
                        }
                        else {
                            // Removing any previous error messages
                            helper.removeMessageAlert();
                            // Creating movie card and rendering it
                            let result = new MovieCard(data.image, 'poster', data.title, data.year, data.crew, data.id, movieOrShowChoice, resultContainer);
                            result.render();
                            // Setting status for result section
                            sectionResult.dataset.status = "loaded";
                            // Removing script for user actions...
                            const script = document.querySelector('script#user_actions');
                            script.remove();
                        }
                    })
                    .then(() => {
                        if (sectionResult.dataset.status === "loaded") {
                            // ..and adding it once more (for the script to load newly rendered movie card)
                            helper.append_script(userActionsScriptSrc);
                        }
                    });
                } else {
                    // Showing spinner while JSON loads
                    const spinner = helper.renderSpinner(resultContainer);
                    // If user chose mood/genre
                    helper.getResource(`/get_data/${movieOrShowChoice}/${genreChoice}`)
                    .then(data => {
                        if (data.error) {
                            // Displaying error message
                            helper.renderMessageAlert(data.error, "danger");
                        }
                        else {
                            // Removing any previous error messages
                            helper.removeMessageAlert();
                            // Removing spinner
                            spinner.remove();
                            // Creating movie card and rendering it
                            let result = new MovieCard(data.image, 'poster', data.title, data.year, data.description, data.id, movieOrShowChoice, resultContainer);
                            result.render();
                            // Setting status for result section
                            sectionResult.dataset.status = "loaded";
                            // Removing script for user actions...
                            const script = document.querySelector('script#user_actions');
                            script.remove();
                        }
                    })
                    .then(() => {
                        if (sectionResult.dataset.status === "loaded") {
                            // ..and adding it once more (for the script to load newly rendered movie card)
                            helper.append_script(userActionsScriptSrc);
                        }
                    });
                }
            });
        }
    }


    // See watchlist
    const watchlistBtn = document.querySelector('button[data-profile="watchlist"]');
    if (watchlistBtn) {
        // In case watchlist section isn't already visible
        watchlistBtn.addEventListener('click', (e) => {
            // Getting watchlist from server (only if it hasn't been rendered before)
            if (watchlistContainer.childElementCount === 0) {
                helper.getResource('get_watchlist')
                .then(data => {
                    console.log(data);
                    if (data.message) {
                        // Rendering error alert
                        helper.renderMessageAlert(data.message, "danger");
                    } else {
                        // Removing any previous error messages
                        helper.removeMessageAlert();
                        // Creating movie cards and rendering them
                        data.forEach(item => {
                            console.log(item);
                            // Setting type of title
                            let type = '';
                            if (item.type === "m") {
                                type = 'movie';
                            } else if (item.type === "s") {
                                type = "show";
                            }
                            let movie = new MovieCard(item.image, 'poster', item.title, item.year, item.details, item.imdb_id, type, watchlistContainer);
                            movie.render("for_watchlist");
                        });
                    }
                })
                .then(() => {
                    // Adding script for user actions
                    helper.append_script(userActionsScriptSrc);
                });
            }
            // Show watchlist and hide other section
            helper.show(sectionWatchlist);
            helper.hide(sectionWatched);
            helper.hide(sectionRated);
        });
    }


    // See list of watched movies
    const watchedBtn = document.querySelector('button[data-profile="watched"]');
    if (watchedBtn) {
        watchedBtn.addEventListener('click', () => {
            // Show watched and hide other section
            helper.show(sectionWatched);
            helper.hide(sectionWatchlist);
            helper.hide(sectionRated);
        });
    }


    // Mutations observer TO APPLY LATER FOR DYNAMIC CONTENT IN RESULT SECTION
    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };
    // Callback function to execute when mutations are observed
    function callback(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                console.log('A child node has been added or removed.');
            }
            else if (mutation.type === 'attributes') {
                console.log('The ' + mutation.attributeName + ' attribute was modified.');
            }
        }
    }
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);
    // Start observing the target node for configured mutations
    observer.observe(resultContainer, config);

});


// Class for movie card
class MovieCard {
    constructor(src, alt, title, year, descr, id, type, parentElement, ...classes) {
        this.src = src;
        this.alt = alt;
        this.title = title;
        this.year = year;
        this.descr = descr;
        this.id = id;
        this.type = type;
        this.classes = classes;
        this.parent = parentElement;
        
    }

    render(condition="for_result") {
        const movieCardElement = document.createElement('div');

        if (this.classes.length === 0) {
            this.classes = ['card', 'text-center', 'text-white', 'mt-5'];
            this.classes.forEach(className => movieCardElement.classList.add(className)); 
            //adding default class to the element in case they were not specified
        } else {
            this.classes.forEach(className => movieCardElement.classList.add(className)); 
            //adding specified classes to the element
        }

        if (condition === "for_result") {
            movieCardElement.innerHTML = `
            <img src=${this.src} class="card-img-top" alt=${this.alt}>
            <div class="card-body">
                <h5 class="card-title">${this.title}</h5>
                <h6 class="card-subtitle mb-2">${this.year}</h6>
                <p class="card-text">${this.descr}</p>
                <button type="button" class="btn btn-outline-warning">
                    <a href="https://www.imdb.com/title/${this.id}/" target="_blank">Details on IMDb</a>
                </button>
                <div class="d-flex flex-row justify-content-center mt-3">
                    <button title="Add to Watchlist" class="btn btn-outline-light btn-lg mx-2" type="button" data-id=${this.id} data-action="watchlist" data-type=${this.type}>&#43;</button>
                    <button title="Mark as Watched" class="btn btn-outline-light btn-lg mx-2" type="button" data-id=${this.id} data-action="watched" data-type=${this.type}>&#10003;</button>
                </div>
            </div>
            `;
        } else if (condition === "for_watchlist") {
            movieCardElement.innerHTML = `
            <img src=${this.src} class="card-img-top" alt=${this.alt}>
            <div class="card-body">
                <h5 class="card-title">${this.title}</h5>
                <h6 class="card-subtitle mb-2">${this.year}</h6>
                <p class="card-text">${this.descr}</p>
                <button type="button" class="btn btn-outline-warning">
                    <a href="https://www.imdb.com/title/${this.id}/" target="_blank">Details on IMDb</a>
                </button>
                <div class="d-flex flex-row justify-content-center mt-3">
                    <button title="Remove from Watchlist" class="btn btn-light btn-lg mx-2" type="button" data-id=${this.id} data-action="watchlist" data-type=${this.type}>&#8722;</button>
                    <button title="Mark as Watched" class="btn btn-outline-light btn-lg mx-2" type="button" data-id=${this.id} data-action="watched" data-type=${this.type}>&#10003;</button>
                </div>
            </div>
            `;
        } else if (condition === "for_watched") {
            movieCardElement.innerHTML = `
            <img src=${this.src} class="card-img-top" alt=${this.alt}>
            <div class="card-body">
                <h5 class="card-title">${this.title}</h5>
                <h6 class="card-subtitle mb-2">${this.year}</h6>
                <p class="card-text">${this.descr}</p>
                <button type="button" class="btn btn-outline-warning">
                    <a href="https://www.imdb.com/title/${this.id}/" target="_blank">Details on IMDb</a>
                </button>
                <div class="d-flex flex-row justify-content-center mt-3">
                    <button title="Rate This Title" class="btn btn-outline-light btn-lg mx-2" type="button" data-id=${this.id} data-action="rate" data-type=${this.type}>Rate</button>
                    <button title="Mark as Not Watched" class="btn btn-light btn-lg mx-2" type="button" data-id=${this.id} data-action="watched" data-type=${this.type}>&#10003;</button>
                </div>
            </div>
            `;
        } else if (condition === "for_rated") {
            movieCardElement.innerHTML = `
            <img src=${this.src} class="card-img-top" alt=${this.alt}>
            <div class="card-body">
                <h5 class="card-title">${this.title}</h5>
                <h6 class="card-subtitle mb-2">${this.year}</h6>
                <p class="card-text">${this.descr}</p>
                <button type="button" class="btn btn-outline-warning">
                    <a href="https://www.imdb.com/title/${this.id}/" target="_blank">Details on IMDb</a>
                </button>
                <div class="d-flex flex-row justify-content-center mt-3">
                    <span class="rating">Rating: </span>
                    <button title="Change Rating" class="btn btn-outline-light btn-sm mx-2" type="button" data-id=${this.id} data-action="rate" data-type=${this.type}>Change Rating</button>
                </div>
            </div>
            `;
        }
        
        this.parent.append(movieCardElement); // adding to DOM
    }
}