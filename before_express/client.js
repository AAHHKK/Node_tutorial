var http = require('http');

var options = {
    host: 'localhost',
    port: '8081',
    path: '/index.html'
};

var callback = function(response){
    var body='';
    // .on -> response는 EventEmitter class를 상속한 객체
    // response event에서 'data'란 event가 감지되면 func실행.
    // 즉 'data'란 event에 대해 event handler등록.
    // response 이벤트가 감지되면 데이터를 body에 받아온다
    response.on('data',function(data){
        body+=data;
    });
    // end 이벤트가 감지되면 데이터 수신을 종료하고 내용을 출력한다
    response.on('end', function() {
        // 데이저 수신 완료
        console.log(body);
     });
}

var req = http.request(options,callback);
req.end();
console.log("REQUEST END");