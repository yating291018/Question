$(function(){
    $("input").on("focus",function(){
            $(this).parents(".am-form-group").next().animate({opacity:1},500);
    });
    drawQ();
    //点击图片刷新验证码
    $(".yamimg").on("click",function(){
        clearTimeout(this.timer);
        this.timer=setTimeout(function(){
           drawQ();
         },200);
    });
    //?????????????????????????????????????????????
    //验证验证码与cookie里面保存的验证码是否一致如果一致就让其成功
    var userflag=false,ymaflag=false,newpassflag=false;
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
    $("input[name=yanma]").on("blur",function(){
        var yanma=$.trim($(this).val());
        if(yanma==$.cookie("yma")){
            $(this).parent().next().removeClass("fail").addClass("success").html("验证码正确");
            ymaflag=true;
        }else{
            $(this).parent().next().removeClass("success").addClass("fail").html("验证码错误");
            ymaflag=false;
            drawQ();
        }
    });
    $("input[name=password]").on("change",function(){
      var password=$.trim($(this).val());
      if(/^\w{6,16}$/.test(password)){
         $(this).parent().next().removeClass("fail").addClass("success").html("密码可用");
         newpassflag=true;
      }else{
        $(this).parent().next().removeClass("success").addClass("fail").html("密码不合法...");
        newpassflag=false;
      }
    });
     $(".reset").on("click",function(e){
          e.preventDefault();
          if(userflag && ymaflag && newpassflag){
                var username=$.trim($("input[name=username]").val());
                var newpass=$.trim($("input[name=password]").val());
                $.post("/resetpassword",{username:username,password:newpass}).done(function(data){
                      if(data.code=="success"){
                            $(".fadeOut").click();
                            $(".am-modal-bd").html(data.message);
                            $(".aclose").on("click",function(){
                                location.href="login.html";
                            });
                      }else{
                            $(".am-modal-bd").html(data.message);
                            $(".fadeOut").click();
                      }
                });
          }else{
              $(".am-modal-bd").html("修改失败!");
              $(".fadeOut").click();
          }
     });
    function drawQ(){
      var nums=[];
      var py=0;
      var  canvas=$(".canvas")[0];
      var cat=canvas.getContext("2d");
      cat.clearRect(0,0,canvas.width,canvas.height);
      cat.rect(0,0,canvas.width,canvas.height);
      cat.font="90px 微软雅黑";
      for(var i=0;i<4;i++){
          var num=Math.floor(Math.random()*10);
          nums.push(num);
          cat.fillStyle=randColor();
          if(i%2==0){
              py=-10;
          }else{
              py=10;
          }
          cat.fillText(num,30+i*60,110+py);
      }
      $.cookie("yma",nums.join(""));
    }

});
function randColor(){
            var r=Math.floor(Math.random()*256);
            var g=Math.floor(Math.random()*256);
            var b=Math.floor(Math.random()*256);
            return "rgb("+r+","+g+","+b+")";
}