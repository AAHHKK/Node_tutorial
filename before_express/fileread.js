var fs = require("fs");

var data = fs.readFileSync('input.txt');

// 모든 Node 어플리케이션의 비동기식 함수에서는 첫번째 매개변수로는 error를,
// 마지막 매개변수로는 callback 함수를 받습니다.
fs.readFile('input.txt', function(err,data){
    if(err)
        return console.error(err);
    console.log(data.toString());
});
//console.log(data.toString());
console.log("Program has ended");