var appDirectives = angular.module('myAppDirectives',[]);
 

appDirectives.directive('mySharedScope', function () {
    return {
        template: 'Name: John Doe <br /> Street: Deccan Street'
    };
});