$(function(){
   var username=$.cookie("username");
   var lookuser=$.cookie("lookuser");
   if(!username){
        location.href="login.html";
   }else{
    if(lookuser){
     $.get("/otherQuestion",{username:lookuser}).done(function(data){
        if(data){
            var html="";
            var questions=data.data;
            for(var i=0;i<questions.length;i++){
                html+="<div class='saitem'>"+
                      "<article class='am-comment'>"+
                      "<a href='#link-to-user-home'>"+
                      "<img src='uploads/"+questions[i].header+"' alt='' class='am-comment-avatar' width='48' height='48' onerror='this.src=\"image/commit.png\"'/>"+
                      "</a>"+
                      "<div class='am-comment-main'>"+
                      "<header class='am-comment-hd'>"+
                      "<div class='am-comment-meta'>"+
          "<a href='#link-to-user' class='am-comment-author'>"+questions[i].username+
                      "</a>发表于 <time>"+time(questions[i].time)+"</time>"+
                      "</div>";
                      if(questions[i].username==username){
                       html+="<a href='###' class='com_close'><i class='am-icon-close'></i></a>";
                      }
               html+="</header><div class='am-comment-bd'>"+zhuan(questions[i].content)+"</div>"+
                      "<div class='footer'><a href='###' class='aicon'>"+
                      "<i class='am-icon-thumbs-up iconpfirst'></i>"+
                      "</a>"+
                      "<a href='###' class='downicon'><i class='am-icon-thumbs-down'></i></a>"+
                      "<a href='###' class='reply'><i class='am-icon-reply'></i></a>"+
                      "</div>"+
                      "</div>"+
                      "</article>";
                if(questions[i].answer){
                    html+="<ul class='am-comments-list am-comments-list-flip'>";
                    for(var j=0;j<questions[i].answer.length;j++){
                      html+="<li class='am-comment'>"+
                      "<a href='#link-to-user-home'>"+
                      "<img src='uploads/"+questions[i].answer[j].header+"' alt='' class='am-comment-avatar' width='48' height='48' onerror='this.src=\"image/commit.png\"'/>"+
                      "</a>"+
                      "<div class='am-comment-main'>"+
                      "<header class='am-comment-hd'>"+
                      "<div class='am-comment-meta'>"+
                      "<a href='#link-to-user' class='am-comment-author'>"+questions[i].answer[j].username+"</a>"+
                      "评论于 <time>"+time(questions[i].answer[j].time)+"</time>"+
                      "</div>";
                      if(questions[i].answer[j].username==username){
                       html+="<a href='###' class='com_close'><i class='am-icon-close'></i></a>";
                       }
                      html+="</header>"+
                   "<div class='am-comment-bd'>"+zhuan(questions[i].answer[j].content)+"</div>"+
                      "</div>"+
                     "</li>";
                   }
               html+="</ul>";
              }
              html+="</div>";
            }
            $(".items").html(html);
            tishi();
            if($(".saitem").length<5){
                  $(".lookmore").fadeOut();
            }else{
                  $(".lookmore").fadeIn();
            }
        }else{
            console.log("没有东西");
        }
      });
    }
  }

  $(".items").on("click",".aicon",function(){
       var icondom=$("<i class='am-icon-thumbs-up iconup'></i>");
       $(this).append(icondom);
       icondom.css("color",randColor()).animate({top:-100,"fontSize":26},500,function(){
          icondom.animate({top:-3,"fontSize":14},500,function(){
              icondom.fadeOut(200,function(){
                  icondom.remove();
              });
          });
       });
   });
   $(".items").on("click",".downicon",function(){
       var icondom=$("<i class='am-icon-thumbs-down d_icon'></i>");
       $(this).append(icondom);
       icondom.css("color",randColor()).animate({top:140,"fontSize":26},500,function(){
          icondom.animate({top:-3,"fontSize":14},500,function(){
              icondom.fadeOut(200,function(){
                  icondom.remove();
              });
          });
       });
   });

});
function randColor(){
            var r=Math.floor(Math.random()*256);
            var g=Math.floor(Math.random()*256);
            var b=Math.floor(Math.random()*256);
            return "rgb("+r+","+g+","+b+")";
}

function zhuan(content){
 var arry=[{"title":"[尴尬]","src":"<img src='image/imgs/1.gif' height='24' width='24'>"},{"title":"[生气]","src":"<img src='image/imgs/2.gif' height='24' width='24'>"},{"title":"[色]","src":"<img src='image/imgs/3.gif' height='24' width='24'>"},{"title":"[脸红]","src":"<img src='image/imgs/4.gif' height='24' width='24'>"},{"title":"[酷]","src":"<img src='image/imgs/5.gif' height='24' width='24'>"},{"title":"[害羞]","src":"<img src='image/imgs/6.gif' height='24' width='24'>"},{"title":"[闭嘴]","src":"<img src='image/imgs/7.gif' height='24' width='24'>"},{"title":"[睡觉]","src":"<img src='image/imgs/8.gif' height='24' width='24'>"},{"title":"[大哭]","src":"<img src='image/imgs/9.gif' height='24' width='24'>"},{"title":"[汗]","src":"<img src='image/imgs/10.gif' height='24' width='24'>"},{"title":"[怒气]","src":"<img src='image/imgs/11.gif' height='24' width='24'>"},{"title":"[调皮]","src":"<img src='image/imgs/12.gif' height='24' width='24'>"},{"title":"[坏笑]","src":"<img src='image/imgs/13.gif' height='24' width='24'>"},{"title":"[微笑]","src":"<img src='image/imgs/14.gif' height='24' width='24'>"},{"title":"[气愤]","src":"<img src='image/imgs/15.gif' height='24' width='24'>"},{"title":"[装逼]","src":"<img src='image/imgs/16.gif' height='24' width='24'>"},{"title":"[无奈]","src":"<img src='image/imgs/17.gif' height='24' width='24'>"},{"title":"[吐]","src":"<img src='image/imgs/18.gif' height='24' width='24'>"},{"title":"[淫笑]","src":"<img src='image/imgs/19.gif' height='24' width='24'>"},{"title":"[红]","src":"<img src='image/imgs/20.gif' height='24' width='24'>"},{"title":"[不介意]","src":"<img src='image/imgs/21.gif' height='24' width='24'>"},{"title":"[撇嘴]","src":"<img src='image/imgs/22.gif' height='24' width='24'>"},{"title":"[添嘴]","src":"<img src='image/imgs/23.gif' height='24' width='24'>"},{"title":"[无辜]","src":"<img src='image/imgs/24.gif' height='24' width='24'>"},{"title":"[囧]","src":"<img src='image/imgs/25.gif' height='24' width='24'>"},{"title":"[汗颜]","src":"<img src='image/imgs/26.gif' height='24' width='24'>"},{"title":"[狂笑]","src":"<img src='image/imgs/27.gif' height='24' width='24'>"},{"title":"[大兵]","src":"<img src='image/imgs/28.gif' height='24' width='24'>"},{"title":"[奋斗]","src":"<img src='image/imgs/29.gif' height='24' width='24'>"},{"title":"[疑问]","src":"<img src='image/imgs/30.gif' height='24' width='24'>"}];

   arry.forEach(function(item,index,arry){
                content=content.replace(item.title,item.src);
   });
   return content;
 }


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
function  tishi(){
        var content=$(".items .saitem").length;
        if(content<1){
            $(".nocontent").fadeIn(2000,function(){
                $(".nocontent").fadeOut(1000);
            });
        }
}