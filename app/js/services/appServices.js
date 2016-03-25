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