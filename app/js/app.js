'use strict';

/* App Module */

var app = angular.module('myApp', [
    'ngRoute',
    'myAppControllers',
    'myAppServices',
    'myAppFactories',
    'myAppDirectives'
]);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/index', {
            templateUrl: 'partials/fileIndex.html',
        }).
        when('/basic', {
            templateUrl: 'partials/basics.html',
            controller: 'firstCtrl'
        }).
        when('/fileUpload', {
            templateUrl: 'partials/fileUpload.html',
            controller: 'fileUploadCtrl'
        }).
        when('/zipUnzip', {
            templateUrl: 'partials/zipUnzip.html',
            controller: 'readZipJSCtrl'
        }).
        when('/dynamicScope', {
            templateUrl: 'partials/dynamicScope.html',
            controller: 'dynamicScopeCtrl'
        }).
        when('/expressionEvaluate', {
            templateUrl: 'partials/expressionEvaluate.html',
            controller: 'expressionEvaluateCtrl'
        }).
        when('/directiveRecompile', {
            templateUrl: 'partials/directiveRecompile.html',
            controller: 'directiveRecompileCtrl'
        }).
        otherwise({
            redirectTo: '/index'
        });
    }
]);
