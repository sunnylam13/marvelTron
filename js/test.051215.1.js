//////////////////////////////////////////////////
// GLOBAL VARIABLES

// create an empty object... which is the start of the application
// you don't have to start it empty though... it is cleaner however
// the word app is too generic...
// you might use the initials of the website you're designing
var mATest1 = {};
// then below there you can add things

// EXAMPLE:  http://gateway.marvel.com:80/v1/public/characters?name=Spider%20Man&limit=50&apikey=2c57ad00857c6163fa0417563cd31499

// the ? will be added by data property in $.ajax()
mATest1.baseURL = "http://gateway.marvel.com:80/v1/public/";
mATest1.categoryURLAdd = [
  "characters",
  "comics",
  "creators",
  "events",
  "series",
  "stories"
];
mATest1.publicKey = "2c57ad00857c6163fa0417563cd31499";
mATest1.limit = 50;
mATest1.character = "Spider-Man";

// WARNING:  if there are extensions or plugins included then variable names may overlap without you knowing hence why we want to use name spacing

// NOTE:  if you had your objects and functions inside the jQuery(document).ready() you can't access the object within the console...  if you do it outside of it however you can access it at any time and anywhere, it's no longer trapped as a local variable or function within the jQuery(document).ready()


//////////////////////////////////////////////////
// FUNCTIONS

// don't forget to call the function in EXECUTION CODE area before running

// NOTE:  in terms of organization, Ryan prefers to put all other functions and variables above the object.init() method however in reality it doesn't matter

// ---------------------------------------------
// // GET CHARACTER NAMES  ------------------------------------------------
// // ---------------------------------------------
mATest1.getCharacterNames = function () {
  var targetType = mATest1.categoryURLAdd[mATest1.categoryURLAdd.indexOf('characters')];
  console.log('The target category is %s', targetType);

  var baseURL = mATest1.baseURL;
      baseURL += targetType;
  console.log('The base URL before the data parameters are added is:  %s', baseURL);

  // GET ERROR
  // http://gateway.marvel.com/v1/public/characters?callback=jQuery214008945271512493491_1431462958913&name=Spider%2520Man&limit=50&apikey=2c57ad00857c6163fa0417563cd31499&_=1431462958914
  // desire:  
  // http://gateway.marvel.com/v1/public/characters?name=Spider%2520Man&limit=50&apikey=2c57ad00857c6163fa0417563cd31499
  // http://gateway.marvel.com:80/v1/public/characters?name=Spider%20Man&limit=50&apikey=2c57ad00857c6163fa0417563cd31499

  // EXAMPLE:  model...
  // assuming $.ajax() method tool will handle the ? and the & that are at the start and inbetween parameters
  // data parameter object
  // name=Spider%20Man
  // limit=50
  // apikey=2c57ad00857c6163fa0417563cd31499
  

  // http://developer.marvel.com/documentation/generalinfo
  // Responses returned by the Marvel Comics API are compliant with the W3C CORS specification, which allows any properly-authorized requests to be made from any origin domain. This means that you should not need to wrap calls in JSONP callbacks in order to make calls from browser-based applications. If you do prefer to use JSONP, however, all endpoints will accept a callback parameter to all endpoints that will wrap results in a JSONP wrapper.

  $.ajax({
    url: baseURL,
    // url: 'http://gateway.marvel.com:80/v1/public/characters?name=Spider%20Man&limit=50&apikey=2c57ad00857c6163fa0417563cd31499',
    type: 'GET',
    dataType: 'http',
    data: {
      name: 'Hulk',
      limit: 50,
      apikey: mATest1.publicKey,
    },
    success: function (data, status) {
      console.log('The mATest1.getCharacterNames success callback was reached');
    }
  })
  .done(function() {
    console.log("success");
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });
  
}
// // ---------------------------------------------
// // END GET CHARACTER NAMES ------------------------------------------------
// // ---------------------------------------------


// method to initialize our application
// all our code will be put inside here
// you should not be defining things in here
mATest1.init = function () {
  mATest1.getCharacterNames();
}

//////////////////////////////////////////////////
// EXECUTION CODE

jQuery(document).ready(function($) {
  mATest1.init();
});  //end doc.onready function

//////////////////////////////////////////////////