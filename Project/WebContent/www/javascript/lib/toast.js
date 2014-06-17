var toast= function(msg){
   $("<div> <div  class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h4>"+msg+"</h4></div></div> ")
   .css({ display: "block", 
      opacity: 0.90, 
      position: "fixed",
      "text-align": "center",
      border: "1px solid red",
      width: "70%",
      height: "6%",
      color: "white",
      "background-color": "#e35e4b",
      "border-radius": "10px",
      
       left: $(window).width()/6,
      top: $(window).height()/3 })
      
   .appendTo( $('.Loginmid')).delay( 500 )
   .fadeOut( 3000, function(){
      $(this).remove();
   });
};