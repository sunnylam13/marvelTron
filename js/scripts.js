/* 
* Tuesday, July 14, 2015 10:48 AM
* next time setup multiple javascript files for broad categories of functions or aspects... like comics, tv shows, movies?  then again they sometimes access the same information...
* 
*/


//////////////////////////////////////////////////
// GLOBAL VARIABLES
////////////////////////////////////////////

  var marTron = {};

  marTron.baseURL = "http://gateway.marvel.com:80/v1/public/";
  marTron.publicKey = "2c57ad00857c6163fa0417563cd31499";
  marTron.limit = 50;

  // ----------------------------------------
  // CHARACTERS  ------------------
  // ----------------------------------------
    marTron.characterDefaultSearch1 = ["Wolverine","Hulk","Thor","Captain America","Silver Surfer", "Thanos","Iron Man","Vision","Warpath","Silver Sable","daredevil"];
    marTron.characterIDStored = [];
    marTron.singleCharacterID = "";
    marTron.categoryURLAdd = [
      "characters",
      "comics",
      "creators",
      "events",
      "series",
      "stories"
    ];
  // ----------------------------------------
  // END CHARACTERS  ------------------
  // ----------------------------------------

  // ----------------------------------------
  // SEARCH MODES  ------------------
  // ----------------------------------------
    marTron.comicMode = true;
    marTron.movieMode = false;
    marTron.tvMode = false;
  // ----------------------------------------
  // END SEARCH MODES  ------------------
  // ----------------------------------------

  // ----------------------------------------
  // DISPLAY DISC  ------------------
  // ----------------------------------------
    marTron.sliderParent = $('figure#spinner');
    marTron.spinner = $('figure#spinner');
    marTron.angle = 0;
    marTron.netDegrees = 360;
    marTron.leftPrev = $('span.fa.fa-chevron-left');
    marTron.rightNext = $('span.fa.fa-chevron-right');

  // ----------------------------------------
  // END DISPLAY DISC  ------------------
  // ----------------------------------------

  // ----------------------------------------
  // COMICS  ------------------
  // ----------------------------------------
    // marTron.items1 holds the items in the gallery... whether they're images or a div
    marTron.items1 = $('section.exploreUnit');
  // ----------------------------------------
  // END COMICS  ------------------
  // ----------------------------------------

  // ----------------------------------------
  // MOVIES  ------------------
  // ----------------------------------------
    marTron.omdbBaseURL = "http://www.omdbapi.com/";
    marTron.omdbArray1 = [];
    marTron.movieUnit = $("section.movieUnit");
    marTron.modalDetails = $("section.modalDetails");
    marTron.modalDetailsRef = $('section.modalDetails .text');
    marTron.movieIndexArray = [];
    marTron.movieObjArray = [];
    marTron.tvIndexArray = [];
    marTron.tvObjArray = [];
    marTron.movieTracker = {};
    marTron.tvTracker = {};
  // ----------------------------------------
  // END MOVIES  ------------------
  // ----------------------------------------

  // ----------------------------------------
  // STATUS MESSAGES  ------------------
  // ----------------------------------------
    marTron.statusMessageBox1 = $('aside.statusBox');
  // ----------------------------------------
  // END STATUS MESSAGES  ------------------
  // ----------------------------------------

//////////////////////////////////////////////////
// END GLOBAL VARIABLES
////////////////////////////////////////////


////////////////////////////////////////////
// 		CHARACTER
////////////////////////////////////////////

  // ----------------------------------------
  // GET CHARACTER REQUEST  ------------------
  // ----------------------------------------
    marTron.getCharacter = function (targetParent,userInputString) {
      var targetType = marTron.categoryURLAdd[marTron.categoryURLAdd.indexOf('characters')];
      // console.log('The target category is %s', targetType);

      var $targetParent = targetParent;
      // console.log($targetParent);

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

      // display a status message that you're getting character data
      marTron.showStatusMsg1("Getting character data...");

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
          // console.log('The getCharacterNames success callback was reached');
          
          if (!data) {
            marTron.showStatusMsg1("No character data available at this time.");
          }

          // the server returns the data in JSONP format, which must be converted to Javascript with JSON.parse(ARRAY)
          var convertData = JSON.parse(data);
          // console.log('The converted data is now an object', convertData);

          // display character entry
          // don't forget to pass the targetParent as per the parameter design
          marTron.displayCharacter(targetParent,convertData);

          // I want the character's ID stored anyway as a data attribute for later access when calling comics upon click
          marTron.characterIDStored.push(marTron.getCharacterID(convertData));
          marTron.singleCharacterID = marTron.getCharacterID(convertData);
          // console.log('Character ID stored is ', marTron.characterIDStored);

          // give the article a data attribute matching the character's id by passing the data object
          // also give the article a data attribute for hero name for later movie and tv searches
          // targetParent.find('article').attr('data-martronheroid', marTron.getCharacterID(convertData).id);
          targetParent.find('article').attr({
            'data-martronheroid': marTron.getCharacterID(convertData).id,
            'data-martronheroname': marTron.getCharacterID(convertData).name
          });

          marTron.showStatusMsg1("Character retrieval complete.");

        }
      })
      // .done(function() {
      //   console.log("success");
      // })
      // .fail(function() {
      //   console.log("error");
      // })
      // .always(function() {
      //   // console.log("complete");
      //   // marTron.showStatusMsg1("Character retrieval complete.");
      // });
      
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
    	// console.log(item);

    	// store reference to target destination
    	var $targetParent = targetParent;
    	// console.log($targetParent);

    	// this always selects the first character that matches
    	var targetResults = apiObj.data.results[0];
    	// console.log(targetResults);


    	// if the search yields matches do this
    	if (targetResults) {
    		// store the reference to the existing <article> entry
    			var $targetAppend = $targetParent.find('article');

    			// empty out the previous contents of <article>
    			// WARNING:  disable this if using the replace method
    			// $targetAppend.empty();


    			// data for the entry
    			var nameHero = targetResults.name;
    			// console.log('Character name', nameHero);
           
    			// "http://i.annihil.us/u/prod/marvel/i/mg/5/a0/538615ca33ab0"
    			// https://i.annihil.us/u/prod/marvel/i/mg/e/e0/537bafa34baa9.jpg
    			// you have to concatenate the https://i.annihil.us/u/prod/marvel/i/mg/e/e0/537bafa34baa9/ + '.' + '.jpg'
    			if (targetResults.thumbnail != undefined || targetResults.thumbnail != null) {
            var thumbnail = targetResults.thumbnail.path + "." + targetResults.thumbnail.extension;
            // console.log('The image thumbnail is', thumbnail);
          }
          
          var description = targetResults.description;
          // console.log('The character description is', description);
          if (description == "") {
            description = "No data available at this time.  Please check back later.";
          }
    			
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

          marTron.showStatusMsg1("Character data displayed.");
    	}

      // if the search yields no matches
      if (!targetResults) {
        marTron.showStatusMsg1("No character data available to display.");
      }
    	
    }
  // ----------------------------------------
  // END DISPLAY CHARACTER  ------------------
  // ----------------------------------------

  // ----------------------------------------
  // CHARACTER EVENTS  ------------------
  // ----------------------------------------
    marTron.characterEvents = function () {
      // things were starting to get crowded
      // this holds the events for the character entries
      

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
        // console.log($targetParent);

        // grab the value from 'this' input field
        var inputString = $targetParent.find('input#hero').val();
        // console.log('User input before encoding is %s', inputString);

        // encode the user's input so that it's ready for a URI string
        // https://stackoverflow.com/questions/332872/encode-url-in-javascript
        // NOTE:  not using this seems to work better than using it
        // inputString = encodeURIComponent(inputString);

        // console.log('The user searches for: ',inputString);

        // use that input field value to get the character if any (it is the target destination)
        marTron.getCharacter($targetParent,inputString);

        // display the comics of the newly searched character
        // get their ID
        // pass this ID to the comic getting
        // allow this to work only if comic mode is true
        
        if (marTron.comicMode == true) {
          marTron.getDigitalComics(marTron.singleCharacterID.id);
        }

        // display movies if movie mode is true
        if (marTron.movieMode == true) {
          // marTron.spinner.empty();
          marTron.getMovies(inputString,"movie");
          // marTron.displayMovies(marTron.omdbArray1,"movie");
        }

        if (marTron.tvMode ==  true) {
          marTron.getMovies(inputString,"series");
        }

        // display tv shows if tv mode is true

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
          // console.log('The hero/character ID is %s', heroID);

          // use that data ID to find the correct comics
          // get digital comics for this named character
          // previous version used a character array, you have to change the GET to use a string
          marTron.getDigitalComics(heroID);
        }

        if (marTron.movieMode == true) {
          // grab the data attribute with the hero's name
          var $thisEntry = $(this);
          var heroName = $thisEntry.attr('data-martronheroname');
          console.log('The character name is %s', heroName);

          // marTron.spinner.empty();
          marTron.getMovies(heroName,"movie");
        }

        if (marTron.tvMode ==  true) {
          // grab the data attribute with the hero's name
          var $thisEntry = $(this);
          var heroName = $thisEntry.attr('data-martronheroname');
          // console.log('The character name is %s', heroName);

          // marTron.spinner.empty();
          marTron.getMovies(heroName,"series");
        }

      });

      // TOOLTIP ANIMATIONS
      // when the user hover over the character entries... display the tool tip
      $('section.characterEntry').on('mouseover', function(e) {
        e.preventDefault();
        // console.log('Mouse over section.characterEntry works.');
        var $thisItem = $(this);

        // ----------------------------------------
        // TOOLTIP  ------------------
        // ----------------------------------------
        if (marTron.comicMode == true) {
          var comicToolTip = $thisItem.attr('data-comictooltips1');
          $thisItem.find('aside.tooltip p').text("Click for this character's comics.")
        }

        if (marTron.movieMode ==  true) {
          $thisItem.find('aside.tooltip p').text("Click for this character's movies.")
        }

        if (marTron.tvMode ==  true) {
          $thisItem.find('aside.tooltip p').text("Click for this character's TV series.")
        }

        // display the tool tip
        TweenMax.to($thisItem.find('aside.tooltip'),0.8,{display:'flex'});
        // ----------------------------------------
        // END TOOLTIP  ------------------
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
        
      });

      // LEFT SECTION ENTRY HOVER ANIMATIONS
      $('section.characterEntry:nth-child(1)').on('mouseover', function(e) {
        e.preventDefault();
        // console.log('Mouse over section.characterEntry works.');
        var $thisItem = $(this);

        // ----------------------------------------
        // ANIMATIONS  ------------------
        // ----------------------------------------
        

        // remove the transform to straighten them out
        // expand the size/scale them
        // move them into center position
        TweenMax.to($(this),1.5,{css:{transform:"matrix(1,0,0,1,0,0) scaleX(1.2) scaleY(1.2)"},ease:Power2.easeIn});

        // ----------------------------------------
        // END ANIMATIONS  ------------------
        // ----------------------------------------

      })
      .on('mouseout', function(e) {
        // console.log('Mouse out of section.');
        e.preventDefault();
        var $thisItem = $(this);
        
        // ----------------------------------------
        // ANIMATIONS  ------------------
        // ----------------------------------------
        // add back the transform
        TweenMax.to($(this),1.5,{css:{transform:"matrix(1,-0.5,0,1,0,0) scaleX(1) scaleY(1)"},ease:Power2.easeIn});
        // un-scale them
        // move them back to their original position
        // ----------------------------------------
        // END ANIMATIONS  ------------------
        // ----------------------------------------
      });


      // RIGHT SECTION ENTRY HOVER ANIMATIONS
      $('section.characterEntry:nth-child(3)').on('mouseover', function(e) {
        e.preventDefault();
        // console.log('Mouse over section.characterEntry works.');
        var $thisItem = $(this);

        // ----------------------------------------
        // ANIMATIONS  ------------------
        // ----------------------------------------
        

        // remove the transform to straighten them out
        // expand the size/scale them
        // move them into center position
        // TweenMax.to($(this),1.5,{scaleX:1.2,scaleY:1.2,ease:Power2.easeIn,css:{transform:"matrix(1,0,0,1,0,0)"}});
        TweenMax.to($(this),1.5,{css:{transform:"matrix(1,0,0,1,0,0) scaleX(1.2) scaleY(1.2)"}, ease:Power2.easeIn});

        // ----------------------------------------
        // END ANIMATIONS  ------------------
        // ----------------------------------------

      })
      .on('mouseout', function(e) {
        // console.log('Mouse out of section.');
        e.preventDefault();
        var $thisItem = $(this);
        
        // ----------------------------------------
        // ANIMATIONS  ------------------
        // ----------------------------------------
        // add back the transform
        // TweenMax.to($(this),1.5,{scaleX:1,scaleY:1,ease:Power2.easeIn,css:{transform:"matrix(1,0.5,0,1,0,0)"}});
        TweenMax.to($(this),1.5,{css:{transform:"matrix(1,0.5,0,1,0,0) scaleX(1) scaleY(1)"},ease:Power2.easeIn});
        // TweenMax.to($(this),1.5,{scaleX:1,scaleY:1,ease:Power2.easeIn,css:{transform:'translateX(0) translateY(0) translateZ(15px)'}});
        // un-scale them
        // move them back to their original position
        // ----------------------------------------
        // END ANIMATIONS  ------------------
        // ----------------------------------------
      });

      // CENTRE CHARACTER ENTRY
      $('section.characterEntry:nth-child(2)').on('mouseover', function(e) {
        e.preventDefault();
        // console.log('Mouse over section.characterEntry works.');
        var $thisItem = $(this);

        // ----------------------------------------
        // ANIMATIONS  ------------------
        // ----------------------------------------
        

        // remove the transform to straighten them out
        // expand the size/scale them
        // move them into center position
        TweenMax.to($(this),1.5,{scaleX:1.2,scaleY:1.2,ease:Power2.easeIn});
        // TweenMax.to($(this),1.5,{scaleX:1.2,scaleY:1.2,ease:Power2.easeIn,transform:"matrix(1,-0.5,0,1,0,0)"});

        // ----------------------------------------
        // END ANIMATIONS  ------------------
        // ----------------------------------------

      })
      .on('mouseout', function(e) {
        // console.log('Mouse out of section.');
        e.preventDefault();
        var $thisItem = $(this);
        
        // ----------------------------------------
        // ANIMATIONS  ------------------
        // ----------------------------------------
        // add back the transform
        TweenMax.to($(this),1.5,{scaleX:1,scaleY:1,ease:Power2.easeIn});
        // TweenMax.to($(this),1.5,{scaleX:1.2,scaleY:1.2,ease:Power2.easeIn,transform:"matrix(1,0,0,1,0,0)"});
        // TweenMax.to($(this),1.5,{scaleX:1,scaleY:1,ease:Power2.easeIn,css:{transform:'translateX(0) translateY(0) translateZ(15px)'}});
        // un-scale them
        // move them back to their original position
        // ----------------------------------------
        // END ANIMATIONS  ------------------
        // ----------------------------------------
      });

    }
  // ----------------------------------------
  // END CHARACTER EVENTS  ------------------
  // ----------------------------------------

  // ----------------------------------------
  // RANDOM CHARACTER START  ------------------
  // ----------------------------------------
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
            // store the random number in the previous number array
            randNumPrev.push(randNum);
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
  // ----------------------------------------
  // END RANDOM CHARACTER START  ------------------
  // ----------------------------------------


  // ----------------------------------------
  // ANIMATION EVENTS  ------------------
  // ----------------------------------------
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
  // ----------------------------------------
  // END ANIMATION EVENTS  ------------------
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
    // the search for comics does not use character names, only IDs so you have to extract the character's ID
    marTron.getCharacterID = function (apiObj) {
      // I want to return an object with a key value pair where key is the name of the character and the ID is the number returned
      
      var item = apiObj;
      var targetResults = apiObj.data.results[0];

      // var heroName = targetResults.name.toString();
      // var heroID = targetResults.id;

      // console.log('The name of the selected hero is ',targetResults.name);
      // console.log("The ID of the selected hero is ", targetResults.id);

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

      marTron.showStatusMsg1("Comic retrieval in progress.");

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

          if (!res) {
            marTron.showStatusMsg1("No comic data available.");
          }

          // the server returns the data in JSONP format, which must be converted to Javascript with JSON.parse(ARRAY)
          var convertData = JSON.parse(res);
          // console.log('The converted data is now an object', convertData);

          marTron.displayComicCovers(convertData);

          marTron.showStatusMsg1("Comic retrieval complete.");
        }
      })
      .done(function() {
        // console.log("success");
        marTron.showStatusMsg1("Comic retrieval complete.");
      })
      // .fail(function() {
      //   console.log("error");
      // })
      // .always(function() {
      //   console.log("complete");
      // });

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

      marTron.showStatusMsg1("Displaying comic covers now...");

      // if there is data to display do it
      if (apiObj) {

        marTron.showStatusMsg1("Displaying comic covers now...");

        var item = apiObj;
        var targetResultsArray = apiObj.data.results;
        // console.log(targetResultsArray);

        // empty the $('section.displayDisc')
        marTron.sliderParent.empty();

        // set the $('section.displayDisc') to have padding top and bottom of 10% each
        TweenMax.to(marTron.sliderParent,2,{ease:Power2.easeIn,paddingTop: '10%',paddingBottom: '10%'});

        $.each(targetResultsArray, function(index, objItem) {

          // COMIC COVER  ------------------------------------------------
          var $section = $('<section>').addClass('exploreUnit');
          
          var $imgFrame = $('<div>').addClass('imgFrame');

          // the images of the comic are in an array and include the first image which is the cover...  that would be objItem.images[0]
          // the remaining images are previews... with text separated out
          // if (objItem.images != null || objItem.images != undefined) {
          //   var $img = $('<img>').attr('src', objItem.images[0].path + "." + objItem.images[0].extension);
          //   $imgFrame.append($img);
          // }

          if (objItem != null || objItem != undefined) {
            var $img = $('<img>').attr('src', objItem.images[0].path + "." + objItem.images[0].extension);
            $imgFrame.append($img);
          }

          var $frame = $('<div>').addClass('frame');
          // END COMIC COVER ------------------------------------------------
          
          // COMIC BUTTONS  ------------------------------------------------
          // the issue is whether the url array links increase or change
          // store a reference to the "reader" link
          if (marTron.retrieveURL(objItem.urls, "reader")) {
            // var readerLink = objItem.urls[2];
            // console.log(readerLink);
            var readerLink = marTron.retrieveURL(objItem.urls, "reader");
            // console.log(readerLink);
          }

          // store a reference to the "purchase" link
          if (marTron.retrieveURL(objItem.urls, "purchase")) {
            // var purchaseLink = objItem.urls[1];
            // console.log(purchaseLink);
            var purchaseLink = marTron.retrieveURL(objItem.urls, "purchase");
            // console.log(purchaseLink);
          }
          
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
          // END COMIC BUTTONS ------------------------------------------------

          // join everything together
          $aPurchase.append($buttonPurchase);
          $aPreview.append($buttonPreview);

          // $frame.append($buttonPreview,$button);
          $frame.append($aPreview,$aPurchase);
          // $imgFrame.append($img);
          $section.append($imgFrame,$frame);
          // $li.append($section);
          marTron.sliderParent.append($section);
        });

        // marTron.showStatusMsg1("Comics displayed below.");
      }

      marTron.showStatusMsg1("Comics displayed below...");

      // if there is no data to display
      if (!apiObj) {
        marTron.showStatusMsg1("No comics to display.");
      }

    }
  // ----------------------------------------
  // END DISPLAY COMICS  ------------------
  // ----------------------------------------

  // ----------------------------------------
  // ANIMATION EVENTS  ------------------
  // ----------------------------------------

  // ----------------------------------------
  // END ANIMATION EVENTS  ------------------
  // ----------------------------------------

  // ----------------------------------------
  // COMIC EVENTS  ------------------
  // ----------------------------------------
    marTron.comicEvents = function () {
      // ----------------------------------------
      // EXPLORE UNIT ANIMATION  ------------------
      // ----------------------------------------

      // WARNING:  section.exploreUnit don't exist yet, they are dynamically created, you need event delegation
      $('section.displayDisc').on('mouseover','section.exploreUnit', function(e) {
        e.preventDefault();

        // console.log('section.exploreUnit mouseover');

        //setup the pulsing border animation
        marTron.pulsingBorder1($(this));

        // console.log('section.exploreUnit mouseover fired');    
        TweenMax.to($(this),0.6,{scaleX:1.5,scaleY:1.5,zIndex:10,ease:Power2.easeIn});

        marTron.psB1.play();
      }).on('mouseout','section.exploreUnit', function(event) {
        event.preventDefault();

        // console.log('section.exploreUnit mouseout');

        // console.log('section.exploreUnit mouseout fired');
        TweenMax.to($(this),0.3,{scaleX:1,scaleY:1,zIndex:0,ease:Power2.easeIn});

        // WARNING:  you'll want a reverse and then a kill at this point... provided that your animation sequence starts with a base state, goes to your desired end state and then ends back at your base state... otherwise if you mouseout halfway through the animation, the outline/border remains midway which isn't what I want
        marTron.psB1.reverse();
        marTron.psB1.kill();

      });

      // ----------------------------------------
      // END EXPLORE UNIT ANIMATION  ------------------
      // ----------------------------------------
    }
  // ----------------------------------------
  // END COMIC EVENTS  ------------------
  // ----------------------------------------

////////////////////////////////////////////
// 		END COMIC
////////////////////////////////////////////


////////////////////////////////////////////
//    MOVIES
////////////////////////////////////////////

  /* 
  * Monday, June 22, 2015 10:36 AM
  * There is currently an error retrieving movie and TV posters when using any domain other than localhost.
  * close though not quite:  https://stackoverflow.com/questions/16135965/image-getting-403-forbidden-when-deployed-to-server
  * that answer was focused on server side
  * 
  */

  marTron.movieModeGet = function (searchString,typeString, paramObject,startSearchYear,currentYear) {
    if (marTron.movieMode == true) {
      // we want to empty out the storage array every time we make a new request... because below we're pushing the objects into it... that means the entries build up and keep being displayed
        // this has to be placed outside of the loop or you'll have nothing
        marTron.omdbArray1 = [];

        marTron.showStatusMsg1("Getting movie data...");

        for (var i = startSearchYear; i < currentYear; i++) {
          // t will change based on the passed search query
          // i is the year
          paramObj = {
            // callback: "marvelMovieSearch",
            t: searchString,
            y: i,
            type: typeString,
            plot: "full",
            r: "json",
            tomatoes: "true"
          };

          $.ajax({
            url: marTron.omdbBaseURL,
            type: 'GET',
            dataType: 'json',
            data: paramObj,
            success: function (res,status,jqXHR) {
              // console.log(res);
              // Object {Response: "False", Error: "Movie not found!"}
              if (!res.Error || !res.Response || res.Response != "False" || res.Error != "Movie not found!") {
                // console.log('marTron.getMovies GET was successful.');
                // console.log(status);
                // console.log(res);

                marTron.omdbArray1.push(res);
                // console.log(marTron.omdbArray1);
              }
            }
          })
          .done(function() {
            // console.log("success");

            // runn the function that displays all the movie posters works best when put here in the .done() method...
            // because in this instance we're querying dozens of times to create the object, placing the function in .success() wouldn't work, it has to be activated after the object is finished

            if (marTron.omdbArray1) {
              // empty the target location
              // placing the emptying here works very well to clear out everything before placing new items
              // marTron.spinner.empty();
              // marTron.sliderParent.empty();

              marTron.displayMovies(marTron.omdbArray1,"movie")

              marTron.showStatusMsg1("Movie retrieval complete... see below.");
            }

            if (!marTron.omdbArray1) {
              marTron.showStatusMsg1("No movie data available.");
            }
          })
          // .fail(function() {
          //   console.log("error");
          // })
          // .always(function() {
          //   console.log("complete");
          // });
          
        }  

        marTron.showStatusMsg1("Movie data retrieval complete...");
    }
  }

  marTron.tvModeGet = function (searchString,typeString, paramObject,startSearchYear,currentYear) {

    // in this version we don't use typeString at all because we want to find both tv "series" and "episode"... we run a loop for each one, and accumulate the entries into a single array
    // if we find that the "episode" search type yields nothing useful we may disable it

    if (marTron.tvMode == true) {
      // we want to empty out the storage array every time we make a new request... because below we're pushing the objects into it... that means the entries build up and keep being displayed
      // this has to be placed outside of the loop or you'll have nothing
      marTron.omdbArray1 = [];

      marTron.showStatusMsg1("Getting TV data right now...");

      // ----------------------------------------
      // SERIES  ------------------
      // ----------------------------------------
      // run the first GET loop to grab all those with episodes (aka "series")
      for (var i = startSearchYear; i < currentYear; i++) {
        // t will change based on the passed search query
        // i is the year
        paramObj = {
          // callback: "marvelMovieSearch",
          t: searchString,
          y: i,
          type: "series",
          plot: "full",
          r: "json",
          tomatoes: "true"
        };

        $.ajax({
          url: marTron.omdbBaseURL,
          type: 'GET',
          dataType: 'json',
          data: paramObj,
          success: function (res,status,jqXHR) {
            // console.log(res);
            // Object {Response: "False", Error: "Movie not found!"}
            if (!res.Error || !res.Response || res.Response != "False" || res.Error != "Movie not found!") {
              // console.log('marTron.getMovies GET was successful.');
              // console.log(status);
              // console.log(res);

              marTron.omdbArray1.push(res);
              // console.log(marTron.omdbArray1);
            }
          }
        })
        // .done(function() {
        //   console.log("success");
        // })
        // .fail(function() {
        //   console.log("error");
        // })
        // .always(function() {
        //   console.log("complete");
        // });
        
      }

      // ----------------------------------------
      // END SERIES  ------------------
      // ----------------------------------------

      // ----------------------------------------
      // EPISODE  ------------------
      // ----------------------------------------
      for (var i = startSearchYear; i < currentYear; i++) {
        // t will change based on the passed search query
        // i is the year
        paramObj = {
          // callback: "marvelMovieSearch",
          t: searchString,
          y: i,
          type: "episode",
          plot: "full",
          r: "json",
          tomatoes: "true"
        };

        $.ajax({
          url: marTron.omdbBaseURL,
          type: 'GET',
          dataType: 'json',
          data: paramObj,
          success: function (res,status,jqXHR) {
            // marTron.spinner.empty();
            // marTron.sliderParent.empty();

            

            // console.log(res);
            // Object {Response: "False", Error: "Movie not found!"}
            if (!res.Error || !res.Response || res.Response != "False" || res.Error != "Movie not found!") {
              console.log('marTron.getMovies GET was successful.');
              console.log(status);
              console.log(res);

              marTron.omdbArray1.push(res);
              // marTron.omdbArray1.push(convertedObj);
              console.log(marTron.omdbArray1);

              // marTron.spinner.empty();
              // marTron.sliderParent.empty();

            }
          }
        })
        .done(function() {
          // console.log("success");

          // NOTE:  The callback function is best placed here or within success and not outside

          // runn the function that displays all the movie posters works best when put here in the .done() method...
          // because in this instance we're querying dozens of times to create the object, placing the function in .success() wouldn't work, it has to be activated after the object is finished

          if (marTron.omdbArray1) {
            // empty the target location
            // placing the emptying here works very well to clear out everything before placing new items
            // marTron.spinner.empty();
            // marTron.sliderParent.empty();

            marTron.displayMovies(marTron.omdbArray1,"series");

            marTron.showStatusMsg1("TV data retrieval complete... see below.");
          }

          if (!marTron.omdbArray1) {
            marTron.showStatusMsg1("No TV data available.");
          }
        })
        // .fail(function() {
        //   console.log("error");
        // })
        // .always(function() {
        //   console.log("complete");
        // });
        
      }
      // ----------------------------------------
      // END EPISODE  ------------------
      // ----------------------------------------

    }
  }

  marTron.getMovies = function (searchString,typeString) {
    // this method could be used to get either movies or tv series
    // typeString = "movie", "series", "episode"
    // otherwise you'd have to grab the object and write a loop to find data.Type=""
    
    var startSearchYear = 1945;
    var currentYear = new Date().getFullYear();

    // the parameter object is setup here
    var paramObj = {};

    // run the GET functions if movie mode is true
    marTron.movieModeGet(searchString,typeString,paramObj,startSearchYear,currentYear);
    
    // run the GET functions if tv mode is true
    marTron.tvModeGet(searchString,typeString,paramObj,startSearchYear,currentYear);
  }

  // a function similar to my Jade mixin that constructs each row
  // used in marTron.displayMovies() method
  // must be declared before it
  function rowEntry1 (txtLeft,txtRight) {
    var $divRow = $("<div>").addClass('row');
    var $divLeft = $("<div>").append($("<h4>").text(txtLeft));
    var $divRight = $("<div>").append($("<h4>").text(txtRight));
    var $rowEntry = $divRow.append($divLeft,$divRight);
    // don't forget to return your constructed item for use
    return $rowEntry;
  }

  function getMediaObj1 (string, indexArray, objArray) {
  	// using the supplied string, find the index number of it and store it
  	var indexNum = indexArray.indexOf(string);

  	// store a reference to the corresponding object
  	var dataObj = objArray[indexNum];

  	// return the data object for use
  	return dataObj;
  }

  marTron.displayMovies = function (mediaArray,typeString) {

    if (mediaArray) {
      // WARNING:  when testing in console, do not input a string for mediaArray, input the variable

      var arrayFile = mediaArray;

      // you will access an array of stored movie results
      // construct the html to insert into figure#spinner or the parent
      // this one function should be able to handle both movies and tv shows based on what mode is active
      // if you constructed the obj.getMovies() method to select for type movie, series, episode you won't have to use a loop to analyze/screen type

      // empty the existing entries within the modal
      // empty the $('section.displayDisc')
      marTron.spinner.empty();
      marTron.sliderParent.empty();

      // set the $('section.displayDisc') to have padding top and bottom of 10% each
      TweenMax.to(marTron.spinner,2,{ease:Power2.easeIn,paddingTop: '10%',paddingBottom: '10%'});

      // console.log(arrayFile);
      // console.log(arrayFile[0]);
      // console.log(arrayFile.length);
      // console.log('Display %s', typeString);

      $.each(mediaArray, function(index, objItem) {
        // if you weren't outputting specific data you would use Object.getOwnPropertyNames() or Object.keys() to construct arrays of all the property key names and match them to the values
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
        // https://stackoverflow.com/questions/6765864/javascript-get-first-and-only-property-name-of-object

        switch(typeString) {
          case "movie":
            // ----------------------------------------
            // MOVIE UNIT  ------------------
            // ----------------------------------------
            // this is the movie poster shown on the page

            // construct the parts for the displayed movie unit on the page
            var $section = $("<section>").addClass('movieUnit');
            var $imgFrame = $('<div>').addClass('imgFrame');
            if (objItem.Poster != "N/A") {
              var $img = $("<img>").attr('src', objItem.Poster);
            }
            var $frame = $("<div>").addClass('frame');
            var $buttonReadMore = $("<button>").attr({
              name: 'readMore',
              type: 'button'
            }).text("Read More");

            // if the media object has a display poster then show it, otherwise show nothing
            if (objItem.Poster != "N/A") {
              $frame.append($buttonReadMore);
              if ($img) {
                $imgFrame.append($img,$frame);
              }
              $section.append($imgFrame);
            }
            // ----------------------------------------
            // END MOVIE UNIT  ------------------
            // ----------------------------------------

            // ----------------------------------------
            // MOVIE DETAILS  ------------------
            // ----------------------------------------
            // construct the parts for details and store it in an object
            var dataDetails = {};

            // at the very minimum it has a title
            dataDetails.$h2 = $('<h2>').text(objItem.Title);
            if (objItem.Year != "N/A") {
              dataDetails.$year = rowEntry1("Year",objItem.Year);
            }
            if (objItem.Released != "N/A") {
              dataDetails.$released = rowEntry1("Released",objItem.Released);
            }
            if (objItem.Runtime != "N/A") {
              dataDetails.$runTime = rowEntry1("Runtime",objItem.Runtime);
            }
            if (objItem.Genre != "N/A") {
              dataDetails.$genre = rowEntry1("Genre",objItem.Genre);
            }
            if (objItem.Plot != "N/A") {
              dataDetails.$plot = rowEntry1("Plot",objItem.Plot);
            }
            if (objItem.Metascore != "N/A") {
              dataDetails.$metaScore = rowEntry1("Metascore",objItem.Metascore);
            }
            if (objItem.imdbRating != "N/A") {
              dataDetails.$imdbRating = rowEntry1("IMDB Rating",objItem.imdbRating);
            }
            if (objItem.tomatoRating != "N/A") {
              dataDetails.$rottenRating = rowEntry1("Rotten Tomatoes",objItem.tomatoRating);
            }
            if (objItem.tomatoConsensus != "N/A") {
              dataDetails.$rottenConsensus = rowEntry1("Tomato Consensus",objItem.tomatoConsensus);
            }
            if (objItem.BoxOffice != "N/A") {
              dataDetails.$boxOfficeEarn = rowEntry1("Box Office Earnings",objItem.BoxOffice);
            }
            
            // console.log('The movie whose data details were stored is %s',objItem.Title);
            // console.log(dataDetails);

            // do we need to convert the object into JSON string to store it in the data attribute... if you don't you see only [object Object], which doesn't work
            // NOTE**:  JSON parse/string won't help with DOM element insertion, it won't convert... I've tried...
            // the data is lost
            // {"$h2":{"0":{},"length":1},"$year":{"0":{},"length":1},"$released":{"0":{},"length":1},"$runTime":{"0":{},"length":1},"$genre":{"0":{},"length":1},"$plot":{"0":{},"length":1},"$metaScore":{"0":{},"length":1},"$imdbRating":{"0":{},"length":1},"$rottenRating":{"0":{},"length":1},"$rottenConsensus":{"0":{},"length":1},"$boxOfficeEarn":{"0":{},"length":1}}

            // store this movie's name and number into an object or array for later retrieval
            // switched to 2 arrays
            marTron.movieIndexArray.push(objItem.Title);
            marTron.movieObjArray.push(dataDetails);

            // attach the name of the movie to the section and use that to reference marTron.movieTracker and acquire the correct data
            $section.attr('data-movietrackerkey', objItem.Title);

            // ----------------------------------------
            // END MOVIE DETAILS  ------------------
            // ----------------------------------------

            // add the movie unit to the DOM
            // only if it actually has a poster image
            // marTron.spinner.append($section);

            if (objItem.Poster != "N/A") {
              marTron.spinner.append($section);
            }

            break;
          case "series":
            // ----------------------------------------
            // MOVIE UNIT  ------------------
            // ----------------------------------------
            // this is the movie poster shown on the page

            // construct the parts for the displayed movie unit on the page
            var $section = $("<section>").addClass('movieUnit');
            var $imgFrame = $('<div>').addClass('imgFrame');
            if (objItem.Poster != "N/A") {
              var $img = $("<img>").attr('src', objItem.Poster);
            }
            var $frame = $("<div>").addClass('frame');
            var $buttonReadMore = $("<button>").attr({
              name: 'readMore',
              type: 'button'
            }).text("Read More");

            if (objItem.Poster != "N/A") {
              $frame.append($buttonReadMore);
              if ($img) {
                $imgFrame.append($img,$frame);
              }
              $section.append($imgFrame);
            }
            // ----------------------------------------
            // END MOVIE UNIT  ------------------
            // ----------------------------------------

            // ----------------------------------------
            // MOVIE DETAILS  ------------------
            // ----------------------------------------
            // construct the parts for details and store it in an object
            var dataDetails = {};

            // at the very minimum it has a title
            dataDetails.$h2 = $('<h2>').text(objItem.Title);
            if (objItem.Year != "N/A") {
              dataDetails.$year = rowEntry1("Year",objItem.Year);
            }
            if (objItem.Released != "N/A") {
              dataDetails.$released = rowEntry1("Released",objItem.Released);
            }
            if (objItem.Runtime != "N/A") {
              dataDetails.$runTime = rowEntry1("Runtime",objItem.Runtime);
            }
            if (objItem.Genre != "N/A") {
              dataDetails.$genre = rowEntry1("Genre",objItem.Genre);
            }
            if (objItem.Plot != "N/A") {
              dataDetails.$plot = rowEntry1("Plot",objItem.Plot);
            }
            if (objItem.Metascore != "N/A") {
              dataDetails.$metaScore = rowEntry1("Metascore",objItem.Metascore);
            }
            if (objItem.imdbRating != "N/A") {
              dataDetails.$imdbRating = rowEntry1("IMDB Rating",objItem.imdbRating);
            }
            if (objItem.tomatoRating != "N/A") {
              dataDetails.$rottenRating = rowEntry1("Rotten Tomatoes",objItem.tomatoRating);
            }
            if (objItem.tomatoConsensus != "N/A") {
              dataDetails.$rottenConsensus = rowEntry1("Tomato Consensus",objItem.tomatoConsensus);
            }
            if (objItem.BoxOffice != "N/A") {
              dataDetails.$boxOfficeEarn = rowEntry1("Box Office Earnings",objItem.BoxOffice);
            }
            
            // console.log('The movie whose data details were stored is %s',objItem.Title);
            // console.log(dataDetails);

            // do we need to convert the object into JSON string to store it in the data attribute... if you don't you see only [object Object], which doesn't work
            // NOTE**:  JSON parse/string won't help with DOM element insertion, it won't convert... I've tried...
            // the data is lost
            // {"$h2":{"0":{},"length":1},"$year":{"0":{},"length":1},"$released":{"0":{},"length":1},"$runTime":{"0":{},"length":1},"$genre":{"0":{},"length":1},"$plot":{"0":{},"length":1},"$metaScore":{"0":{},"length":1},"$imdbRating":{"0":{},"length":1},"$rottenRating":{"0":{},"length":1},"$rottenConsensus":{"0":{},"length":1},"$boxOfficeEarn":{"0":{},"length":1}}

            // store this movie's name and number into an object or array for later retrieval
            // switched to 2 arrays
            marTron.tvIndexArray.push(objItem.Title);
            marTron.tvObjArray.push(dataDetails);

            // attach the name of the movie to the section and use that to reference marTron.movieTracker and acquire the correct data
            $section.attr('data-tvtrackerkey', objItem.Title);

            // ----------------------------------------
            // END MOVIE DETAILS  ------------------
            // ----------------------------------------

            // add the movie unit to the DOM
            // only if it actually has a poster image
            // marTron.spinner.append($section);

            if (objItem.Poster != "N/A") {
              marTron.spinner.append($section);
            }
            break;
        }

        
      });

      marTron.showStatusMsg1("Data is shown below.");

    }

    if (!mediaArray) {
      marTron.showStatusMsg1("No media data available for display.");
    }

  }

  marTron.displayMovieDetails = function () {
    // when the user clicks on the displayed movie item... since these displayed movies are dynamically generated you must use event delegation
    // navigate up to the parent movie unit, find the element with the "data-moviedetails" attribute
    // grab the value of the attribute "data-moviedetails" and store it in a reference
    // you should have the location of the data object with the DOM elements
    // open the section.modalDetails
    // erase the existing section.modalDetails .text
    // append the reference into it... with a loop
    
    // make sure to setup this event marTron.events()
    
    marTron.spinner.on('click', 'section.movieUnit button', function(e) {
      var thisItem = $(this);
      e.preventDefault();

      if (marTron.movieMode == true) {
        var dataItem = thisItem.parents("section.movieUnit").attr('data-movietrackerkey');
        // console.log(dataItem);
        // use the acquired key to access the marTron.movieTracker object and acquire the correct data object
        // var detailsObj = marTron.movieTracker[dataItem];
        // console.log(detailsObj);

        // use the data to search for correct object in 2 arrays
        var detailsObj = getMediaObj1(dataItem, marTron.movieIndexArray, marTron.movieObjArray);
        // console.log(detailsObj);

        // store a reference to the array object
        // passing the dataItem with the object location in the array should mean we have the movie object in question
        // var movieObj = marTron.movieArray1[dataItem];

        // empty the text area before you append anything
        marTron.modalDetailsRef.empty();

        $.each(detailsObj, function(index, objItem) {
          // where objItem is the DOM insert object
          marTron.modalDetailsRef.append(objItem);
        });
      }

      if (marTron.tvMode ==  true) {
        var dataItem = thisItem.parents("section.movieUnit").attr('data-tvtrackerkey');
        // console.log(dataItem);
        // use the acquired key to access the marTron.movieTracker object and acquire the correct data object
        // var detailsObj = marTron.movieTracker[dataItem];
        // console.log(detailsObj);

        // use the data to search for correct object in 2 arrays
        var detailsObj = getMediaObj1(dataItem, marTron.tvIndexArray, marTron.tvObjArray);
        // console.log(detailsObj);

        // store a reference to the array object
        // passing the dataItem with the object location in the array should mean we have the movie object in question
        // var movieObj = marTron.movieArray1[dataItem];

        // empty the text area before you append anything
        marTron.modalDetailsRef.empty();

        $.each(detailsObj, function(index, objItem) {
          // where objItem is the DOM insert object
          marTron.modalDetailsRef.append(objItem);
        });
      }

      // make the modal visible
      // marTron.modalDetails.css({
      //   display: 'flex',
      //   zIndex: '50',
      //   opacity: 0
      // });
      TweenMax.to(marTron.modalDetails,1,{display:'flex',zIndex: '50', opacity: 1});
    });


  }

  marTron.mediaEvents = function () {
    // for movies, tv series, episodes
    marTron.displayMovieDetails(); 
  }

////////////////////////////////////////////
//    END MOVIES
////////////////////////////////////////////


////////////////////////////////////////////
//    NAV MENU
////////////////////////////////////////////

  // ----------------------------------------
  // NAV MENU EVENTS  ------------------
  // ----------------------------------------
    marTron.navMenuEvents = function () {
      var $handle = $('.naviTab');
      var $target = $('nav.selectMenu');
      // toggleState... where true means menu is out, false means it's hidden
      var toggleState = false;
      marTron.comicModeButton = $('button.comics');
      marTron.movieModeButton = $('button.movies');
      marTron.tvModeButton = $('button.tvshows');

      $handle.on('click', function(e) {
        e.preventDefault();

        switch(toggleState) {
          case false:
            // $target.css('right', '0');
            TweenMax.to($target,1,{top:0,ease:Power2.easeIn});
            toggleState = true;
            break;
          case true:
            // $target.css('right', '-25%');
            TweenMax.to($target,1,{top:"-27%",ease:Power2.easeIn});
            toggleState = false;
            break;
        }
      });

      marTron.comicModeButton.on('click', function(e) {
        e.preventDefault();
        marTron.comicMode = true;
        marTron.movieMode = false;
        marTron.tvMode = false;

        marTron.showStatusMsg1("Comic Search Mode Activated");
      });

      marTron.movieModeButton.on('click', function(e) {
        e.preventDefault();
        marTron.comicMode = false;
        marTron.movieMode = true;
        marTron.tvMode = false;

        marTron.showStatusMsg1("Movie Search Mode Activated");
      });

      marTron.tvModeButton.on('click', function(e) {
        e.preventDefault();
        marTron.comicMode = false;
        marTron.movieMode = false;
        marTron.tvMode = true;

        marTron.showStatusMsg1("TV Search Mode Activated");
      });

    }
  // ----------------------------------------
  // END NAV MENU EVENTS  ------------------
  // ----------------------------------------

////////////////////////////////////////////
//    END NAV MENU
////////////////////////////////////////////


////////////////////////////////////////////
/////     HELPER FUNCTIONS
///////////////////////////////////////////////
  function getRandom (num) {
    var my_num = Math.floor(Math.random()*num);
    return my_num;
  }

  marTron.showStatusMsg1 = function (textString) {

    // console.log('marTron.showStatusMsg1 active');

    // create new sequence
    marTron.sSM1 = new TimelineMax();

    // empty the status message box
    marTron.statusMessageBox1.empty();

    // construct the new status
    var $statusMessage = $("<p>").text(textString);

    // change the status text
    marTron.statusMessageBox1.append($statusMessage);

    // make the modal appear
    // use yoyo so it returns to its previous state... yoyo doesn't work for once offs
    this.sSM1.to(marTron.statusMessageBox1,0.6,{top:"2%",opacity:1, zIndex: "15",ease:Power2.easeIn});
    // TweenMax.to(marTron.statusMessageBox1,0.6,{top:"2%",opacity:1, zIndex: "15",ease:Power2.easeIn});
    
    //make the modal disappear
    this.sSM1.to(marTron.statusMessageBox1,5,{top:"-50em",opacity:0, zIndex: "-5",ease:Power2.easeIn});
    
    //execute the sequence
    this.sSM1.play();

    // setTimeout(marTron.sSM1.reverse(), 3000);

    // entire sequence should only happen once
  }

  marTron.modalDetailsEvents = function () {
    // if you click the big modal anywhere you close it
    marTron.modalDetails.on('click', function(e) {
      e.preventDefault();
      TweenMax.to(marTron.modalDetails,1,{display:'none',zIndex: '-5', opacity: 0});
    });
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

  marTron.pulsingBorder1 = function (targetE) {
    /* 
    * typically used for the comic covers when users hover over them...
    * 
    */

    // where targetE is the selector with quotes
    var $target = $(targetE);

    this.psB1 = new TimelineMax({repeat:-1,yoyo:true});
    this.hcR1.yoyo(true);
    this.psB1.to($target,0.6,{outline:'none'});
    this.psB1.to($target,0.6,{outline:'5px solid #f0141e'});
    this.psB1.to($target,0.6,{outline:'none'});
  }
///////////////////////////////////////////////
/////     END HELPER FUNCTIONS
///////////////////////////////////////////////



////////////////////////////////////////////
//    EVENTS
////////////////////////////////////////////
  marTron.events = function () {

    marTron.navMenuEvents();
    marTron.firstLoadAnim1();
    marTron.modalDetailsEvents();

    marTron.hoverCardsLeft1();
    marTron.hoverCardsCenter1();
    marTron.hoverCardsRight1();

    marTron.randomCharacters1(marTron.characterDefaultSearch1);

    marTron.comicTooltips();
    marTron.characterEvents();
    marTron.comicEvents();
    marTron.mediaEvents();
  }
////////////////////////////////////////////
//    END EVENTS
////////////////////////////////////////////


////////////////////////////////////////////
//    INIT
////////////////////////////////////////////
  marTron.init = function () {
    marTron.events();
    
  }
////////////////////////////////////////////
//    END INIT
////////////////////////////////////////////


// method to initialize our application
// all our code will be put inside here
// you should not be defining things in here


//////////////////////////////////////////////////
// EXECUTION CODE

jQuery(document).ready(function($) {
	marTron.init();
});  //end doc.onready function

//////////////////////////////////////////////////