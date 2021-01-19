
$("document").ready(function(e){

  if($("#transaction_id").val()){
    generateSelect2(1);
    costCenterAutofill("costcenter_head_1", "costcenter_head_site_1");
    $("#receiptIdServiceMonth-1").datepicker({
            autoclose: true,
            minViewMode: 1,
            format: 'M-yyyy'
        });
    //$(".dateField").each(function(item, i){  
    if($('.dates').length > 0){
           $('.dates').datepicker({ format : 'dd/mm/yyyy', autoclose: true,endDate:"today",maxDate:"today" });
            var getDate = $("#trDate").attr("data-value");
         if(getDate != ""){
            var setDate = new Date(getDate);
          }else{
            var setDate = new Date();
          }
     $('.dates').datepicker('update', setDate);
      }
      if($('.date1').length > 0){
           $('.date1').datepicker({ format : 'dd/mm/yyyy', autoclose: true,endDate:"today",maxDate:"today" });
            var getDate = $("#datetimepicker3").attr("data-values");
         if(getDate != ""){
            var setDate = new Date(getDate);
          }else{
            var setDate = new Date();
          }
     $('.date1').datepicker('update', setDate);
      }
    //})
      if($('.dateMonth').length > 0){
           $('.dateMonth').datepicker({ format : 'M-yyyy', autoclose: true,endDate:"today",maxDate:"today" });
            var getDate = $("#receiptIdServiceMonth-1").attr("data-month");
         if(getDate != ""){
            var setDate = new Date(getDate);
          }else{
            var setDate = new Date();
          }
     $('.dateMonth').datepicker('update', setDate); 
      }
       $('#debit_head_1').val($('#debitHead_id').val());
       $('#costcenter_head_site_1').val($('#costcenter_id').val());
       $('#credit_head_id').val($('#creditHead_id').val());
  }
  var editFirstTimeCreditHead = false;
  var editFirstTimeCostcenter = false;

  $('#bankModal').on('show.bs.modal', function () {
    $('#choosebankform').submit(function(e){
        e.preventDefault();
        var value = $( "#banklist option:selected" ).text();
        var id =  $( "#banklist option:selected" ).val();
        $('#banklisthidden').val(id);
        $('#banklistvalhidden').val(value);
        var rowid = $('#rowid').val();
        $('#bankname_'+ rowid).val(value);
        $('#selectedbankId_' + rowid).val(id);
        $("#bankModal").modal('hide');
    });
    $('#addbank').submit(function(e){
      e.preventDefault();
      var rowid = $('#rowid2').val();
      //alert(rowid);
      var value = $( "#bankIFSCinput" ).val();
      var ifscid = $('#bankDetialsId').val();
      $('#bankname_' + rowid).val(value);
      $('#selectedbankId_' + rowid).val();
      let bankhead_id = $("#debit_head_" + rowid).val();
      let urlBank = '/form/addHeadBankDetails';
      urlBank = urlBank+"?head_id="+bankhead_id;
      $.ajax({
          type: 'POST',
          url: urlBank,
          data: $("#addbank").serialize(),
          datatype: 'json',
          success: function (data) {
            console.log("data",data);
              if(data.status == "success"){
                  setTimeout(function(){
                      $("#bankSuccMsg").text(data.message);
                      $("#banksucessmsg").show();
                       $('#selectedbankId_' + rowid).val(data.newBank.id);
                      $("#bankModal").modal('hide');
                  }, 2000);
              } else if(data.status == "error"){
                  $("#bankErrMsg").text(data.message);
                  $("#bankerrormsg").show();
                  setTimeout(function(){
                    $("#bankerrormsg").hide("slow");
                  }, 2000);
              } else {
                  $("#bankErrMsg").text("something_bad_happened_please_try_again");
                  $("#bankerrormsg").show();
                  setTimeout(function(){
                      $("#bankerrormsg").hide("slow");
                  }, 2000);
            }
          },
          error: function (data) {
              $("#bankErrMsg").text("something_bad_happened_please_try_again");
              $("#bankerrormsg").show();   
              if(data.status == 401){
                  throwSessionOut();
                }                     
              setTimeout(function(){
                  $("#bankerrormsg").hide("slow");
              }, 2000);
          }
      }); 
    });
  });

  $("#receiptform").submit(function(){ 
    var crAmount = parseFloat($('#cramountid').val());
    var sum = 0;
    var totalArr = [];
    var mode_type = $("#txntype").val();
    var userRole = $("#currentUserRole").val();
    event.preventDefault();
      var valid = $('#receiptform')[0].checkValidity();

                if(!valid){
                  $("#trLoader").hide();
                    alert("Please fill the form correctly");
                    return false;
                }
    for (var a = document.querySelectorAll('table.transaction_table tbody tr'), i = 0; a[i]; ++i) {
      cells = a[i].querySelectorAll('.amount_value');
      sum = parseFloat(sum) + parseFloat(cells[0].value);
      if(isNaN(sum)){
        alert('Please fill sum debit amount equal to debit amount');
      }
      else{
      }
    }
    if((sum<crAmount) || (sum>crAmount)){
      alert('debit sum must be equal to credit amount');
      return false;
    }
    else{
      $('.add').css('display', 'none');
    }
    var url = "/form/transaction";
    var data = $('#receiptform').serialize();
    doAjaxCall(url,data,"POST",true,'loaderOverlay',function(data,type){       
        if(data.status=='success'){
          alert(data.message);
          if(userRole == 65){
            window.location.replace(`/super/control-panel?mode=${mode_type}`);
          }else if(userRole == 45){
            window.location.replace(`/control-panel?mode=${mode_type}`);
          }else if(userRole == 55){
            window.location.replace(`/company/control-panel?mode=${mode_type}`);
          }
        }
    });
  });

  ////function for credit head name
  $(".credit_head_data_ajax").select2({
    ajax: {
      url: "/form/creaditheadList",
      dataType: 'json',
      delay: 250,
      data: function (params) {
        return {
          phrase: params.term, // search term
          page: params.page,
          accountType: $('#credittype').val(),
          //account_type: $('#getcrhead2').val(),
        };
      },
      processResults: function (data, params) {
        params.page = params.page || 1;
        return {
          results: data.items,
          pagination: {
            more: (params.page * 30) < data.total_count
          }
        };
      },
      cache: true
    },
    placeholder: 'Search for credit head',
    escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
    minimumInputLength: 1,
    templateResult: formatRepo,
    templateSelection: formatRepoSelection
  });

  function formatRepo (repo) {
    if (repo.loading){ return repo.text; } 
    var markup = "<div class='select2-result-repository clearfix'>" + repo.label + "</div>";
    return markup;
  }

  function formatRepoSelection (repo) {
    if(repo.id){ $("#credit_head_id").val(repo.id); }

    if(!editFirstTimeCreditHead){
      editFirstTimeCreditHead= true;
      name = repo.label;
      return repo.label;
    }
    return repo.label;
  }

  // /function for costcenter
  $(".costcenter_data_ajax").select2({
    ajax: {
      url: "/form/fetchCostcenter",
      dataType: 'json',
      delay: 250,
      data: function (params) {
        return {
          phrase: params.term, // search term
          page: params.page,
        };
      },
      processResults: function (data, params) {
        params.page = params.page || 1;
        return {
          results: data.items,
          pagination: {
          more: (params.page * 30) < data.total_count
          }
        };
      },
      cache: true
    },
    placeholder: 'Search for costcenter',
    escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
    minimumInputLength: 1,
    templateResult: formatRepo2,
    templateSelection: formatRepoSelection2
  });

  function formatRepo2 (repo) {
    if(repo.site_reference==null){
      repo.site_reference = 'N/A';
    }
    if (repo.loading) {
      return repo.text;
    }
    var markup = "<div class='select2-result-repository clearfix'>" + repo.site_name + '(' + repo.site_reference + ')' + "</div>";
    return markup;
  }

  function formatRepoSelection2 (repo) {
    //console.log(repo);
    $("#costcenter_head").val(repo.id);
    if(!editFirstTimeCostcenter){
      editFirstTimeCostcenter= true;
      return repo.site_name + '(' + repo.site_reference + ')';
    } 

    if(repo.site_reference){
      return repo.site_name + '(' + repo.site_reference + ')';
    } else {
      return repo.site_name;
    }
  }

});

function IfscAutoComplete(e, obj, url, hiddenId, selectId, dataId){
    var url = "/form/getBankDetails";
    var getVal =  $(obj).val();
    var id = $('#' + selectId + ' option').filter(function() {
              return this.value == getVal.trim();
            }).data(dataId);
    $('#' + hiddenId).val(id);
    doAjaxCall(url,{phrase:getVal},"GET",false,'',function(data,type){
    var str = "";
    $.each(data, function(i, item) {        
      str=`${str}<option data-id="${item.id}" value="${item.name} (${item.branch} ${item.ifsc})"/>`     
    }); 
    $('#' + selectId).html(str);
  });
}

function chooseacntbank(id, rowid){
   $('#headidname').val(id);
   $('#rowid').val(rowid);
   $('#rowid2').val(rowid);
   var url = '/form/getAllHeadBanks';
   var head_id = $('#'+id).val();
   var data = {head_id:head_id};
   doAjaxCall(url,data,"GET",false,'',function(data,type){
        console.log(data);
        var str = "";
        $.each(data.allHeadBanks, function(i, item) {
          str=`${str}<option value="${item.id}">${item.name} (${item.bank_account_number})</option>`;     
        });  
        $('#banklist').html(str);
    }) 
}

function addrows(){
  document.querySelector('table.transaction_table tbody').appendChild(generateTableRow());
  if( $(".amountField").length > 0){
    $(".amountField").on("keypress keyup blur",function (event) {
          $(this).val($(this).val().replace(/[^0-9\.]/g,''));
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });
  }
  if($('.dateField').length > 0){
       $('.dateField').datepicker({ format : 'dd/mm/yyyy', autoclose: true,endDate:"today",maxDate:"today" }); 
  }
}

function checkForenter(e){
  if(e.keyCode == '13'){
    e.preventDefault();
    generateTableRow(); 
    }
}

async function generateTableRow() {
  var mode = $('#txntype').val();
  var url = "/form/debitrowview";
  var totalCount = $("#totalRows").val();
  var rowsCount = parseInt(totalCount)+1;
  var data = {mode:mode, rowsCount:rowsCount};
  await doAjaxCall(url,data,"GET",true,'loaderOverlay',function(data,type){
    var crAmount = $('#cramountid').val();
    /*if(crAmount==''){
      alert('Please enter some amount');
      $(".add").prop("disabled", true);
    }*/
      var emptyColumn = document.createElement('tr');
      emptyColumn.innerHTML = data;

      $("#totalRows").val(rowsCount);
      document.querySelector('table.transaction_table tbody').appendChild(emptyColumn);
       $("#receiptIdServiceMonth-"+rowsCount).datepicker({
            autoclose: true,
            minViewMode: 1,
            format: 'M-yyyy'
        });
       costCenterAutofill("costcenter_head_"+rowsCount, "costcenter_head_site_"+rowsCount);

    $("#account_head_data_ajax_"+rowsCount).select2({
      ajax: {
        url: "/form/creaditheadList",
        dataType: 'json',
        delay: 250,
        data: function (params) {
          return {
            phrase: params.term, // search term
            page: params.page,
            accountType: $('#debittype_'+rowsCount).val(),
          };
        },
        processResults: function (data, params) {
          params.page = params.page || 1;
          return {
            results: data.items,
            pagination: {
              more: (params.page * 30) < data.total_count
            }
          };
        },
        cache: true
      },
      placeholder: 'Search for credit head',
      escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
      minimumInputLength: 1,
      templateResult: formatRepo3,
      templateSelection: formatRepoSelection3
    });

    function formatRepo3 (repo) {
     // console.log(repo, 'repo');
      if (repo.loading) {
        return repo.text;
      }
      var markup = "<div class='select2-result-repository clearfix'>" + repo.label + "</div>";
      return markup;
    }

    function formatRepoSelection3 (repo) {
      $("#debit_head_"+rowsCount).val(repo.id);
        name = repo.label;
        return `<span title="${repo.label}">${repo.label}</span>`;
    }
      if( $(".amountField").length > 0){
        $(".amountField").on("keypress keyup blur",function (event) {
              $(this).val($(this).val().replace(/[^0-9\.]/g,''));
                if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                    event.preventDefault();
                }
            });
      }

      if($('.dateField').length > 0){
           $('.dateField').datepicker({ format : 'dd/mm/yyyy', autoclose: true,endDate:"today",maxDate:"today" }); 
      }
  });
}

function costCenterAutofill(siteId, siteHiddenId){
  $("#"+siteId).select2({
    ajax: {
      url: "/form/fetchCostcenter",
      dataType: 'json',
      delay: 250,
      data: function (params) {
        return {
          phrase: params.term, // search term
          page: params.page,
          accountType: $('#credittype').val(),
          //account_type: $('#getcrhead2').val(),
        };
      },
      processResults: function (data, params) {
        params.page = params.page || 1;
        return {
          results: data.items,
          pagination: {
            more: (params.page * 30) < data.total_count
          }
        };
      },
      cache: true
    },
    placeholder: 'Search for credit head',
    escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
    minimumInputLength: 1,
    templateResult: function(repo){
       if(repo.site_reference==null){
          repo.site_reference = 'N/A';
        }
        if (repo.loading) {
          return repo.text;
        }
        var markup = "<div class='select2-result-repository clearfix'>" + repo.site_name + '(' + repo.site_reference + ')' + "</div>";
        return markup;
    },
    templateSelection: function(repo){
      $("#"+siteHiddenId).val(repo.id);
        return `<span title="${repo.site_name}(${repo.site_reference})">${repo.site_name}</span>`;
      }
  });
}

        function ischecked(obj, id){
          if($(obj).is(':checked') == true ){
            $("#"+id).val(1);
          }else{
            $("#"+id).val(0);
          }
        }

function removeRow(e, obj){
  var crAmount = $('#cramountid').val();
  var sum=0;
  $(obj).parents('tr').remove();
  for (var a = document.querySelectorAll('table.transaction_table tbody tr'), i = 0; a[i]; ++i) {
    cells = a[i].querySelectorAll('.amount_value');

    if(!isNaN(cells[0].value)){
        sum = parseFloat(sum) + parseFloat(cells[0].value);
    }
  }
  if((sum<crAmount)){
    $('.add').css('display', 'inline-block');
  }
  var total = $('#totalRows').val();
  total = total - 1;
  $("#totalRows").val(total);
}

function expenseAutoComplete(e, obj, url, hiddenId, selectId, dataId, rowsCount){
  console.log($('#aioConceptName').find(":selected").text());
  var getVal = $(obj).val();
  var id = $('#' + selectId + ' option').filter(function() {
              return this.value == getVal.trim();
            }).data(dataId);
  $('#' + hiddenId).val(id);
  var idOfInput = $('#debit_head_' + rowsCount).val();
  doAjaxCall(url,{phrase:getVal},"GET",false,'',function(data,type){
        var str = "";   
        $.each(data, function(i, item) {          
                  str=`${str}<option data-id="${item.id}" value="${item.expense_name}"/>`;     
    });  
    $('#' + selectId).html(str);
});
}

function costcenterAutoComplete(e, obj, url, hiddenId, selectId, dataId, rowsCount){
  var getVal = $(obj).val();
  var id = $('#' + selectId + ' option').filter(function() {
              return this.value == getVal.trim();
            }).data(dataId);
  $('#' + hiddenId).val(id);
  var idOfInput = $('#debit_head_' + rowsCount).val();
  doAjaxCall(url,{phrase:getVal},"GET",false,'',function(data,type){
        var str = "";
        
        $.each(data, function(i, item) {          
                  var ref = "N/A";
                  if(item.site_reference){
                    ref = item.site_reference;
                  }
                  str=`${str}<option data-id="${item.id}" value="${item.site_name}(${ref})"/>`;     
    });  
    $('#' + selectId).html(str);
});
}

function flushhtml(idofDiv){
  document.getElementById(idofDiv).innerHTML = "";
  var crAmount = $('#cramountid').val();
  var sum = 0;
  for (var a = document.querySelectorAll('table.transaction_table tbody tr'), i = 0; a[i]; ++i) {
    cells = a[i].querySelectorAll('.amount_value');
    sum = parseFloat(sum) + parseFloat(cells[0].value);
  }
  //console.log(sum);
  $("#cramountid").val(sum);
  /*if(parseFloat(sum)<parseFloat(crAmount)){
    $('.add').css('display','inline-block');
  }
  else if(parseFloat(sum)>parseFloat(crAmount)){
    alert('invalid sum');
  }
  else{
  }*/
} 

function checkforAccount(){
  var value = $('.account_input').val();
  if(value==''){
    $(".expenseInput").prop("disabled", true);
  }
}

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

function convertAmount(name, second, contid) {
  var numericValue = document.getElementById(second).value;
  numericValue = parseFloat(numericValue).toFixed(2);
  var amount = numericValue.toString().split('.');
  var taka = amount[0];
  var paisa = amount[1];
  var inWords = document.getElementById(contid).innerHTML = convert(taka) +" rupees and "+ convert(paisa)+" paisa only";
  document.getElementById(second).setAttribute('title', inWords);
}

function convert(numericValue) {
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

$(document).on('keydown', function ( e ) {

    // You may replace `c` with whatever key you want
    //console.log(e.keyCode);
    //if ((e.metaKey || e.ctrlKey) && ( String.fromCharCode(e.which).toLowerCase() === 'c') )
    if ((e.metaKey || e.ctrlKey) && ( e.keyCode == 32) ) {
      e.preventDefault();
      generateTableRow();
    }
    else if((e.metaKey || e.ctrlKey) && ( String.fromCharCode(e.which).toLowerCase() === 's')){
      e.preventDefault();
      $("#receiptform").submit();
        //console.log( "You pressed CTRL + R" );
    }else if((e.metaKey || e.ctrlKey) && ( String.fromCharCode(e.which).toLowerCase() === 'e')){
      e.preventDefault();
      addExpenseMaster(-1);
    }else{
      return true;
    }
}); 
  removedisable = () => {
    $("#credit_head").empty();
    
    if($("#credittype").val() == ''){
      $("#credit_head").attr("disabled", true);
    }else{
      $("#credit_head").removeAttr("disabled");
    }
  }
 function getExpense(obj, rowsCount){
  var val = $(obj).val();
  if(val != ""){
    doAjaxCall('/getExpenseCategories',{head_id:val},"GET",false,'',function(data,type){
      var str = "<option value=''> Select Expense Category</option>";
      if(data.expenses.length > 0){
        data.expenses.map(function(res){
         str =`${str}<option value="${res.id}">${res.expense_name}</option>`;
        });
      }
       
      $("#debitexpense_head_"+rowsCount).html(str); 
      $("#debitexpense_head_"+rowsCount).select2(); 
    })
  }else{
    $("#debitexpense_head_"+rowsCount).empty();
  }
}
function empty(rowsCount){
  $("#account_head_data_ajax_"+rowsCount).empty().trigger('change');
}
function crEmpty(){
  $("#credit_head").empty().trigger('change');
}
function generateSelect2(rowsCount){
   $("#account_head_data_ajax_"+rowsCount).select2({
      ajax: {
        url: "/form/creaditheadList",
        dataType: 'json',
        delay: 250,
        data: function (params) {
          return {
            phrase: params.term, // search term
            page: params.page,
            accountType: $('#debittype_'+rowsCount).val(),
          };
        },
        processResults: function (data, params) {
          params.page = params.page || 1;
          return {
            results: data.items,
            pagination: {
              more: (params.page * 30) < data.total_count
            }
          };
        },
        cache: true
      },

      /*initSelection: function (element, callback) {
        if($("#transaction_id").val()){
          callback({id: $("#debitHead_id").val(), label: $("#debitHead_name").val() });
        }
      },*/
      placeholder: 'Search for credit head',
      escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
      minimumInputLength: 1,
      templateResult: function (repo) {
     // console.log(repo, 'repo');
      if (repo.loading) {
        return repo.text;
      }
      var markup = "<div class='select2-result-repository clearfix'>" + repo.label + "</div>";
      return markup;
    },
      templateSelection: function formatRepoSelection3 (repo) {
      $("#debit_head_"+rowsCount).val(repo.id);
        name = repo.label;
        return repo.label;
    }

    });
   $("#account_head_data_ajax_"+rowsCount).select2('data', {id:'103', label:'ENABLED_FROM_JS'});
   $("#account_head_data_ajax_"+rowsCount).val(103);
}
