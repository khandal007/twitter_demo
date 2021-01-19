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

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("opacitydiv").style.display= "none";
  
}

function closeNavMedia() {
  document.getElementById("mySidebar2").style.width = "0";
  document.getElementById("opacitydiv2").style.display= "none";
}

function reloadwindow(){
  location.reload();
}

function openNav(id) {
    console.log(name);
    var ajaxUrl = '/fetcheddata/media?doc_id='+id;
    var div = '';
    $.ajax({
      type: 'GET',
      url: ajaxUrl,
      data: '',
      datatype:'json',
      success: function (data) {
        $('#placehere').html(data);
      },
      error: function (data) {
        alert("something_bad_happened_please_try_again");
      },
  });
  document.getElementById("mySidebar2").style.width = "80%";
  document.getElementById("opacitydiv2").style.display= "block";
}

function openCostcenterModal(site_id,site_name,site_reference){
  var ajaxUrl = '/getSiteBalance';
  var sendObj ={
    site_id:site_id,
    site_name:site_name,
    site_reference:site_reference
  }
  var div = '';
    $.ajax({
      type: 'GET',
      url: ajaxUrl,
      data: sendObj,
      datatype:'html',
      success: function (data) {
        //console.log(data);
        $('#commonModalContent').html(data);
        $("#commonModal").modal('show');
      },
      error: function (data) {
        alert("something_bad_happened_please_try_again");
      },
  });
  
}

function commonAutoComplete(e, obj, typeid, url, hiddenId, selectId, dataId){
  var value = $('#' + typeid + " " + "option:selected" ).text();
  if(value=="Select"){
    $("." + hiddenId).prop("disabled", true);
  }
  var getVal = $(obj).val();
  var id = $('#' + selectId + ' option').filter(function() {
              return this.value == getVal.trim();
            }).data(dataId);
  $('#' + hiddenId).val(id);
  var accountType = $('#' + typeid).val();
  doAjaxCall(url,{phrase:getVal, accountType:accountType},"GET",false,'',function(data,type){
        var str = "";
        $.each(data, function(i, item) { 
        console.log(item);       
          str=`${str}<option data-id="${item.id}" value="${item.labelName} (${item.balance})"/>`;     
        });  
        $('#' + selectId).html(str);
  });
  $(".expenseInput").prop("disabled", false);
}

function removedisable(id){
  $(".credit_head_data_ajax").val(null).trigger("change");
  $('.' + id).val("");
  $('#' + id).val("");
  var value = $("#credittype option:selected" ).val();
  $('#getcrhead').val(value);
  $('#selecttype').val(value);
  if(value!=""){
    $("." + id).prop("disabled", false);
  }
}

function emptydatalist(id, inputid, rowscount){
  $('.'+id).val("");
  $('#'+inputid).val("");
  var value = $('#debittype_'+rowscount+ ' ' + 'option:selected').val();
  $("#account_head_data_ajax_"+rowscount).val(null).trigger("change");
}

function selectCrAccount(id, headVal){
  var value = $("#" + id + " " +  "option:selected" ).val();
  if(value==""){
    $("#" + headVal).prop("disabled", true);
  }
}

function removeidhead(self, headid){
  $("#" + headid).val("");
  var value = $("#" + self + " " +  "option:selected" ).val();
   if(value!=""){
    $("#" + headid).prop("disabled", false);
  }
}

function showTransactionData(tr_id,modalId){
    doAjaxCall('/showTransaction',{transaction_id:tr_id},"GET",true,'loaderOverlay',function(data,type){
        $("#"+modalId).html(data);
        document.getElementById("mySidenav").style.width = "80%";
        document.getElementById("opacitydiv").style.display= "block";
    }) 
}

function showTrData(site_id, flag, modalId){
    doAjaxCall('/showTrSite',{site_id:site_id, flag: flag},"GET",true,'loaderOverlay',function(data,type){
        $("#"+modalId).html(data);
        document.getElementById("mySidenav").style.width = "80%";
        document.getElementById("opacitydiv").style.display= "block";
    }) 
}

function createnewstock(id,modalId){
    //alert('here');
    //console.log(id);
    doAjaxCall('/createstock',{id:id},"GET",true,'loaderOverlay',function(data,type){
        $("#"+modalId).html(data);
        document.getElementById("mySidenav").style.width = "40%";
        document.getElementById("opacitydiv").style.display= "block";
    }) 
}
function addDocument(rowCount){
  var url_string = window.location.href;
  var url = new URL(url_string);
  var mode = url.searchParams.get("mode");
  $.ajax({
      type: 'GET',
      url: '/uploadUnregDoc',
      data: { mode: mode, rowCount: rowCount},
      datatype:'json',
      success: function (data) {
        
         $("#sidenavcontent").html(data);
         document.getElementById("mySidenav").style.width = "80%";
          document.getElementById("opacitydiv").style.display= "block";
         $('input[type="radio"].flat-red').iCheck({
            radioClass   : 'iradio_flat-green'
          })//$('#goodModal').modal('show');
         //$(".datepicker").datepicker();
      },
      error: function (data) {
        alert("something_bad_happened_please_try_again");
      },
  });
}
function addGoodsMaster(id){
  var sendId;
  if(id==-1){
    sendId = null;
  }
  else{
   sendId = id;
  }
  $.ajax({
      type: 'GET',
      url: '/goodDetails',
      data: { good_id: sendId},
      datatype:'json',
      success: function (data) {
         $("#sidenavcontent").html(data);
         document.getElementById("mySidenav").style.width = "80%";
          document.getElementById("opacitydiv").style.display= "block";
         $('input[type="radio"].flat-red').iCheck({
            radioClass   : 'iradio_flat-green'
          })//$('#goodModal').modal('show');
      },
      error: function (data) {
        alert("something_bad_happened_please_try_again");
      },
  });
}

function addExpenseMaster(id){
  var sendId;
  if(id==-1){
    sendId = null;
  }
  else{
   sendId = id;
  }
  $.ajax({
      type: 'GET',
      url: '/common/createExpense',
      data: { account_id: sendId},
      datatype:'html',
      success: function (data) {
         $("#sidenavcontent").html(data);
         document.getElementById("mySidenav").style.width = "80%";
         document.getElementById("opacitydiv").style.display= "block";
        
      },
      error: function (data) {
        alert("something_bad_happened_please_try_again");
      },
  });
}

function doAjaxHTMLCall(url,data,send_type,showLoading,loaderClass,callback) {
 if (showLoading) {
     $('.'+loaderClass).show();
 }
 $.ajax({
     url: url,
     type: send_type,
     data: data,
     cache: false,
     datatype:"HTML",
     success: function (data) {
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
     }
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
                type: 'PUT',
                url: '/admin-secure/logout',
                data: {},
                datatype: 'json',
                success: function (data) {
                  console.log("success",data);
                  if(data.status){
                  	//alert("You are now logged out.");
                //   	 if(data.role == 65){
      				      //    window.location.replace("/spanel");
      				      //  } else if(data.role == 55){
      				      //     window.location.replace("/upanel");
      				      // } else if( data.role == 45){
      				      //     window.location.replace("/panel");
      				      // }
                     window.location.replace('/loginpanel');
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
            t = setTimeout(doForcelogout, 1200000);
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
 var iWords = ['zero', ' one', ' two', ' three', ' four', ' five', ' six', ' seven', ' eight', ' nine'];
var ePlace = ['ten', ' eleven', ' twelve', ' thirteen', ' fourteen', ' fifteen', ' sixteen', ' seventeen', ' eighteen', ' nineteen'];
var tensPlace = ['', ' ten', ' twenty', ' thirty', ' forty', ' fifty', ' sixty', ' seventy', ' eighty', ' ninety'];
var inWords = [];

var numReversed, inWords, actnumber, i, j;

function tensComplication() {
  if (actnumber[i] == 0) {
    inWords[j] = '';
  } else if (actnumber[i] == 1) {
    inWords[j] = ePlace[actnumber[i - 1]];
  } else {
    inWords[j] = tensPlace[actnumber[i]];
  }
}   
function convertToWords(numericValue) {
  inWords = []
  if(numericValue == "00" || numericValue =="0"){
    return 'zero';
  }
  var obStr = numericValue.toString();
  numReversed = obStr.split('');
  actnumber = numReversed.reverse();

  
  if (Number(numericValue) == 0) {
    var inWords2 = document.getElementById(contid).innerHTML = 'BDT Zero';
    document.getElementById(second).setAttribute('title', inWords2);
    return false;
  }
  
  var iWordsLength = numReversed.length;
  var finalWord = '';
  j = 0;
  for (i = 0; i < iWordsLength; i++) {
    switch (i) {
      case 0:
        if (actnumber[i] == '0' || actnumber[i + 1] == '1') {
          inWords[j] = '';
        } else {
          inWords[j] = iWords[actnumber[i]];
        }
        inWords[j] = inWords[j] + '';
        break;
      case 1:
        tensComplication();
        break;
      case 2:
        if (actnumber[i] == '0') {
          inWords[j] = '';
        } else if (actnumber[i - 1] !== '0' && actnumber[i - 2] !== '0') {
          inWords[j] = iWords[actnumber[i]] + ' hundred';
        } else {
          inWords[j] = iWords[actnumber[i]] + ' hundred';
        }
        break;
      case 3:
        if (actnumber[i] == '0' || actnumber[i + 1] == '1') {
          inWords[j] = '';
        } else {
          inWords[j] = iWords[actnumber[i]];
        }
        if (actnumber[i + 1] !== '0' || actnumber[i] > '0') {
          inWords[j] = inWords[j] + ' thousand';
        }
        break;
      case 4:
        tensComplication();
        break;
      case 5:
        if (actnumber[i] == '0' || actnumber[i + 1] == '1') {
          inWords[j] = '';
        } else {
          inWords[j] = iWords[actnumber[i]];
        }
        if (actnumber[i + 1] !== '0' || actnumber[i] > '0') {
          inWords[j] = inWords[j] + ' lakh';
        }
        break;
      case 6:
        tensComplication();
        break;
      case 7:
        if (actnumber[i] == '0' || actnumber[i + 1] == '1') {
          inWords[j] = '';
        } else {
          inWords[j] = iWords[actnumber[i]];
        }
        inWords[j] = inWords[j] + ' crore';
        break;
      case 8:
        tensComplication();
        break;
      default:
        break;
    }
    j++;
  }


  inWords.reverse();
  for (i = 0; i < inWords.length; i++) {
    finalWord += inWords[i];
  }
  
  return finalWord;
}

// function storeURL(){
//  // alert(document.referrer);
//   $.cookie("backurl", document.referrer,{
//        expires : 10,           // Expires in 10 days

//        path    : '/',          // The value of the path attribute of the cookie
//                                // (Default: path of page that created the cookie).

//       // domain  : 'jquery.com', // The value of the domain attribute of the cookie
//                                // (Default: domain of page that created the cookie).

//        secure  : false          // If set to true the secure attribute of the cookie
//                                // will be set and the cookie transmission will
//                                // require a secure protocol (defaults to false).
//       });
// }
function jumpBack(e){
  e.preventDefault();
 window.location.replace(document.referrer);
}
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

       $('.dateField').datepicker({ format : 'dd/mm/yyyy', autoclose: true }); 
        var getDate = $(".dateField").attr('data-date');
         if(getDate != ""){
            var setDate = new Date(getDate);
          }else{
            var setDate = new Date();
          }
     $('.dateField').datepicker('update', setDate);
  
      // $('.dateField').datepicker('update', new Date());
  }
 // storeURL();

 


 function doAjaxinvoicevalidation(url,mode,modetype,showLoading,loaderClass,callback) {
 if (showLoading) {
     $('.'+loaderClass).show();
 }
 
 // var data = {
 //    mode:mode,
 //    modetype:modetype,
 //    datecheck:datecheck
 // }
 $.ajax({
     url: url,
     type: 'GET',
     data: data,
     cache: false,
     success: function (data) {
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
     }
 });
}
 
})
function convertNumberToWords(amount) {
    var words = new Array();
    words[0] = ''; words[1] = 'One'; words[2] = 'Two'; words[3] = 'Three'; words[4] = 'Four'; words[5] = 'Five'; words[6] = 'Six'; words[7] = 'Seven'; words[8] = 'Eight'; words[9] = 'Nine'; words[10] = 'Ten'; words[11] = 'Eleven'; words[12] = 'Twelve'; words[13] = 'Thirteen'; words[14] = 'Fourteen'; words[15] = 'Fifteen'; words[16] = 'Sixteen'; words[17] = 'Seventeen'; words[18] = 'Eighteen'; words[19] = 'Nineteen'; words[20] = 'Twenty'; words[30] = 'Thirty'; words[40] = 'Forty'; words[50] = 'Fifty'; words[60] = 'Sixty'; words[70] = 'Seventy'; words[80] = 'Eighty'; words[90] = 'Ninety';
    amount = amount.toString();
    var atemp = amount.split(".");
    var number = atemp[0].split(",").join("");
    var n_length = number.length;
    var words_string = "";
    if (n_length <= 9) {
        var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
        var received_n_array = new Array();
        for (var i = 0; i < n_length; i++) {
            received_n_array[i] = number.substr(i, 1);
        }
        for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
            n_array[i] = received_n_array[j];
        }
        for (var i = 0, j = 1; i < 9; i++, j++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                if (n_array[i] == 1) {
                    n_array[j] = 10 + parseInt(n_array[j]);
                    n_array[i] = 0;
                }
            }
        }
        value = "";
        for (var i = 0; i < 9; i++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                value = n_array[i] * 10;
            } else {
                value = n_array[i];
            }
            if (value != 0) {
                words_string += words[value] + " ";
            }
            if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Crores ";
            }
            if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Lakhs ";
            }
            if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Thousand ";
            }
            if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                words_string += "Hundred and ";
            } else if (i == 6 && value != 0) {
                words_string += "Hundred ";
            }
        }
        words_string = words_string.split("  ").join(" ");
    }
    return words_string;
}
function withDecimal(n) {
    var nums = n.toString().split('.')
    var whole = convertNumberToWords(nums[0])
    if (nums.length == 2) {
        var fraction = convertNumberToWords(nums[1])
        return whole + 'Rupees and ' + fraction + 'paise only!';
    } else {
        return whole + 'Rupees only!';
    }
}
function addRevGoods(id){
  var sendId;
  if(id==-1){
    sendId = null;
  }
  else{
   sendId = id;
  }
  var url_string = window.location.href;
  var url = new URL(url_string);
  $.ajax({
      type: 'GET',
      url: '/addRevenueItems',
      data: {},
      datatype:'json',
      success: function (data) {
         $("#sidenavcontent").html(data);
         document.getElementById("mySidenav").style.width = "80%";
          document.getElementById("opacitydiv").style.display= "block";
         $('input[type="radio"].flat-red').iCheck({
            radioClass   : 'iradio_flat-green'
          })//$('#goodModal').modal('show');
      },
      error: function (data) {
        alert("something_bad_happened_please_try_again");
      },
  });
}