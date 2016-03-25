

angular.module('directivesModule',[])


.directive('mySharedScope', function () {
    return {
        template: 'Name: John Doe <br /> Street: Deccan Street'
    };
});