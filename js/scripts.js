//////////////////////////////////////////////////
// GLOBAL VARIABLES

////////////////////////////////////////////
// 		CHARACTER
////////////////////////////////////////////
var marTron = {};

marTron.baseURL = "http://gateway.marvel.com:80/v1/public/";
marTron.categoryURLAdd = [
  "characters",
  "comics",
  "creators",
  "events",
  "series",
  "stories"
];
marTron.publicKey = "2c57ad00857c6163fa0417563cd31499";
marTron.limit = 50;
marTron.character = "Spider-Man";
marTron.characterIDStored = [];

// ----------------------------------------
// GET CHARACTER REQUEST  ------------------
// ----------------------------------------
marTron.getCharacter = function (targetParent,userInputString) {
  var targetType = marTron.categoryURLAdd[marTron.categoryURLAdd.indexOf('characters')];
  // console.log('The target category is %s', targetType);

  var baseURL = marTron.baseURL;
      baseURL += targetType;
  // console.log('The base URL before the data parameters are added is:  %s', baseURL);

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
      name: userInputString,
      limit: 50,
      apikey: marTron.publicKey,
    },
    success: function (data, status) {
      console.log('The getCharacterNames success callback was reached');
      
      // the server returns the data in JSONP format, which must be converted to Javascript with JSON.parse(ARRAY)
      var convertData = JSON.parse(data);
      console.log('The converted data is now an object', convertData);

      // display character entry
      // don't forget to pass the targetParent as per the parameter design
      marTron.displayCharacter(targetParent,convertData);

      // for later use with acquiring covers... we need to store the characte name and ID into an array
      // marTron.characterIDStored.push(marTron.getCharacterID(convertData));
      // console.log('Character ID stored is ', marTron.characterIDStored);

      // get digital comics for this named character
      // marTron.getDigitalComics(marTron.characterIDStored);

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
// ----------------------------------------
// END GET CHARACTER REQUEST  ------------------
// ----------------------------------------


// ----------------------------------------
// DISPLAY CHARACTER  ------------------
// ----------------------------------------
marTron.displayCharacter = function (targetParent,apiObj) {

	// store reference to retrieved API data object from server
	var item = apiObj;
	console.log(item);

	// store reference to target destination
	var $targetParent = targetParent;
	console.log($targetParent);

	// this always selects the first character that matches
	var targetResults = apiObj.data.results[0];
	console.log(targetResults);


	// if the search returns no matches then don't do anything
	if (targetResults) {
		// store the reference to the existing <article> entry
			var $targetAppend = $targetParent.find('article');

			// empty out the previous contents of <article>
			// WARNING:  disable this if using the replace method
			// $targetAppend.empty();


			// data for the entry
			var nameHero = targetResults.name;
			console.log('Character name', nameHero);
			// "http://i.annihil.us/u/prod/marvel/i/mg/5/a0/538615ca33ab0"
			// https://i.annihil.us/u/prod/marvel/i/mg/e/e0/537bafa34baa9.jpg
			// you have to concatenate the https://i.annihil.us/u/prod/marvel/i/mg/e/e0/537bafa34baa9/ + '.' + '.jpg'
			var thumbnail = targetResults.thumbnail.path+"."+targetResults.thumbnail.extension;
			console.log('The image thumbnail is', thumbnail);
			var description = targetResults.description;
			console.log('The character description is', description);
			var wikiLink1 = "";
			// use a loop to find the object with the wiki link and set it
			$.each(targetResults.urls, function(index, arrayVal) {
				if (this.type == "wiki") {
					wikiLink1 = this.url;
				}
			});


			// BUILD ENTRY VERSION 1  ------------------------------------------------
			// // build the entry for the hero
			// // var $li = $('<li>');
			// var $imgFrame = $('<div>').addClass('imgFrame');
			// var $img = $('<img>').attr({
			// src: thumbnail
			// });
			// var $charName = $('<h2>');
			// var $description = $('<p>').addClass('description').text(description);
			// var $readMoreLink = $('<a>').attr('href', targetResults.urls[1].url).text('Read More on the Marvel Universe Wiki');

			// // put everything together
			// $imgFrame.append($img);

			// // insert the elements into the DOM
			// $targetAppend.append($imgFrame,$charName,$description,$readMoreLink);
			// END BUILD ENTRY VERSION 1 ------------------------------------------------

			// REPLACE EXISTING ENTRY VERSION 1  ------------------------------------------------
			
			$targetParent.find('.imgFrame img').attr('src', thumbnail);
			$targetParent.find('article h2').text(nameHero);
			$targetParent.find('p.description').text(description);
			$targetParent.find('a.readMore').attr('href', wikiLink1);

			// END REPLACE EXISTING ENTRY VERSION 1 ------------------------------------------------

	}

	
	
}
// ----------------------------------------
// END DISPLAY CHARACTER  ------------------
// ----------------------------------------


////////////////////////////////////////////
// 		END CHARACTER
////////////////////////////////////////////



////////////////////////////////////////////
// 		COMIC
////////////////////////////////////////////

// ----------------------------------------
// GET CHARACTER ID  ------------------
// ----------------------------------------
// for later use with acquiring covers... we need to store the ID
marTron.getCharacterID = function (apiObj) {
  // I want to return an object with a key value pair where key is the name of the character and the ID is the number returned
  
  var item = apiObj;
  var targetResults = apiObj.data.results[0];

  // var heroName = targetResults.name.toString();
  // var heroID = targetResults.id;

  console.log('The name of the selected hero is ',targetResults.name);
  console.log("The ID of the selected hero is ", targetResults.id);

  // you create an object with 2 properties, one for name, one for id
  var heroIDObj = {};
  heroIDObj.name = targetResults.name;
  heroIDObj.id = targetResults.id;

  // store the hero's name and their ID into an object delivery system

  return heroIDObj;
}
// ----------------------------------------
// END GET CHARACTER ID  ------------------
// ----------------------------------------


// ----------------------------------------
// GET COMICS  ------------------
// ----------------------------------------
// for everything linked to comic covers, prices and more
marTron.getDigitalComics = function (charIDArray) {

  console.log('marTron.getDigitalComics is active.');

  // charIDArray is null if marTron.getCharacter is run after this function...
  // this must be placed after marTron.getCharacter
  console.log('The character ID array passed was', charIDArray);

  // if it's a certain div then you'd want to associate it with additional targeting data...

  // for each ID stored in the marTron.characterIDStored array, get the available digital comic editions for that character

  $.each(charIDArray, function(index, objItem) {

    console.log(index,objItem);

    // get the comics
    $.ajax({
      // don't forget to add + "comics" because the baseURL/endpoint doesn't include that
      url: marTron.baseURL + "comics",
      type: 'GET',
      dataType: 'html',
      data: {
        // format: 'digital%20comic',
        format: 'comic',
        formatType: 'comic',
        hasDigitalIssue: 'false',
        characters: objItem.id,
        // characters: "1009351",
        apikey: marTron.publicKey
      },
      success: function (res,status,jqXHR) {
        console.log('Get Digital Comics action is a success.');
        // console.log('The returned object for comics for this character is...');
        // console.log(res);

        // the server returns the data in JSONP format, which must be converted to Javascript with JSON.parse(ARRAY)
        var convertData = JSON.parse(res);
        console.log('The converted data is now an object', convertData);

        marTron.displayComicCovers(convertData);
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
  });
}
// ----------------------------------------
// END GET COMICS  ------------------
// ----------------------------------------


// ----------------------------------------
// RETRIEVE URLS  ------------------
// ----------------------------------------
marTron.retrieveURL = function (urlArray,actionType) {
  // where actionType = "reader" or "purchase"
  // find and locate the objects that have the type = "reader" or type="purchase"
  // console.log('marTron.retrieveURL is active.');

  for (var i = 0; i < urlArray.length; i++) {
    switch(actionType) {
      case "reader":
        if (urlArray[i].type == "reader") {
          return urlArray[i].url;
        }
        break;
      case "purchase":
        if (urlArray[i].type == "purchase") {
          return urlArray[i].url;
        }
        break;
      default:
        console.log('marTron.retrieveURL has an error.');
    }
  }

}
// ----------------------------------------
// END RETRIEVE URLS  ------------------
// ----------------------------------------


// ----------------------------------------
// DISPLAY COMICS  ------------------
// ----------------------------------------
marTron.displayComicCovers = function (apiObj) {

  console.log('marTron.displayComicCovers is active.');

  var item = apiObj;
  var targetResultsArray = apiObj.data.results;
  console.log(targetResultsArray);

  $.each(targetResultsArray, function(index, objItem) {
    var $li = $('<li>');
    var $section = $('<section>').addClass('exploreUnit');
    
    var $imgFrame = $('<div>').addClass('imgFrame');

    // the images of the comic are in an array and include the first image which is the cover...  that would be objItem.images[0]
    // the remaining images are previews... with text separated out
    var $img = $('<img>').attr('src', objItem.images[0].path + "." + objItem.images[0].extension);
    var $frame = $('<div>').addClass('frame');

    // the issue is whether the url array links increase or change
    // store a reference to the "reader" link
    // var readerLink = objItem.urls[2];
    // console.log(readerLink);
    var readerLink = marTron.retrieveURL(objItem.urls, "reader");
    // console.log(readerLink);

    // store a reference to the "purchase" link
    // var purchaseLink = objItem.urls[1];
    // console.log(purchaseLink);
    var purchaseLink = marTron.retrieveURL(objItem.urls, "purchase");
    // console.log(purchaseLink);

    // create the buttons
    // var $button = $('<button>').attr('name', 'buynow').text('Buy Now');
    var $aPurchase = $('<a>').attr({
      name: 'buynow',
      href: purchaseLink
    });
    var $buttonPurchase = $('<button>').attr({
      name: 'buynow',
      href: purchaseLink
    }).text('Buy Now');
    // var $buttonPreview = $('<button>').attr('name', 'preview').text('Preview Comic');
    var $aPreview = $('<a>').attr({
      name: 'preview',
      href: readerLink
    });
    var $buttonPreview = $('<button>').attr({
      name: 'preview',
      href: readerLink
    }).text('Preview Comic');

    // join everything together
    $aPurchase.append($buttonPurchase);
    $aPreview.append($buttonPreview);

    // $frame.append($buttonPreview,$button);
    $frame.append($aPreview,$aPurchase);
    $imgFrame.append($img);
    $section.append($imgFrame,$frame);
    $li.append($section);
    $('section.comicCoverTest1 ul.nameList').append($li);
  });
}

// ----------------------------------------
// END DISPLAY COMICS  ------------------
// ----------------------------------------

////////////////////////////////////////////
// 		END COMIC
////////////////////////////////////////////




//////////////////////////////////////////////////
// FUNCTIONS

marTron.events = function () {

	// when the character entry is clicked, display the comics for that character
	// $('section.characterEntry').on('click', function(event) {
	// 	event.preventDefault();
	// 	marTron.displayComicCovers(convertData);
	// });

	// when user changes the form field and submits, get the character data
	$('section.characterEntry form').on('submit', function(event) {
		event.preventDefault();

		// create a reference to 'this' section...
		// aim for the parent
		var $targetParent = $(this).parents('section.characterEntry');
		console.log($targetParent);

		// grab the value from 'this' input field
		var inputString = $targetParent.find('input#hero').val();
		console.log('User input before encoding is %s', inputString);

		// encode the user's input so that it's ready for a URI string
		// https://stackoverflow.com/questions/332872/encode-url-in-javascript
		// inputString = encodeURIComponent(inputString);

		console.log('The user searches for: ',inputString);

		// use that input field value to get the character if any (it is the target destination)
		marTron.getCharacter($targetParent,inputString);
		


	});

}


// method to initialize our application
// all our code will be put inside here
// you should not be defining things in here
marTron.init = function () {
	marTron.events();
}

//////////////////////////////////////////////////
// EXECUTION CODE

jQuery(document).ready(function($) {
	marTron.init();
});  //end doc.onready function

//////////////////////////////////////////////////