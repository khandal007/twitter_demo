
$(document).ready(function(e) {
  $('#example2').DataTable({
    'paging': true,
    'lengthChange': true,
    'searching': true,
    'ordering': true,
    'info': true,
    'autoWidth': false
  });

  $('#alertSection').hide();
  $('[data-toggle="tooltip"]').tooltip();
})

// Mobile View Function To Get Form Data And Render It In Mobile Frame
function mobileView(formId){
    $("#modal-default").show("slow");

    formFields = {
        "_csrf" : $("#_csrf").val(),
        "formId" : formId,
    };

    $.ajax({
        type: 'POST',
        url: '/form/getform',
        data: formFields,
        dataType: "json",
        success: function (data) {
            var htmlData ="<div class='col-sm-12 text-center'><u>"+data.newData[0].formName+"</u></div>";
            var index= 0;
            data.newData[0].questions.forEach(function(element) {
                if(element.isActive == 1){
                    index=parseInt(index)+parseInt(1);
                    htmlData += "<div class='col-sm-12'><div class='col-sm-12 padding-none'><label>"+index+"."+element.question+"";
                    
                    if(element.isRequired == "true"){ htmlData += "*</label></div>";} 
                    else { htmlData += "</label></div>"; }

                    if(element.element_type == 'input'){
                        htmlData += "<input type='"+element.elementSlug+"' class='form-control' placeholder='"+element.fieldPlaceHolder+"'>"; 
                    } else if( element.element_type == 'tag'){
                        htmlData += "<"+element.elementSlug+"></"+element.elementSlug+">";
                    } else if(element.element_type == 'option'){
                        if(element.elementSlug == 'select' ||  element.elementSlug == 'datalist'){
                            htmlData += "<"+element.elementSlug+" class='form-control'>"; 
                            element.options.forEach(function(option) { 
                                htmlData += "<option>"+option.optionLabel+"</option>";
                            })
                            htmlData += "</"+element.elementSlug+">";
                        }
                        else if(element.elementSlug == "radio" || element.elementSlug == "checkbox"){
                            element.options.forEach(function(option) {
                              htmlData += "<div class='col-sm-6'><input type='"+element.elementSlug+"' name='"+element.elementSlug+"'> "+option.optionLabel+"</div>";
                            })
                        }
                    }
                    htmlData += "</div>";
                }
            });

            $("#mobile-view-data").html(htmlData);
        },
        error: function (data) {
            alert(data.message);
        },
    });
}

// Close Modal Function To Close Modal Showing Mobile Frame
function close_model(){ $("#modal-default").hide("slow"); }

// Active/Deactive Form Status Function
function changeStatus(formId, status){
    var formFields ={
        'id': formId,
        '_csrf': $('#_csrf').val(),
        'isActive' : parseInt(status),
    };

    $.ajax({
        type: 'PUT',
        url: '/form/updateFormStatus',
        data: formFields,
        dataType: "json",
        success: function (data) {
            $("#alertSection").show("slow");
            setTimeout(function(){ $("#alertSection").hide("slow"); }, 3000);
            $("#alertStatus").removeClass("alert-danger");
            $("#alertStatus").addClass("alert-success");
            $("#message").html(data.message);
            location.reload();
        },
        error: function (data) {
            $("#alertSection").show("slow");
            setTimeout(function(){ $("#alertSection").hide("slow"); }, 3000);
            $("#alertStatus").removeClass("alert-success");
            $("#alertStatus").addClass("alert-danger");
            $("#message").html(data.message);
        },
    });
}
function openModel(){

}