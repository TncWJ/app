
	//tab切换
$.jqtab = function(obj){
   var len=$(obj).length;
    $(obj).click(function(){
      for(var i=0;i<len;i++){
        if($(this).hasClass("active")){
          $(this).removeClass("active");
        }else{
          $(this).addClass("active").siblings().removeClass("active");
        }
      }
    });
	}

$.tap=function(obj){
	$(obj).tap(function(){
		$(this).addClass("on").siblings().removeClass("on");
	});
	
}	
$.clicktap=function(obj){
	$(obj).click(function(){
		$(this).addClass("on").siblings().removeClass("on");
	});
	
}	

//遮罩
$.maskclshow=function(obj,oShow){
 $(obj).click(function(){
    $(".mask").fadeIn(200); 
    $(oShow).fadeIn(500);
	
  });
   $(".hotel_sure,.mask").click(function(){
	  $(".mask").fadeOut(200);
	  $(oShow).fadeOut(200);
	 
	});
	}
//遮罩二
$.maskshow=function(obj,oShow){
 $(obj).tap(function(){ 
    $(".mask").show(); 
    $(oShow).show();
	
  });
   $(".hotel_sure,.mask").tap(function(){
	  $(".mask").hide();
	  $(oShow).hide();
	});	
	}