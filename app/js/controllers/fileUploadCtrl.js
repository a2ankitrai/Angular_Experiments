angular.module('myAppControllers').controller('fileUploadCtrl', ['$scope', '$http', function($scope, $http){
 
	$scope.upload =  function(){
		console.log("inside upload");
		var fileAsString;
		var file = document.getElementById("file").files[0];
	 

		var reader ;
		try
		{
		    reader = new FileReader();
		}catch(e)
		{
				document.getElementById('output').innerHTML = 
					"Error: seems File API is not supported on your browser";
			  return;
		 }
  
  		reader.readAsText(file,"UTF-8");	
		 reader.onload = function(e){
		    var data = e.target.result;
		    document.getElementById('output').innerHTML = data;
		    fileAsString = data;
	/*	    console.log(data);
*/

		    /**zip reader code : start**/

		    	zip.createReader(new zip.BlobReader(data), function(reader) {

			  // get all entries from the zip
			  reader.getEntries(function(entries) {
			    if (entries.length) {

			      // get first entry content as text
			      entries[0].getData(new zip.TextWriter(), function(text) {
			        // text contains the entry data as a String
			        console.log(text);

			        // close the zip reader
			        reader.close(function() {
			          // onclose callback
			        });

			      }, function(current, total) {
			        // onprogress callback
			      });
			    }
			  });
			}, function(error) {
			  // onerror callback
			});
		    /**zip reader code: end***/

		  } 
 			

 		 // Handle progress, success, and errors
		/*  reader.onprogress = updateProgress;*/
		 /* reader.onload = loaded;*/
		  /*reader.onerror = errorHandler;	*/
 		 	
		  var parser = new DOMParser();
		   var doc = parser.parseFromString( fileAsString, "application/xml"); 

		   var output = document.getElementById("output");
		   output.innerHTML= reader.result;

		  document.getElementById("sample").innerHTML= doc;
 		  console.log("end of file upload");

 		function updateProgress(evt)
{
  if (evt.lengthComputable)
	{
    // evt.loaded and evt.total are ProgressEvent properties
    var loaded = (evt.loaded / evt.total);
    if (loaded < 1)
		{
      // Increase the prog bar length
      // style.width = (loaded * 200) + "px";
			document.getElementById("bar").style.width = (loaded*100) + "%";
    }
  }
} 
function loaded(evt)
{
  // Obtain the read file data    
  var fileString = evt.target.result;
  document.getElementById('output').innerHTML = fileString;
		document.getElementById("bar").style.width = 100 + "%";
}

function errorHandler(evt)
{
  if(evt.target.error.code == evt.target.error.NOT_READABLE_ERR)
	{
    // The file could not be read
		document.getElementById('output').innerHTML = "Error reading file..."
  }
}
	 
	};
  
}]);