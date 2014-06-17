$(function(){

  var methods = {
		  
     change : function(event) { 
    	 
     	var id = this.id;
     	
 	    for(var i=0; i<this.files.length; i++){
 	    	if(this.files[i].type.split('/')[0] == 'image'){
 	    		
	 	    	var reader = new FileReader();
	    		reader.onload = function (e) {
	    			$('#upload_' + id).css({'background-image': ('url('+e.target.result+')'), 'background-size': '100% 100%' });
	    		};
	    		
	    		reader.readAsDataURL(this.files[i]);
	 	   	}else{
	 	   		alert('이미지 형식 파일만 등록 가능합니다.');
	 	   		alert($('#' + id).val(''));
	 	   		$('#upload_' + id).css('background-image', 'url("/img/photo.png")');
	 	   		return false;
	 	   	};
 	    };
     }
  };

  $.fn.preimage = function( method ) {
	  $(this).bind('change', methods.change);
  };
});

