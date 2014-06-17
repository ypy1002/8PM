var IDConfirm;
var searchID;
var PWConfirm;
var check = 'id';
var socket = io.connect('http://localhost:4000');

//toast 2014.06.17
var toast = function(msg){
	   $("<div><div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h4><span class='glyphicon glyphicon-warning-sign'></span>&nbsp"+msg+"</h4></div></div> ")
	   .css({ display: "block", 
	      opacity: 0.90, 
	      position: "fixed",
	      "text-align": "center",
	      border: "1px solid #FFC091",
	      width: "67%",
	      height: "6%",
	      color: "white",
	      "background-color": "#FFC091",
	      "border-radius": "5px",
	      
	       left: $(window).width()/6,
	       top: $(window).height()/2 })
	     
	   .appendTo( $('body')).delay( 500 )
	   .fadeOut( 3000, function(){
	      $(this).remove();
	   });
	};
//toast 2014.06.17 여기까지
function moveSignPage(){
	$('#signPage').click();
}

function selectSearch(menu){
	
	if(menu.id == 'idSearch' && check != 'id'){
		$('#pwSearch').css('background-color', '').css('color','');
		$('#idSearch').css('background-color', '#47A447').css('color','white');
		$('.idFirstShow').css('display', '');
		$('.idFirstHidden').css('display', 'none');
		$('.idInput').val('').removeAttr('readonly');
		$('#idNumberBtn').html('인증번호 받기');
		check = 'id';
	}else if(menu.id == 'pwSearch' && check != 'pw'){
		$('#idSearch').css('background-color', '').css('color','');
		$('#pwSearch').css('background-color', '#47A447').css('color','white');
		$('.pwFirstShow').css('display','');
		$('.pwFirstHidden').css('display','none');
		$('.pwInput').val('').removeAttr('readonly');
		$('#pwNumberBtn').html('인증번호 받기');
		check = 'pw';
	}else{
		$('.idFirstShow, .pwFirstShow').css('display', '');
		$('.idFirstHidden, .pwFirstHidden').css('display', 'none');
		$('.idInput, .pwInput').val('').removeAttr('readonly');
		$('#idNumberBtn, #pwNumberBtn').html('인증번호 받기');
		$('#idSearch').click();
	}
}

function labelToggle(){
	$('label').css('display','none');
	
	if($('#signId').val().length > 5){
		$('#signIdOKLabel').css('display','');
	}
	
	if($('#signPhoneNumber').val().length == 11){
		$('#signPhoneNumberOKLabel').css('display','');
	}
}

function statusEvent(target, labelHTML, status){
	
	if(status == 'error'){
		$('#' + target.id + 'Div').removeClass('has-success','has-warning').addClass('has-error');
		$('#' + target.id + 'TypoSuccess').css('display', 'none');
		$('#' + target.id + 'Typo').css('color','#a94442').css('display', '');
		$('#' + target.id + 'Label').html(labelHTML).css('display', '');
	}else if(status == 'success'){
		$('#' + target.id + 'Div').removeClass('has-warning').addClass('has-success');
		$('#' + target.id + 'Label, #' + target.id + 'Typo').css('display', 'none');
		$('#' + target.id + 'TypoSuccess').css('color','#3c763d').css('display', '');
	}else if(status == 'success2'){
		$('#' + target.id + 'Div').removeClass('has-error').addClass('has-success');
		$('#' + target.id + 'Label, #' + target.id + 'Typo').css('display', 'none');
		$('#' + target.id + 'TypoSuccess').css('color','#3c763d').css('display', '');
	}else if(status == 'warning'){
		$('#' + target.id + 'Div').removeClass('has-error', 'has-success').addClass('has-warning');
		$('#' + target.id + 'TypoSuccess').css('display', 'none');
		$('#' + target.id + 'Typo').css('color','#66512c').css('display', '');
		$('#' + target.id + 'Label').html(labelHTML).css('display', "");
	}
}


function inputLengthCheck(target){
	
	labelToggle();
	
	var formCheckList = $('.checkInput');
	
	for(var i=0; i<formCheckList.length; i++){
		if($('#' + formCheckList[i].id).val().length == 0 || $('#' + formCheckList[i].id).val()[0] == " "){
			$('#' + formCheckList[i].id).val('');
			$('#' + formCheckList[i].id + 'Div').removeClass('has-warning', 'has-success').addClass('has-error');
			$('#' + formCheckList[i].id + 'TypoSuccess').css('display', 'none');
			$('#' + formCheckList[i].id + 'Typo').css('color','#a94442').css('display', '');
			$('#' + formCheckList[i].id + 'Label').html('필수항목입니다.').css('display', "");
			$('#' + formCheckList[i].id).focus();
			return false;
		}
	}
	
	for(var i=0; i<formCheckList.length; i++){
		var status = Form_Chk(formCheckList[i]);
		if(status == false){
			$('#' + formCheckList[i].id).focus();
			return false;
		}
	}
	

	
	if(idCheckStatus == 'error'){
		$('#signId').focus();
		return false;
	}else if(phoneNumberCheckStatus == 'error'){
		$('#signPhoneNumber').focus();
		return false;
	}else{
		
		if(target.id == "signEnd"){
			$.post('/sign', {
				id : $('#signId').val(),
			    pw : $('#signPw').val(),
			    name : $('#signName').val(),
			    gender : $('#signGender').val(),
			    year : $('#signYear').val(),
			    month : $('#signMonth').val(),
			    day : $('#signDay').val(),
			    tel : $('#signPhoneNumber').val()
			
				}, function(data){
					toast(data);
					$('#nextBtn').click();
		 	    });
		}else{
			setTimeout('sendNumber();', 1000);
		}
	}
}

function genderCheck(target){
	if(target.id == "man"){
		$('#signGender').val("남자");
		$('#man').css('background-color', '#6EEAFF').css('color',"white");
		$('#woman').css('background-color', '').css('color',"#FFDAD7");
		$('#signGenderTypo, #signGenderLabel').css('display', 'none');
		$('#signGenderTypoSuccess').css('display', '').css('color','#3c763d');
	}else if(target.id == "woman"){
		$('#signGender').val("여자");
		$('#woman').css('background-color', '#FFDAD7').css('color',"white");
		$('#man').css('background-color', '').css('color',"#6EEAFF");
		$('#signGenderTypo, #signGenderLabel').css('display', 'none');
		$('#signGenderTypoSuccess').css('display', '').css('color','#3c763d');
	}
}

function checkLength(target){
	if($('#' + target.id).val().length == 0 || $('#' + target.id).val()[0] == " "){
		$('#' + target.id).val('');
		statusEvent(target, "필수항목입니다", "error");
		return false;
	}
}

function checkId(target){
	if($('#' + target.id).val().length > 0 && $('#' + target.id).val().length < 6){
		statusEvent(target, 6 - $('#' + target.id).val().length + '자 더 입력해주세요.', "warning");
		return false;
	}else{
		
		$.post('/idChk', {
			id : $('#' + target.id).val(),
			
		}, function(data){
			
			if(data == "ID사용가능"){
				statusEvent(target, "", "success");
				statusEvent(target, "", "success2");
				$('#' + target.id + 'OKLabel').html('사용할 수 있는 ID입니다.').css('display','').css('color', '#3c763d');
				idCheckStatus = "result";
			}else{
				$('#' + target.id + 'Div').removeClass('has-success','has-warning').addClass('has-error');
				$('#' + target.id + 'TypoSuccess').css('display', 'none');
				$('#' + target.id + 'Typo').css('color','#a94442').css('display', '');
				$('#' + target.id + 'OKLabel').html('사용할 수 없는 ID입니다.').css('display','').css('color', 'red');
				idCheckStatus = "error";
				return false;
			}
 	    });
	}
}

function checkPw(target){
	if($('#' + target.id).val().length > 0 && $('#' + target.id).val().length < 8){
		statusEvent(target, 8 - $('#' + target.id).val().length + '자 더 입력해주세요.', "warning");
		if($('#signPwConfirm').val().length > 0){
			$('#signPwConfirmDiv').removeClass('has-success','has-warning').addClass('has-error');
			$('#signPwConfirmTypoSuccess').css('display', 'none');
			$('#signPwConfirmTypo').css('color','#a94442').css('display', '');
		}
		return false;
	}else{
		statusEvent(target, "", "success");
	}
	
	if($('#signPwConfirm').val().length > 0){
		if($('#signPwConfirm').val() != $('#' + target.id).val()){
			$('#signPwConfirmDiv').removeClass('has-success').addClass('has-error');
			$('#signPwConfirmTypoSuccess').css('display', 'none');
			$('#signPwConfirmLabel').html('비밀번호가 일치하지 않습니다.').css('display', '');
			$('#signPwConfirmTypo').css('color','#a94442').css('display', '');
		}else{
			$('#signPwConfirmDiv').removeClass('has-error', 'has-warning').addClass('has-success');
			$('#signPwConfirmLabel, #signPwConfirmTypo').css('display', 'none');
			$('#signPwConfirmTypoSuccess').css('color','#3c763d').css('display', '');
		}
	}
}

function checkPwConfirm(target){
	if($('#' + target.id).val().length > 0 && $('#' + target.id).val().length < 8){
		statusEvent(target, 8 - $('#' + target.id).val().length + '자 더 입력해주세요.', "warning");
		return false;
	}
	
	if($('#signPw').val() != $('#' + target.id).val()){
		statusEvent(target, "비밀번호가 일치하지 않습니다.", "error");	
		return false;
	}else{
		statusEvent(target, "", "success");
		statusEvent(target, "", "success2");
	}
}

function checkName(target){
	$('#' + target.id).val($('#' + target.id).val().replace(/[a-z0-9]/gi,''));
	
	if($('#' + target.id).val().length < 2){
		statusEvent(target, 2 - $('#' + target.id).val().length + '자 더 입력해주세요.', "warning");
		return false;
	}else{
		statusEvent(target, "", "success");
	}
}

function checkYear(target){
	$('#' + target.id).val($('#' + target.id).val().replace(/[^0-9]/gi,""));
	
	var nowYear = new Date().getFullYear();
	
	if($('#' + target.id).val().length < 4){
		statusEvent(target, 4 - $('#' + target.id).val().length + '자 더 입력해주세요.', "warning");
		return false;
	}
	
	if($('#' + target.id).val() > nowYear){
		statusEvent(target, "잘못된 날짜입니다.", "error");
		return false;
		
	}else if($('#' + target.id).val() >= (nowYear-18)){
		statusEvent(target, "미성년자는 가입하실 수 없습니다.", "error");	
		return false;
		
	}else if($('#' + target.id).val() <= (nowYear-59)){
		statusEvent(target, "60세 이상은 가입하실 수 없습니다.", "error");	
		return false;
		
	}else{
		statusEvent(target, "", "success");
	}
}

function checkMonth(target){
	$('#' + target.id).val($('#' + target.id).val().replace(/[^0-9]/gi,""));
	
	if($('#' + target.id).val() < 1 || $('#' + target.id).val() > 12){
		statusEvent(target, "잘못된 날짜입니다.", "error");
		return false;
		
	}else{
		
		statusEvent(target, "", "success2");
		
		var month = checkDay();
		
		if(month == false){
			return false;
		}
		
	}
}

function checkDay(target){
	
	$('#signDay').val($('#signDay').val().replace(/[^0-9]/gi,""));
	
	if($('#signYear').val() % 4 == 0 && $('#signYear').val() % 100 != 0){
		if($('#signMonth').val() == 2){
			if($('#signDay').val() > 29 || $('#signDay').val() < 1){
				statusEvent($('#signDay')[0], "잘못된 날짜입니다.", "error");
				return false;
			}
		}else if($('#signMonth').val() == 1 || $('#signMonth').val() == 3 || 
				 $('#signMonth').val() == 5 || $('#signMonth').val() == 7 || 
				 $('#signMonth').val() == 8 || $('#signMonth').val() == 10 || 
				 $('#signMonth').val() == 12){
			if($('#signDay').val() > 31 || $('#signDay').val() < 1){
				statusEvent($('#signDay')[0], "잘못된 날짜입니다.", "error");
				return false;
			}
		}else{
			if($('#signDay').val() > 30 || $('#signDay').val() < 1){
				statusEvent($('#signDay')[0], "잘못된 날짜입니다.", "error");
				return false;
			}
		}
	}else{
		if($('#signMonth').val() == 2){
			if($('#signDay').val() > 28 || $('#signDay').val() < 1){
				statusEvent($('#signDay')[0], "잘못된 날짜입니다.", "error");
				return false;
			}
		}else if($('#signMonth').val() == 1 || $('#signMonth').val() == 3 ||
			     $('#signMonth').val() == 5 || $('#signMonth').val() == 7 || 
			     $('#signMonth').val() == 8 || $('#signMonth').val() == 10 ||
			     $('#signMonth').val() == 12){
			if($('#signDay').val() > 31 || $('#signDay').val() < 1){
				statusEvent($('#signDay')[0], "잘못된 날짜입니다.", "error");
				return false;
			}
		}else{
			if($('#signDay').val() > 30 || $('#signDay').val() < 1){
				statusEvent($('#signDay')[0], "잘못된 날짜입니다.", "error");
				return false;
			}
		}
	}
	
	statusEvent($('#signDay')[0], "", "success2");
}

function checkPhoneNumber(target){
	if($('#' + target.id).val().length < 11){
		statusEvent(target, 11 - $('#' + target.id).val().length + '자 더 입력해주세요.', "warning");
		return false;
	}else if($('#' + target.id).val().substr(0,3) != "010"){
		statusEvent(target, '잘못된 전화번호 형식입니다.' , "error");
		return false;
	}else{
		
		$.post('/telChk', {
			tel : $('#signPhoneNumber').val()
		
		}, function(data){
			
				if(data == "TEL중복"){
					$('#signPhoneNumberOKLabel').html('사용할 수 없는 번호입니다.').css('display','').css('color', 'red');
					$('#' + target.id + 'Div').removeClass('has-success','has-warning').addClass('has-error');
					$('#' + target.id + 'TypoSuccess').css('display', 'none');
					$('#' + target.id + 'Typo').css('color','#a94442').css('display', '');
					phoneNumberCheckStatus = 'error';
					return false;
							
				}else{
					statusEvent(target, "", "success");
					$('#signPhoneNumberLabel').css('display','none');
					$('#signPhoneNumberOKLabel').html('사용할 수 있는 번호입니다.').css('display','').css('color', '#3c763d');
					phoneNumberCheckStatus = 'result';
				}
 	    });
	}
}
	
function Form_Chk(target){
	
	labelToggle();
	
	if(target.id != 'signGender' && checkLength(target) == false) return false;
	if(target.id == 'signId' && checkId(target) == false) return false;
	if(target.id == 'signPw' && checkPw(target) == false) return false;
	if(target.id == 'signPwConfirm' && checkPwConfirm(target) == false) return false;
	if(target.id == 'signName' && checkName(target) == false) return false;
	if(target.id == 'signYear' && checkYear(target) == false) return false;
	if(target.id == 'signMonth' && checkMonth(target) == false) return false;
	if(target.id == "signDay" && checkDay(target) == false) return false;
	if(target.id == 'signPhoneNumber' && checkPhoneNumber(target) == false) return false;
	
}

function sendNumber(){
	$('#signRecievedNumber, #complete').css('display','');
	$('#signPhoneNumber').attr('readonly', 'readonly');
	$("#number").html("인증번호 새로받기");
	randomNum = parseInt(Math.random() * 8999 +1000);
	toast(randomNum);
	
}

function numberCheck(){
	if($('#signRecievedNumber').val() == randomNum){
		toast('인증되었습니다.');
		$('#number , #signRecievedNumber, #complete, #signRecievedNumberLabel').css('display','none');
		$('#signEnd').css('display', '');
	}else{
		$('#signRecievedNumberLabel').css('display','');
	}
}

$(function() {
	
/*	$('.carousel').carousel({
		  interval: 0
	});*/
	
	$('label').css('display','none');
	
	$('.checkInput').keyup(function(){
		Form_Chk(this);
	});
	
	$('#number, #signEnd').click(function(){
		inputLengthCheck(this);
	});
	
	$('#complete').click(function(){
		numberCheck();
	});
	
	$("input:text[numberOnly]").keyup(function(){
		$(this).val($(this).val().replace(/[^0-9]/gi,""));
	});
	
	$('#idSearch').css('background-color', '#47A447').css('color','white');

	
	$('#idNumberBtn').click(function(){
		if($('#idSearchTelNo').val().length == 0 || $('#idSearchTelNo').val()[0] == " "){
			$('#idSearchTelNoLabel').html("전화번호를 입력해주세요.").css('display', '');
			return false;
		}
		
		if($('#idSearchTelNo').val()[0] == 0 && $('#idSearchTelNo').val()[1] == 1 && $('#idSearchTelNo').val()[2] == 0 && $('#idSearchTelNo').val().length == 11){
			$.post('/searchId', {
				tel : $('#idSearchTelNo').val()
				
			}, function(data){
				
				if(data == "등록되어있지 않은 번호입니다."){
					$('#idSearchTelNoLabel').html("등록되어있지 않은 번호입니다.").css('display', '').focus();
					$('#idSearchTelNo').val('');
				}else{
					searchID = data;
					$('#idSearchTelNoLabel, #idSearchTelNoLabel').css('display', 'none');
					$('.idNumberDiv').css('display', '');
					$('#idNumberBtn').html('인증번호 새로받기');
					$('#idSearchTelNo').attr('readonly', 'readonly');
					IDConfirm = Math.floor(Math.random() * (9999 - 1000)) + 1000;
					toast(IDConfirm);
				}
			});
		}else{
			$('#idSearchTelNoLabel').html("잘못된 전화번호 형식입니다.").css('display', '').focus();
			$('#idSearchTelNo').val('');s
		}
	});
	
	$('#idSubmitBtn').click(function(){
		if ($('#idNumber').val() == IDConfirm) {
			$('#idNumber').attr('readonly', 'readonly');
			$('.idEndHidden').css('display','none');
			$('#userID').html("ID : " + searchID).css('display','');
		}else{
			$('#idNumberLabel').css('display','');
		}
	});
	
	$('#pwNumberBtn').click(function(){
		
		if($('#pwSearchID').val().length == 0 || $('#pwSearchID').val()[0] == " "){
			$('#pwSearchTelNoLabel').css('display', 'none');
			$('#pwSearchIDLabel').html('ID를 입력해주세요.').css('display', '');
			return false;
		}
		
		if($('#pwSearchTelNo').val().length == 0 || $('#pwSearchTelNo').val()[0] == " "){
			$('#pwSearchTelNoLabel').html('전화번호를 입력해주세요.').css('display', '');
			$('#pwSearchIDLabel').css('display', 'none');
			return false;
		}
		
		if($('#pwSearchTelNo').val()[0] == 0 && $('#pwSearchTelNo').val()[1] == 1 && $('#pwSearchTelNo').val()[2] == 0 && $('#pwSearchTelNo').val().length == 11){
			
			$.post('/searchPw', {
				id : $('#pwSearchID').val(),
				tel : $('#pwSearchTelNo').val()
				
			}, function(data){
				
				if(data == "가입되어있지 않은 ID입니다."){
					$('#pwSearchIDLabel').html('가입되어있지 않은 ID입니다.').css('display', '');
					$('#pwSearchTelNoLabel').css('display', 'none');
					
				}else if(data == "아이디에 등록된 번호가 아닙니다."){
					$('#pwSearchTelNoLabel').html('아이디에 등록된 번호가 아닙니다.').css('display', '');
					$('#pwSearchIDLabel').css('display', 'none');
					
				}else{
					$('#pwSearchIDLabel, #pwSearchTelNoLabel').css('display', 'none');
					$('.pwNumberDiv').css('display', '');
					$('#pwNumberBtn').html('인증번호 새로받기');
					$('#pwSearchID, #pwSearchTelNo').attr('readonly', 'readonly');
					PWConfirm = Math.floor(Math.random() * (9999 - 1000)) + 1000;
					toast(PWConfirm);
				}
			});
			
		}else{
			$('#pwSearchTelNoLabel').html('잘못된 전화번호 형식입니다.').css('display', '');
			$('#pwSearchTelNo').val('');
		}
		
	});
	
	$('#pwSubmitBtn').click(function(){
		if ($('#pwNumber').val() == PWConfirm) {
			$('.updateShow').css('display','');
			$('.pwEndHidden').css('display','none');
		} else {
			$('#pwNumberLabel').css('display','');
		} 
	});
	
	$('#pwUpdateBtn').click(function(){
		
		if($('#pwUpdate').val().length == 0 || $('#pwUpdate').val()[0] == " "){
			$('#pwUpdateLabel').html('비밀번호를 입력해주세요.').css('display', '');
			$('#pwUpdateChkLabel').css('display', 'none');
			
		}else if($('#pwUpdate').val().length < 8 && $('#pwUpdate').val().length > 0){
			$('#pwUpdateLabel').html('8자 이상 입력해주세요.').css('display', '');
			$('#pwUpdateChkLabel').css('display', 'none');
			
		}else if($('#pwUpdateChk').val().length == 0 || $('#pwUpdateChk').val()[0] == " "){
			$('#pwUpdateChkLabel').html('한번 더 입력해주세요.').css('display', '');
			$('#pwUpdateLabel').css('display', 'none');
			
		}else if($('#pwUpdate').val() != $('#pwUpdateChk').val()){
			$('#pwUpdateChkLabel').html('비밀번호가 다릅니다.').css('display', '');
			$('#pwUpdateLabel').css('display', 'none');
			
		}else{
			$('#pwUpdateLabel, #pwUpdateChkLabel').css('display', 'none');
			
			$.post('/updatePw', {
				id : $('#pwSearchID').val(),
				updatePw : $('#pwUpdate').val()
				
			}, function(data){
				toast(data);
				$('.pwFirstShow').css('display','');
				$('.pwFirstHidden').css('display','none');
				$('.pwInput').val('').removeAttr('readonly');
				$('#pwNumberBtn').html('인증번호 받기');
			});
		}
	});
	
	$('#loginBtn').click(function(){
		
		if($('#inputID').val().length == 0 || $('#inputID').val()[0] == " "){
			toast("ID를 입력해주세요.");
			return false;
		}else if($('#inputPW').val().length == 0 || $('#inputPW').val()[0] == " "){
			toast("PW를 입력해주세요.");
			return false;
		}
		
		$.post('/loginChk', {
			userID : $('#inputID').val(),
			userPW : $('#inputPW').val()
		}, function(data){
			if(data == "가입되어있지 않은 ID입니다."){
				toast(data);
				$('#inputID').val("");
			}else if(data == "PW가 틀렸습니다."){
				toast(data);
				$('#inputPW').val("");
			}else{
				if(data[0].CITY){
					location.href='/html/login/main.html';
				}else{
					location.href='/html/profile/profile.html';
				}
			}
		});
	});
});

