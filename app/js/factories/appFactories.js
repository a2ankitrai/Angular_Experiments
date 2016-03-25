var appFactories = angular.module('myAppFactories',[]);

appFactories.factory('firstFactory', function () {
  return {
    sayHello: function () {
      console.log('hello');
    },

    sayGoodBye: function(){
    	console.log('will take help from you.');
    }
  }
}); 