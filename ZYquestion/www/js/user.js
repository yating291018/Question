$(function(){
   var username=$.cookie("username");
   var headerimg=$.cookie("header");
   if(!username){
        location.href="login.html";
   }
   if(username !="undefined" && username){
        $(".login").hide().next().show().find("a span").text(username);
        var data="username="+username;
        $.get("/user",data).done(function(data){
                $(".am-list li").each(function(i,el){
                    if($(this).data("info")){
                        $(el).find("span").text(data.data[$(this).data("info")]);
                        if(i==2){
                          var sex=data.data[$(el).data("info")]=="true"?"男":"女";
                          $(el).find("span").text(sex);
                        }
                        if(i==5){
                            $(el).find("span").text(time(data.data[$(el).data("info")]));
                        }
                    }
                });
          }).fail(function(error){
              console.log(error);
          });
     }else{
        $(".am-dropdown").hide().prev().show();
   }
   if(headerimg && headerimg!="undefined"){
      $(".header-img img").attr("src","uploads/"+headerimg);
      $(".am-btn img").attr("src","uploads/"+headerimg);
   }
   $(".am-dropdown-content li").first().on("click",function(){
      location.href="user.html";
   });
   $(".am-dropdown-content li").last().on("click",function(){
        $.removeCookie("username");
        $.removeCookie("header");
        location.reload();
   });
   $(".ask").on("click",function(){
      location.href="ask.html";
   });
   $(".upload-img").on("click",function(){
          $(".uploadbtn").click();
          $(".pic,.pj").on("click",function(){
              $(".header-img input").click();
              $("#my-actions").hide();
          });
   });
   $(".header-img input[type=file]").change(function(){
         //上传文件必须使用formdata格式的数据,传入的参数必须为原始的form便签的dom节点
        var datas=new FormData($("form")[0]);
        $.post({
          url:"/header",
          data:datas,
          contentType:false,
          processData:false
        }).done(function(data){
            if(data.code=="success"){
                location.reload();
            }
        }).fail(function(error){
           console.log(error);
        });
   });
   $(".modify").on("click",function(){
        location.href="modifyp.html";
   });

});
function time(timestamp){
        var date=new Date(timestamp);
        var year=date.getFullYear();
        var month=date.getMonth()+1;
        month=month>9?month:"0"+month;
        var day=date.getDate();
        day=day>9?day:"0"+day;
        var hour=date.getHours();
        hour=hour>9?hour:"0"+hour;
        var minute=date.getMinutes();
        minute=minute>9?minute:"0"+minute;
        var second=date.getSeconds();
        second=second>9?second:"0"+second;
        return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
        // return `{year}`年`{month}`月`{day}`日  `{hour}`时`{minute}`分`{second}`秒;
    }
