var app = angular.module('myApp',['myAppServices','directivesModule']);

app.controller('firstCtrl',function($scope,firstService,firstFactory,$q){

	$scope.welcomeMsg = firstService.setWelcomeMessage();
  
  	firstFactory.sayGoodBye(); 	

	firstService.satSunNotPossible(); 

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
		    function(x) { console.log(x); },
		    function(reason) { console.log('Error: ' + reason); });
		});


app.controller('secondCtrl',function($scope){ 
	$scope.welcomeMsg = "Second strike inbound";
	 
});

app.controller('fileUploadCtrl',function($scope){

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
  
});

 
app.controller('readZipJSCtrl',function($scope){
 		
  	zip.workerScriptsPath = "/app/js_vendors/";
 	var requestFileSystem = window.webkitRequestFileSystem || window.mozRequestFileSystem || window.requestFileSystem;

	function onerror(message) {
		alert(message);
	}

	function createTempFile(callback) {
		var tmpFilename = "tmp.dat";
		requestFileSystem(TEMPORARY, 4 * 1024 * 1024 * 1024, function(filesystem) {
			function create() {
				filesystem.root.getFile(tmpFilename, {
					create : true
				}, function(zipFile) {
					callback(zipFile);
				});
			}

			filesystem.root.getFile(tmpFilename, null, function(entry) {
				entry.remove(create, create);
			}, create);
		});
	}

	var model = (function() {
		var URL = window.webkitURL || window.mozURL || window.URL;

		return {
			getEntries : function(file, onend) {
				zip.createReader(new zip.BlobReader(file), function(zipReader) {
					zipReader.getEntries(onend);
				}, onerror);
			},
			getEntryFile : function(entry, creationMethod, onend, onprogress) {
				var writer, zipFileEntry;

				function getData() {
					entry.getData(writer, function(blob) {
						var blobURL = creationMethod == "Blob" ? URL.createObjectURL(blob) : zipFileEntry.toURL();
						onend(blobURL);
					}, onprogress);
				}

				if (creationMethod == "Blob") {
					writer = new zip.BlobWriter();
					getData();
				} else {
					createTempFile(function(fileEntry) {
						zipFileEntry = fileEntry;
						writer = new zip.FileWriter(zipFileEntry);
						getData();
					});
				}
			}
		};
	})();

 
	$scope.initiateUploadR = function () {
  
		var fileInput = document.getElementById("file-inputR");
		var unzipProgress = document.createElement("progress");
		var fileList = document.getElementById("file-listR");
		var creationMethodInput = document.getElementById("creation-method-input");

		function download(entry, li, a) {
				model.getEntryFile(entry, creationMethodInput.value, function(blobURL) {
					var clickEvent = document.createEvent("MouseEvent");
					if (unzipProgress.parentNode)
						unzipProgress.parentNode.removeChild(unzipProgress);
					unzipProgress.value = 0;
					unzipProgress.max = 0;
					clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
					a.href = blobURL;
					a.download = entry.filename;
					a.dispatchEvent(clickEvent);
				}, function(current, total) {
					unzipProgress.value = current;
					unzipProgress.max = total;
					li.appendChild(unzipProgress);
				});
			}
 
		if (typeof requestFileSystem == "undefined")
			creationMethodInput.options.length = 1;
			model.getEntries(fileInput.files[0], function(entries) {
				fileList.innerHTML = "";
				entries.forEach(function(entry) {
					var li = document.createElement("li");
					var a = document.createElement("a");
					a.textContent = entry.filename;
					a.href = "#";
					a.addEventListener("click", function(event) {
						if (!a.download) {
							download(entry, li, a);
							event.preventDefault();
							return false;
						}
					}, false);
					li.appendChild(a);
					fileList.appendChild(li);
				});
			}); 
		} 
	});



app.controller('writeZipJSCtrl',function($scope){

		zip.workerScriptsPath = "/app/js_vendors/";
	
  		var requestFileSystem = window.webkitRequestFileSystem || window.mozRequestFileSystem || window.requestFileSystem;

  		function onerror(message) {
			alert(message);
		}

		function createTempFile(callback) {
			var tmpFilename = "tmp.zip";
			requestFileSystem(TEMPORARY, 4 * 1024 * 1024 * 1024, function(filesystem) {
				function create() {
					filesystem.root.getFile(tmpFilename, {
						create : true
					}, function(zipFile) {
						callback(zipFile);
					});
				}

				filesystem.root.getFile(tmpFilename, null, function(entry) {
					entry.remove(create, create);
				}, create);
			});
		}

			var model = (function() {
		var zipFileEntry, zipWriter, writer, creationMethod, URL = window.webkitURL || window.mozURL || window.URL;

		return {
			setCreationMethod : function(method) {
				creationMethod = method;
			},
			addFiles : function addFiles(files, oninit, onadd, onprogress, onend) {
				var addIndex = 0;

				function nextFile() {
					var file = files[addIndex];
					onadd(file);
					zipWriter.add(file.name, new zip.BlobReader(file), function() {
						addIndex++;
						if (addIndex < files.length)
							nextFile();
						else
							onend();
					}, onprogress);
				}

				function createZipWriter() {
					zip.createWriter(writer, function(writer) {
						zipWriter = writer;
						oninit();
						nextFile();
					}, onerror);
				}

				if (zipWriter)
					nextFile();
				else if (creationMethod == "Blob") {
					writer = new zip.BlobWriter();
					createZipWriter();
				} else {
					createTempFile(function(fileEntry) {
						zipFileEntry = fileEntry;
						writer = new zip.FileWriter(zipFileEntry);
						createZipWriter();
					});
				}
			},
			getBlobURL : function(callback) {
				zipWriter.close(function(blob) {
					var blobURL = creationMethod == "Blob" ? URL.createObjectURL(blob) : zipFileEntry.toURL();
					callback(blobURL);
					zipWriter = null;
				});
			},
			getBlob : function(callback) {
				zipWriter.close(callback);
			}
		};
	})();

	var fileInput = document.getElementById("file-inputW");
	var zipProgress = document.createElement("progress");
	var downloadButton = document.getElementById("download-button");
	var fileList = document.getElementById("file-list");
	var filenameInput = document.getElementById("filename-input");
	var creationMethodInput = document.getElementById("creation-method-input");

	$scope.initiateUpload = function(){
		if (typeof requestFileSystem == "undefined")
			creationMethodInput.options.length = 1;
		model.setCreationMethod(creationMethodInput.value);
		model.addFiles(fileInput.files, function() {
			}, function(file) {
				var li = document.createElement("li");
				zipProgress.value = 0;
				zipProgress.max = 0;
				li.textContent = file.name;
				li.appendChild(zipProgress);
				fileList.appendChild(li);
			}, function(current, total) {
				zipProgress.value = current;
				zipProgress.max = total;
			}, function() {
				if (zipProgress.parentNode)
					zipProgress.parentNode.removeChild(zipProgress);
				fileInput.value = "";
				fileInput.disabled = false;
			}); 
	};

			downloadButton.addEventListener("click", function(event) {
			var target = event.target, entry;
			if (!downloadButton.download) {
				if (typeof navigator.msSaveBlob == "function") {
					model.getBlob(function(blob) {
						navigator.msSaveBlob(blob, filenameInput.value);
					});
				} else {
					model.getBlobURL(function(blobURL) {
						var clickEvent;
						clickEvent = document.createEvent("MouseEvent");
						clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
						downloadButton.href = blobURL;
						downloadButton.download = filenameInput.value;
						downloadButton.dispatchEvent(clickEvent);
						creationMethodInput.disabled = false;
						fileList.innerHTML = "";
					});
					event.preventDefault();
					return false;
				}
			}
		}, false);
 
});
