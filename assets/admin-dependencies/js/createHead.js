
$(document).ready(function(e){
   
    $('input[type="radio"].flat-red').iCheck({
        radioClass   : 'iradio_flat-green'
    });

    var url_string = window.location.href;
    var url = new URL(url_string);
    var account_id = url.searchParams.get('account_id');
    var contact_id = url.searchParams.get('contact_id');
    var bank_id = url.searchParams.get('bank_id');
    var head_id = url.searchParams.get('head_id');
    var page = url.searchParams.get('page');
    
    
    if(head_id){ 
       $("#head_id").val(head_id); 
    }

    if(account_id){
        $(".breadcrumb").hide();
        formTab("account");
    } else if(contact_id || page =='contact'){
        $(".breadcrumb").hide();
        formTab("contact");
    } else if(bank_id || page =='bank'){
        $(".breadcrumb").hide();
        formTab("bank");
    } else {
        formTab("account");
    }

    // Same correspondence address
    $('#addressCheckFlag').change(function() {
        if($(this).is(":checked")) {
            $(".CorAddress").hide('slow');
        } else {
            $(".CorAddress").show('slow');
        }
    });

    // Key Search Heads
    $("#companyName").on('keyup change',function(e){
        let url = "/form/headList";
        let data = {phrase:$(this).val(),similarHead:1,_csrf:$("#_csrf").val()};
        let send_type = "GET";
      
        doAjaxCall(url,data,send_type,false,'',function(data,type){
            if(type == 1){
                $("#prevHeadsDiv").show();
                if(data.length > 0){
                    var str = "";
                    data.map(function(res){
                    str =`${str}<li title="${res.labelName}"><a href="/master/createHead?page=account&action=merge&account_id=${res.id}" class="users-list-name">${res.labelName}</a><span class="users-list-state">${res.state_name}</span><span class="users-list-date">${res.account_type_text}</span><span class="users-list-date"><b>${res.company_name}</b></span></li>`;
                    });
                    $("#prevHeads").html(str);
                }else{
                    $("#prevHeadsDiv").hide();
                }
            }else{
                $("#prevHeadsDiv").hide();
            }
        });
    });

});

function formTab(str){
     var url_string = window.location.href;
     var url = new URL(url_string);
     var type_id = url.searchParams.get('type');
    $(".breadcrumb").empty();
    var breadcrumb = '';
    if(str == 'account'){
        console.log(str);
        $("#HeadDetailDiv").hide();
        $(".accountFrm").show();
        $(".contactFrm").hide();        
        $(".bankFrm").hide();
        
        breadcrumb =
            `<a href="/master/ledgerlist?type=${type_id}" class='btn btn-primary' style="margin-top: 0px;">Back</a>
            <li><a href="javascript:void(0)" id="account" class="breadcrumb-active">Account</a></li>
            <li><a href="javascript:void(0)" id="contact">Contact</a></li>
            <li><a href="javascript:void(0)" id="bank">Bank</a></li>`;

    } else if(str == 'contact'){
        $("#HeadDetailDiv").show();
        $(".accountFrm").hide();
        $(".contactFrm").show();
        $(".bankFrm").hide();
        
        breadcrumb =
            `<a href="/master/ledgerlist?type=1" class='btn btn-primary' style="margin-top: 0px;">Back</a>
            <li><a href="javascript:void(0)" id="account">Account</a></li>
            <li><a href="javascript:void(0)" id="contact" class="breadcrumb-active" onClick="formTab('contact')">Contact</a></li>
            <li><a href="javascript:void(0)" id="bank" onClick="formTab('bank')">Bank</a></li>`;

    } else if(str == 'bank'){
        $("#HeadDetailDiv").show();
        $(".accountFrm").hide();
        $(".contactFrm").hide();
        $(".bankFrm").show();        
        
        breadcrumb =
            `<a href="/master/ledgerlist?type=2" class='btn btn-primary' style="margin-top: 0px;">Back</a>
            <li><a href="javascript:void(0)" id="account">Account</a></li>
            <li><a href="javascript:void(0)" id="contact" onClick="formTab('contact')">Contact</a></li>
            <li><a href="javascript:void(0)" id="bank" class="breadcrumb-active" onClick="formTab('bank')">Bank</a></li>`;
    } else if(str == "documents"){
        $("#HeadDetailDiv").show();
        $(".accountFrm").hide();
        $(".contactFrm").hide();
        $(".bankFrm").hide();
        
        breadcrumb =
            `<a href="/master/ledgerlist" class='btn btn-primary' style="margin-top: 0px;">Back</a>
            <li><a href="javascript:void(0)" id="account">Account</a></li>
            <li><a href="javascript:void(0)" id="contact" onClick="formTab('contact')">Contact</a></li>
            <li><a href="javascript:void(0)" id="bank" onClick="formTab('bank')">Bank</a></li>`;
    }

    $(".breadcrumb").prepend(breadcrumb);
}