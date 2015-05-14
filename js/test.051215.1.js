//////////////////////////////////////////////////
// GLOBAL VARIABLES

// create an empty object... which is the start of the application
// you don't have to start it empty though... it is cleaner however
// the word app is too generic...
// you might use the initials of the website you're designing

// WARNING:  if there are extensions or plugins included then variable names may overlap without you knowing hence why we want to use name spacing

// NOTE:  if you had your objects and functions inside the jQuery(document).ready() you can't access the object within the console...  if you do it outside of it however you can access it at any time and anywhere, it's no longer trapped as a local variable or function within the jQuery(document).ready()

// ----------------------------------------
// CHARACTER EXTRACTION  
// ---------------------------------------------
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
mATest1.characterIDStored = [];
// ----------------------------------------
// // END CHARACTER EXTRACTION
// --------------------------------------------





// ----------------------------------------
// AMAZON PRODUCT  ------------------------------------------------
var maProd1 = {};

maProd1.baseURL = "http://ecs.amazonaws.com/onca/xml";
maProd1.awsAccessKeyIDRoot1 = "AKIAJ3BLXKR72AHUXC2A";
// maProd1.awsAccessKeyIDIAM1 = "AKIAIF2W6LINNXUTS6SA";
maProd1.awsAccessKeyIDIAM1 = "AKIAJZJ24QDU2BQBDIHQ";
maProd1.awsAccessKeyIDIAM1b = "OHq2HHrknWTje277e/zak58VnujXd8HcrYmEA39n";

// maProd1.associateTag = "sunnylamca-20";
// maProd1.keyWords1 = "";
// maProd1.operation1 = "ItemSearch";
// maProd1.searchIndex1 = "Books";
// maProd1.service1 = "AWSECommerceService";
// maProd1.version = "2011-08-01";
maProd1.hashBaseEncoded1 = "32ca31fbaef0779282ef774df4f64f31656a182e9239030530c4319c33604766";

maProd1.hashIAM1 = "ea261c38392c89dccfe8116ca0341d8fe90319e893eb9f1b65363ac5afa45c61";
maProd1.hashIAMEncoded1 = "5dffbeb74abb3247b20e91c5b8821adbc6003139b3d74526d8fb18f026ccb757";



// ----------------------------------------
// // END AMAZON PRODUCT 
// ----------------------------------------------



//////////////////////////////////////////////////
// FUNCTIONS

// don't forget to call the function in EXECUTION CODE area before running

// NOTE:  in terms of organization, Ryan prefers to put all other functions and variables above the object.init() method however in reality it doesn't matter

// ----------------------------------------
// HELPER  ------------------
// ----------------------------------------
function getNowTimeStamp() {
  var time = new Date();
  var gmtTime = new Date(time.getTime() + (time.getTimezoneOffset() * 60000));
  return gmtTime.toISODate() ;
}

function addZero(n) {
  return ( n < 0 || n > 9 ? "" : "0" ) + n;
}

function sign(secret, message) {
  var messageBytes = str2binb(message);
  var secretBytes = str2binb(secret);
  
  if (secretBytes.length > 16) {
      secretBytes = core_sha256(secretBytes, secret.length * chrsz);
  }
  
  var ipad = Array(16), opad = Array(16);
  for (var i = 0; i < 16; i++) { 
      ipad[i] = secretBytes[i] ^ 0x36363636;
      opad[i] = secretBytes[i] ^ 0x5C5C5C5C;
  }

  var imsg = ipad.concat(messageBytes);
  var ihash = core_sha256(imsg, 512 + message.length * chrsz);
  var omsg = opad.concat(ihash);
  var ohash = core_sha256(omsg, 512 + 256);
  
  var b64hash = binb2b64(ohash);
  var urlhash = encodeURIComponent(b64hash);
  
  return urlhash;
}

function jsonParse (dataObj) {
  var convertData = JSON.parse(dataObj);
  console.log('The converted data is now an object', dataObj);
  return convertData;
}

// ----------------------------------------
// END HELPER  ------------------
// ----------------------------------------






// ----------------------------------------
// GET CHARACTER NAMES  ------------------
// ----------------------------------------
mATest1.getCharacterNames = function () {
  var targetType = mATest1.categoryURLAdd[mATest1.categoryURLAdd.indexOf('characters')];
  // console.log('The target category is %s', targetType);

  var baseURL = mATest1.baseURL;
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

      // for later use with acquiring covers... we need to store the characte name and ID into an array
      mATest1.characterIDStored.push(mATest1.getCharacterID(convertData));
      console.log('Character ID stored is ', mATest1.characterIDStored);

      // get digital comics for this named character
      mATest1.getDigitalComics(mATest1.characterIDStored);

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
// END GET CHARACTER NAMES  ------------------
// ----------------------------------------

// ----------------------------------------
// DISPLAY CHARACTER  ------------------
// ----------------------------------------
mATest1.displayCharacterNames = function (apiObj) {
  var item = apiObj;
  // this always selects the first character that matches
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
  $('section.nameTest ul.nameList').append(heroItem);

  $('section.nameTest p.attribution').html(item.attributionHTML);

  // console.log(item.attributionHTML);
}
// ----------------------------------------
// END DISPLAY CHARACTER  ------------------
// ----------------------------------------



// ----------------------------------------
// GET CHARACTER ID  ------------------
// ----------------------------------------
// for later use with acquiring covers... we need to store the ID
mATest1.getCharacterID = function (apiObj) {
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
// COMIC COVER EXTRACTION  ------------------
// ----------------------------------------
// we'll use the same mATest1 object

// GOAL:  http://gateway.marvel.com:80/v1/public/comics?format=digital%20comic&formatType=comic&hasDigitalIssue=true&characters=1009351&apikey=2c57ad00857c6163fa0417563cd31499
// Breakdown
// http://gateway.marvel.com:80/v1/public/comics?
// format=digital%20comic&
// formatType=comic&
// hasDigitalIssue=true&
// characters=1009351&
// apikey=2c57ad00857c6163fa0417563cd31499


// ALTERNATE 1
// returns more results
// http://gateway.marvel.com:80/v1/public/comics?format=comic&formatType=comic&hasDigitalIssue=false&characters=1009351&apikey=2c57ad00857c6163fa0417563cd31499
// Breakdown
// http://gateway.marvel.com:80/v1/public/comics?
// format=comic&
// formatType=comic&
// hasDigitalIssue=false&
// characters=1009351&
// apikey=2c57ad00857c6163fa0417563cd31499


// this version only seeks digital comic editions that are available



mATest1.getDigitalComics = function (charIDArray) {

  console.log('mATest1.getDigitalComics is active.');

  // charIDArray is null if mATest1.getCharacterNames is run after this function...
  // this must be placed after mATest1.getCharacterNames
  console.log('The character ID array passed was', charIDArray);

  // if it's a certain div then you'd want to associate it with additional targeting data...

  // for each ID stored in the mATest1.characterIDStored array, get the available digital comic editions for that character

  $.each(charIDArray, function(index, objItem) {

    console.log(index,objItem);

    // get the comics
    $.ajax({
      // don't forget to add + "comics" because the baseURL/endpoint doesn't include that
      url: mATest1.baseURL + "comics",
      type: 'GET',
      dataType: 'html',
      data: {
        // format: 'digital%20comic',
        format: 'comic',
        formatType: 'comic',
        hasDigitalIssue: 'false',
        characters: objItem.id,
        // characters: "1009351",
        apikey: mATest1.publicKey
      },
      success: function (res,status,jqXHR) {
        console.log('Get Digital Comics action is a success.');
        // console.log('The returned object for comics for this character is...');
        // console.log(res);

        // the server returns the data in JSONP format, which must be converted to Javascript with JSON.parse(ARRAY)
        var convertData = JSON.parse(res);
        console.log('The converted data is now an object', convertData);

        mATest1.displayComicCovers(convertData);
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
// END COMIC COVER EXTRACTION  ------------------
// ----------------------------------------


// ----------------------------------------
// DISPLAY COMIC COVERS  ------------------
// ----------------------------------------
mATest1.displayComicCovers = function (apiObj) {

  console.log('mATest1.displayComicCovers is active.');

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
    var readerLink = mATest1.retrieveURL(objItem.urls, "reader");
    console.log(readerLink);

    // store a reference to the "purchase" link
    // var purchaseLink = objItem.urls[1];
    // console.log(purchaseLink);
    var purchaseLink = mATest1.retrieveURL(objItem.urls, "purchase");
    console.log(purchaseLink);

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

mATest1.retrieveURL = function (urlArray,actionType) {
  // where actionType = "reader" or "purchase"
  console.log('mATest1.retrieveURL is active.');

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
        console.log('mATest1.retrieveURL has an error.');
    }
  }

}

// ----------------------------------------
// END DISPLAY COMIC COVERS  ------------------
// ----------------------------------------


// ----------------------------------------
// MAKE BUY COMIC STRING  ------------------
// ----------------------------------------
// using the comic based object I retrieve the title of the comic and query a query string that is placed into the href attribute of the Buy Now link taking the user to the Marvel.com product page (instead of Amazon), giving them the option to buy

// it appears that we'll need to use .replace and RegEx to craft these strings
// NOTE:  never mind, the comic object has all the data we need

// Google
// https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&es_th=1&ie=UTF-8#q=%22Hulk+(2014)+%231%22&es_th=1

// Marvel

// Search Title was Hulk (2014) #1
// https://marvel.com/comics/issue/50372/hulk_2014_1
// id = 50372
// resourceURI = "http://gateway.marvel.com/v1/public/comics/50372"

// Search Title was Captain America (2012) #25
// https://marvel.com/comics/issue/48592/captain_america_2012_25

// Thursday, May 14, 2015 1:01 PM:  I've decided to integrate this into the Display Comic Cover strings

// ----------------------------------------
// END MAKE BUY COMIC STRING  ------------------
// ----------------------------------------


// ----------------------------------------
// PRODUCT TIMESTAMP  ------------------
// ----------------------------------------
maProd1.timestamp = function () {
  /*
    Description:
    The getTime() method returns the numeric value corresponding to the time for the specified date according to universal time.
  
    Syntax:
    dateObj.getTime()
  */
 /*
 Looks like:  2015-05-13T21%3A03%3A55.000Z
 Looks like:  2015-05-13T21:03:55.000Z
 represented in Universal Time (GMT): YYYY-MM-DDThh:mm:ssZ (where T and Z are literals)
 where %3A = : (colon)

 https://stackoverflow.com/questions/23108262/how-to-get-timestamp-in-iso-8601-format-with-timezone-in-php
 date('Y-m-d\TH:i:s.Z\Z', time());
  */
 
  // var timestamp = moment().utc().format()+"Z";
  // return timestamp;

  // http://www.w3schools.com/jsref/jsref_toisostring.asp
  var d = new Date();
  var n = d.toISOString();
  return n;
  
}
// ----------------------------------------
// END PRODUCT TIMESTAMP  ------------------
// ----------------------------------------



// ----------------------------------------
// PRODUCT HASH  ------------------
// ----------------------------------------
maProd1.Signature = function (testString) {
  // hash generation script for Amazon API
  // usage:  hash = hex_sha256("test string");
  // You calculate a keyed-hash message authentication code (HMAC-SHA) signature using your secret access key (for information about HMAC, go to http://www.faqs.org/rfcs/ rfc2104.html)
  // this will be encoded before you use it here
  var hash = hex_sha256(testString);

  return hash;
}

maProd1.encodeString = function (tString) {
  // you need to encode the hashed or URI string once to change commas and colons
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
  // encodeURIComponent()
  
  var urlEncodeHash = encodeURIComponent(tString);

  return urlEncodeHash;
}
// ----------------------------------------
// END PRODUCT HASH  ------------------
// ----------------------------------------



// ----------------------------------------
// GET AMAZON DATA  ------------------
// ----------------------------------------

maProd1.paramPreSigSet1 = {
  Service: "AWSECommerceService",
  AWSAccessKeyId: maProd1.awsAccessKeyIDIAM1,
  AssociateTag: "sunnylamca-20",
  Keywords: "hulk",
  Operation: "ItemSearch",
  SearchIndex: "Books",
  Timestamp: maProd1.timestamp(),
  Version: "2011-08-01"
}

maProd1.buildPreHashString = function () {
  var preHashString = maProd1.baseURL+"?";

  $.each(maProd1.paramPreSigSet1, function(index, item) {
    // console.log(index,item);

    preHashString += index + "=" + item + "&";
  });

  // remove the last &
  preHashString = preHashString.replace(/\&$/g, '');

  return preHashString;
}

maProd1.paramSet1 = {
  Service: maProd1.paramPreSigSet1.Service,
  AWSAccessKeyId: maProd1.paramPreSigSet1.AWSAccessKeyId,
  AssociateTag: maProd1.paramPreSigSet1.AssociateTag,
  Keywords: maProd1.paramPreSigSet1.Keywords,
  Operation: maProd1.paramPreSigSet1.Operation,
  SearchIndex: maProd1.paramPreSigSet1.SearchIndex,
  Timestamp: maProd1.paramPreSigSet1.Timestamp,
  Version: maProd1.paramPreSigSet1.Version,
  // the hash is an encrypted version of your private key
  Signature: sign(maProd1.awsAccessKeyIDIAM1b,maProd1.buildPreHashString())
};

maProd1.getAmazonData = function () {

  $.ajax({
    url: this.baseURL,
    type: 'GET',
    dataType: 'xml',
    data: maProd1.paramSet1,
    success: function (res,status,jqXHR) {
      console.log("Get Amazon data API call worked.");
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
// END GET AMAZON DATA  ------------------
// ----------------------------------------


// method to initialize our application
// all our code will be put inside here
// you should not be defining things in here
mATest1.init = function () {
  mATest1.getCharacterNames();
  // mATest1.getDigitalComics(mATest1.characterIDStored);
  // mATest1.getDigitalComics();
}

maProd1.init = function () {
  // maProd1.getAmazonData();
}

//////////////////////////////////////////////////
// EXECUTION CODE

jQuery(document).ready(function($) {
  mATest1.init();
  maProd1.init();
});  //end doc.onready function

//////////////////////////////////////////////////
