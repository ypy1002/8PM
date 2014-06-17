var express = require('express');
var fs = require('fs');
var crypto = require('crypto');
var mysql = require('mysql');
var socketio = require('socket.io');
var http = require('http');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var app = express();
var LoginUserUNO;

// 서버, 메인, 업데이트

var connection = mysql.createConnection(
    {	
      host     : '192.168.200.77',   /* host     : '192.168.200.77',*/
      user     : 'study',
      password : 'study',	
      database : '8pm',
    }
);

connection.connect();

app.set('port', 4000);

setInterval(function() {
    var hourDate = new Date().getHours();
    if(hourDate == 10){
    	
    	clearInterval(this);
    }
}, 1000);

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('express server listening on port ' + app.get('port'));
});

app.use('/script' ,express.static(__dirname + "/../WebContent/www/javascript"));
app.use("/style",express.static(__dirname + "/../WebContent/www/stylesheets"));
app.use('/img' ,express.static(__dirname + "/../WebContent/www/image"));
app.use('/html' ,express.static(__dirname + "/../WebContent/www/html"));
app.use('/imgData', express.static(__dirname + '/multipart'));

app.use(express.bodyParser());
app.use(app.router);
app.use(express.cookieParser());
app.use(express.limit('10mb'));
app.use(express.bodyParser({uploadDir:__dirname + '/multipart'}));

var io = socketio.listen(server);
io.set('log level', 2);
io.sockets.on('connection', function(socket){
	
	socket.on('join', function(data){
		socket.join(data.roomname);
		socket.set('socketid', socket.id);
		socket.set('room', data.roomname);
		socket.set('userData', data.userData);
		socket.get('room', function(error, room){
			io.sockets.in(room).emit('join', data);
		});
	});
	
	socket.on('userDataSetting', function(data){
		console.log('asd');
		var myRoom = Date.now();
		socket.join(myRoom);
		socket.set('myRoom', myRoom);
		socket.set('myData', data);
		socket.set('socketid', socket.id);
	});
	
	socket.on('startTimer', function(){
		socket.get('room', function(error, room){
			socket.get('socketid', function(error, socketid){
				socket.get('userData', function(error, userData){
					socket.broadcast.in(room).emit('startTimer', userData);
					io.sockets.sockets[socketid].emit('startTimer');
				});
			});
		});
	})
	
	socket.on('after', function(data){
		socket.get('room', function(error, room){
			if(data=='ok'){
				socket.broadcast.in(room).emit('after', data);
			}else{
				socket.broadcast.in(room).emit('after');
			};
		});
	});
	
	socket.on('message', function(data){
		socket.get('room', function(error, room){
			io.sockets.in(room).emit('message', data);
		});
	});
	
	socket.on('bye', function(){
		socket.get('room', function(error, room){
			socket.broadcast.in(room).emit('bye');
		});
	});
	
	socket.on('nono', function(){
		socket.get('room', function(error, room){
			socket.get('id', function(error, id){	
				socket.broadcast.in(room).emit('alert_nono', id);
			});
		});
	});
	
	socket.on('viewPhoto',function(data){
	      socket.get('room', function(error, room){
	         socket.broadcast.in(room).emit('viewPhoto', data);
	      });   
	   });
});

app.post('/sos', function(req, res){
	
	var date = new Date();
	var sos_date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
	console.log(req.param('myUNO'));
	console.log(req.param('youUNO'));
	console.log(sos_date);
	console.log(req.param('sosText'));
	console.log(req.param('chatText'));
	
	 connection.query('insert into sos(UNO, UNO2, SOS_DATE, SOS_MSG, CHAT_DATA) values(' + req.param('myUNO') + ',' 
			 																			  + req.param('youUNO') + ',"'
			 																			  + sos_date + '","'
			 																			  + req.param('sosText') + '","'
			 																			  + req.param('chatText') + '")' ,function(err, photo, fields){
		 res.send('신고가 완료되었습니다.');
	 });
	
});

app.post('/getMyChatProfile', function(req, res){
	connection.query('select UNO, TEL from users where ID="' + req.param('id') + '"', function(err, unoTel, fields){
	    connection.query('select PHOTO from photo where UNO=' + unoTel[0].UNO + ' and photo_no=1' ,function(err, photo, fields){
		   res.send({'unoTel':unoTel,'photo':photo});
	    });
	});
});

app.get('/login', function(req, res){
	fs.readFile('../WebContent/www/html/login/login.html', function(error, data){
		res.writeHead(200, {'Content-Type' : 'text/html'});
		res.end(data);
	});
});

app.post('/loginChk', function(req, res){
	
	connection.query('select PW, CITY from users where ID="' + req.param('userID') + '"', function(err, rows, fields) {
		
		if(rows[0]){
			try{
				var readyDecipher = crypto.createDecipher('aes192', req.param('userPW'));
				readyDecipher.update(rows[0].PW, 'base64', 'utf8');
		        var pw = readyDecipher.final('utf8');
		        rows[0].PW = pw;
				
				connection.query('select UNO from users where ID="' + req.param('userID') + '"', function(err, rows, fields) {
					LoginUserUNO = rows[0].UNO;
				});
				
				res.send(rows);
			}catch(e){
				res.send('PW가 틀렸습니다.');
			};
		}else{
			res.send('가입되어있지 않은 ID입니다.');
		};
	});
});

app.post('/idChk', function(req, res){
	
	connection.query('select ID from users where ID="' + req.param('id') + '"', function(err, rows, fields) {
		if(rows[0] == undefined){
			res.send("ID사용가능");
		}else{
			res.send('ID중복');
		}
	});
});

app.post('/telChk', function(req, res){
	connection.query('select TEL from users where TEL="' + req.param('tel') + '"', function(err, rows, fields) {
		if(rows[0] == undefined){
			res.send("TEL사용가능");
		}else{
			res.send('TEL중복');
		}
	});
});

app.post('/sign', function(req, res){
	
	var readyCrypto = crypto.createCipher('aes192', req.param('pw'));
	readyCrypto.update(req.param('pw'), 'utf8', 'base64');
	var pw = readyCrypto.final('base64');
	
	var date = new Date();
	var sign_date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

	connection.query('insert into users(ID, PW, NAME, GENDER, AGE, YEAR, MONTH, DAY, TEL, SIGN_DATE) ' +
					 'values("' + req.param('id') + '","' + pw + '","' + req.param('name') + '","' + 
					 		      req.param('gender') + '","' + ((date.getFullYear() - req.param('year')) + 1) + '",' + 
					 		      req.param('year') + ',' + req.param('month') + ',' +
					 		      req.param('day') + ',"' + req.param('tel') + '","' + sign_date + '")', function(err, rows, fields) {
		res.send("가입이 완료되었습니다.");
	});
});

app.post('/searchId', function(req, res){
	
	connection.query('select ID from users where TEL="' + req.param('tel') + '"', function(err, rows, fields) {
		
		if(rows[0]){
			res.send(rows[0].ID);
		}else{
			res.send("등록되어있지 않은 번호입니다.");
		}
	});
});

app.post('/searchPw', function(req, res){
	
	connection.query('select TEL from users where ID="' + req.param('id') + '"', function(err, idRows, fields) {
		if(idRows[0] == undefined){
			res.send('가입되어있지 않은 ID입니다.');
		}else{
			connection.query('select ID from users where TEL="' + req.param('tel') + '"', function(err, telRows, fields) {
				if(telRows[0] == undefined || telRows[0].ID != req.param('id')){
					res.send('아이디에 등록된 번호가 아닙니다.');
				}else{
					res.send("result");
				}
			});
		};
		
	});
});

app.post('/profileInsert' , function(req, res){
	connection.query('insert into profile (UNO, CITY, BLOOD, JOB) ' +
			 		 'values(' + req.param('uno') + ',"' + req.param('city') +
			 		 						   '","' + req.param('blood') + 
			 		 						   '","' + req.param('job') + '")', function(err, rows, fields) {
		
			connection.query('insert into face (UNO, FACE_NO, FACE) ' +
			 		 'values(' + req.param('uno') + ',1,"' + req.param('face1') + '"),'
			 		 	 + '(' + req.param('uno') + ',2,"' + req.param('face2') + '"),'
			 		 	 + '(' + req.param('uno') + ',3,"' + req.param('face3') + '"),'
			 		 	 + '(' + req.param('uno') + ',4,"' + req.param('face4') + '"),'
			 		 	 + '(' + req.param('uno') + ',5,"' + req.param('face5') + '")'
			 		 		   , function(err, rows, fields) {console.log('face End');});
			
			connection.query('insert into style (UNO, STYLE_NO, STYLE) ' +
			 		 'values(' + req.param('uno') + ',1,"' + req.param('style1') + '"),'
			 		     + '(' + req.param('uno') + ',2,"' + req.param('style2') + '"),'
			 		     + '(' + req.param('uno') + ',3,"' + req.param('style3') + '"),'
			 		     + '(' + req.param('uno') + ',4,"' + req.param('style4') + '"),'
			 		     + '(' + req.param('uno') + ',5,"' + req.param('style5') + '")'
			 		 		   , function(err, rows, fields) {console.log('style End');});
			
			connection.query('insert into ct (UNO, CT_NO, CT) ' +
			 		 'values(' + req.param('uno') + ',1,"' + req.param('personality1') + '"),'
			 		     + '(' + req.param('uno') + ',2,"' + req.param('personality2') + '"),'
			 		     + '(' + req.param('uno') + ',3,"' + req.param('personality3') + '"),'
			 		     + '(' + req.param('uno') + ',4,"' + req.param('personality4') + '"),'
			 		     + '(' + req.param('uno') + ',5,"' + req.param('personality5') + '")'
			 		 		   , function(err, rows, fields) {console.log('personality End');});
			
			connection.query('insert into hobby (UNO, HOBBY_NO, HOBBY) ' +
			 		 'values(' + req.param('uno') + ',1,"' + req.param('hobby1') + '"),'
			 		 	 + '(' + req.param('uno') + ',2,"' + req.param('hobby2') + '"),'
			 		 	 + '(' + req.param('uno') + ',3,"' + req.param('hobby3') + '"),'
			 		 	 + '(' + req.param('uno') + ',4,"' + req.param('hobby4') + '"),'
			 		 	 + '(' + req.param('uno') + ',5,"' + req.param('hobby5') + '")'
			 		 		   , function(err, rows, fields) {console.log('hobby End');});
			
		connection.query('select AGE from users where UNO=' + req.param('uno'), function(err, rows, fields) {
			if((rows[0].AGE - 3) < 20){
				connection.query('update users set CITY="' + req.param('city') + '", MIN_AGE = 20, MAX_AGE=' + (rows[0].AGE + 3) + 
								 ' where UNO=' + req.param('uno') , function(err, rows, fields) {
					res.send('프로필이 설정되었습니다.');
				});
			}else{
				connection.query('update users set CITY="' + req.param('city') + '", MIN_AGE =' + (rows[0].AGE - 3) + 
								 ', MAX_AGE=' + (rows[0].AGE + 3) + ' where UNO=' + req.param('uno'), function(err, rows, fields) {
					res.send('프로필이 설정되었습니다.');
				});
			};
		});
	});
});

app.get('/getMatchingProfile', function(req, res){
	connection.query('select CITY, MIN_AGE, MAX_AGE from users where UNO=' + req.param('uno') , function(err, rows, fields) {
		res.send(rows);
	});
});

app.post('/updateMatching', function(req, res){
	connection.query('update users set CITY="' + req.param('city') + '", MIN_AGE=' + req.param('minage') + 
					 ', MAX_AGE=' + req.param('maxage') + ' where UNO=' + req.param('uno') , function(err, rows, fields) {
		res.send('매칭 상대 정보가 설정되었습니다.');
	});
});

app.get('/getUserProfile', function(req, res){
	connection.query('select UNO, ID, TEL, CITY, MIN_AGE, MAX_AGE from users where UNO=' + LoginUserUNO, function(err, userData, fields){
		connection.query('select FACE from face where UNO=' + userData[0].UNO , function(err, face, fields) {
			connection.query('select STYLE from style where UNO=' + userData[0].UNO , function(err, style, fields) {
				connection.query('select CT from ct where UNO=' + userData[0].UNO , function(err, ct, fields) {
					connection.query('select HOBBY from hobby where UNO=' + userData[0].UNO , function(err, hobby, fields) {
						connection.query('select PHOTO from photo where UNO=' + userData[0].UNO , function(err, photo, fields) {
							connection.query('select CITY, BLOOD, JOB from profile where UNO=' + userData[0].UNO , function(err, profile, fields) {
								res.send({'userData':userData,'face':face,'style':style,'ct':ct,'hobby':hobby,'photo':photo,'profile':profile});
							});
						});
					});
				});
			});
		});
	});
});

app.post('/profileUpdate', function(req, res){
	
	connection.query('update profile set CITY="' + req.param('city') 
			                       + '", BLOOD="' + req.param('blood') 
			                       + '", JOB="' + req.param('job') 
			                       + '" where UNO=' + req.param('uno') , function(err, profile, fields) {});
	
	connection.query('update face set FACE = CASE WHEN FACE_NO=1 THEN "' + req.param('face1') + '"'
											  + ' WHEN FACE_NO=2 THEN "' + req.param('face2') + '"'
											  + ' WHEN FACE_NO=3 THEN "' + req.param('face3') + '"'
											  + ' WHEN FACE_NO=4 THEN "' + req.param('face4') + '"'
											  + ' WHEN FACE_NO=5 THEN "' + req.param('face5') + '"'
											  + ' END WHERE UNO = ' + req.param('uno') , function(err, profile, fields) {});
	
	connection.query('update style set STYLE = CASE WHEN STYLE_NO=1 THEN "' + req.param('style1') + '"'
											  + ' WHEN STYLE_NO=2 THEN "' + req.param('style2') + '"'
											  + ' WHEN STYLE_NO=3 THEN "' + req.param('style3') + '"'
											  + ' WHEN STYLE_NO=4 THEN "' + req.param('style4') + '"'
											  + ' WHEN STYLE_NO=5 THEN "' + req.param('style5') + '"'
											  + ' END WHERE UNO = ' + req.param('uno') , function(err, profile, fields) {});
	
	connection.query('update ct set CT = CASE WHEN CT_NO=1 THEN "' + req.param('ct1') + '"'
											  + ' WHEN CT_NO=2 THEN "' + req.param('ct2') + '"'
											  + ' WHEN CT_NO=3 THEN "' + req.param('ct3') + '"'
											  + ' WHEN CT_NO=4 THEN "' + req.param('ct4') + '"'
											  + ' WHEN CT_NO=5 THEN "' + req.param('ct5') + '"'
											  + ' END WHERE UNO = ' + req.param('uno') , function(err, profile, fields) {});
									
	connection.query('update hobby set HOBBY = CASE WHEN HOBBY_NO=1 THEN "' + req.param('hobby1') + '"'
											  + ' WHEN HOBBY_NO=2 THEN "' + req.param('hobby2') + '"'
											  + ' WHEN HOBBY_NO=3 THEN "' + req.param('hobby3') + '"'
											  + ' WHEN HOBBY_NO=4 THEN "' + req.param('hobby4') + '"'
											  + ' WHEN HOBBY_NO=5 THEN "' + req.param('hobby5') + '"'
											  + ' END WHERE UNO = ' + req.param('uno') , function(err, profile, fields) {});
	
	console.log('프로필 수정완료');
	res.send('프로필 수정완료');
});

app.post('/updatePw', function(req, res){
	
	var readyCrypto = crypto.createCipher('aes192', req.param('updatePw'));
	readyCrypto.update(req.param('updatePw'), 'utf8', 'base64');
	var pw = readyCrypto.final('base64');
	
	connection.query('select UNO from users where ID="' + req.param('id') + '"' , function(err, IDrows, fields) {
		connection.query('update users set PW="' + pw + '" where UNO=' + IDrows[0].UNO , function(err, rows, fields) {
			res.send('비밀번호가 변경되었습니다.');
		});
	});
});


app.post('/upload', multipartMiddleware, function(req, res){
	
	var imglist = [req.files.image1, req.files.image2, req.files.image3, req.files.image4];
	
		var dataNow = Date.now();
		var writePath = "D:\\8pm\\Project\\Server\\multipart\\" + dataNow + "_";
		
		if(imglist[0].type.split('/')[0] == 'image'){
			
			fs.readFile(imglist[0].path, function(error, data){
				fs.writeFile(writePath + imglist[0].name , data, function(error){
					if(error){
						console.log(error);
					}
				});
			});
		};
		
		if(imglist[1].type.split('/')[0] == 'image'){
			
			fs.readFile(imglist[1].path, function(error, data){
				fs.writeFile(writePath + imglist[1].name , data, function(error){
					if(error){
						console.log(error);
					}
				});
			});
		};
		
		if(imglist[2].type.split('/')[0] == 'image'){
			
			fs.readFile(imglist[2].path, function(error, data){
				fs.writeFile(writePath + imglist[2].name , data, function(error){
					if(error){
						console.log(error);
					}
				});
			});
		};
		
		if(imglist[3].type.split('/')[0] == 'image'){
			
			fs.readFile(imglist[3].path, function(error, data){
				fs.writeFile(writePath + imglist[3].name , data, function(error){
					if(error){
						console.log(error);
					}
				});
			});
		};
		
		connection.query('insert into photo (UNO, PHOTO_NO, PHOTO) values(' + LoginUserUNO + ',1,"' + dataNow + '_' + imglist[0].name +  '"),('
																			+ LoginUserUNO + ',2,"' + dataNow + '_' + imglist[1].name +  '"),('
																			+ LoginUserUNO + ',3,"' + dataNow + '_' + imglist[2].name +  '"),('
																			+ LoginUserUNO + ',4,"' + dataNow + '_' + imglist[3].name +  '")'
																			, function(err, rows, fields){console.log('upload end');});
});


