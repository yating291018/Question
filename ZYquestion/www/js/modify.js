$(function(){
    var username=$.cookie("username");
    if(!username){
        location.href="login.html";
    }
    $("input").on("focus",function(){
            $(this).parents(".am-form-group").next().animate({opacity:1},500);
    });
    var oldpassflag=false,newpassflag=false;
    $("input[name=username]").on("blur",function(){
        var name=$(this).val();
        var $this=$(this);
        if(/^[\u4E00-\u9FA5]{2,5}$/.test(name)){
            if(name==username){
                $this.parent().next().removeClass("fail").addClass("success").html("用户名正确！");
            }else{
                $this.parent().next().removeClass("success").addClass("fail").html("用户名和登录名不一致！");
            }
       }else{
            $this.parent().next().removeClass("success").addClass("fail").html("不合法...");
       }
    });
    $("input[name=oldPassword]").on("blur",function(){
       var name=$.trim($(this).val());
       if(/^\w{6,16}$/.test(name)){
           $(this).parent().next().removeClass("fail").addClass("success").html("密码可用");
           oldpassflag=true;
       }else{
           $(this).parent().next().removeClass("success").addClass("fail").html("密码不合法...");
            oldpassflag=false;
       }
    });
    $("input[name=password]").on("change",function(){
       var name=$.trim($(this).val());
       if(/^\w{6,16}$/.test(name) && $.trim($("input[name=oldPassword]").val())!=name){
          $(this).parent().next().removeClass("fail").addClass("success").html("新密码可用");
          newpassflag=true;
       }else{
          newpassflag=false;
          $(this).parent().next().removeClass("success").addClass("fail").html("密码不可用");
       }
    });
    $("form").on("submit",function(e){
         e.preventDefault();
         var oldpass=$.trim($("input[name=oldPassword]").val());
         var newpass=$.trim($("input[name=password]").val());
         var data={oldPassword:oldpass,password:newpass};
         if(oldpassflag && newpassflag){
           $.post("/password",data).done(function(data){
                if(data.code=="success"){
                     gologin(data.message);
                }else{
                     gologin(data.message);
                }
           });
         }else{
             gologin("旧密码或新密码不符合！");
         }
    });
    function gologin(message){
        $(".fadeOut").click();
        $(".am-modal-bd").html(message);
        $(".aclose").on("click",function(){
            location.href="login.html";
        });
    }
});