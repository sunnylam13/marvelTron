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
marTron.characterDefaultSearch1 = ["Wolverine","Hulk","Thor","Captain America","Silver Surfer", "Thanos","Iron Man","Vision","Warpath","Silver Sable","daredevil"];
marTron.characterIDStored = [];
marTron.comicMode = true;
marTron.movieMode = false;
marTron.tvMode = false;
marTron.sliderParent = $('figure#spinner');

marTron.angle = 0;
marTron.netDegrees = 360;
marTron.spinner = $('figure#spinner');
marTron.leftPrev = $('span.fa.fa-chevron-left');
marTron.rightNext = $('span.fa.fa-chevron-right');
// marTron.items1 holds the items in the gallery... whether they're images or a div
marTron.items1 = $('section.exploreUnit');

// ----------------------------------------
// GET CHARACTER REQUEST  ------------------
// ----------------------------------------
marTron.getCharacter = function (targetParent,userInputString) {
  var targetType = marTron.categoryURLAdd[marTron.categoryURLAdd.indexOf('characters')];
  // console.log('The target category is %s', targetType);

  var $targetParent = targetParent;
  console.log($targetParent);

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

      // I want the character's ID stored anyway as a data attribute for later access when calling comics upon click
      marTron.characterIDStored.push(marTron.getCharacterID(convertData));
      console.log('Character ID stored is ', marTron.characterIDStored);

      // give the article a data attribute matching the character's id by passing the data object
      targetParent.find('article').attr('data-martronheroid', marTron.getCharacterID(convertData).id);


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
marTron.getDigitalComics = function (idString) {

  console.log('marTron.getDigitalComics is active.');

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
      characters: idString,
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

  // empty the $('section.displayDisc')
  marTron.sliderParent.empty();

  // set the $('section.displayDisc') to have padding top and bottom of 10% each
  // $('section.displayDisc').css({
  // 	paddingTop: '10%',
  // 	paddingBottom: '10%'
  // });
  // Tween option
  TweenMax.to(marTron.sliderParent,2,{ease:Power2.easeIn,paddingTop: '10%',paddingBottom: '10%'});

  $.each(targetResultsArray, function(index, objItem) {
    // var $li = $('<li>');
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
    // $li.append($section);
    marTron.sliderParent.append($section);
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

function getRandom (num) {
  var my_num = Math.floor(Math.random()*num);
  return my_num;
}

marTron.comicTooltips = function () {
	// Friday, May 15, 2015 3:00 PM:  using jQuery UI is ugly
	
	var $targetParent = $('section.characterEntry');

	// go to each section.characterEntry
	$.each($targetParent, function(index, val) {
    if (marTron.comicMode ==  true) {
      // when comic mode is enabled
      // set the title attribute to have text for the jQuery tooltip
      $(this).attr('data-comictooltips1', 'Click to see comics');
    } else {
      $(this).attr('data-comictooltips1', '');
    }
	});	
}

marTron.randomCharacters1 = function (array) {
	// array to use...
	// marTron.characterDefaultSearch1

	var randNum;
  var currentNum;
	var randNumPrev = [];

	// store a reference to character entry boxes
	var $charBoxes = $('section.characterEntry');

	// for each section.characterEntry
	$.each($charBoxes, function(index, entryBox) {
		// select a random number
		// we don't want the same characters showing up so if the generated number matches the previous number then roll another random number
		
		randNum = getRandom(array.length);

		// while currentNum != randNum... the opposite of what we want...
		while (currentNum != randNum) {
			// place this condition in the loop
			if (randNumPrev.indexOf(randNum) == -1) {
				// if the number isn't in the array set var currentNum = randNum and use this for the selection
				// this is the condition we want
				currentNum = randNum;
			} else if (randNumPrev.indexOf(randNum) != -1) {
				// if the number is in the array then I want to generate another random number
				randNum = getRandom(array.length);
			}
		}

		// when the page loads, randomly select some Marvel characters who I know have full entries
		// var charSelectString = array[randNum];
		var charSelectString = array[currentNum];		

		// pass the chosen character string to get character data
		// you want to pass the targetParent, which will be $(this)... don't use entryBox
		marTron.getCharacter($(this),charSelectString);
	});

	
}


marTron.firstLoadAnim1 = function () {

  // animate the character cards into place
  this.startTL1 = new TimelineMax();
  this.startTL1.staggerFrom($('section.characterEntry:nth-child(1)'),1,{ease: Power2.easeInOut, left:'-9999999px',opacity:0},0.6);
  this.startTL1.staggerFrom($('section.characterEntry:nth-child(3)'),1,{ease: Power2.easeInOut, right:'-9999999px',opacity:0},0.6);
  this.startTL1.staggerFrom($('section.characterEntry:nth-child(2)'),1,{ease: Power2.easeInOut, top:'-9999999px',opacity:0},0.6);  
}

marTron.hoverCardsLeft1 = function () {
  // make the character card entries hover
  
  $target = $('section.characterEntry:nth-child(1)');

  this.hcL1 = new TimelineMax({repeat:-1,yoyo:true});
  this.hcL1.yoyo(true);
  this.hcL1.staggerTo($target,3,{css:{transform:'matrix(1,-0.5,0,1,0,-10)'},ease:SlowMo.easeOut},0.2);
  this.hcL1.staggerTo($target,2.7,{css:{transform:'matrix(1,-0.5,0,1,0,10)'},ease:SlowMo.easeOut},0.4);
  this.hcL1.play();

 }

 marTron.hoverCardsCenter1 = function () {
   // make the character card entries hover
   
   $target = $('section.characterEntry:nth-child(2)');

   this.hcc1 = new TimelineMax({repeat:-1,yoyo:true});
   this.hcc1.yoyo(true);
   this.hcc1.staggerTo($target,3.1,{css:{transform:'matrix(1,0,0,1,0,-10)'},ease:SlowMo.easeOut},0.4);
   this.hcc1.staggerTo($target,2.8,{css:{transform:'matrix(1,0,0,1,0,10)'},ease:SlowMo.easeOut},0.3);
   this.hcc1.play();

  }

marTron.hoverCardsRight1 = function () {
  // make the character card entries hover

  var $target = $('section.characterEntry:nth-child(3)');

  this.hcR1 = new TimelineMax({repeat:-1,yoyo:true});
  this.hcR1.yoyo(true);
  this.hcR1.staggerTo($target,2.6,{css:{transform:'matrix(1,0.5,0,1,0,-10)'},ease:SlowMo.easeOut},0.3);
  this.hcR1.staggerTo($target,3,{css:{transform:'matrix(1,0.5,0,1,0,10)'},ease:SlowMo.easeOut},0.5);
  this.hcR1.play();
}

marTron.pulsingBorder1 = function (targetE) {
  // where targetE is the selector with quotes
  var $target = $(targetE);

  this.psB1 = new TimelineMax({repeat:-1,yoyo:true});
  this.hcR1.yoyo(true);
  this.psB1.to($target,0.6,{outline:'5px solid #f0141e'});
}

marTron.events = function () {


  // stop clicks on the links from triggering the character entry
  $('a.readMore').click(function(e) {
    e.stopPropagation();
  });

	// when user changes the form field and submits, get the character data
	$('section.characterEntry form').on('submit', function(e) {
		e.preventDefault();
    e.stopPropagation();

		// create a reference to 'this' section...
		// aim for the parent
		var $targetParent = $(this).parents('section.characterEntry');
		console.log($targetParent);

		// grab the value from 'this' input field
		var inputString = $targetParent.find('input#hero').val();
		console.log('User input before encoding is %s', inputString);

		// encode the user's input so that it's ready for a URI string
		// https://stackoverflow.com/questions/332872/encode-url-in-javascript
		// not using this seems to work better than using it
		// inputString = encodeURIComponent(inputString);

		console.log('The user searches for: ',inputString);

		// use that input field value to get the character if any (it is the target destination)
		marTron.getCharacter($targetParent,inputString);

    // clear the input field once all of this is done
    $('section.characterEntry form input#hero').val('');

	});


	// if comic mode is true (thus enabled), if you click one of the character entries... you reveal its comics
	
	$('section.characterEntry article').on('click', function(e) {
		e.preventDefault();
		
		// if comic mode is enabled from nav menu
		if (marTron.comicMode == true) {
			// grab the data attribute with the character ID
			var $thisEntry = $(this);
			var heroID = $thisEntry.attr('data-martronheroid');
			console.log('The hero/character ID is %s', heroID);

			// use that data ID to find the correct comics
			// get digital comics for this named character
			// previous version used a character array, you have to change the GET to use a string
			marTron.getDigitalComics(heroID);
		}

	});

  // when the user hover over the character entries... 
  $('section.characterEntry').on('mouseover', function(e) {
    e.preventDefault();
    // console.log('Mouse over section.characterEntry works.');
    var $thisItem = $(this);

    // ----------------------------------------
    // TOOLTIP  ------------------
    // ----------------------------------------
    // setup the data attribute
    var comicToolTip = $thisItem.attr('data-comictooltips1');
    
    // display the tool tip
    // $thisItem.find('aside.tooltip').css('display', 'flex');
    // Tween option
    TweenMax.to($thisItem.find('aside.tooltip'),0.8,{display:'flex'});
    // ----------------------------------------
    // END TOOLTIP  ------------------
    // ----------------------------------------
    
    // ----------------------------------------
    // ANIMATIONS  ------------------
    // ----------------------------------------
    // remove the transform to straighten them out
    // expand the size/scale them
    // move them into center position
    TweenMax.to($(this),1.5,{scaleX:1.2,scaleY:1.2,ease:Power2.easeIn});

    // ----------------------------------------
    // END ANIMATIONS  ------------------
    // ----------------------------------------

  })
  .on('mouseout', function(e) {
    // console.log('Mouse out of section.');
    e.preventDefault();
    var $thisItem = $(this);
    
    // ----------------------------------------
    // TOOLTIP  ------------------
    // ----------------------------------------
    // $thisItem.find('aside.tooltip').css('display', 'none');
    TweenMax.to($thisItem.find('aside.tooltip'),0.8,{display:'none'});
    // ----------------------------------------
    // END TOOLTIP  ------------------
    // ----------------------------------------
    
    // ----------------------------------------
    // ANIMATIONS  ------------------
    // ----------------------------------------
    // add back the transform
    TweenMax.to($(this),1.5,{scaleX:1,scaleY:1,ease:Power2.easeIn});
    // TweenMax.to($(this),1.5,{scaleX:1,scaleY:1,ease:Power2.easeIn,css:{transform:'translateX(0) translateY(0) translateZ(15px)'}});
    // un-scale them
    // move them back to their original position
    // ----------------------------------------
    // END ANIMATIONS  ------------------
    // ----------------------------------------
  });

  // ----------------------------------------
  // EXPLORE UNIT ANIMATION  ------------------
  // ----------------------------------------

  // WARNING:  section.exploreUnit don't exist yet, they are dynamically created, you need event delegation
  $('section.displayDisc').on('mouseover','section.exploreUnit', function(e) {
    e.preventDefault();
    //setup the pulsing border animation
    marTron.pulsingBorder1($(this));

    // console.log('section.exploreUnit mouseover fired');    
    TweenMax.to($(this),0.6,{scaleX:1.5,scaleY:1.5,zIndex:10,ease:Power2.easeIn});

    marTron.psB1.play();
  }).on('mouseout','section.exploreUnit', function(event) {
    event.preventDefault();
    // console.log('section.exploreUnit mouseout fired');
    TweenMax.to($(this),0.3,{scaleX:1,scaleY:1,zIndex:0,ease:Power2.easeIn});

    marTron.psB1.kill();
  });

  // ----------------------------------------
  // END EXPLORE UNIT ANIMATION  ------------------
  // ----------------------------------------

 

}


// method to initialize our application
// all our code will be put inside here
// you should not be defining things in here
marTron.init = function () {
  marTron.firstLoadAnim1();
  marTron.hoverCardsLeft1();
  marTron.hoverCardsCenter1();
  marTron.hoverCardsRight1();
	marTron.randomCharacters1(marTron.characterDefaultSearch1);
  marTron.comicTooltips();
	marTron.events();
	
}

//////////////////////////////////////////////////
// EXECUTION CODE

jQuery(document).ready(function($) {
	marTron.init();
});  //end doc.onready function

//////////////////////////////////////////////////