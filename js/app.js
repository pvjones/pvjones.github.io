angular.module('nasaViewer', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/',
        controller: 'mainContr',
        templateUrl: '../views/home.html'
      })
      .state('apod', {
        url: '/apod',
        controller: 'apodContr',
        templateUrl: '../views/apod.html'
      }).state('neo', {
        url: '/neo',
        controller: 'neoContr',
        templateUrl: '../views/neo.html'
      });

      $urlRouterProvider
        .otherwise('/')



  })