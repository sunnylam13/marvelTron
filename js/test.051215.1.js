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
// ----------------------------------------
// END HELPER  ------------------
// ----------------------------------------






// ----------------------------------------
// GET CHARACTER NAMES  ------------------
// ----------------------------------------
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
// ----------------------------------------
// END GET CHARACTER NAMES  ------------------
// ----------------------------------------

// ----------------------------------------
// DISPLAY CHARACTER  ------------------
// ----------------------------------------
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
// ----------------------------------------
// END DISPLAY CHARACTER  ------------------
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
    console.log(index,item);

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
}

maProd1.init = function () {
  maProd1.getAmazonData();
}

//////////////////////////////////////////////////
// EXECUTION CODE

jQuery(document).ready(function($) {
  mATest1.init();
  maProd1.init();
});  //end doc.onready function

//////////////////////////////////////////////////
