/*$(document).ready(function(){
	$('#chat').css('height' ,  $(window).height()-100);
	$('#chat').resize(function() {
		$('html').css('height' ,  $(window).height()-100);
	});
});
*/
var myData = 0;
var chatStatus = 0;
var socket = io.connect('http://localhost:4000');
var blindHeight = 12.8;
var blindPhoto = 12.8;
//toast 2014.06.17
var toast = function(msg){
	   $("<div><div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h4><span class='glyphicon glyphicon-heart'></span>&nbsp"+msg+"</h4></div></div> ")
	   .css({ display: "block", 
	      opacity: 0.90, 
	      position: "fixed",
	      "text-align": "center",
	      border: "1px solid #FFC091",
	      width: "70%",
	      height: "6%",
	      color: "white",
	      "background-color": "#FFC091",
	      "border-radius": "5px",
	      
	       left: $(window).width()/6,
	       top: $(window).height()/2 })
	      
	   .appendTo( $('body')).delay( 500 )
	   .fadeOut( 10000, function(){
	      $(this).remove();
	   });
	};
//toast 2014.06.17 여기까지
$(function() {
	
    $('.score').click(function(){
       socket.emit('viewPhoto',(this.id).split('_')[1]);
    });
	
	socket.on('viewPhoto' , function(data){
		
		  if(blindPhoto - (blindHeight/100)*data >= 0 && blindPhoto - (blindHeight/100)*data <= 12.8){
			  $('#blind').css('height', blindPhoto - (blindHeight/100)*data + '%');
		      blindPhoto = blindPhoto - (blindHeight/100)*data;
		  }else if(blindPhoto - (blindHeight/100)*data < 0){
			  $('#blind').css('height', '0%');
			  blindPhoto = 0;
		  }else if(blindPhoto - (blindHeight/100)*data > 12.8){
			  $('#blind').css('height', '12.8%');
			  blindPhoto = 12.8;
		  }
	});
	
	$('#select').slider();
	
	$('.slider-handle').on({'mousemove': function(){
		$('#minAge').html($('.tooltip-inner').html().split(' : ')[0]);
		$('#maxAge').html($('.tooltip-inner').html().split(' : ')[1]);
	}, 'mouseup': function(){
		$('#minAge').html($('.tooltip-inner').html().split(' : ')[0]);
		$('#maxAge').html($('.tooltip-inner').html().split(' : ')[1]);
	}});
		
	
	$('.carousel').carousel({
		  interval: 0
	});
	
	$('#city1, #blood1, label, .toggleInput, .carousel-indicators, .file, #photoSubmit').css('display','none');
	
	$('.moveMainBtn').click(function(){
		$('#mainPage').click();
	});
	
	$.getJSON('/getUserProfile',function(data){
		
		myData = data;
		$('#userid').val(data.userData[0].ID);
		$('#roomname').val("ypy1001hiletsgo");
		socket.emit('userDataSetting', data);
		
		$('.selectedCity').html(data.userData[0].CITY);
		$('#cityInput1').val(data.userData[0].CITY);
		$('#minAge').html(data.userData[0].MIN_AGE);
		$('#maxAge').html(data.userData[0].MAX_AGE);
		$('#select').attr('data-slider-value', '[' + data.userData[0].MIN_AGE + ',' + data.userData[0].MAX_AGE + ']');
		
		var cityAll = $('.cityBtn');
		var bloodAll = $('.bloodBtn');
		for(var i=0; i<cityAll.length; i++){
			if($('#' + cityAll[i].id).html() == data.profile[0].CITY){
				$('#' + cityAll[i].id).click();
				break;
			}
		}
		
		for(var i=0; i<bloodAll.length; i++){
			if($('#' + bloodAll[i].id).html() == data.profile[0].BLOOD){
				$('#' + bloodAll[i].id).click();
				break;
			}
		}
		
		$('#job1').val(data.profile[0].JOB);
		
		for(var i=0; i<5; i++){
			
			if(i <= 2){
				$('#face' + (i+1)).val(data.face[i].FACE);
				$('#style' + (i+1)).val(data.style[i].STYLE);
				$('#personality' + (i+1)).val(data.ct[i].CT);
				$('#hobby' + (i+1)).val(data.hobby[i].HOBBY);
				$('#upload_file' + (i+1)).css({'background-image': ('url(/imgData/'+data.photo[i].PHOTO+')'), 'background-size': '100% 100%' });
			}
			
			if(i > 2){
				if(i == 3){
					$('#upload_file' + (i+1)).css({'background-image': ('url(/imgData/'+data.photo[i].PHOTO+')'), 'background-size': '100% 100%' });
				}
				
				if(data.face[i].FACE != ''){
					$('#facePlus').click();
					$('#face' + (i+1)).val(data.face[i].FACE);
				}
				
				if(data.style[i].STYLE != ''){
					$('#stylePlus').click();
					$('#style' + (i+1)).val(data.style[i].STYLE);
				}
				
				if(data.ct[i].CT != ''){
					$('#personalityPlus').click();
					$('#personality' + (i+1)).val(data.ct[i].CT);
				}
				
				if(data.hobby[i].HOBBY != ''){
					$('#hobbyPlus').click();
					$('#hobby' + (i+1)).val(data.hobby[i].HOBBY);
				}
			}
		}
	});
	
	$('#chatBtn').click(function(){
		if(chatStatus++ == 0){
			$('#enter').click();
		}
	});
	
	$.getJSON('/getMatchingProfile', {
		uno : myData.UNO
	},function(data){
		$('.selectedCity').html(data[0].CITY);
		$('#cityInput1').val(data[0].CITY);
		$('#minAge').val(data[0].MIN_AGE);
		$('#maxAge').val(data[0].MAX_AGE);
	});
	
	timer2();
	
	$('#waitBtn').click(function(){
		$.post('/updateMatching', {
			uno : myData.userData[0].UNO,
			city : $('#cityInput1').val(),
			minage : $('#minAge').html(),
			maxage : $('#maxAge').html()
		}, function(data){
			toast(data);	
		});
	});
	
	
	// 채팅 스크립트 ---------------

	$('#nono').on('click', function(){
		socket.emit('nono');
	});
	
	socket.on('toast_nono', function(data){
		toast(data + "님이 거절하셨네요 ㅜㅜ 안녕~~~~");
	});
	
	$('#enter').click(function() {
		if ($('#userid').val().length == 0
				|| $('#userid').val()[0] == " ") {
			toast("아이디를 입력해주세요.");
		} else if ($('#roomname').val().length == 0
				|| $('#roomname').val()[0] == " ") {
			toast("방이름을 입력해주세요.");
		} else {
			
			$.post('/getMyChatProfile', {
				id : $('#userid').val()
			}, function(data){
				data.id = $('#userid').val();
				socket.emit('join', {
					'roomname' : $('#roomname').val(),
					'userData' : data
				});
			});
			
			$('#log').css('display', 'none');
			$('#chat').css('display', '');
			$(".timerDiv2").text( 10 + ":" + 00 );
		}
	});
	  
    $('#after').click(function(){
	     $('#after').css({'background-image': ('url(/img/wait.jpg)'), 'backgroung-size':'100% 100%'});
         socket.emit('after');
         $('#after').unbind('click');	
    });
	
	$('#okok').click(function(){
		socket.emit('after','ok');
		$('#phoneNum').css('font-size','120%').html(youData.unoTel[0].TEL);
	});

	socket.on('join', function(data) {
		var divLength = $('#txtarea>div');

		if (divLength[0] == undefined) {
			$('#txtarea').append(
					'<div class="joinUser"><span>' + data.userData.id + '님이 입장하셨습니다.');
		} else {
			youData = data.userData;
			$('#txtarea').append(
					'<br><div class="joinUser"><span>' + data.userData.id
							+ '님이 입장하셨습니다.');
			$('#person').removeAttr('src').attr('src','/imgData/'+ data.userData.photo[0].PHOTO );
			socket.emit('startTimer');
		}
	});
	
	socket.on('startTimer', function(data){
		if(data){
			youData = data;
			$('#person').removeAttr('src').attr('src','/imgData/'+ data.photo[0].PHOTO );
		};
		$('#txt').removeAttr('readonly');
		timer();
	});
	
	socket.on('after', function(data){
		if(data == 'ok'){
		    $('#phoneNum').css('font-size','120%').html(youData.unoTel[0].TEL);
		}else{
		    $('#after').css('background-image','none');
	    	$('#okok, #nono, #after>span').css('display','');
	    	$('#after').unbind('click');
			toast(youData.id  + '님이after신청했어요!');
		}
	 });
	

	
	$('#btn').click(function() {
		if ($('#txt').val().length != 0) {
			socket.emit('message', {
				"userid" : $('#userid').val(),
				"message" : $('#txt').val()
			});
		}
	});

	socket.on('bye', function() {
		$('#txtarea').append(
				'<br><br><div class="joinUser"><span>' + youData.id + '님이 퇴장하셨습니다.');
	});

	socket.on('message', function(data) {
		

		var date = new Date();
		var hour = date.getHours();
		var minute = date.getMinutes();
		var when;

		if (hour > 12) {
			hour -= 12;
			when = "오후";
		} else {
			when = '오전';
		}
		
		if(minute < 10){
			minute = '0' + minute;
		}

		data.message = data.message.replace(/\r\n/g, '<br>');
		data.message = data.message.replace(/\n/g, '<br>');
		data.message = data.message.replace(/\r/g, '<br>');
		
		//채팅 말풍선 여러줄적용시키기!!2014.06.18
		if (myData.userData[0].ID == data.userid) {
			$('#txtarea').append(
					'<br><div class="mychat"><span class="time1">' + when
							+ ' ' + hour + ' : ' + minute + ' '
							+ '</span><div class="mychtting">' + data.message);
			var textarea = $('#txtarea');
			textarea[0].scrollTop = textarea[0].scrollHeight;
			$('#txt').val('').focus();
		} else {
			$('#txtarea').append(
					'<div class="youchatInline">'+ '<div class="abcd">' + data.userid + '</div>'
							+ '<div class="yourchtting">' + data.message + '</div></div>' 
							+ '<span class="time1"> ' + when + ' ' + hour
							+ ' : ' + minute) + '</span>';
			var textarea = $('#txtarea');
			textarea[0].scrollTop = textarea[0].scrollHeight;
		}
	});
	
	// 채팅스크립트 끝 --------------------------
});

function timer2(){
	
	$('#timerDiv').append($('<span>').text(' 다음 만남까지...   '))
	  .append($('<br><span>').addClass('time time glyphicon glyphicon-time')
			  .text(" 00 : 00 : 00"));
	
	setInterval(function(){
		var date = new Date();
		var standard = 19;
		if(standard - date.getHours() < 0){
			standard += 24;
		}
		
		$('#timerDiv').html('');
		
		$('#timerDiv').append($('<span>').text(' 다음 만남까지...   '))
					  .append($('<br><span>').addClass('time time glyphicon glyphicon-time')
							  .text(" " + format((standard - date.getHours())) + " : " + 
				              format((59 - date.getMinutes())) + " : " + 
				              format((59 - date.getSeconds())) ));
				      /*.append($('<span>').text(' 남았습니다.'));*/
		
		if( (standard - date.getHours()) == 23 && $('#chatBtn').length < 1){
			$('#chatBtn').css('display', '');
		}else if((standard - date.getHours()) != 23 && $('#chatBtn').length == 1 ){
			/*$('#chatBtn').css('display', 'none');*/
		} 
	}, 1000);	
	

}

function timer() {
	
   var minute = 1;
   var second = 10;
   var miliSecond = 99;
   var mileCheck = 0;
   var aaa = setInterval(function(){
	   
	   if(minute == 0 && second == 00){
		   mileCheck = 1;
		   clearInterval(aaa);
	   }
	   
	   $(".timerDiv2").html( minute + ":" + second );
	   
	   if(minute == 1 && second == 0){
		   $('#txtarea').append('<br><div id="oneMin"><p>3분남았어요!</p></div>');
		   
		   var bbb = setInterval(function(){
			   
			   if(miliSecond < 10){
				   miliSecond = "0" + miliSecond;
			   }
			   
			   if($('#miliSpan')){
				   $('#miliSpan').remove();
			   }
			   
			   $('.timerDiv2').append('<span id="miliSpan">' + ':' + miliSecond + '</span>');
			   
			   if(mileCheck == 1 && miliSecond == 0){
				   clearInterval(bbb);
			   }
			   
			   if(--miliSecond < 0){
				   miliSecond = 99;
			   };
		   }, 10);
	   }
	   
	   if(--second < 0 && minute != 0 ){
		   minute--;
		   second = 59;
	   }
	   
	   if(second < 10){
		   second = "0" + second;
	   }
	   
  }, 1000);
}

function format(n) {
	var zero = '';
	n = n.toString();
	if (n.length < 2) {
			zero += '0';
	}
	return zero + n;
}

function cityCheck(choiceCity){
	$('.selectedCity').html(choiceCity);
	$('#cityInput1').val(choiceCity);
	$('#cityModalClose').click();
}

function CityAndBloodCheck(menu, choice){
	if(menu == "city"){
		$('.cityBtn').css('background','').css('color', '');
		$('#city1').val($('#' + choice).html());
		$('#' + choice).css('background-color' , 'darkgray').css('color', 'white');
		$('#city1Label').css('display', 'none');
	}else{
		$('.bloodBtn').css('background','').css('color', '');	
		$('#blood1').val($('#' + choice).html());
		$('#' + choice).css('background-color' , 'darkgray').css('color', 'white');
		$('#blood1Label').css('display', 'none');
	}
}

function formCheck(){
	
	var inputAll = $('input[data-formCheck="true"]');
	
	for(var i=0; i<inputAll.length; i++){
		
		if(inputAll[i].id.substr(inputAll[i].id.length-1) < 4){
			if($('#' + inputAll[i].id).val().length == 0 || $('#' + inputAll[i].id).val()[0] == " "){
				if(inputAll[i].id == 'city1'){
					$('#' + inputAll[i].id + 'Label').css('display', '');
					$('#' + inputAll[i].id.substr(0, inputAll[i].id.length-1) + 'Box').click();
					return false;
				}else if(inputAll[i].id == 'blood1'){
					$('#' + inputAll[i].id + 'Label').css('display', '');
					$('#' + inputAll[i].id.substr(0, inputAll[i].id.length-1) + 'Box').click();
					return false;
				}else{
					$('#' + inputAll[i].id + 'Label').html('필수 입력항목입니다!').css('display', '').css('color', 'red');
					$('#' + inputAll[i].id + 'Div').addClass('has-error has-feedback');
					$('#' + inputAll[i].id.substr(0, inputAll[i].id.length-1) + 'Box').click();
					$('#' + inputAll[i].id).focus();
					return false;
				}
				
			}else if(inputAll[i].id != 'city1' && inputAll[i].id != 'blood1' && $('#' + inputAll[i].id).val().length < 10 && $('#' + inputAll[i].id).val().length > 0){
				$('#' + inputAll[i].id.substr(0, inputAll[i].id.length-1) + 'Box').click();
				$('#' + inputAll[i].id).focus();
				return false;
			}else{
				$('#' + inputAll[i].id + 'Div').removeClass('has-error has-feedback');
				$('#' + inputAll[i].id + 'Label').css('display', 'none');
			}
		}else{
			if($('#' + inputAll[i].id).css('display') == 'block'){
				if($('#' + inputAll[i].id).val().length == 0 || $('#' + inputAll[i].id).val()[0] == " "){
					$('#' + inputAll[i].id + 'Label').html('필수 입력항목입니다.').css('display', '').css('color', 'red');
					$('#' + inputAll[i].id + 'Div').addClass('has-error has-feedback');
					$('#' + inputAll[i].id.substr(0, inputAll[i].id.length-1) + 'Box').click();
					$('#' + inputAll[i].id).focus();
					return false;
				}else if($('#' + inputAll[i].id).val().length < 10 && $('#' + inputAll[i].id).val().length > 0){
					$('#' + inputAll[i].id.substr(0, inputAll[i].id.length-1) + 'Box').click();
					$('#' + inputAll[i].id).focus();
					return false;
				}else{
					$('#' + inputAll[i].id + 'Div').removeClass('has-error has-feedback');
					$('#' + inputAll[i].id + 'Label').css('display', 'none');
				}
			}
		}
	}
	
	profileUpdate();
}


function profileUpdate(){
	
	$.post('/profileUpdate', {
		uno : myData.userData[0].UNO,
		city : $('#city1').val(),
		blood : $('#blood1').val(),
		job : $('#job1').val(),
		face1 : $('#face1').val(),
		face2 : $('#face2').val(),
		face3 : $('#face3').val(),
		face4 : $('#face4').val(),
		face5 : $('#face5').val(),
		style1 : $('#style1').val(),
		style2 : $('#style2').val(),
		style3 : $('#style3').val(),
		style4 : $('#style4').val(),
		style5 : $('#style5').val(),
		ct1 : $('#personality1').val(),
		ct2 : $('#personality2').val(),
		ct3 : $('#personality3').val(),
		ct4 : $('#personality4').val(),
		ct5 : $('#personality5').val(),
		hobby1 : $('#hobby1').val(),
		hobby2 : $('#hobby2').val(),
		hobby3 : $('#hobby3').val(),
		hobby4 : $('#hobby4').val(),
		hobby5 : $('#hobby5').val()
		
	}, function(data){
		$('#mainPage').click();
	});
}


function plus(id){
	if($(id + 'InputCount').val() == '0'){
		$(id + '4').css('display', '');
		$(id + 'Minus').css('display', '');
		$(id + 'InputCount').val('1');
		$(id + 'InputEnd').css('display', 'none');
	}else if($(id + 'InputCount').val() == '1'){
		$(id + '5').css('display', '');
		$(id + 'Plus').css('display', 'none');
		$(id + 'InputCount').val('2');
		$(id + 'InputEnd').css('display', 'none');
	}
}

function minus(id){
	if($(id + 'InputCount').val() == '2'){
		$(id + '5').css('display', 'none');
		$(id + 'Plus').css('display', '');
		$(id + '5').val("");
		$(id + 'InputCount').val('1');
		$(id + '5Label').css('display', 'none');
	}else if($(id + 'InputCount').val() == '1') {
		$(id + '4').css('display', 'none');
		$(id + 'Minus').css('display', 'none');
		$(id + '4').val("");
		$(id + 'InputCount').val('0');
		$(id + '4Label').css('display', 'none');
	}
}

function eventonkeypress(id) {
	
	if($(id).val().length == 0){
    	$(id + 'Label').html('필수 입력항목입니다!').css('display', '').css('color', 'red');
    	$(id + 'Div').removeClass('has-warning has-feedback');
    	$(id + 'Div').addClass('has-error has-feedback');
    }else if($(id).val().length > 0 && $(id).val().length < 10){
    	$(id + 'Label').html('10자 이상 적어주세요!').css('display', '').css('color','#996633');
    	$(id + 'Div').removeClass('has-error has-feedback');
    	$(id + 'Div').addClass('has-warning has-feedback');
    }else{
    	$(id + 'Label').css('display', 'none');
    	$(id + 'Div').removeClass('has-warning has-feedback');
    	$(id + 'Div').addClass('has-success has-feedback');
    }
  }

function sosTextLengthCheck(sosText){
	var sosTextLength = 0;
	
	for(var i=0; i < sosText.length; i++) {
        var c = escape(sosText.charAt(i));
         
        if( c.length==1 ) sosTextLength ++;
        else if( c.indexOf("%u")!=-1 ) sosTextLength += 2;
        else if( c.indexOf("%")!=-1 ) sosTextLength += c.length/3;
    }
	
	if(sosTextLength != 0 && sosTextLength <= 500){
		$('#abc').removeClass('disabled');
		$('#sosTextLength').html(sosTextLength).css('color','black');
		$('#inputTextLabel').css('display','none');
	}else if(sosTextLength == 0){
		$('#abc').addClass('disabled');
	}else{
		$('#abc').addClass('disabled');
		$('#sosTextLength').html(sosTextLength).css('color','red');
		$('#inputTextLabel').css('display','');
	}
}

function helpMe(sosYesNo){
	
	if($('#' + sosYesNo.id).html() == '예'){
		var i = $('#txtarea>div');
		var chatText = "";
		
		for(var j=0; j<i.length; j++){
			chatText += i[j].innerText + '<br>';
		}
		$.post('/sos', {
			sosText :$('#inputText').val(),
			chatText : chatText,
			myUNO : myData.userData[0].UNO,
		    youUNO : youData.unoTel[0].UNO
		}, function(data){
			socket.emit("bye");
			$('#sosCloseBtn').click();
			$('#mainPage').click();
		});
	}else{
		$('#sosCloseBtn').click();
	}
};



