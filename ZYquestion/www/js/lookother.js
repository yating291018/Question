$(function(){
   var username=$.cookie("username");
   var headerimg=$.cookie("header");
   if(!username){
        location.href="login.html";
   }else{
        allUser();
   }
   function allUser(){
      $.get("/allUser").done(function(data){
              var html="";
              var json={};
              if(data.code=="success"){
                  json={"userinfo":data.userArr};
                  html=template("otheruser",json);
                  $(".userlist").html(html);
              }else{
                  json={"userinfo":[]};
                  html=template("otheruser",json);
                  $(".userlist").html(html);
              }
        });
   }

   $("input[type=search]").on("keyup",function(){
        var value=$.trim($(this).val());
        var html="";
        var json={};
        if(value){
          $.get("/search",{"keyword":value}).done(function(data){
              if(data.code=="success"){
                  json={"name":data.key};
                  html=template("users",json);
                  $(".tishi").show();
                  $(".tishi ul").show().html(html);
              }else{
                   html=template("users",json);
                   $(".tishi ul").html(html).hide();
                   allUser();
              }
          });
        }else{
             html=template("users",json);
             $(".tishi ul").html(html).hide();
             allUser();
        }
   });
   $(".tishi ul").on("click","li",function(){
        var value=$(this).text();
        $("input[type=search]").val(value);
        $(this).parents(".tishi").hide(function(){
            showhtml($.trim($("input[type=search]").val()));
        });
   });

   $(".searchbtn").on("click",function(){
        var value=$.trim($("input[type=search]").val());
        showhtml(value);

   });
   function showhtml(value){
      var html="";
        if(value){
            $.get("/otherInfo",{username:value}).done(function(data){
                  if(data.code=="success"){
                      data.data.username=value;
                      var userarry=[];
                      userarry.push(data.data)
                      html=template("otheruser",{"userinfo":userarry});
                      $(".userlist").html(html);
                  }else{
                      var userarry=[];
                      html=template("otheruser",{"userinfo":userarry});
                      $(".userlist").html(html);
                  }
            });
        }
   }
   $(".userlist").on("click","li",function(){
        var lookuser=$.trim($(this).find(".lookuser").text());
        $.cookie("lookuser",lookuser);
        location.href="lookdes.html";
   });
});