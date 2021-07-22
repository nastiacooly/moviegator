document.addEventListener('DOMContentLoaded', () => {
    // Variables for app sections
    const sectionWelcome = document.querySelector('#section-welcome'),
        sectionStart = document.querySelector('#section-start'),
        sectionMoodGenre = document.querySelector('#section-mood-genre');


    // Navbar hide/show on hover TODO
    const navbar = document.querySelector('.navbar');


    // Click 'Start' btn to enter start section
    const startBtn = document.querySelector('button[data-action="start"]');
    if (startBtn) {
        startBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Hiding current section and showing next section
            hideWithAnimation(sectionWelcome);
            show(sectionStart);
        });
    }

    // Start choice (Movie or TV Show)
    const firstChoiceButtons = sectionStart.querySelectorAll('button');
    if (firstChoiceButtons) {
        firstChoiceButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Disabling not clicked button
                if (button === firstChoiceButtons[1]) {
                    firstChoiceButtons[2].setAttribute('disabled', True);
                    button.removeAttribute('disabled');
                } else if (button === firstChoiceButtons[2]) {
                    firstChoiceButtons[1].setAttribute('disabled', True);
                    button.removeAttribute('disabled');
                }
                // Storing user's choice to variable
                movieOrShowChoice = e.target.dataset.type;
                console.log(movieOrShowChoice);
                // Hiding current section and showing next section
                hideWithAnimation(sectionStart);
                show(sectionMoodGenre);
            });
        });
    }

    // Mood or genre choice TODO

});


// Variables to access globally

let movieOrShowChoice = '';


// Helper functions

function hide(element) {
    element.style.display = 'none';
}

function show(element) {
    element.style.display = 'block';
}

function hideWithAnimation(element) {
    element.style.animationPlayState = 'running';
    element.addEventListener('animationend', () => {
        hide(element);
    });
}
