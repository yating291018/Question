$(function(){
     var username=$.cookie("username");
     var headerimg=$.cookie("header");
     if(username !="undefined" && username){
        $(".login").hide().next().show().find("a span").text(username);
        if(localStorage){
            var storagevalue=localStorage.getItem("areavalue");
            if(storagevalue!="undefined" && storagevalue){
              $(".formg textarea").val(storagevalue);
            }
        }
     }else{
        $(".am-dropdown").hide().prev().show();
        location.href="login.html";
     }
      $(".login").on("click",function(){
        location.href="login.html";
     });
     if(headerimg && headerimg!="undefined"){
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
     $(".qqicon img").on("click",function(){
      $(this).next().toggle();
     });
      num();
   $(".qqicon ul").find("li").on("mousedown",function(e){
        e.stopPropagation();
        var imgtitle=$(this).find("img").attr("title");
        var $this=$(this).parent();
        insertText($("textarea[name=answer]")[0],imgtitle);
        localStorage.setItem("areavalue",$("textarea[name=content]").val());
        $("textarea[name=content]").on("focus",function(){
            $this.hide();
        });
   });
   $(".askbtn").on("click",function(e){
        e.preventDefault();
        var textarea=$.trim($("textarea").val());
        if(!textarea){
            return;
        }
        var index=$.cookie("index");
        $.post("/answer",{"answer":textarea,"index":index}).done(function(data){
            if(data){
                if(data.code=="success"){
                       $(".fadeOut").click();
                       $(".aclose").show();
                       $(".am-modal-bd.title").html(data.message+",要继续吗？");
                       $(".aclose").on("click",function(){
                          location.href="index.html";
                       });
                       $(".aok").on("click",function(){
                          $("textarea[name=answer]").val("");
                       });
                       localStorage.clear();
                }else{
                      $(".fadeOut").click();
                      $(".aclose").hide();
                      $(".fadeOut .am-modal-bd").html(data.message);
                }
            }
        });
   });
   $(document).on("mousedown",function(){
        $(".qqicon ul").hide();
   });
 });
 //光标处插入文本
function insertText(obj,str) {
  if (document.selection) {
    var sel = document.selection.createRange();
    sel.text = str;
  }else if(typeof obj.selectionStart==='number' && typeof obj.selectionEnd==='number') {
    var startPos = obj.selectionStart,
      endPos = obj.selectionEnd,
      cursorPos = startPos,
      tmpStr = obj.value;
    obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
    cursorPos += str.length;
    obj.selectionStart = obj.selectionEnd = cursorPos;
  } else {
    obj.value += str;
  }
};

function num(){
    var num=140;
    $(".formg textarea").on("input",function(){
          var textvalue=$(this).val();
          var textlength=$.trim(textvalue).length;
          var yu=num-textlength;
          if(textvalue){
              localStorage.setItem("areavalue",textvalue);
          }
          if(yu>=0){
              $(".num").text(yu);
          }else{
             $(this).val($.trim($(this).val()).substring(0,10));
          }
    });
}