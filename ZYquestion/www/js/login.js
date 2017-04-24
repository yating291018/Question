$(function(){
     $(".register").on("click",function(){
        location.href="register.html";
     });
     $("form").on("submit",function(e){
            e.preventDefault();
            var data=$(this).serialize();
            $.post("/login",data).done(function(data){
                   if(data){
                        if(data.code=="success"){
                            location.href="index.html";
                        }else if(data.code=="fail"){
                            $(".error").text(data.message).animate({opacity:1},500).removeClass("success").addClass("fail");
                        }
                   }
            });
    });
});