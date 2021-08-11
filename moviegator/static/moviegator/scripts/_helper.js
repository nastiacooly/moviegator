/*
This is the configuration for the helper functions script.
Do not change anything here unless something has changed 
in HTML-structure or CSS.
*/

const configuration = {
    CSS: {
        IDs: {
            messageView: 'message'
        },
        classes: {
            info: 'info',
            marginTop5: 'mt-5',
            spinner: 'spinner'
        }
    },
    staticFilesSrc: {
        spinnerSVG: '/static/moviegator/img/spinner.svg'
    }
};


/*
End of configuration
*/


/*
Helper functions
*/

// Functions for hiding/showing elements
export function hide(element) {
    element.style.display = 'none';
}

export function show(element) {
    element.style.display = 'block';
}

export function hideWithAnimation(element, animationName) {
    element.style.animation = `${animationName} 1s linear 0s 1 normal forwards`;
    element.addEventListener('animationend', () => {
        hide(element);
    });
}

export function showWithAnimation(element, animationName) {
    show(element);
    element.style.animation = `${animationName} 2s linear 0s 1 normal forwards`;
}

export function removeWithAnimation(element, animationName) {
    element.style.animation = `${animationName} 1s linear 0s 1 normal forwards`;
    element.addEventListener('animationend', () => {
        element.remove();
    });
}

// Renders alert messages
export function renderMessageAlert(message, type) {
    const messageView = document.querySelector(`#${configuration.CSS.IDs.messageView}`);
    messageView.className = `alert alert-${type}`;
    messageView.role = "alert";
    messageView.innerHTML = message;
    messageView.style.display = 'block';
}

// Removes alerts
export function removeMessageAlert() {
    const messageView = document.querySelector(`#${configuration.CSS.IDs.messageView}`);
    messageView.style.display = 'none';
}


// Render info paragraph (if none) inside parent 
export function renderInfoHeader(text, parent) {
    if (!parent.querySelector(`p.${configuration.CSS.classes.info}`)) {
        const info = document.createElement('p');
        info.classList.add(configuration.CSS.classes.info, configuration.CSS.classes.marginTop5);
        info.textContent = text;
        parent.append(info);
    }
}


// Rendering spinner animated img on loadng data inside a specified parent element
export function renderSpinner(parent) {
    const spinner = document.createElement('img');
    spinner.src = configuration.staticFilesSrc.spinnerSVG;
    spinner.classList.add(configuration.CSS.classes.spinner);
    parent.appendChild(spinner);
    return spinner;
}


// Function to make GET-requests which return JSON-data
export const getResource = async (url) => {
    const result = await fetch(url, {
        headers: {
            // For Django is_ajax() method to work
            "X-Requested-With": "XMLHttpRequest"
        },
    });

    if(!result.ok) { // in case the request was unsuccessful
        throw new Error(`Could not get resources from ${url}, status: ${result.status}`);
    }

    return await result.json();
};


// Function to make POST-requests which return JSON-data
export const postData = async (url, data, csrftoken) => {
    const result = await fetch(url, {
        method: 'POST',
        headers: {
            // For Django is_ajax() method to work
            "X-Requested-With": "XMLHttpRequest",
            // Securing POST-request
            'X-CSRFToken': csrftoken
        },
        body: data
    });

    return await result.json();
};