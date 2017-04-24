$(function(){
    $("input").on("focus",function(){
            $(this).parents(".am-form-group").next().animate({opacity:1},500);
    });
    var usernameflag=false,passflag=false,repassflag=false,emailflag=false;
    $("input[name=username]").on("blur",function(){
        var name=$(this).val();
        var $this=$(this);
        if(/^[\u4E00-\u9FA5]{2,5}$/.test(name)){
            $.post("/username",{username:name}).done(function(data){
                if(data){
                   if(data.code=="success"){
                    $this.parent().next().removeClass("fail").addClass("success").html(data.message);
                    usernameflag=true;
                  }else{
                       $this.parent().next().removeClass("success").addClass("fail").html(data.message);
                        usernameflag=false;
                  }
                }
            }).fail(function(error){
                console.log(error);
            });
       }else{
            $this.parent().next().removeClass("success").addClass("fail").html("不合法...");
            usernameflag=false;
       }
    });

    $("input[name=password]").on("blur",function(){
       var name=$(this).val();
       if(/^\w{6,16}$/.test(name)){
           $(this).parent().next().removeClass("fail").addClass("success").html("密码可用");
           passflag=true;
       }else{
           $(this).parent().next().removeClass("success").addClass("fail").html("密码不合法...");
           passflag=false;
       }
    });

    $("input[name=repassword]").on("change",function(){
       var name=$(this).val();
       if(name && $("input[name=password]").val()==name){
          $(this).parent().next().removeClass("fail").addClass("success").html("密码一致");
          repassflag=true;
       }else{
          $(this).parent().next().removeClass("success").addClass("fail").html("密码不一致");
          repassflag=false;
       }
    });

    $("input[name=email]").on("blur",function(){
        var reg=/^[0-9a-zA-Z]+@[0-9a-zA-Z]+\.[a-z]+$/;//小括号子项
        if(reg.test($(this).val())){
            $(this).parent().next().removeClass("fail").addClass("success").html("邮箱正确");
            emailflag=true;
        }else{
            $(this).parent().next().removeClass("success").addClass("fail").html("邮箱格式不正确");
            emailflag=false;
        }
    });

     $("form").on("submit",function(e){
            e.preventDefault();
            var data=$(this).serialize();
            if(usernameflag && passflag && repassflag && emailflag){
              $.post("/register",data).done(function(data){
                     if(data){
                          if(data.code=="success"){
                              $(".fadeOut").click();
                              $(".am-modal-bd").html(data.message);
                              $(".am-modal-btn").on("click",function(){
                                  location.href="login.html";
                              });
                          }else{
                              $(".am-modal-bd").html(data.message);
                              $(".fadeOut").click();
                          }
                     }
              });
           }else{
              $(".am-modal-bd").html("注册失败!");
              $(".fadeOut").click();
           }
    });

     $(".login").on("click",function(){
        location.href="login.html";
     });
});