var menuCount = 0;
var myData;

$(function(){
	
	$.getJSON('/getUserProfile', function(data){
		console.log(data);
		myData = data;
	});
	
	$('.carousel').carousel({
		  interval: 0
	});
	
	$('#city1, #blood1, label, .toggleInput, .carousel-indicators, .file, #photoSubmit').css('display','none');
	
	$('.file').preimage();
	
});

function whereClickFileDiv(clickDiv){
	$('#file' + clickDiv.id.substr(clickDiv.id.length-1)).click();
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
	
	var inputAll = $('input[type=text]');
/*	var fileAll = $('input[type=file]');*/
	
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
	
	
/*	for(var i=0; i<fileAll.length; i++){
		if($('#' + fileAll[i].id).val().length == 0){
			$('#file1Label').css('display', '');
			$('#photoBox').click();
			return false;
		}
	}
	
	$('#photoSubmit').click();*/
	setTimeout("profileInsert();", 1000 * 2);
	
}


function profileInsert(){
	
	$.post('/profileInsert', {
		
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
		personality1 : $('#personality1').val(),
		personality2 : $('#personality2').val(),
		personality3 : $('#personality3').val(),
		personality4 : $('#personality4').val(),
		personality5 : $('#personality5').val(),
		hobby1 : $('#hobby1').val(),
		hobby2 : $('#hobby2').val(),
		hobby3 : $('#hobby3').val(),
		hobby4 : $('#hobby4').val(),
		hobby5 : $('#hobby5').val()
		
	}, function(data){
		alert(data);
		location.href = '/html/login/main.html';
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

