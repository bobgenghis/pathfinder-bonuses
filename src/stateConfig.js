export default ($locationProvider, $stateProvider) => {
    'ngInject';

    const loadDependencies = (...components) => ($q, $ocLazyLoad, AppVersion) => {
        'ngInject';

        return $q.all(components.map(component => $ocLazyLoad.load(`${AppVersion}/components/${component}.js`)));
    };

    $locationProvider.html5Mode(true);

    $stateProvider
        .state('app', {
            abstract: true,
            component: 'app',
            resolve: {
                dependencies: loadDependencies('core'),
            },
        })
		.state('app.characters', {
            component: 'characters',
            resolve: {
                dependencies: loadDependencies('bonuses'),
            },
            url: '/',
        })
        .state('otherwise', {
            url: '*path',
            template: '<path-not-found></path-not-found>',
        });
};
