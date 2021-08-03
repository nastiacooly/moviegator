// Helper functions

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

// Renders error alert messages
export function renderMessageAlert(message, type) {
    const messageView = document.querySelector('#message');
    messageView.style.display = 'block';
    const errorElement = document.createElement('div');

    errorElement.classList.add("alert", `alert-${type}`);
    errorElement.role = "alert";
    errorElement.innerHTML = message;
    messageView.appendChild(errorElement);
}

// Removes error alerts
export function removeMessageAlert() {
    const messageView = document.querySelector('#message');
    messageView.style.display = 'none';
}


// Rendering spinner animated img on loadng data inside a specified parent element
export function renderSpinner(parent) {
    const spinner = document.createElement('img');
    spinner.src = '/static/moviegator/img/spinner.svg';
    spinner.style.cssText = `
        display: block;
        padding-top: 10px;
        margin: 0 auto;
    `;
    parent.appendChild(spinner);
    return spinner;
}


// Function to make GET-requests
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


// Function to make POST-requests
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


// Function to add script to a page
export function append_script(src) {
    let script = document.createElement('script');
    script.src = src;
    script.type = 'module';
    document.body.append(script);
}