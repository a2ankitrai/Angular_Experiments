angular.module('myAppControllers').controller('firstCtrl', ['$scope','firstService','firstFactory','$q',
	 function($scope,firstService,firstFactory,$q){
  
  	$scope.welcomeMsg = firstService.setWelcomeMessage();
  
  	firstFactory.sayGoodBye(); 	

	firstService.satSunNotPossible(); 

	$scope.currentTimeStamp = Date.now();

		function async1(value) {  
		    var deferred = $q.defer();
		    var asyncCalculation = value * 2;
		    deferred.resolve(asyncCalculation);
		    return deferred.promise;
		}
		function async2(value) {  
		    var deferred = $q.defer();
		    deferred.reject('rejected for demonstration!' + (value+3));
		    return deferred.promise;
		}

		var promise = async1(10)  
		    .then(function(x) {
		        return async2(x);
		    });

		promise.then(  
		    function(x) { console.log(x+"phase 1"); },
		    function(reason) { console.log('Error: ' + reason); });

}]);

angular.module('myAppControllers').controller('secondCtrl', ['$scope', function($scope){  
  	$scope.welcomeMsg = "Second strike inbound";
}]);

 