var appService = angular.module('myAppServices',[]);

appService.service('firstService',function(){
	this.setWelcomeMessage = function(){

		console.log("Snipers Activated....");
		return "Snipers Activated....";
	}

	this.satSunNotPossible=function(){

		console.log("IT IT IT");
	}
});

appService.factory('firstFactory', function () {
  return {
    sayHello: function () {
      console.log('hello');
    },

    sayGoodBye: function(){
    	console.log('will take help from you.');
    }
  }
}); 