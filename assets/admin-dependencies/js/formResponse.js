
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
function mobileView(id,formId){
    $("#modal-default").show("slow");

    formFields = {
        "_csrf" : $("#_csrf").val(),
        "formId" : formId,
        "submit_id" : id,
    };

    $.ajax({
        type: 'POST',
        url: '/form/getFormResponse',
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
                        
                        htmlData += "<input type='"+element.elementSlug+"' class='form-control' placeholder='"+element.fieldPlaceHolder+"' value='"+element.answers[0].answer+"' disabled>";

                    } else if( element.element_type == 'tag'){
                        
                        htmlData += "<"+element.elementSlug+" disabled>"+element.answers[0].answer+"</"+element.elementSlug+">";

                    } else if(element.element_type == 'option'){
                        
                        if(element.elementSlug == 'select' ||  element.elementSlug == 'datalist'){
                            
                            if(element.optionFieldAttribute == true || element.optionFieldAttribute == "true"){
                                htmlData += "<"+element.elementSlug+" class='form-control' multiple disabled>"; 
                            } else {
                                htmlData += "<"+element.elementSlug+" class='form-control' disabled>";
                            }
                            
                            var a=0;
                            element.options.forEach(function(opt) {
                                if(typeof element.answers[0].options[a] != 'undefined'){
                                    if(opt.id == element.answers[0].options[a].id){
                                        htmlData += "<option selected>"+opt.optionLabel+"</option>";
                                        a++;
                                    } else {
                                       htmlData += "<option>"+opt.optionLabel+"</option>"; 
                                    } 
                                }
                                else {
                                    htmlData += "<option>"+opt.optionLabel+"</option>"; 
                                    a++;
                                }
                            })
                            
                            htmlData += "</"+element.elementSlug+">";
                        
                        } else if(element.elementSlug == "radio" || element.elementSlug == "checkbox"){
                            
                            var x=0;
                            element.options.forEach(function(opt) {
                              
                                htmlData += "<div class='col-sm-6'>"
                                if(typeof element.answers[0].options[x] != 'undefined'){
                                    if(opt.id == element.answers[0].options[x].id){
                                        htmlData += "<input type='"+element.elementSlug+"' name='"+element.elementSlug+"' checked disabled> "+opt.optionLabel+"";
                                        x++;
                                    } else {
                                       htmlData += "<input type='"+element.elementSlug+"' name='"+element.elementSlug+"' disabled> "+opt.optionLabel+""; 
                                    } 
                                }
                                else {
                                    htmlData += "<input type='"+element.elementSlug+"' name='"+element.elementSlug+"' disabled> "+opt.optionLabel+""; 
                                    x++;
                                }
                              
                                htmlData += "</div>";
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


// Export To Excel File Function
function expExcel(){

    formFields = {
        "_csrf" : $("#_csrf").val(),
        "formId" : $("#formId").val(),
    };

    $.ajax({
        type: 'POST',
        url: '/form/getResponseExcel',
        data: formFields,
        dataType: "json",
        success: function (data) {
        },
        error: function (data) {
            alert(data.message);
        },
    });
}