# Getting Started
 https://github.com/langdonx/angularjs-2017-starter
 
1. Prerequisites
    - Install [Git 2.x](https://git-scm.com/downloads)
    - Install [Node 6.x](https://nodejs.org/en/download/)
    - Install [Visual Studio Code](https://code.visualstudio.com/) (optional, but recommended)
1. Clone the repository and run the following commands in the cloned directory
    1. `npm i`
    1. `npm start`
1. Make some changes and see them reflected in the browser

# Features

- Modern ECMASCript features
- Angular 1.6
- UI Router 1.0 with html5Mode
- ocLazyLoad for lazy loading logical components
- ngInject (aka ngAnnotate)
- Browser Sync configured to support html5Mode
- ESLint
- Logical component compilation
- File versioning as an easy cache busting technique

# To Do
- watch gulpfile.js for changes, reload, rebuild
    - https://www.npmjs.com/package/gulper
    - tried, not great: https://github.com/ihoneycomb/gulp-auto-restart
- look into html formatting/linting whether it produces something commitable or not (like .esformatter, .stylelintrc)
- tests
    - testing controllers, services is easy
    - how do you unit test a component without the import statements firing?
- generally improve src/* (code cleanliness, ui, ux)
- generally improve README.md with notes about each feature, reasoning behind approaches
- fork a bootstrap alternative (bootstrap, ui-bootstrap)
- fork an angular material alternative

# For Consideration
- when we compile the scss->js the way we are, we lose the ability to use sourcemaps
    - what is more important here? http efficiency or development efficiency? are there any other benefits/detriments i'm missing?
- using webpack for vendor.js... might let us drop a dependency or two... not sure it's worth much else (try at least for speed, it takes 4 seconds currently)
- the benefits of bootstrapping angular (are there any?)
- using gulp-ng-templates... although requiring the template is pretty amazing, i don't think it will ever be supported natively
