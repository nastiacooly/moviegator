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
            modal: 'ratingModal'
        },
        containerClasses: {
            watchlist: 'watchlist-container',
            watched: 'watched-container',
            result: 'result-container',
            modal: 'modal-container',
            choices: 'choices-container'
        },
        buttonsAttributes: {
            action: 'data-action',
            random: 'data-random',
            type: 'data-type',
            base: 'data-base',
            genre: 'data-genre',
            profile: 'data-profile',
            modal: 'data-modal',
            starRating: 'data-rating'
        },
        buttonsAttrValues: {
            actionStart: 'start',
            actionWatchlist: 'watchlist',
            actionWatched: 'watched',
            actionMore: 'more',
            actionRate: 'rate',
            baseMood: 'mood',
            baseGenre: 'genre',
            profileWatchlist: 'watchlist',
            profileWatched: 'watched',
            modalClose: 'close',
            modalSave: 'save'
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
        arrowDown: '&#8595;',
        plus: '&#43;',
        check: '&#10003;',
        minus: '&#8722;',
        star: '&#9733;'
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
        markAsWatched: '/mark_as_watched',
        markAsNotWatched: '/mark_as_not_watched',
        saveRating: '/save_rating'
    },
    userLists: {
        watchlist: 'watchlist',
        watched: 'watched'
    }
};
/*
End of configuration
*/


/* 
Dynamic page scripts 
*/
document.addEventListener('DOMContentLoaded', () => {
    // Variables for static sections/containers of the app
    const sectionWelcome = document.querySelector(`#${config.CSS.sectionIDs.welcome}`),
        sectionStart = document.querySelector(`#${config.CSS.sectionIDs.start}`),
        sectionMoodGenre = document.querySelector(`#${config.CSS.sectionIDs.moodOrGenre}`),
        sectionMood = document.querySelector(`#${config.CSS.sectionIDs.mood}`),
        sectionGenre = document.querySelector(`#${config.CSS.sectionIDs.genre}`),
        choicesContainers = document.querySelectorAll(`.${config.CSS.containerClasses.choices}`),
        sectionResult = document.querySelector(`#${config.CSS.sectionIDs.result}`),
        resultContainer = document.querySelector(`.${config.CSS.containerClasses.result}`),
        sectionUser = document.querySelector(`#${config.CSS.sectionIDs.profile}`),
        sectionWatchlist = document.querySelector(`#${config.CSS.sectionIDs.watchlist}`),
        sectionWatched = document.querySelector(`#${config.CSS.sectionIDs.watched}`),
        watchlistContainer = document.querySelector(`.${config.CSS.containerClasses.watchlist}`),
        watchedContainer = document.querySelector(`.${config.CSS.containerClasses.watched}`),
        ratingModal = document.getElementById(config.CSS.sectionIDs.modal);


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


    // Welcome section
    if (sectionWelcome) {
        sectionWelcome.addEventListener('click', (e) => {
            // Clicking 'start' button
            if (e.target.getAttribute(config.CSS.buttonsAttributes.action) === config.CSS.buttonsAttrValues.actionStart) {
                // Hiding current section and showing next section
                helper.hideWithAnimation(sectionWelcome, config.CSS.animationNames.slideToTop);
                helper.show(sectionStart);
            }
        });
    }


    // Start section
    if (sectionStart) {
        sectionStart.addEventListener('click', (e) => {
            // Movie or TV Show choice
            if (e.target.hasAttribute(config.CSS.buttonsAttributes.type)) {
                // Disabling not clicked button
                e.target.closest(`button[${config.CSS.buttonsAttributes.type}]`).setAttribute('disabled', true);
                e.target.removeAttribute('disabled');
                // Storing user's choice to variable
                userChoices.movieOrShow = e.target.dataset.type;
                // Hiding current section's content and showing next section's content
                helper.hideWithAnimation(sectionStart, config.CSS.animationNames.disappear);
                helper.showWithAnimation(sectionMoodGenre, config.CSS.animationNames.appear);
            }
            
            // Random type choice
            if (e.target.hasAttribute(config.CSS.buttonsAttributes.random)) {
                // Saving user's choice
                userChoices.randomType = e.target.dataset.random;
                if (userChoices.randomType === 'top-shows') {
                    userChoices.movieOrShow = 'show';
                } else {
                    userChoices.movieOrShow = 'movie';
                }
                // Hiding current section
                helper.hideWithAnimation(sectionStart, config.CSS.animationNames.slideToTop);
                // Showing result section
                helper.show(sectionResult);
                // Showing spinner while JSON loads
                spinner = helper.renderSpinner(resultContainer);
                // Getting random movie from requested category
                helper.getResource(`${config.urlPaths.getMovieData}/${userChoices.randomType}`)
                .then(data => {
                    if (userChoices.randomType === 'trend') {
                        renderResult(data, data.stars, resultContainer);
                    } else {
                    renderResult(data, data.crew, resultContainer);
                    }
                });
            }
        });
    }


    // Mood or genre base choice section
    if (sectionMoodGenre) {
        sectionMoodGenre.addEventListener('click', (e) => {
            if (e.target.hasAttribute(config.CSS.buttonsAttributes.base)) {
                // Hiding current section
                helper.hideWithAnimation(sectionMoodGenre, config.CSS.animationNames.disappear);
                if (e.target.getAttribute(config.CSS.buttonsAttributes.base) === config.CSS.buttonsAttrValues.baseMood) {
                    // Showing next section (mood)
                    helper.showWithAnimation(sectionMood, config.CSS.animationNames.appear);
                }
                if (e.target.getAttribute(config.CSS.buttonsAttributes.base) === config.CSS.buttonsAttrValues.baseGenre) {
                    // Showing next section (genre)
                    helper.showWithAnimation(sectionGenre, config.CSS.animationNames.appear);
                }
            }
        });
    }


    // Genre choice section (based on mood or genre itself)
    if (sectionMood || sectionGenre) {
        choicesContainers.forEach(container => {
            container.addEventListener('click', (e) => {
                // Clicking on a mood or a genre
                if (e.target.hasAttribute(config.CSS.buttonsAttributes.genre)) {
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
                }
            });
        });
    }


    // Result section with recommendation
    if (sectionResult) {
        sectionResult.addEventListener('click', (e) => {
            // Add to watchlist button handler
            if (e.target.getAttribute(config.CSS.buttonsAttributes.action) === config.CSS.buttonsAttrValues.actionWatchlist) {
                addToUserList(config.userLists.watchlist, e.target);
            }
            // 'Mark as Watched' button handler
            if (e.target.getAttribute(config.CSS.buttonsAttributes.action) === config.CSS.buttonsAttrValues.actionWatched) {
                addToUserList(config.userLists.watched, e.target);
            }
            // 'More results' button handler
            if (e.target.getAttribute(config.CSS.buttonsAttributes.action) === config.CSS.buttonsAttrValues.actionMore) {
                // Remove previous result element
                const previousResult = sectionResult.querySelector(`div.${config.CSS.bootstrapCardClasses.card}`);
                previousResult.remove();
                // Fetching for another random movie and rendering its card
                if (userChoices.randomType) {
                    // If user chose "random buttons" in start section
                    helper.getResource(`${config.urlPaths.getMovieData}/${userChoices.randomType}`)
                    .then(data => {
                        if (userChoices.randomType === "trend") {
                            renderResult(data, data.stars, resultContainer);
                        } else {
                        renderResult(data, data.crew, resultContainer);
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
            }
        });
    }


    // Profile section
    if (sectionUser) {
        // Variables necessary for this section
        let page_counter_watchlist = 1;
        let page_counter_watched = 1;
        let watchlistEnded = false;
        let watchedEnded = false;
        const scrollArrow = sectionUser.querySelector('.scroll-arrow');

        sectionUser.addEventListener('click', (e) => {
            // Open Watchlist
            if (e.target.getAttribute(config.CSS.buttonsAttributes.profile) === config.CSS.buttonsAttrValues.profileWatchlist) {
                // Getting watchlist from server (only if it hasn't been rendered before)
                if (watchlistContainer.childElementCount === 0) {
                    helper.getResource(`${config.urlPaths.watchlist}/${page_counter_watchlist}`)
                    .then(data => {
                        page_counter_watchlist++;
                        renderMovieCards(data, config.userLists.watchlist, watchlistContainer);
                    });
                }
                // Show watchlist and hide other section
                helper.show(sectionWatchlist);
                helper.hide(sectionWatched);
            }

            // Open Watched
            if (e.target.getAttribute(config.CSS.buttonsAttributes.profile) === config.CSS.buttonsAttrValues.profileWatched) {
                // Getting watched list from server (only if it hasn't been rendered before)
                if (watchedContainer.childElementCount === 0) {
                    helper.getResource(`${config.urlPaths.watched}/${page_counter_watched}`)
                    .then(data => {
                        page_counter_watched++;
                        renderMovieCards(data, config.userLists.watched, watchedContainer);
                        
                    });
                }
                // Show watched and hide other section
                helper.show(sectionWatched);
                helper.hide(sectionWatchlist);
            }

            // Scroll to top on click of an arrow
            if (e.target === scrollArrow) {
                window.scrollTo({
                    top: 0, 
                    behaviour: "smooth"
                });
                helper.hide(scrollArrow);
            }
        });

        // Infinite scroll for watchlist and watched
        window.addEventListener('scroll', function(e) {
            // While server returns objects from watchlist and user scrolls to the end of a page
            if (!watchlistEnded && (window.pageYOffset + window.innerHeight) >= sectionUser.scrollHeight) {
                // And watchlist is visible
                if (e.target.getElementById(config.CSS.sectionIDs.watchlist).classList.contains('show')) {
                    setTimeout(function() {
                        // Try to get more movie cards
                        helper.getResource(`${config.urlPaths.watchlist}/${page_counter_watchlist}`)
                        .then(data => {
                            // Render spinner to display loading process for user
                            spinner = helper.renderSpinner(watchlistContainer);
                            // update page counter
                            page_counter_watchlist++;
                            // And after 2s remove spinner and render additional movie cards
                            setTimeout(function() {
                                spinner.remove();
                                renderMovieCards(data, config.userLists.watchlist, watchlistContainer);
                            }, 2000);
                        })
                        // Server returns 404 - watchlist has ended
                        .catch(error => {watchlistEnded = true;});
                    }, 1000);
                }
            }

            // While server returns objects from watched list and user scrolls to the end of a page
            if (!watchedEnded && (window.pageYOffset + window.innerHeight) >= sectionUser.scrollHeight) {
                // And watched list is visible
                if (e.target.getElementById(config.CSS.sectionIDs.watched).classList.contains('show')) {
                    setTimeout(function() {
                        // Try to get more movie cards
                        helper.getResource(`${config.urlPaths.watched}/${page_counter_watched}`)
                        .then(data => {
                            // Render spinner to display loading process for user
                            spinner = helper.renderSpinner(watchedContainer);
                            // update page counter
                            page_counter_watched++;
                            // And after 2s remove spinner and render additional movie cards
                            setTimeout(function() {
                                spinner.remove();
                                renderMovieCards(data, config.userLists.watched, watchedContainer);
                            }, 2000);
                        })
                        // Server returns 404 - watched list has ended
                        .catch(error => {watchedEnded = true;});
                    }, 2000);
                }
            }

            // Show arrow for scrolling back to top
            if (window.pageYOffset >= (window.innerHeight * 0.5)) {
                helper.show(scrollArrow);
            } else {
                helper.hide(scrollArrow);
            }
        });
    }


    // Watchlist section
    if (sectionUser) {
        watchlistContainer.addEventListener('click', (e) => {
            // 'Remove from watchlist' buttons handler
            if (e.target.getAttribute(config.CSS.buttonsAttributes.action) === config.CSS.buttonsAttrValues.actionWatchlist) {
                // Remove from watchlist database
                removeFromUserList(config.userLists.watchlist, e.target);
                // Remove from watchlist's page
                removeMovieCardFromDOM(e.target);
            }
            // 'Mark as Watched' buttons handler
            if (e.target.getAttribute(config.CSS.buttonsAttributes.action) === config.CSS.buttonsAttrValues.actionWatched) {
                // Mark as watched in database
                addToUserList(config.userLists.watched, e.target);
                // Remove from watchlist's page
                removeMovieCardFromDOM(e.target);
            }
        });
    }


    // Watched section
    if (sectionUser) {
        // Variables necessary for this section
        let rating, movieID, newRating;
        const stars = [...ratingModal.querySelector('.rating_modal-rate').children];

        watchedContainer.addEventListener('click', (e) => {
            // 'Mark as Not Watched' buttons handler
            if (e.target.getAttribute(config.CSS.buttonsAttributes.action) === config.CSS.buttonsAttrValues.actionWatched) {
                // Mark as not watched in the database
                removeFromUserList(config.userLists.watched, e.target);
                // Remove from 'watched' page
                removeMovieCardFromDOM(e.target);
            }
            // Rating buttons handler (open modal to rate a movie)
            if (e.target.getAttribute(config.CSS.buttonsAttributes.action) === config.CSS.buttonsAttrValues.actionRate) {
                // Get movie details from button
                let title = e.target.getAttribute('data-title');
                rating = e.target.getAttribute('data-rating');
                movieID = e.target.getAttribute('data-id');
                // Change modal header according to movie title
                let modalTitle = ratingModal.querySelector('.rating_modal-title');
                modalTitle.textContent = `Rate "${title}"`;
                // Color stars according to current user's rating of a movie
                colorUserRating(stars, rating);
                // Prevent page from scrolling with modal open
                document.body.classList.add('modal-open');
                // Show modal
                helper.show(ratingModal.closest(`div.${config.CSS.containerClasses.modal}`));
            }
        });

        ratingModal.addEventListener('click', (e) => {
            // 'Save rating' button handler
            if (e.target.getAttribute(config.CSS.buttonsAttributes.modal) === config.CSS.buttonsAttrValues.modalSave) {
                // Save rating to database
                saveRating(newRating, movieID);
                setTimeout(() => {
                    // Enable page scrolling
                    document.body.classList.remove('modal-open');
                    // Hide modal
                    helper.hide(ratingModal.closest(`div.${config.CSS.containerClasses.modal}`));
                    // Change rating on a page
                    watchedContainer.querySelector(`span.rating[data-id="${movieID}"]`).innerHTML = `
                        Rating: ${config.HTMLSymbols.star.repeat(parseInt(newRating))}
                    `;
                }, 1000);
            }
            // 'Cancel' button handler
            if (e.target.getAttribute(config.CSS.buttonsAttributes.modal) === config.CSS.buttonsAttrValues.modalClose) {
                // Enable page scrolling
                document.body.classList.remove('modal-open');
                // Hide modal
                helper.hide(ratingModal.closest(`div.${config.CSS.containerClasses.modal}`));
            }
        });

        ratingModal.addEventListener('mouseover', (e) => {
            if (e.target.hasAttribute(config.CSS.buttonsAttributes.starRating)) {
                // Color rating stars as user hovers mouse over and keep track of chosen rating
                newRating = colorChosenStars(e.target);
            }
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
    constructor(src, alt, title, year, descr, id, type, rating, parentElement, ...classes) {
        this.src = src;
        this.alt = alt;
        this.title = title;
        this.year = year;
        this.descr = descr;
        this.id = id;
        this.type = type;
        this.rating = parseInt(rating);
        this.classes = classes;
        this.parent = parentElement;
        
    }

    render(condition="for_result") {
        const movieCardElement = document.createElement('div');
        let buttons;

        if (this.classes.length === 0) {
            this.classes = [config.CSS.bootstrapCardClasses.card, 'text-center', 'text-white', 'mt-5'];
            this.classes.forEach(className => movieCardElement.classList.add(className)); 
            //adding default classes to the element in case they were not specified
        } else {
            this.classes.forEach(className => movieCardElement.classList.add(className)); 
            //adding specified classes to the element
        }

        if (condition === "for_result") {
            buttons = `
                <div class="d-flex flex-row justify-content-center mt-3">
                    <button title="Add to Watchlist" class="btn btn-outline-light btn-lg mx-2" type="button" data-id=${this.id} data-action="watchlist" data-type=${this.type}>${config.HTMLSymbols.plus}</button>
                    <button title="Mark as Watched" class="btn btn-outline-light btn-lg mx-2" type="button" data-id=${this.id} data-action="watched" data-type=${this.type}>${config.HTMLSymbols.check}</button>
                </div>
            `;
        } else if (condition === "for_watchlist") {
            buttons = `
                <div class="d-flex flex-row justify-content-center mt-3">
                    <button title="Remove from Watchlist" class="btn btn-light btn-lg mx-2" type="button" data-id=${this.id} data-action="watchlist" data-type=${this.type}>${config.HTMLSymbols.minus}</button>
                    <button title="Mark as Watched" class="btn btn-outline-light btn-lg mx-2" type="button" data-id=${this.id} data-action="watched" data-type=${this.type}>${config.HTMLSymbols.check}</button>
                </div>
            `;
        } else if (condition === "for_watched") {
            buttons = `
                <div class="d-flex flex-column mt-3">
                    <span class="rating" data-id=${this.id}>Rating: 
                    ${this.rating === 0 ? 'not rated' : config.HTMLSymbols.star.repeat(this.rating)} 
                    </span>
                    <div class="d-flex flex-row justify-content-center mt-3">
                        <button title="Change Rating" class="btn btn-outline-light btn-lg mx-2" type="button" data-title="${this.title}" data-rating=${this.rating} data-id=${this.id} data-action="rate" data-type=${this.type}>${config.HTMLSymbols.star}</button>
                        <button title="Mark as Not Watched" class="btn btn-light btn-lg mx-2" type="button" data-id=${this.id} data-action="watched" data-type=${this.type}>${config.HTMLSymbols.check}</button>
                    </div>
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
        let result = new MovieCard(data.image, 'poster', data.title, data.year, detailsParameter, data.id, userChoices.movieOrShow, '0', resultContainer);
        result.render();
    }
};


/* 
 * Function to render movie cards from user's lists.
 * Parameters: data - for JS-object with data,
 * list - for profile's section where cards will be rendered,
 * container - parent-element for rendering in.
*/
const renderMovieCards = (data, list, container) => {
    if (data.empty) {
        // Rendering info message
        helper.renderInfo(data.empty, container);
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
            // Creating card
            let movie = new MovieCard(item.image, 'poster', item.title, item.year, item.details, item.imdb_id, type, item.rating, container);
            // Render depending on specified list
            if (list === config.userLists.watchlist) {
                movie.render("for_watchlist");
            } else if (list === config.userLists.watched) {
                movie.render("for_watched");
            }
        });
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


/* Function for getting movie IMDb-id from clicked button */
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


/* Function to remove clicked title from specified user's list in database */
function removeFromUserList(list, button) {
    let url = '';
    // Get movie IMDb id...
    const data = returnMovieID(button);

    // Set url for POST-request
    if (list === config.userLists.watchlist) {
        url = config.urlPaths.removeFromWatchlist;
    } else if (list === config.userLists.watched) {
        url = config.urlPaths.markAsNotWatched;
    }

    // Make POST-request to remove movie/show from user's watchlist
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


/* Function to save user's movie rating to database */
function saveRating(rating, movieID) {
    let url = config.urlPaths.saveRating;

    const movie_details = {
        rating: rating,
        imdb_id: movieID
    };

    const data = JSON.stringify(movie_details);
    
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


/* Function to remove movie card from a page (DOM) */
function removeMovieCardFromDOM(button) {
    // Identifying movie card by a clicked button
    let movieCard = button.closest(`div.${config.CSS.bootstrapCardClasses.card}`);
    helper.removeWithAnimation(movieCard, config.CSS.animationNames.disappear);
}


/* Colors stars according to user's rating given to a movie */
function colorUserRating(stars, rating) {
    stars.forEach(star => {
        if (rating >= parseInt(star.getAttribute('data-rating'))) {
            star.classList.remove('unchecked');
            star.classList.add('checked');
        } else {
            star.classList.add('unchecked');
            star.classList.remove('checked');
        }
    });
}


/* Colors chosen star and its previous siblings
 * and returns chosen rating (as a String)
 */
function colorChosenStars(currentStar) {
    currentStar.classList.remove('unchecked');
    currentStar.classList.add('checked');
    let previousStar = currentStar.previousElementSibling;
    let nextStar = currentStar.nextElementSibling;
    while (previousStar) {
        previousStar.classList.remove('unchecked');
        previousStar.classList.add('checked');
        previousStar = previousStar.previousElementSibling;
    }
    while (nextStar) {
        nextStar.classList.remove('checked');
        nextStar.classList.add('unchecked');
        nextStar = nextStar.nextElementSibling;
    }
    return currentStar.getAttribute('data-rating');
}

/*
End of functions
*/