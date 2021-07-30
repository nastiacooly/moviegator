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
export function renderErrorAlert(message) {
    const messageView = document.querySelector('#message');
    messageView.style.display = 'block';
    const errorElement = document.createElement('div');

    errorElement.classList.add("alert", "alert-danger");
    errorElement.role = "alert";
    errorElement.innerHTML = message;
    messageView.appendChild(errorElement);
}

// Removes error alerts
export function removeErrorAlert() {
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


// Function to make POST-requests
const postData = async (url, data) => {
    const result = await fetch(url, {
        method: 'POST',
        headers: {
            // For Django is_ajax() method to work
            "X-Requested-With": "XMLHttpRequest"
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