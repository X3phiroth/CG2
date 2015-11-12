
/*
 * This is main.js which is referenced directly from within
 * a <script> node in index.html
 */

// "use strict" means that some strange JavaScript things are forbidden
"use strict";

/**
 * Outer function 
 * @param seperator string defines how points on path are seperated 
 * @returns inner function
 */
var makePath = function(seperator){

    // define a default seperator and an empty path
    // in the execution context of the closure
    var defaultSeperator = ", ";

    // holds the current state of the path 
    var path = "";

    /**
     * Inner function 
     * @param point is a point on the path
     * @returns the complete path
     */
    var f = function(point) {

        if( point !== undefined ) {
            // append the seperator only when path already contains
            // a point, i.e. the sep is added as prefix to the 
            // second/third etc point
            // if seperator argument is undefined we use a default one
            if(path !== "") {
                path += seperator || defaultSeperator;
            }
            path += point;
        }
        return path;
    };
    return f;
};


// the main() function is called when the HTML document is loaded
var main = function() {

    ////////////////////////////////////////////////////////////
    //create a path, add a few points on the path, and print it
    var path1 = makePath();

    path1("A"); 
    path1("B"); 
    path1("C");

    var path2 = makePath("-->");
    path2("Berlin"); 
    path2("San Francisco"); 
    path2("Vancouver");

    window.console.log("path 1 is " + path1() );
    window.console.log("path 2 is " + path2() );

    ////////////////////////////////////////////////////////////
    // second example
    window.console.log('This is the start.');

    // sets a timeout and calls the callbackFunction
    // after the timeout. 
    // The specified callback is 0!!! milliseconds
    setTimeout(function callbackFunction() {
        window.console.log('This is a msg from call back.');
    }, 0);

    window.console.log('This is just a message.');


};

