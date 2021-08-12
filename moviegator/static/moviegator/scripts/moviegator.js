/* importing my helper functions */
import * as helper from "./_helper.js";


/* Global variables */
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
            watched: 'watched-container',
            result: 'result-container'
        },
        buttonsSelectors: {
            start: 'button[data-action="start"]',
            typeChoice: 'button[data-type]',
            randomChoice: 'button[data-random]',
            moodBase: 'button[data-base="mood"]',
            genreBase: 'button[data-base="genre"]',
            genreChoice: 'button[data-genre]',
            moreResults: 'button[data-action="more"]',
            watchlist: 'button[data-profile="watchlist"]',
            watched: 'button[data-profile="watched"]',
            watchlistActions: 'button[data-action="watchlist"]',
            watchedActions: 'button[data-action="watched"]'
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
    HTMLSymbols: {
        arrowUp: '&#8593;',
        arrowDown: '&#8595;'
    },
    backend: {
        csrftoken: getCookie('csrftoken')
    },
    urlPaths: {
        watchlist: '/get_watchlist',
        watched: '/get_watched',
        addToWatchlist: '/add_to_watchlist',
        removeFromWatchlist: '/remove_from_watchlist',
        getMovieData: '/get_data',
        markAsWatched: '/mark_as_watched'
    },
    userLists: {
        watchlist: 'watchlist',
        watched: 'watched',
        rated: 'rated'
    }
};

/*
End of configuration
*/


/* 
Dynamic page scripts 
*/
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
        watchlistContainer = document.querySelector(`.${config.CSS.containerClasses.watchlist}`),
        watchedContainer = document.querySelector(`.${config.CSS.containerClasses.watched}`);


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
            menuArrow.innerHTML = `menu ${config.HTMLSymbols.arrowUp}`;
        }
        else if (e.target.dataset.slide == 'up') {
            menuArrow.classList.remove(`animated-${config.CSS.animationNames.slideDown}`);
            menuArrow.classList.add(`animated-${config.CSS.animationNames.slideUp}`);
            navbar.classList.remove(`animated-${config.CSS.animationNames.enterScreen}`);
            navbar.classList.add(`animated-${config.CSS.animationNames.exitScreen}`);
            e.target.dataset.slide = 'down';
            menuArrow.innerHTML = `menu ${config.HTMLSymbols.arrowDown}`;
        }
    });


    /* 
    Mutations observer for the result section.
    It adds eventListeners on buttons in movie cards which are
    dynamically rendered on a page.
    */
    // Options for the observer (which mutations to observe)
    const params = { childList: true };
    // Callback function to execute when mutations are observed
    function callback(mutations, observer) {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                // If movie card was rendered
                if (node.classList.contains(config.CSS.bootstrapCardClasses.card)) {
                    // Get 'Add to watchlist' button
                    const addToWatchlistBtn = sectionResult.querySelector(config.CSS.buttonsSelectors.watchlistActions);
                    if (addToWatchlistBtn) {
                        // On click of this button
                        addToWatchlistBtn.addEventListener('click', (e) => {
                            addToUserList(config.userLists.watchlist, e.target);
                        });
                    }
                    // Get 'Mark as Watched' button
                    const markAsWatchedBtn = sectionResult.querySelector(config.CSS.buttonsSelectors.watchedActions);
                    if (markAsWatchedBtn) {
                        // On click of this button
                        markAsWatchedBtn.addEventListener('click', (e) => {
                            addToUserList(config.userLists.watched, e.target);
                        });
                    }
                }
            });
        });
    }
    // Create observer instance linked to the callback function
    const observer = new MutationObserver(callback);
    // Mutations observer start and disconnect in corresponding sections
    if (sectionWelcome) {
        observer.observe(resultContainer, params);
    }
    if (sectionUser) {
        observer.disconnect();
    }


    // Click 'Start' btn to enter start section
    const startBtn = document.querySelector(config.CSS.buttonsSelectors.start);
    if (startBtn) {
        startBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Hiding current section and showing next section
            helper.hideWithAnimation(sectionWelcome, config.CSS.animationNames.slideToTop);
            helper.show(sectionStart);
        });
    }


    // Start section
    if (sectionStart) {
        // Start choice (Movie or TV Show)
        const firstChoiceButtons = sectionStart.querySelectorAll(config.CSS.buttonsSelectors.typeChoice);
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
                    helper.hideWithAnimation(sectionStart, config.CSS.animationNames.disappear);
                    helper.showWithAnimation(sectionMoodGenre, config.CSS.animationNames.appear);
                });
            });
        }


        // Start choice (for Random)
        const randomButtons = sectionStart.querySelectorAll(config.CSS.buttonsSelectors.randomChoice);
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
                        if (userChoices.randomType === 'top-shows') {
                            renderResult(data, data.crew, resultContainer);
                        } else {
                        renderResult(data, data.stars, resultContainer);
                        }
                    });
                });

            });
        }
    }


    // 'Mood or genre' choice
    if (sectionMoodGenre) {
        const moodBtn = sectionMoodGenre.querySelector(config.CSS.buttonsSelectors.moodBase);
        const genreBtn = sectionMoodGenre.querySelector(config.CSS.buttonsSelectors.genreBase);

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
        const genreChoiceButtons = document.querySelectorAll(config.CSS.buttonsSelectors.genreChoice);

        if (genreChoiceButtons) {
            // Choosing genre (by clicking button with mood or genre) shows section with movie recommendation
            genreChoiceButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    // Saving genre choice
                    userChoices.genre = e.target.dataset.genre;
                    // Hiding current section
                    helper.hideWithAnimation(sectionMood, config.CSS.animationNames.disappear);
                    helper.hideWithAnimation(sectionGenre, config.CSS.animationNames.disappear);
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
    }

    // More results for user's preferences
    if (sectionResult) {
        const moreButton = sectionResult.querySelector(config.CSS.buttonsSelectors.moreResults);
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
                        if (userChoices.randomType === "top-shows") {
                            renderResult(data, data.crew, resultContainer);
                        } else {
                        renderResult(data, data.stars, resultContainer);
                        }
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

    // See watchlist
    const watchlistBtn = document.querySelector(config.CSS.buttonsSelectors.watchlist);
    if (watchlistBtn) {
        watchlistBtn.addEventListener('click', (e) => {
            // Getting watchlist from server (only if it hasn't been rendered before)
            if (watchlistContainer.childElementCount === 0) {
                helper.getResource(config.urlPaths.watchlist)
                .then(data => {
                    if (data.empty) {
                        // Rendering info message
                        helper.renderInfo(data.empty, watchlistContainer);
                    } else {
                        // Creating movie cards and rendering them
                        data.forEach(item => {
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
                    // Get 'Remove from Watchlist' buttons
                    const removeFromWatchlistBtns = sectionWatchlist.querySelectorAll(config.CSS.buttonsSelectors.watchlistActions);
                    if (removeFromWatchlistBtns) {
                        // On click of these buttons
                        removeFromWatchlistBtns.forEach(button => {
                            button.addEventListener('click', (e) => {
                                // Remove from watchlist database
                                removeFromWatchlist(e.target);
                                // Remove from watchlist's page
                                removeMovieCardFromDOM(e.target);
                            });
                        });
                    }
                    // Get 'Mark as Watched' buttons
                    const markAsWatchedBtns = sectionWatchlist.querySelectorAll(config.CSS.buttonsSelectors.watchedActions);
                    if (markAsWatchedBtns) {
                        // On click of these buttons
                        markAsWatchedBtns.forEach(button => {
                            button.addEventListener('click', (e) => {
                                // Mark as watched
                                addToUserList(config.userLists.watched, e.target);
                                // Remove from watchlist's page
                                removeMovieCardFromDOM(e.target);
                            });
                        });   
                    }
                });
            }
            // Show watchlist and hide other section
            helper.show(sectionWatchlist);
            helper.hide(sectionWatched);
            helper.hide(sectionRated);
        });
    }


    // See list of watched movies
    const watchedBtn = document.querySelector(config.CSS.buttonsSelectors.watched);
    if (watchedBtn) {
        watchedBtn.addEventListener('click', () => {
            // Getting watchlist from server (only if it hasn't been rendered before)
            if (watchedContainer.childElementCount === 0) {
                helper.getResource(config.urlPaths.watched)
                .then(data => {
                    if (data.empty) {
                        // Rendering info message
                        helper.renderInfo(data.empty, watchedContainer);
                    } else {
                        // Creating movie cards and rendering them
                        data.forEach(item => {
                            // Setting type of title
                            let type = '';
                            if (item.type === "m") {
                                type = 'movie';
                            } else if (item.type === "s") {
                                type = "show";
                            }
                            let movie = new MovieCard(item.image, 'poster', item.title, item.year, item.details, item.imdb_id, type, watchedContainer);
                            movie.render("for_watched");
                        });
                    }
                });
            }
            // Show watched and hide other section
            helper.show(sectionWatched);
            helper.hide(sectionWatchlist);
            helper.hide(sectionRated);
        });
    }
});
/*
End of dynamic page scripts
*/


/* 
Class for movie card
 */
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
        let buttons;

        if (this.classes.length === 0) {
            this.classes = [config.CSS.bootstrapCardClasses.card, 'text-center', 'text-white', 'mt-5'];
            this.classes.forEach(className => movieCardElement.classList.add(className)); 
            //adding default class to the element in case they were not specified
        } else {
            this.classes.forEach(className => movieCardElement.classList.add(className)); 
            //adding specified classes to the element
        }

        if (condition === "for_result") {
            buttons = `
                <div class="d-flex flex-row justify-content-center mt-3">
                    <button title="Add to Watchlist" class="btn btn-outline-light btn-lg mx-2" type="button" data-id=${this.id} data-action="watchlist" data-type=${this.type}>&#43;</button>
                    <button title="Mark as Watched" class="btn btn-outline-light btn-lg mx-2" type="button" data-id=${this.id} data-action="watched" data-type=${this.type}>&#10003;</button>
                </div>
            `;
        } else if (condition === "for_watchlist") {
            buttons = `
                <div class="d-flex flex-row justify-content-center mt-3">
                    <button title="Remove from Watchlist" class="btn btn-light btn-lg mx-2" type="button" data-id=${this.id} data-action="watchlist" data-type=${this.type}>&#8722;</button>
                    <button title="Mark as Watched" class="btn btn-outline-light btn-lg mx-2" type="button" data-id=${this.id} data-action="watched" data-type=${this.type}>&#10003;</button>
                </div>
            `;
        } else if (condition === "for_watched") {
            buttons = `
                <div class="d-flex flex-row justify-content-center mt-3">
                    <button title="Rate This Title" class="btn btn-outline-light btn-lg mx-2" type="button" data-id=${this.id} data-action="rate" data-type=${this.type}>Rate</button>
                    <button title="Mark as Not Watched" class="btn btn-light btn-lg mx-2" type="button" data-id=${this.id} data-action="watched" data-type=${this.type}>&#10003;</button>
                </div>
            `;
        } else if (condition === "for_rated") {
            buttons = `
                <div class="d-flex flex-row justify-content-center mt-3">
                    <span class="rating">Rating: </span>
                    <button title="Change Rating" class="btn btn-outline-light btn-sm mx-2" type="button" data-id=${this.id} data-action="rate" data-type=${this.type}>Change Rating</button>
                </div>
            `;
        }

        movieCardElement.innerHTML = `
            <img src=${this.src} class="card-img-top" alt=${this.alt}>
            <div class="card-body">
                <h5 class="card-title">${this.title}</h5>
                <h6 class="card-subtitle mb-2">${this.year}</h6>
                <p class="card-text">${this.descr}</p>
                <button type="button" class="btn btn-outline-warning">
                    <a href="https://www.imdb.com/title/${this.id}/" target="_blank">Details on IMDb</a>
                </button>
                ${buttons}
            </div>
            `;
        
        this.parent.append(movieCardElement); // adding to DOM
    }
}
/*
End of class
*/


/*
Functions necessary for dynamic page scripts
*/

/* Function for Getting CSRF-token */
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


/* Function for handling and rendering recommended movie data
Parameters: data - for JS-object with data, 
detailsParameter - for data.key which contains details about movie's stars/crew, 
resultContainer - parent-element for rendering result in.
*/
const renderResult = (data, detailsParameter, resultContainer) => {
    if (data.error) {
        // Displaying error message
        helper.renderMessageAlert(data.error, config.CSS.bootstrapAlertTypes.danger);
    } else if (data.empty) {
        // If no recommendations, remove spinner and display information to user
        spinner.remove();
        helper.renderInfo(data.empty, resultContainer);
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


/* Function for getting data about a movie through its card and clicked button */
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
    title: title.textContent,
    year: year.textContent,
    image: image.src,
    details: details.textContent
    };
    // ... and returning JSON-data
    return JSON.stringify(movie_details);
}


/* Function for getting movie IMDb-id through clicked button */
function returnMovieID(button) {
    // Get movie IMDb id from DOM...
    const imdb_id = button.dataset.id;

    const movie_details = {
        imdb_id: imdb_id
    };
    // ... and return as JSON
    return JSON.stringify(movie_details);
}


/* Function to add clicked movie to specified user's list in database */
function addToUserList(list, button) {
    let url = '';
    // Get movie details from attrs of a button
    const data = returnMovieDetails(button);

    // Set url for POST-request
    if (list === config.userLists.watchlist) {
        url = config.urlPaths.addToWatchlist;
    } else if (list === config.userLists.watched) {
        url = config.urlPaths.markAsWatched;
    }
    
    // Make POST-request to add movie/show to movie database of the app and to watchlist
    helper.postData(url, data, config.backend.csrftoken)
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
}


/* Function to remove clicked title from watchlist database */
function removeFromWatchlist(button) {
    // Get movie IMDb id...
    const data = returnMovieID(button);

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
    });
}


/* Function to remove movie card from a page (DOM) */
function removeMovieCardFromDOM(button) {
    // Identifying movie card by a clicked button
    let movieCard = button.parentElement.parentElement.parentElement;
    helper.removeWithAnimation(movieCard, config.CSS.animationNames.disappear);
}

/*
End of functions
*/