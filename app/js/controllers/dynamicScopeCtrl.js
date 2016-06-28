angular.module('myAppControllers').controller('dynamicScopeCtrl', ['$scope', '$parse',
    function($scope, $parse) {
        $scope.welcomeMsg = "Dynamic Scopes activataed";

        $scope.myarray = [{ 'id': 'myname1' }, { 'id': 'myname2' }];
        $scope.myname1 = "John;"
        $scope.myname2 = "Ankit"
        $scope.setp = { arr: [] };
        $scope.setp.arr[0] = "sample Value";
        $scope.myVar_2_4 = "setpReloaded";

        /*  $scope.setp.arr[0].var[1] = "sample Value";*/
        var getMeMyValue = $scope[$scope.myarray[1].id];
        /*console.log(getMeMyValue); 

         console.log($scope['myname'+ 1]); 
        	console.log($scope.setp.arr[0]);*/
        var scopeVariable = $parse('setp.arr[0]');
        scopeVariable.assign($scope, "new Value");
        console.log($scope.setp.arr[0]);

        var aiseHi = 'setp.arr[0]';
        console.log($scope['setp.arr' + [0]]);
        console.log($scope['setp.arr[0]']);
        console.log($scope['setp']['arr'][0]);
        console.log($scope['myVar_' + 2 + '_' + 4]);

    }
]);
