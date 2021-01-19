function throwSessionOut(){
	///alert("Sorry session timeout");
	//var role = $("#currentUserRole").val();
  window.location.replace("/");
      // if(role == 65){
      //    window.location.replace("/spanel");
      //  } else if(role == 55){
      //     window.location.replace("/upanel");
      // } else if( role == 45){
      //     window.location.replace("/panel");
      // }
}

function commonAutoComplete(e, obj, url, hiddenId, selectId, dataId){
  //console.log(keyVar);
  var getVal = $(obj).val();
  var id = $('#' + selectId + ' option').filter(function() {
              return this.value == getVal.trim();
            }).data(dataId);

  $('#' + hiddenId).val(id);
  
  doAjaxCall(url,{phrase:getVal},"GET",false,'',function(data,type){
        var str = "";
        
				$.each(data, function(i, item) {
          console.log(item);					
                  str=`${str}<option data-id="${item.id}" value="${item.labelName} (${item.balance})"/>`;     
    });  
    $('#' + selectId).html(str);
});
}


function doAjaxCall(url,data,send_type,showLoading,loaderClass,callback) {
 if (showLoading) {
     $('.'+loaderClass).show();
 }
 $.ajax({
     url: url,
     type: send_type,
     data: data,
     cache: false,
     success: function (data) {
      //alert("success"+data);
         if (showLoading) {
           $('.'+loaderClass).hide();
         }
         callback(data,1);
     },
     error: function (data,errorThrown) {
      if(data.status == 401){
        if (showLoading) {
           $('.'+loaderClass).hide();
         }
          throwSessionOut();
      }
      if (showLoading) {
           $('.'+loaderClass).hide();
         }
      callback(data,2);
      //alert("error"+html);
      //alert("error"+errorThrown);
         //console.log(html);
     }
 });
}

function doAjaxFileupload(url,data,send_type,showLoading,loaderClass,callback) {
 if (showLoading) {
     $('.'+loaderClass).show();
 }
 $.ajax({
     url: url,
     type: send_type,
     data: data,
     cache: false,
     enctype: 'multipart/form-data',
     contentType: false,
     processData: false,
     headers:{"x-csrf-token":$("#_csrf").val()},
     success: function (data) {
      //alert("success"+data);
         if (showLoading) {
           $('.'+loaderClass).hide();
         }
         callback(data,1);
     },
     error: function (data,errorThrown) {
      if(data.status == 401){
        if (showLoading) {
           $('.'+loaderClass).hide();
         }
          throwSessionOut();
      }
      if (showLoading) {
           $('.'+loaderClass).hide();
         }
      callback(data,2);
      //alert("error"+html);
      //alert("error"+errorThrown);
         //console.log(html);
     }
 });
}



    var t;
    window.onload = resetTimer;
		document.onload = resetTimer;
		document.onmousemove = resetTimer;
		document.onmousedown = resetTimer; // touchscreen presses
		//document.ontouchstart = resetTimer;
		//document.onclick = resetTimer;     // touchpad clicks
		document.onscroll = resetTimer;    // scrolling with arrow keys
		document.onkeypress = resetTimer;

    // DOM Events
    // document.onmousemove = resetTimer;
    // document.onkeypress = resetTimer;

    function doForcelogout() {
    	 $.ajax({
                type: 'GET',
                url: '/deleteMe',
                data: {},
                datatype: 'json',
                success: function (data) {
                  console.log("success",data);
                  if(data.status == "success"){
                  	//alert("You are now logged out.");
                //   	 if(data.role == 65){
      				      //    window.location.replace("/spanel");
      				      //  } else if(data.role == 55){
      				      //     window.location.replace("/upanel");
      				      // } else if( data.role == 45){
      				      //     window.location.replace("/panel");
      				      // }
                     window.location.replace("/");
                  }

                },
                error: function (data) {
                  //alert("Something bad happened.");

                  if(data.status == 401){
                    throwSessionOut();
                  }
                  return false;
                }

             });

        //location.href = 'logout.php'
    }

    function resetTimer() {
        clearTimeout(t);
        var projectMode = $("#projectMode").val();
        if(projectMode == "live"){
            t = setTimeout(doForcelogout, 600000);
        }
        // 1000 milisec = 1 sec
        // 300000
    }

/*
window.onbeforeunload = function (e) {
    e = e || window.event;

    // For IE and Firefox prior to version 4
    if (e) {
        e.returnValue = 'Sure?';
        $.ajax({
                type: 'DELETE',
                url: '/deleteMe',
                data: {},
                datatype: 'json',
                success: function (data) {
                  console.log("success",data);

                },
                error: function (data) {
                  //alert("Something bad happened.");
                  if(data.status == 401){
                    throwSessionOut();
                  }
                  return false;
                }

             });
          }else{
            return false;
         }
       // alert("Suresss");
    }

   alert("Sure");
    // For Safari
    return 'Sure?';
};
*/
/*window.onbeforeunload = function(e) {
	//alert("kam khatam");
       return 'Dialog text here.';
    };*/

$(document).ready(function(e){
  if( $(".amountField").length > 0){
    $(".amountField").on("keypress keyup blur",function (event) {
            //this.value = this.value.replace(/[^0-9\.]/g,'');
          $(this).val($(this).val().replace(/[^0-9\.]/g,''));
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });
  }

  if($('.dateField').length > 0){
       $('.dateField').datepicker({ format : 'dd/mm/yyyy', autoclose: true,endDate:"today",maxDate:"today" }); 
  
      // $('.dateField').datepicker('update', new Date());
  }

 
})