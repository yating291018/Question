$(function(){
    $("input").on("focus",function(){
            $(this).parents(".am-form-group").next().animate({opacity:1},500);
    });
    var userflag=false;
    var photoflag=false;
    $("input[name=username]").on("blur",function(){
        var name=$(this).val();
        var $this=$(this);
        if(/^[\u4E00-\u9FA5]{2,5}$/.test(name)){
            $.post("/username",{username:name}).done(function(data){
                if(data){
                   if(data.code=="fail"){
                     $this.parent().next().removeClass("fail").addClass("success").html("存在可用");
                    userflag=true;
                 }else{
                     $this.parent().next().removeClass("success").addClass("fail").html("用户名不存在");
                     userflag=false;
                 }
                }
            }).fail(function(error){
                console.log(error);
            });
       }else{
            $this.parent().next().removeClass("success").addClass("fail").html("不合法...");
            userflag=false;
       }
    });
    $("input[name=photo]").on("blur",function(){
        var photo=$.trim($(this).val());
        var $this=$(this);
        if(/^1[3587]\d{9}$/.test(photo)){
            $this.parent().next().removeClass("fail").addClass("success").html("可用");
            photoflag=true;
       }else{
            $this.parent().next().removeClass("success").addClass("fail").html("不合法...");
            photoflag=false;
       }
    });
    $(".lbtn").on("click",function(e){
            e.preventDefault();
            if(userflag && photoflag){
                location.href="resetpass.html";
            }
    });
});