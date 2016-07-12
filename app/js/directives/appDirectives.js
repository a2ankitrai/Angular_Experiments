var appDirectives = angular.module('myAppDirectives', []);


appDirectives.directive('mySharedScope', function() {
    return {
        template: 'Name: John Doe <br /> Street: Deccan Street'
    };
});

appDirectives.directive('recompiler', function() {
    return {
        restrict: 'AE',
        /* templateUrl: 'partials/directive/my-directive-template.html'*/
        templateUrl: function(elem, attr) {
            console.log(elem);
            console.log(attr);
            return 'partials/directive/' + elem[0].localName + '.html';
        },
        scope: {
            name: '=namer',
            version: '='
        },
        link: function link(scope, element, attrs){
        	console.log("inside Link");
        	console.log(scope.name);
        	console.log(element);
        	console.log(attrs);
        	scope.name = "Lion King";

        }
    };
});
