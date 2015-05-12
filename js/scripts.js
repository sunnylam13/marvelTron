//////////////////////////////////////////////////
// GLOBAL VARIABLES

// create an empty object... which is the start of the application
// you don't have to start it empty though... it is cleaner however
// the word app is too generic...
// you might use the initials of the website you're designing
var mcaApp = {};
// then below there you can add things

// WARNING:  if there are extensions or plugins included then variable names may overlap without you knowing hence why we want to use name spacing

// NOTE:  if you had your objects and functions inside the jQuery(document).ready() you can't access the object within the console...  if you do it outside of it however you can access it at any time and anywhere, it's no longer trapped as a local variable or function within the jQuery(document).ready()


//////////////////////////////////////////////////
// FUNCTIONS

// don't forget to call the function in EXECUTION CODE area before running

// NOTE:  in terms of organization, Ryan prefers to put all other functions and variables above the object.init() method however in reality it doesn't matter



// method to initialize our application
// all our code will be put inside here
// you should not be defining things in here
mcaApp.init = function () {
	//
}

//////////////////////////////////////////////////
// EXECUTION CODE

jQuery(document).ready(function($) {
	mcaApp.init();
});  //end doc.onready function

//////////////////////////////////////////////////