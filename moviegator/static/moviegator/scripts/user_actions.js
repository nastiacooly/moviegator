// importing my helper functions
import * as helper from "./_helper.js";


// Getting CSRF-token
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
const csrftoken = getCookie('csrftoken');

// Variables
const sectionResult = document.querySelector("#section-result"),
    resultContainer = sectionResult.querySelector('div.result-container');

// Add to watchlist APPLY MUTATION OBSERVER LATER
if (sectionResult && sectionResult.dataset.status === "loaded") {
    // When result is visible and loaded
    const addToWatchlistBtn = sectionResult.querySelector('button[data-action="watchlist"]');
    if (addToWatchlistBtn) {
        addToWatchlistBtn.addEventListener('click', (e) => {
            // Saving movie/show details from DOM-elements...
            const image = document.querySelector('.card-img-top'),
                title = document.querySelector('.card-title'),
                year = document.querySelector('.card-subtitle'),
                details = document.querySelector('.card-text'),
                imdb_id = e.target.dataset.id,
                type = e.target.dataset.type[0];
                
            const movie_details = {
                imdb_id: imdb_id,
                type: type,
                title: title.innerHTML,
                year: year.innerHTML,
                image: image.src,
                details: details.innerHTML
            };
            // ... and convert to JSON
            const data = JSON.stringify(movie_details);
            
            // Making POST-request to add movie/show to movie database of the app and to watchlist
            helper.postData('/add_to_watchlist', data, csrftoken)
            .then(data => {
                if (data.error) {
                    // Render error message
                    helper.renderMessageAlert(data.error, 'danger');
                    // Remove error mssg after some time
                    setTimeout(helper.removeMessageAlert, 5000);
                } else if (data.message) {
                    // Remove previous messages if any
                    helper.removeMessageAlert();
                    // Showing successful result message
                    helper.renderMessageAlert(data.message, 'success');
                    // Remove success mssg after some time
                    setTimeout(helper.removeMessageAlert, 3000);
                }
            });
        });
    }
}


// Remove from Watchlist
const userSection = document.querySelector("#section-user");
if (userSection) {
    const removeFromWatchlistBtns = userSection.querySelectorAll('button[data-action="watchlist"]');
    if (removeFromWatchlistBtns) {
        removeFromWatchlistBtns.forEach(button => {
            button.addEventListener('click', (e) => {
                // Getting movie IMDb id...
                const imdb_id = e.target.dataset.id;

                const movie_details = {
                    imdb_id: imdb_id
                };
                // ... and convert to JSON
                const data = JSON.stringify(movie_details);

                // Making POST-request to remove movie/show from user's watchlist
                helper.postData('/remove_from_watchlist', data, csrftoken)
                .then(data => {
                    if (data.error) {
                        // Render error message
                        helper.renderMessageAlert(data.error, 'danger');
                        // Remove error mssg after some time
                        setTimeout(helper.removeMessageAlert, 5000);
                    } else if (data.message) {
                        // Remove previous messages if any
                        helper.removeMessageAlert();
                        // Showing successful result message
                        helper.renderMessageAlert(data.message, 'success');
                        // Remove success mssg after some time
                        setTimeout(helper.removeMessageAlert, 3000);
                    }
                })
                .then(() => {
                    // Remove movie card from watchlist page (from DOM)
                    let movieCard = e.target.parentElement.parentElement.parentElement;
                    helper.removeWithAnimation(movieCard, 'disappear');
                });
            });
        });
    }
}

