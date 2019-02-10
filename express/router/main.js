// server.js에서 모듈로 불러오려면 module.exports해줘야 되는듯.
module.exports = function(app,fs)
{    
    app.get('/',function(req,res){
        // .set('views','경로')로 지정해준 경로에서 index file을 rendering.
        // 즉 index file의 인자로 title, length를 넣어서 response해줌.
        res.render('index',{
            title: "MY HOMEPAGE",
            length: 5
        });
    });
    
    app.get('/list', function (req, res) {
        fs.readFile( __dirname + "/../data/user.json", 'utf8', function (err, data) {
            console.log( data );
            res.end( data );
        });
    });
    
    app.get('/getUser/:username', function(req, res){
        fs.readFile( __dirname + "/../data/user.json", 'utf8', function (err, data) {
            // JSON.parse(string)
            // readFile로 파일을 읽으면 시엔 텍스트 형태로 읽어짐.
            // 따라서 JSON.parse를 사용하여 자바스크립트 객체로 변환하는 것
            var users = JSON.parse(data);
            // request로 온 username을 인덱스로 접근하는 듯.
            // req.params.username하면 위에 routing된 username 읽어오는듯<o>
            // req.params. This property is an object containing properties mapped to the named route “parameters”. 
            // For example, if you have the route /user/:name, then the “name” property is available as req.params.name. This object defaults to {}.
            // json 객체의 인덱스로 위에서 얻은 username을 사용
            // 이를 통해 해당 json flxjsqkedma.
            res.json(users[req.params.username]);
        });
    });
    
    app.post('/addUser/:username', function(req, res){

        var result = {  };
        var username = req.params.username;

        // CHECK REQ VALIDITY
        // req.body
        // Contains key-value pairs of data submitted in the request body. By default, it is undefined, and is populated when you use body-parsing middleware such as body-parser and multer.
        // POST 방식으로 넘어오는 파라미터를 담고있다. HTTP의 BODY 부분에 담겨져있는데, 이 부분을 파싱하기 위해 body-parser와 같은 패키지가 필요하다.
        // https://luckyyowu.tistory.com/346
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        // LOAD DATA & CHECK DUPLICATION
        fs.readFile( __dirname + "/../data/user.json", 'utf8',  function(err, data){
            var users = JSON.parse(data);
            // user json을 읽어서 users 객체로 저장.
            // username은 params.username 즉 url로 입력받아왔음
            // 중복 확인.
            // post는 ideompotent하지 않으므로 중복 확인
            // put은 ideompotent하므로 중복 확인 안 해줘도 됨.
            if(users[username]){
                // DUPLICATION FOUND
                result["success"] = 0;
                result["error"] = "duplicate";
                res.json(result);
                return;
            }
            // 여기까지 진행됐다면 id,password 입력 됐으며, 중복도 안된경우
            // ADD TO DATA
            // users는 user.json객체 전체임.
            // 여기의 username index에 req.body(id,password 데이터)저장
            users[username] = req.body;

            // SAVE DATA
            fs.writeFile(__dirname + "/../data/user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                // users전체를 쓰는데 중복 제거 되는건가?
                result = {"success": 1};
                res.json(result);
            });
        });
    });
}
    app.delete('/deleteUser/:username', function(req, res){
        var result = { };
        //LOAD DATA
        fs.readFile(__dirname + "/../data/user.json", "utf8", function(err, data){
            var users = JSON.parse(data);

            // IF NOT FOUND
            if(!users[req.params.username]){
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }
            // FOUND
            // delete를 통해 users(JSON 객체)에서 username dat를 지우는게 가능한 듯.
            delete users[req.params.username];
            // 지웠으므로 다시 write후 return success
            fs.writeFile(__dirname + "/../data/user.json",
                        JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result["success"] = 1;
                res.json(result);
                return;
            });
        });

})