//////////////////////////////////////////////////
// GLOBAL VARIABLES

// create an empty object... which is the start of the application
// you don't have to start it empty though... it is cleaner however
// the word app is too generic...
// you might use the initials of the website you're designing
var mATest1 = {};
// then below there you can add things

// EXAMPLE:  http://gateway.marvel.com:80/v1/public/characters?name=Spider%20Man&limit=50&apikey=2c57ad00857c6163fa0417563cd31499
// http://gateway.marvel.com:80/v1/public/characters?name=Spider%20Man&limit=50&apikey=2c57ad00857c6163fa0417563cd31499

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
  // MAMP or live preview from Prepros must be used...
  // you need to add authorized referrers to your Marvel Developer account
  // localhost
  // localhost*
  // *localhost
  // sunnylam.ca (for when you make yours live)... you'll need to cite Marvel

  // EXAMPLE:  model...
  // assuming $.ajax() method tool will handle the ? and the & that are at the start and inbetween parameters
  // data parameter object
  // name=Spider%20Man
  // limit=50
  // apikey=2c57ad00857c6163fa0417563cd31499
  

  // http://developer.marvel.com/documentation/generalinfo
  // Responses returned by the Marvel Comics API are compliant with the W3C CORS specification, which allows any properly-authorized requests to be made from any origin domain. This means that you should not need to wrap calls in JSONP callbacks in order to make calls from browser-based applications. If you do prefer to use JSONP, however, all endpoints will accept a callback parameter to all endpoints that will wrap results in a JSONP wrapper.
  // using dataType: 'html' is easiest

  $.ajax({
    url: baseURL,
    type: 'GET',
    dataType: 'html',
    data: {
      name: 'Hulk',
      limit: 50,
      apikey: mATest1.publicKey,
    },
    success: function (data, status) {
      console.log('The getCharacterNames success callback was reached');
      // the server returns the data in JSONP format, which must be converted to Javascript with JSON.parse(ARRAY)
      var convertData = JSON.parse(data);
      console.log('The converted data is now an object', convertData);

      // display character entry
      mATest1.displayCharacterNames(convertData);

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

mATest1.displayCharacterNames = function (apiObj) {
	var item = apiObj;
	var targetResults = apiObj.data.results[0];

	// build the <li> entry for hero
	var nameHero = targetResults.name;
	// https://i.annihil.us/u/prod/marvel/i/mg/e/e0/537bafa34baa9.jpg
	// "http://i.annihil.us/u/prod/marvel/i/mg/5/a0/538615ca33ab0"
	var thumbnail = targetResults.thumbnail.path+"."+targetResults.thumbnail.extension;
	var description = targetResults.description;

	var heroItem = '<li>';
		heroItem += '<h2>' + nameHero + '</h2>';
		heroItem += "<img src='" + thumbnail + "'" + ">";
		heroItem += "" + description + "";
		heroItem += '</li>';

	// $('section.nameTest img').attr('src', thumbnail);

	// insert the elements into the DOM
	$('ul.nameList').append(heroItem);

	$('section.nameTest p.attribution').html(item.attributionHTML);

	console.log(item.attributionHTML);
}

// method to initialize our application
// all our code will be put inside here
// you should not be defining things in here
mATest1.init = function () {
  mATest1.getCharacterNames();
}

//////////////////////////////////////////////////
// EXECUTION CODE

jQuery(document).ready(function($) {
  // mATest1.init();
});  //end doc.onready function

//////////////////////////////////////////////////
