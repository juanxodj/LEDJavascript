var five = require('johnny-five');
var firebase = require('firebase');
var board = new five.Board();
var ardxRef = firebase.initializeApp({
    databaseURL: "https://arduinojs-f5662.firebaseio.com/"
});
var led1, led2, led3;
var led1State = 0, led2State = 0, led3State = 0;

//Crear referencia
var dbRefObject = firebase.database().ref().child('ardx');
var dbRefLed1 = dbRefObject.child('led1');
var dbRefLed2 = dbRefObject.child('led2');
var dbRefLed3 = dbRefObject.child('led3');

// reset firebase data
ardxRef.database().ref('ardx').set({
    'led1': led1State,
    'led2': led2State,
    'led3': led3State
});

/**
 * called on board is ready
 * 1. init leds
 * 2. reset led states to off
 * 3. register firebase event
 * */
board.on("ready", function () {
    led1 = new five.Led(5);
    led2 = new five.Led(6);
    led3 = new five.Led(7);

    led1.stop().off();
    led2.stop().off();
    led3.stop().off();

    listenEvent();
});

var listenEvent = function () {
    dbRefLed1.on('value', function (snapshot) {
        changeLed(led1,snapshot.val(),'led1');
    });

    dbRefLed2.on('value', function (snapshot) {
        changeLed(led2,snapshot.val(),'led2');
    });

    dbRefLed3.on('value', function (snapshot) {
        changeLed(led3,snapshot.val(),'led3');
    });
};

/**
 * change led state
 * @param led: which led
 * @param value: 0: off, 1: on
 * @param tag: name of led
 * */
var changeLed = function(led, value, tag){
    switch (value){
        case 0:
            led.stop().off();
            console.log(tag + " off");
            break;
        default :
            led.on();
            console.log(tag + " on");
            break;
    }
};