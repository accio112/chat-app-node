var moment = require('moment');

//Jan 1st 1970 00:00:00 am

//1000 is in ms meaning plus 1 sec

// var date = new Date();
// console.log(date.getDay());

// var date = moment(); //current time
// date.add(1,'year').subtract(9,'months');
// console.log(date.format('MMM Do, YYYY')); //for more tokens..visit moment docs

var someTimestamp = moment().valueOf();
console.log(someTimestamp);

var date = moment();
console.log(date.format('h:mm a'));