/* importing my helper functions */
import * as helper from "./_helper.js";


// Global variables
let spinner;
let userChoices = {
    movieOrShow: '',
    genre: '',
    randomType: '',
};


/*
This is the configuration for the application.
Do not change anything here unless something has changed 
in HTML-structure, CSS or Django (backend).
*/

const config = {
    CSS: {
        sectionIDs: {
            welcome: 'section-welcome',
            start: 'section-start',
            moodOrGenre: 'section-mood-genre',
            mood: 'section-mood',
            genre: 'section-genre',
            result: 'section-result',
            profile: 'section-user',
            watchlist: 'section-watchlist',
            watched: 'section-watched',
            rated: 'section-rated'
        },
        containerClasses: {
            watchlist: 'watchlist-container',
            result: 'result-container'
        },
        animationNames: {
            slideToTop: 'slideToTop',
            disappear: 'disappear',
            appear: 'appear',
            scale: 'scale',
            enterScreen: 'enterScreen',
            exitScreen: 'exitScreen',
            slideDown: 'slideDown',
            slideUp: 'slideUp'
        },
        bootstrapAlertTypes: {
            danger: 'danger',
            success: 'success'
        },
        bootstrapCardClasses: {
            card: 'card',
            cardImg: 'card-img-top',
            cardTitle: 'card-title',
            cardSubtitle: 'card-subtitle',
            cardText: 'card-text'
        }
    },
    backend: {
        csrftoken: getCookie('csrftoken')
    },
    urlPaths: {
        watchlist: '/get_watchlist',
        addToWatchlist: '/add_to_watchlist',
        removeFromWatchlist: '/remove_from_watchlist',
        getMovieData: '/get_data',
        movieByGenre: `/get_data/${userChoices.movieOrShow}/${userChoices.genre}`
    }
};

/*
End of configuration
*/


// Function for Getting CSRF-token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


/* Function for handling and rendering response data
Parameters: data - for JS-object with data, 
detailsParameter - for data.key which contains details about a movie, 
resultContainer - parent-element for rendering result,
*/
const renderResult = (data, detailsParameter, resultContainer) => {
    if (data.error) {
        // Displaying error message
        helper.renderMessageAlert(data.error, config.CSS.bootstrapAlertTypes.danger);
    } else if (data.empty) {
        // If no recommendations, remove spinner and display information to user
        spinner.remove();
        helper.renderInfoHeader(data.empty, resultContainer);
    } else {
        // Removing any previous error messages
        helper.removeMessageAlert();
        // Removing spinner
        spinner.remove();
        // Creating movie card and rendering it
        let result = new MovieCard(data.image, 'poster', data.title, data.year, detailsParameter, data.id, userChoices.movieOrShow, resultContainer);
        result.render();
    }
};


// Function for getting data from movie card
function returnMovieDetails(button) {
    // Saving movie/show details from DOM-elements...
    const image = document.querySelector(`.${config.CSS.bootstrapCardClasses.cardImg}`),
    title = document.querySelector(`.${config.CSS.bootstrapCardClasses.cardTitle}`),
    year = document.querySelector(`.${config.CSS.bootstrapCardClasses.cardSubtitle}`),
    details = document.querySelector(`.${config.CSS.bootstrapCardClasses.cardText}`),
    imdb_id = button.dataset.id,
    type = button.dataset.type[0];
    // Adding them to object...
    const movie_details = {
    imdb_id: imdb_id,
    type: type,
    title: title.innerHTML,
    year: year.innerHTML,
    image: image.src,
    details: details.innerHTML
    };
    // ... and returning JSON-data
    return JSON.stringify(movie_details);
}


// Function for getting movie IMDb id from movie card
function returnMovieID(button) {
    // Get movie IMDb id from DOM...
    const imdb_id = button.dataset.id;

    const movie_details = {
        imdb_id: imdb_id
    };
    // ... and return as JSON
    return JSON.stringify(movie_details);
}



// Dynamic page scripts
document.addEventListener('DOMContentLoaded', () => {
    // Variables for app sections
    const sectionWelcome = document.querySelector(`#${config.CSS.sectionIDs.welcome}`),
        sectionStart = document.querySelector(`#${config.CSS.sectionIDs.start}`),
        sectionMoodGenre = document.querySelector(`#${config.CSS.sectionIDs.moodOrGenre}`),
        sectionMood = document.querySelector(`#${config.CSS.sectionIDs.mood}`),
        sectionGenre = document.querySelector(`#${config.CSS.sectionIDs.genre}`),
        sectionResult = document.querySelector(`#${config.CSS.sectionIDs.result}`),
        resultContainer = document.querySelector(`.${config.CSS.containerClasses.result}`),
        sectionUser = document.querySelector(`#${config.CSS.sectionIDs.profile}`),
        sectionWatchlist = document.querySelector(`#${config.CSS.sectionIDs.watchlist}`),
        sectionWatched = document.querySelector(`#${config.CSS.sectionIDs.watched}`),
        sectionRated = document.querySelector(`#${config.CSS.sectionIDs.rated}`),
        watchlistContainer = document.querySelector(`.${config.CSS.containerClasses.watchlist}`);


    // Navbar hide/show
    const navbar = document.querySelector('.navbar');
    const menuArrow = document.querySelector('.menu-arrow');
    menuArrow.addEventListener('click', (e) => {
        if (e.target.dataset.slide == 'down') {
            menuArrow.classList.remove(`animated-${config.CSS.animationNames.slideUp}`);
            menuArrow.classList.add(`animated-${config.CSS.animationNames.slideDown}`);
            navbar.classList.add(`animated-${config.CSS.animationNames.enterScreen}`);
            navbar.classList.remove(`animated-${config.CSS.animationNames.exitScreen}`);
            e.target.dataset.slide = 'up';
            menuArrow.innerHTML = "menu &#8593;";
        }
        else if (e.target.dataset.slide == 'up') {
            menuArrow.classList.remove(`animated-${config.CSS.animationNames.slideDown}`);
            menuArrow.classList.add(`animated-${config.CSS.animationNames.slideUp}`);
            navbar.classList.remove(`animated-${config.CSS.animationNames.enterScreen}`);
            navbar.classList.add(`animated-${config.CSS.animationNames.exitScreen}`);
            e.target.dataset.slide = 'down';
            menuArrow.innerHTML = "menu &#8595;";
        }
    });


    // Mutations observer
    // Options for the observer (which mutations to observe)
    const params = { childList: true };
    // Callback function to execute when mutations are observed
    function addToWatchlist(mutations, observer) {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                // If movie card was rendered
                if (node.classList.contains(config.CSS.bootstrapCardClasses.card)) {
                    // Get 'Add to watchlist' button
                    const addToWatchlistBtn = sectionResult.querySelector('button[data-action="watchlist"]');
                    if (addToWatchlistBtn) {
                        // On click of this button
                        addToWatchlistBtn.addEventListener('click', () => {
                            // Get movie details
                            const data = returnMovieDetails(addToWatchlistBtn);
                            
                            // Make POST-request to add movie/show to movie database of the app and to watchlist
                            helper.postData(config.urlPaths.addToWatchlist, data, config.backend.csrftoken)
                            .then(data => {
                                if (data.error) {
                                    // Render error message
                                    helper.renderMessageAlert(data.error, config.CSS.bootstrapAlertTypes.danger);
                                    // Remove error mssg after some time
                                    setTimeout(helper.removeMessageAlert, 5000);
                                } else if (data.message) {
                                    // Remove previous messages if any
                                    helper.removeMessageAlert();
                                    // Showing successful result message
                                    helper.renderMessageAlert(data.message, config.CSS.bootstrapAlertTypes.success);
                                    // Remove success mssg after some time
                                    setTimeout(helper.removeMessageAlert, 3000);
                                }
                            });
                        });
                    }
                }
            });
        });
    }

    // Create observer instance linked to the callback function
    const observer = new MutationObserver(addToWatchlist);
    // Mutations observer start and disconnect in corresponding sections
    if (sectionWelcome) {
        observer.observe(resultContainer, params);
    }
    if (sectionUser) {
        observer.disconnect();
    }


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
                    userChoices.movieOrShow = e.target.dataset.type;
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
                    userChoices.randomType = e.target.dataset.random;
                    if (userChoices.randomType === 'top-shows') {
                        userChoices.movieOrShow = 'show';
                    } else {
                        userChoices.movieOrShow = 'movie';
                    }
                    // Hiding previous section
                    helper.hideWithAnimation(sectionStart, config.CSS.animationNames.slideToTop);
                    // Showing result section
                    helper.show(sectionResult);
                    // Showing spinner while JSON loads
                    spinner = helper.renderSpinner(resultContainer);
                    // Getting random movie from requested category
                    helper.getResource(`${config.urlPaths.getMovieData}/${userChoices.randomType}`)
                    .then(data => {
                        renderResult(data, data.stars, resultContainer);
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
                helper.hideWithAnimation(sectionMoodGenre, config.CSS.animationNames.disappear);
                // Showing next section
                helper.showWithAnimation(sectionMood, config.CSS.animationNames.appear);
            });
        }

        if(genreBtn) {
            // Clicking 'genre' button shows section for genre choice
            genreBtn.addEventListener('click', () => {
                // Hiding current section
                helper.hideWithAnimation(sectionMoodGenre, config.CSS.animationNames.disappear);
                // Showing next section
                helper.showWithAnimation(sectionGenre, config.CSS.animationNames.appear);
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
                    userChoices.genre = e.target.dataset.genre;
                    // Hiding current section
                    helper.hideWithAnimation(sectionMood, config.CSS.animationNames.disappear);
                    // Showing section with recommendation
                    helper.showWithAnimation(sectionResult, config.CSS.animationNames.appear);
                    // Showing spinner while JSON loads
                    spinner = helper.renderSpinner(resultContainer);
                    // Getting random movie/show for chosen mood (genre)
                    helper.getResource(`${config.urlPaths.getMovieData}/${userChoices.movieOrShow}/${userChoices.genre}`)
                    .then(data => {
                        renderResult(data, data.description, resultContainer);
                    });
                });
            });
        }
    
        if (genreButtons) {
            // Choosing mood (clicking button) shows section with movie recommendation
            genreButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    // Saving genre according to mood choice
                    userChoices.genre = e.target.dataset.genre;
                    // Hiding current section
                    helper.hideWithAnimation(sectionGenre, config.CSS.animationNames.disappear);
                    // Showing section with recommendation
                    helper.showWithAnimation(sectionResult, config.CSS.animationNames.appear);
                    // Showing spinner while JSON loads
                    spinner = helper.renderSpinner(resultContainer);
                    // Getting random movie/show for chosen genre
                    helper.getResource(`${config.urlPaths.getMovieData}/${userChoices.movieOrShow}/${userChoices.genre}`)
                    .then(data => {
                        renderResult(data, data.description, resultContainer);
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
                const previousResult = sectionResult.querySelector(`div.${config.CSS.bootstrapCardClasses.card}`);
                previousResult.remove();
                // Fetching for another random movie and rendering its card
                if (userChoices.randomType) {
                    // If user chose "random buttons" in start section
                    helper.getResource(`${config.urlPaths.getMovieData}/${userChoices.randomType}`)
                    .then(data => {
                        renderResult(data, data.stars, resultContainer);
                    });
                } else {
                    // Showing spinner while JSON loads
                    spinner = helper.renderSpinner(resultContainer);
                    // If user chose mood/genre
                    helper.getResource(`${config.urlPaths.getMovieData}/${userChoices.movieOrShow}/${userChoices.genre}`)
                    .then(data => {
                        renderResult(data, data.description, resultContainer);
                    });
                }
            });
        }
    }

    // Function to remove title from watchlist on click of a button CHANGE LATER (TOO COMPLEX FUNCTION)
    function remove_from_watchlist_on_click() {
        // Get 'Remove from Watchlist' buttons
        const removeFromWatchlistBtns = sectionWatchlist.querySelectorAll('button[data-action="watchlist"]');
        if (removeFromWatchlistBtns) {
            // On click of these buttons
            removeFromWatchlistBtns.forEach(button => {
                button.addEventListener('click', (e) => {
                    // Get movie IMDb id...
                    const data = returnMovieID(e.target);

                    // Make POST-request to remove movie/show from user's watchlist
                    helper.postData(config.urlPaths.removeFromWatchlist, data, config.backend.csrftoken)
                    .then(data => {
                        if (data.error) {
                            // Render error message
                            helper.renderMessageAlert(data.error, config.CSS.bootstrapAlertTypes.danger);
                            // Remove error mssg after some time
                            setTimeout(helper.removeMessageAlert, 5000);
                        } else if (data.message) {
                            // Remove previous messages if any
                            helper.removeMessageAlert();
                            // Showing successful result message
                            helper.renderMessageAlert(data.message, config.CSS.bootstrapAlertTypes.success);
                            // Remove success mssg after some time
                            setTimeout(helper.removeMessageAlert, 3000);
                        }
                    })
                    .then(() => {
                        // Remove movie card from watchlist page (from DOM)
                        let movieCard = e.target.parentElement.parentElement.parentElement;
                        helper.removeWithAnimation(movieCard, config.CSS.animationNames.disappear);
                    });
                });
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
                helper.getResource(config.urlPaths.watchlist)
                .then(data => {
                    console.log(data);
                    if (data.message) {
                        // Rendering error alert
                        helper.renderMessageAlert(data.message, config.CSS.bootstrapAlertTypes.danger);
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
                .then(remove_from_watchlist_on_click);
            }
            // Show watchlist and hide other section
            helper.show(sectionWatchlist);
            helper.hide(sectionWatched);
            helper.hide(sectionRated);
        });
    }


    // See list of watched movies TODO
    const watchedBtn = document.querySelector('button[data-profile="watched"]');
    if (watchedBtn) {
        watchedBtn.addEventListener('click', () => {
            // Show watched and hide other section
            helper.show(sectionWatched);
            helper.hide(sectionWatchlist);
            helper.hide(sectionRated);
        });
    }

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
            this.classes = [config.CSS.bootstrapCardClasses.card, 'text-center', 'text-white', 'mt-5'];
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