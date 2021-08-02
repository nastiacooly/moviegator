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


const sectionResult = document.querySelector("#section-result");
console.log(sectionResult);
// Add to watchlist
if (sectionResult.style.display === 'block' && sectionResult.dataset.status === "loaded") {
    // When result is visible and loaded
    const addToWatchlistBtn = sectionResult.querySelector('button[data-action="watchlist"]');
    if (addToWatchlistBtn) {
        addToWatchlistBtn.addEventListener('click', (e) => {
            // Saving movie/show details
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
            const data = JSON.stringify(movie_details);
            
            // Making POST-request to add movie/show to watchlist
            helper.postData('/add_to_watchlist', data, csrftoken)
            .then(data => {
                if (data.error) {
                    // Render error message
                    helper.renderMessageAlert(data.error, 'danger');
                } else if (data.message) {
                    // Remove previous messages if any
                    helper.removeMessageAlert();
                    // Showing successful result message
                    helper.renderMessageAlert(data.message, 'success');
                    // Add 'check' symbol to button
                    e.target.TextContent = "&#1004;";
                    // Remove success mssg after some time
                    setTimeout(helper.removeMessageAlert, 3000);
                }
            });
        });
    }
}
