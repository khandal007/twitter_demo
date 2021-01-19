  $(document).ready(function(e){
        //Form submit start
        $("#attAmount").on("keypress keyup blur",function (event) {
            //this.value = this.value.replace(/[^0-9\.]/g,'');
          $(this).val($(this).val().replace(/[^0-9\.]/g,''));
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });
        $("#receiptForm").submit(function(e){
                var txt;
                var amountSend = $("#attAmount").val();
                var headPerson = $("#headName").val();
                if($("#paymentMode").val() == 1){
                    txt = `Are you sure you want to pay Rs ${amountSend}/- to ${headPerson} through cash`;
                }else if($("#paymentMode").val() == 2){
                    txt = `Are you sure you want to pay Rs ${amountSend}/- to ${headPerson} through cheque`;
                }else{
                    txt = `Are you sure you want to pay Rs ${amountSend}/- to ${headPerson} through bank transfer`;
                }
                var r = confirm(txt);
                if (r == true) {
                $("#trLoader").show();
                e.preventDefault();

                var valid = $('#receiptForm')[0].checkValidity();
                if(!valid){
                    alert("Please fill the form correctly");
                    return false;
                }
                //alert("Form submit done");
                let transactionData = $("#receiptForm").serialize();
                 $.ajax({
                    type: 'post',
                    url: '/master/savetransaction?type=2',
                    data: transactionData,
                    datatype: 'json',
                    success: function (data) {
                        if(data.status == "success"){
                            let msg = "Please note your transaction ID: "+data.unique_id;
                            $("#trsuccMsg").text(msg);
                            $("#trsuccessmsg").show();
                            $("#receiptForm")[0].reset();
                            $("#head").focus();
                            $("#trLoader").hide();
                        setTimeout(function(){
                           $("#trsuccessmsg").hide();                            
                        }, 10000);
                            
                        } else if(data.status == "error"){
                            //alert(data.message);
                            $("#trLoader").hide();
                            $("#trerrMsg").text(data.message);
                              $("#trerrormsg").show();
                             setTimeout(function(){
                                ("#trerrormsg").hide();
                                 
                            }, 2000);
                        } else {
                                $("#trerrMsg").text("Something bad happened");
                                $("#trerrormsg").show();
                            setTimeout(function(){
                                $("#trerrormsg").hide();
                                $("#trLoader").hide();
                            }, 2000);
                          
                    }
                },
                error: function (data) {
                     $("#trerrMsg").text("Something bad happened");
                     $("#trerrormsg").show();
                      if(data.status == 401){
                        throwSessionOut();
                      }
                    setTimeout(function(){
                                 $("#trerrormsg").hide();   
                                 $("#trLoader").hide();
                            }, 2000);
                  }
                 });
                return false;

                 
                } else {
                 return false;
                }


        });
        //Form submit end    

         var options = {
            url: function(phrase){ return "/form/headList"; },
            getValue: function(element){ 
                //console.log(element);
               
                return element.label; 
            },    
            list: {
                    onSelectItemEvent: function() {
                         var element = $("#head").getSelectedItemData();
                          if(element.id){
                                $("#headId").val(element.id);  
                                $("#headName").val(element.labelName);  
                                getHeadBanks(element.id,0);                 
                                $( "#btnSubmit" ).prop( "disabled", false );


                            }else{
                                $("#headId").val(0);   
                                $("#headName").val("");  
                                $( "#btnSubmit" ).prop( "disabled", true ); 
                            }
                        //console.log("click hone ke bad",);
                    }   
            },        
            ajaxSettings: {
                dataType: "json",
                method: "GET",
                data: { dataType: "json" }
            },
            preparePostData: function(data) {
                data.phrase = $("#head").val();
                return data;
            },
            requestDelay: 400
        };
        $("#head").easyAutocomplete(options);


        var bankOptions = {
            url: function(phrase){ return "/form/bankList"; },
            getValue: function(element){ 
               
                return element.label; 
            },
             list: {
                    onSelectItemEvent: function() {
                         var element = $("#chequeBank").getSelectedItemData();
                           if(element.id){
                            $("#chequeBankId").val(element.id);                   
                    
                        }else{
                            $("#chequeBankId").val(0);   
                           // $( "#btnSubmit" ).prop( "disabled", true ); 
                        }
                    }
                        //console.log("click hone ke bad",);
            }, 
            ajaxSettings: {
                dataType: "json",
                method: "GET",
                data: { dataType: "json" }
            },
            preparePostData: function(data) {
                data.phrase = $("#chequeBank").val();
                return data;
            },
            requestDelay: 400
        }

        $("#chequeBank").easyAutocomplete(bankOptions);



        $("#addHeadBank").on('shown.bs.modal', function(){
          $("#addBank")[0].reset();  
         var bankHeadOptions = {
            url: function(phrase){ return "/form/getBankDetails"; },
            getValue: function(element){ 
               
                let showVal = element.name+"("+element.branch+"-"+element.ifsc+")";
                return showVal; 
            },
            list: {
                    onSelectItemEvent: function() {
                        var element = $("#bankIFSC").getSelectedItemData();
                         if(element.id){
                                $("#bankDetialsId").val(element.id);                   
                                
                            }else{
                                $("#bankDetialsId").val(0);   
                            }
                            }
                        //console.log("click hone ke bad",);
            },
            ajaxSettings: {
                dataType: "json",
                method: "GET",
                data: { dataType: "json" }
            },
            preparePostData: function(data) {
                data.phrase = $("#bankIFSC").val();
                return data;
            },
            requestDelay: 400
        }

        $("#bankIFSC").easyAutocomplete(bankHeadOptions);


        $("#addBank").submit(function (e){
            e.preventDefault();
            let bankhead_id = $("#headId").val();
            let urlBank = '/form/addHeadBankDetails';
            if(bankhead_id){
                urlBank = urlBank+"?head_id="+bankhead_id;
            }else{
                alert("You did not choose any head yet");
                $("#addHeadBank").modal('hide');
                return false;
            }
            $.ajax({
                type: 'POST',
                url: urlBank,
                data: $("#addBank").serialize(),
                datatype: 'json',
                success: function (data) {
                    if(data.status == "success"){
                        setTimeout(function(){
                            $("#bankSuccMsg").text(data.message);
                            $("#banksucessmsg").show();
                            getHeadBanks(bankhead_id,data.newBank.id);
                            //$("#bankDetialsHeadId").val(data.newBank.id)
                            
                            $("#addHeadBank").modal('hide');
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
                    setTimeout(function(){
                        $("#bankerrormsg").hide("slow");
                    }, 2000);
                }
            });
        });


        
        });

        $("#head").focus();
        $(".cheque_no").hide();
        $(".cheque_date").hide();
        $(".cheque_bank").hide();
        $(".bankTransfer").hide();
        $(".transaction_number").hide();

        $('#txn_date').datepicker({ format : 'dd/mm/yyyy',autoclose: true}); 
        $('#cheque_date').datepicker({ format : 'dd/mm/yyyy', autoclose: true }); 
       
        $('#cheque_date').datepicker('update', new Date());
        $('#txn_date').datepicker('update', new Date());

        $("#transactionExpense").change(function(e){
            var getValue = $(this).val();
            if(getValue == ""){
                
                $(".subexpens").hide('slow');
                return false;
            }
              $.ajax({
                type: 'GET',
                url: '/getChildExpense?parent_id='+getValue,
                data: '',
                datatype: 'json',
                success: function (data) {
                    if(data.status == "success"){
                         var newOptions="";
                         $.each(data.allChildExpenses, function (key, val) {
                                var selectedOption="";
                                //console.log(key + val);
                                
                                newOptions = `${newOptions}<option value="${val.id}">${val.expense_name}</option>`;
                            });
                         
                    } else if(data.status == "error"){
                        newOptions = "<option value=''>Select Expensse</option>";
                        
                    } else {
                       newOptions = "<option value=''>Select Expensse</option>";
                  }
                  $("#transactionExpenseSub").html(newOptions);
                   $(".subexpens").show('slow');
                },
                error: function (data) {
                   $("#transactionExpenseSub").html("");
                }
            });
        })
        

        

        // Create Header Account
        var frm = $('#addCompany');
        frm.submit(function (e){
            e.preventDefault();
            $.ajax({
                type: frm.attr('method'),
                url: '/master/addHead',
                data: frm.serialize(),
                datatype: 'json',
                success: function (data) {
                    if(data.status == "success"){
                        $("#sucessmsg").show();
                        setTimeout(function(){
                            $("#head").val(data.createdHead.account_name);
                            $("#headId").val(data.createdHead.id);
                            $("#addHead").modal('hide');
                        }, 5000);
                    } else if(data.status == "error"){
                        $("#errMsg").text(data.message);
                        $("#errormsg").show();
                        setTimeout(function(){
                                $("#errormsg").hide("slow");
                        }, 5000);
                    } else {
                        $("#errMsg").text("something_bad_happened_please_try_again");
                        $("#errormsg").show();
                        setTimeout(function(){
                            $("#errormsg").hide("slow");
                        }, 5000);
                  }
                },
                error: function (data) {
                    $("#errormsg").show();
                    if(data.status == 401){
                        throwSessionOut();
                      }
                    setTimeout(function(){
                        $("#errormsg").hide("slow");
                    }, 6000);
                }
            });
        });

    });

    function payMode(val){
        if(val == '2'){
            $(".cheque_no").show("slow");
            $(".cheque_date").show("slow");
            $(".cheque_bank").show("slow");            
            $(".bankTransfer").hide("slow");   
            $(".transaction_number").hide("slow");   
        } else if(val == '3'){
            $(".cheque_no").hide("slow");
            $(".cheque_date").hide("slow");
            $(".cheque_bank").hide("slow");
            $(".bankTransfer").show("slow");
            $(".transaction_number").show("slow");
        } else {
            $(".cheque_no").hide("slow");
            $(".cheque_date").hide("slow");
            $(".cheque_bank").hide("slow");
            $(".bankTransfer").hide("slow");
            $(".transaction_number").hide("slow");
        }   
    }
    function getHeadBanks(headId,selected){
        if(headId){
            $("#bankTransfer").html("");
             $.ajax({
                type: 'GET',
                url: '/form/getAllHeadBanks?head_id='+headId,
                data: '',
                datatype: 'json',
                success: function (data) {
                    if(data.status == "success"){
                         var newOptions="";
                         $.each(data.allHeadBanks, function (key, val) {
                                var selectedOption="";
                                //console.log(key + val);
                                if(selected == val.id){
                                    selectedOption = "selected";
                                }
                                newOptions = `${newOptions}<option ${selectedOption} value="${val.id}">${val.name}-${val.branch}(A/C: ${val.bank_account_number})</option>`;
                            });
                         
                    } else if(data.status == "error"){
                        newOptions = "<option value=''>Select Bank</option>";
                        
                    } else {
                       newOptions = "<option value=''>Select Bank</option>";
                  }
                  $("#bankTransfer").html(newOptions);
                },
                error: function (data) {
                   $("#bankTransfer").html("");
                }
            });
        }
    }
