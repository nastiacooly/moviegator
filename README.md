# Moviegator
## A web-app which randomly recommends movies / TV shows based on your genre preference or mood.

#### Video Demo: not currently available.


#### 1. What is it?
  
Moviegator is my final project for CS50w: Web-Programming with Python and Javascript.

Moviegator is a web-application built on Django Framework and vanilla Javascript with help of imdb-api.com (third-party API).

Developed in 2021 by Anastasia Maryina ([@nastiacooly](https://github.com/nastiacooly)).


#### 2. What can it do?
  
Moviegator provides the following features:

1. To non-registered users:
    - Registering your new account;
    - Getting random movie / TV show recommendation based on chosen mood, genre or category;
    - See recommended movie / TV show details on IMDb website by one click;
    - Searching for movie / TV show YouTube trailer and watching it right on the web-app page.

2. To registered users:
    - Logging in and out of your account;
    - All of the above-mentioned features provided for non-registered users;
    - Opening your profile page with watchlist and 'watched' list;
    - Adding movie / TV show to your watchlist / Removing title from watchlist;
    - Marking movie / TV show as already watched / Marking title as not watched;
    - Giving 1-to-5-star rating to watched movies / TV shows and changing rating;
    - Seeing IMDb details for each title in user's lists by one click;
    - Moviegator will not recommend a movie or show if it has already been added to watchlist or marked as watched by signed user.


#### 3. Which technologies were used to develop this app?

  - Frontend: HTML5, CSS3/Scss (+ Bootstrap), vanilla Javascript;
  - Backend: Django Framework (Python);
  - API: [imdb-api.com](https://imdb-api.com) (third-party API).


#### 4. Distinctiveness and Complexity

1. Moviegator is sufficiently distinct from the other projects in CS50w course as:

    - it is not a simple static page with search function;
    - it is not a wiki;
    - it is not an auction / e-commerce site;
    - it is not a mail page;
    - it is not a social network.

Moviegator is an app which recommends movies / TV shows and provides features 
for adding such titles to watchlist or mark them as watched, rate titles and watch their trailers.

2. Moviegator is more complex than the other projects in CS50w course as:

    - Moviegator works with the third-party API to get data about movies / TV shows. 
        To secure API calls and private API key, I applied the following scheme:
        - JS-script (frontend) fetches certain URL of the app;
        - Then, backend makes sure that the request was made by AJAX 
        and makes necessary API-call by retrieving private API key from the environment variable;
        - When backend receives response from API, it returns JSON data;
        - JS-script receives JSON-response from backend, processes it and renders necessary content for user.
    
    These scheme is useful as API URLs and private key are not shown in browsers' dev tools console or URL bar.

    - Moviegator is designed mostly as a dynamic SPA meaning that all the contents of the pages are asynchronously loaded/changed by frontend script. All of the HTML-templates of the app does not initially contain any movies / TV shows data or data from user's lists. And the sections of the main page are dynamically switching depending on user's actions. 
    All of this was achieved with help of AJAX.

    - Moviegator applies infinite scroll for watchlist and 'watched' list, so the user should not click 'next' or 'previous' page buttons to see all the contents - user can just scroll to the end of the page and the content will be loaded and rendered.
    While loading additional data, app shows loading spinner, so the user is aware that something is currently loading.

    - All of the POST-requests made by JS-script (frontend) are secured with CSRF-token.

    - Moviegator's backend is always checking that important requests to the app are AJAX only.

    - The app throws RuntimeError (so it is not running) when private API key is not set as environment variable.

3. Moviegator is mobile-responsive both for portrait and landscape orientations.


#### 5. What are all these files in this repository?

The organization of folders and files is mostly the default organization provided by Django.

["Final" folder](final/) is the main folder of the app which provides main settings, main url routes and etc. (all standard here).

["Moviegator" folder](moviegator/) is responsible for the main app, i.e. all the actions users can make on Moviegator page:
- ['migrations' folder](moviegator/migrations) - model migrations of the app;
- ['templates/moviegator' folder](moviegator/templates/moviegator) - all the HTML-templates of the app including layout;
- ['models.py'](moviegator/models.py) - database models for the app. It includes two models: 1) for movie / show details 2) for user actions (lists and ratings);
- ['urls.py'](moviegator/urls.py) - routing settings for the app;
- ['views.py'](moviegator/views.py) - view functions of the app (which also contains settings for importing environment variables and API requests construction);
- ['static/moviegator' folder](moviegator/static/moviegator) - contains all static files for the app:
    - ['scss' folder](moviegator/static/moviegator/scss) - styles written with SCSS pre-processor divided by categories for animations, media queries, mixins, variables and general styles;
    - ['css' folder](moviegator/static/moviegator/css) - compilated 'styles.min.css' and 'styles.min.css.map' files from SCSS files;
    -  ['img' folder](moviegator/static/moviegator/img) - contains svg for loading spinner;
    - ['scripts' folder](moviegator/static/moviegator/scripts) - JS-scripts for the frontend of the app (["_helper.js"](moviegator/static/moviegator/scripts/_helper.js) contains helper functions which are exported to the main script, ["moviegator.js"](moviegator/static/moviegator/scripts/moviegator.js) - the main script of the app).

["Requirements.txt"](requirements.txt) - required packages to run the app.


#### 6. How to run Moviegator?

1. Please, install all the packages mentioned in ["requirements.txt"](requirements.txt).

    - [How to Install Django](https://docs.djangoproject.com/en/3.2/topics/install/).

    - Use `pip install python-dotenv` in your terminal to install 'dotenv'.

2. Download this repository.

3. Register on [imdb-api](https://imdb-api.com/Identity/Account/Register) to receive your **free** private API key.

4. In root directory of the app (at the same level as "manage.py" file), create '.env' file. 

    - In this file you should store API_KEY variable with your private API key received at step 3:
    `API_KEY=yourkey`

    - Without this step, the app will not launch!

5. When in root directory, execute the following terminal commands to make model migrations for the app:
```
py - 3 manage.py makemigrations
py -3 manage.py migrate
```

6. To run the app locally, execute the following command:
`py -3 manage.py runserver`

7. Enjoy Moviegator! 

*If you have any questions on the functionality of the app, please watch the [demo video](https://github.com/nastiacooly/moviegator#video-demo-not-currently-available).*


