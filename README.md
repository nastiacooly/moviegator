# Moviegator
## A web-app which randomly recommends movies / TV shows based on your genre preference or mood.

#### Video Demo: not currently available.


#### 1. What is it?
  
Moviegator is my final project for CS50w: Web-Programming with Python and Javascript.

Moviegator is a web-application built on Django Framework and vanilla Javascript with help of imdb-api.com (third-party API).

Developed in 2021 by Anastasia Maryina (@nastiacooly).


#### 2. What can it do?
  
Moviegator provides the following features:

a) To non-registered users:
    - Registering your new account;
    - Getting random movie / TV show recommendation based on chosen mood, genre or category;
    - See recommended movie / TV show details on IMDb website by one click;
    - Searching for movie / TV show YouTube trailer and watching it right on the web-app page.

b) To registered users:
    - Logging in and out of your account;
    - All of the above-mentioned feautures provided for non-registered users;
    - Opening your profile page with watchlist and 'watched' list;
    - Adding movie / TV show to your watchlist / Removing title from watchlist;
    - Marking movie / TV show as already watched / Marking title as not watched;
    - Giving 1-to-5-star rating to watched movies / TV shows and changing rating;
    - Seeing IMDb details for each title in user's lists by one click;
    - Moviegator will not recommend a movie or show if it has already been added to watchlist or marked as watched by signed user.


#### 3. Which technologies were used to develop this app?

  - Frontend: HTML5, CSS3/Scss (+ Bootstrap), vanilla Javascript;
  - Backend: Django Framework (Python);
  - API: imdp-api.com (third-party API).


#### 4. Distinctiveness and Complexity

    1) Moviegator is sufficiently distinct from the other projects in CS50w course as:

        - it is not a simple static page with search function;
        - it is not a wiki;
        - it is not an auction / e-commerce site;
        - it is not a mail page;
        - it is not a social network.
    Moviegator is an app which recommends movies / TV shows and provides features for adding such titles to watchlist or mark them as watched, rate titles and watch their trailers.

    2) Moviegator is more complex than the other projects in CS50W course as:

        a) Moviegator works with third-party API to get data about movies / TV shows. To secure API calls and API private key, I applied the following scheme:
            - JS-script (frontend) fetches certain URL of the app;
            - Then, backend makes sure that request was made by AJAX and makes necessary API-call by retrieving private API key from environment variable;
            - When backend receives response from API, it returns JSON data;
            - JS-script receives JSON-response from backend, processes it and renders necessary content for user.
        These scheme is useful as API URLs and API private key are not shown in browsers' dev tools console or URL bar.

        b) Moviegator is designed mostly as a dynamic SPA meaning that all the contents of the pages are asynchronously loaded/changed by frontend script. All of the HTML-templates of the app does not initially contain any movies / TS shows data or data from user's lists. And the sections of the main page are dynamically switching depending on user's actions. 
        All of this was achieved with help of AJAX.

        c) Moviegator applies infinite scroll for watchlist and 'watched' list, so the user should not click 'next' or 'previous' page buttons to see all the contents - user can just scroll to the end of the page and the content will be loaded and rendered.
        While loading additional data, app shows loading spinner, so the user is aware that something is currently loading.

        d) All of the POST-requests made by JS-script (frontend) are secured with CSRF-token.

        e) The app throws RuntimeError (so it is not running) when API private key is not set in environmental variable.

    3) Moviegator is mobile-responsive both for portrait and landscape orientations.


#### 5. What are all these files in this repository?

The organization of folders and files is mostly the default organization provided by Django.

"Final" folder is the main folder of the app which provides main settings, main url routes and etc. (all standard here).

"Moviegator" folder is responsible for the main app, i.e. all the actions users can make on Moviegator page:
    - 'migrations' folder - model migrations of the app;
    - 'templates/moviegator' folder - all the HTML-templates of the app including layout;
    - 'models.py' - database models for the app. It includes two models: 1) for movie / show details 2) for user actions (lists and ratings);
    - 'urls.py' - routing settings for the app;
    - 'views.py' - view functions of the app (which also contains settings for importing environment variables and API requests construction);
    - 'static/moviegator' folder - contains all static files for the app:
        -- 'scss' folder - styles written with SCSS pre-processor divided by categories for animations, media queries, mixins, variables and general styles;
        -- 'css' folder - compilated 'styles.min.css' and 'styles.min.css.map' files from SCSS files;
        --  'img' folder - contains svg for loading spinner;
        -- 'scripts' folder - JS-scripts for the frontend of the app ("_helper.js" contains helper functions which are exported to the main script, "moviegator.js" - the main script of the app).

"Requirements.txt" - required packages to run the app.


#### 6. How to run Moviegator?

TODO

