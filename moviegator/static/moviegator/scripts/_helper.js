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


// Function to make GET-requests
const getResource = async (url) => {
    const result = await fetch(url);

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
            'Content-type': 'application/json'
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