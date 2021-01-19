/*******************Global Variables**********************/
var questions =[];
var questionId;
var validateFlag = 0;
var errorMessage;

$(document).ready(function(e){
    $('input[type="radio"].flat-red').iCheck({
        radioClass   : 'iradio_flat-green'
    })

    /*****************Hide Fields******************/
    $("#alertSection").hide();
    $("#fieldDetails").hide();
    $("#fieldOptions").hide();
    $("#fileValid").hide();
    $("#saveField").hide();
    $("#optionSelectTypeField").hide();

    var max_fields      = 15; //maximum input boxes allowed
    var wrapper         = $(".input_fields_wrap"); //Fields wrapper
    var add_button      = $(".add_field_button"); //Add button ID
    
    var x = 1; //initlal text box count
    $(add_button).click(function(e){ //on add input button click
        e.preventDefault();
        if(x < max_fields){ //max input box allowed
            x++; //text box increment
            $(wrapper).append("<div class='col-sm-12 added_field'><input type='text' name='optionLabel"+x+"' id='optionLabel"+x+"' placeholder='Option Label "+x+"' class='form-control option-control'/><a href='#' class='btn btn-danger remove_field'>Remove</a></div>"); //add input box
            $("#selectOption").val(x);
        }
    });
    
    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
        e.preventDefault(); $(this).parent('div').remove(); x--;
    })

});

// Delete Button Function To Delete Form Index/Form Field
function onSelectElement(ElementId, slug,element_type){
    if(ElementId){
        $("#fieldDetails").show("slow");
        $("#saveField").show("slow");
        $("#elementSlug").val(slug);
        $("#element_type").val(element_type);

    } else{
        $("#fieldDetails").hide();
        $("#fieldOptions").hide();
        $("#fileValid").hide();
    }
    
    if(ElementId == 10){
        $("#fileValid").show("slow");
        $("#fieldOptions").hide();
        $("#saveField").show("slow");
    } else {
       $("#fieldOptions").hide();
       $("#fileValid").hide(); 
    }
    
    if(ElementId == 6 || ElementId == 7 || ElementId == 18 || ElementId == 20){
        $("#fileValid").hide();
        $("#fieldOptions").show("slow");
        $("#saveField").show("slow");
    } else{
        $("#fieldOptions").hide();
    }

    if(ElementId == 18 || ElementId == 20){  
        $("#optionSelectTypeField").show("slow");
    } else{
        $("#optionSelectTypeField").hide();
    }

    var formName = $("#formTitle").val();
    var formDesc = $("#formDescription").val();
    if(formName != ''){
        $("#formTitle").prop('disabled', true);    
    }

    if(formDesc != ''){
        $("#formDescription").prop('disabled', true);    
    }
}

// Add Field Button Function To Add Field In Form 
function addField(){
    validateFlag = 0;

    var elementId = $("#elementId").val();
    var question = $("#question").val();
    //var fieldLabel = $("#fieldLabel").val();
    
    if($('#isRequired').is(":checked")){
        var isRequired = true;
    } else {
        var isRequired = false;
    }

    if(elementId ==""){
        validateFlag = 1;
        errorMessage ="Select Form Element!";
    } else if(question ==""){
        validateFlag = 1;
        errorMessage ="Question Can't Be Blank!";
    } else {
        validateFlag = 0;
    }


    var fieldData = {
        "isActive" : parseInt(1),
        "questionId" : ((questions.length > 0) ? ((questions[questions.length-1].questionId) ? questions[questions.length-1].questionId :0) : 0 ) + parseInt(1) ,
        "elementId" : parseInt(elementId),
        "question" : question,
        "fieldPlaceHolder" : $("#fieldPlaceHolder").val(),
        "isRequired": isRequired,
        "elementSlug": $("#elementSlug").val(),
        "element_type" : $("#element_type").val(),
    };
    
    if(elementId == 18 || elementId == 20){
        fieldData.optionFieldAttribute = $("#optionSelectType").val();
    }

    if(elementId == 6 || elementId == 7 || elementId == 18 || elementId == 20){
        var option =[]; 
        var selectedOptions=$("#selectOption").val();
        for (i = 1; i <= selectedOptions; i++) {
            var optionLabel = $("#optionLabel"+i).val();
                if(optionLabel==""){
                    validateFlag = 1;
                    errorMessage ="Option Label "+i+" Can't Be Blank!";
                } else {
                    validateFlag = 0;
                }
        }

        if(validateFlag == 0){
            for (i = 1; i <= selectedOptions; i++) { 
                var optionLabel =$("#optionLabel"+i).val();
                if(typeof(optionLabel) != "undefined"){
                    var optionData= {
                        "id": parseInt(i),
                        "optionLabel" : optionLabel,
                    }
                    option.push(optionData);
                }
            }
            fieldData.options=option;
        }
    }

    if(elementId == 10){
        var fileType = $("#fileType").val();
        var fileSize = $("#fileSize").val();
        var fileSelectType = $("#fileSelectType").val();

        var imageOption = {
            fileType : fileType,
            fileSize : fileSize,
            fileSelectType : fileSelectType
        }

        fieldData.imageOptions=imageOption;
    }

    if(validateFlag == 1){
        $("#alertSection").show("slow");
        setTimeout(function(){ $("#alertSection").hide("slow"); }, 3000);
        $("#alertStatus").removeClass("alert-success");
        $("#alertStatus").addClass("alert-danger");
        $("#message").html(errorMessage); 
        return false; 
    } else {
        $("#alertSection").show("slow");
        setTimeout(function(){ $("#alertSection").hide("slow"); }, 3000);
        $("#alertStatus").removeClass("alert-danger");
        $("#alertStatus").addClass("alert-success");
        $("#message").html("Form Field Added Successfully!");
        validateFlag = 0;
    }

    questions.push(fieldData);
    mobileView();
    blankFormData();
    console.log(questions);
}

// Function To Show Form Fields In Mobile Frame
function mobileView(){
    var formName = $("#formTitle").val();
    if(formName == '') { formName = 'My Form'}
    var htmlData ="<div class='col-sm-12 text-center'><u>"+formName+"</u></div>";

    var index= 0;
    if(questions.length){
        questions.forEach(function(element) {
            index=parseInt(index)+parseInt(1);
            htmlData += "<div class='col-sm-12'><div class='col-sm-10 padding-none'><label>"+index+"."+element.question+"";
            
            if(element.isRequired == true){
                htmlData += "*</label></div>";
            } else {
                htmlData += "</label></div>";
            }

            htmlData += `<div class='col-sm-2 padding-none'><button class='btn-danger' title='Delete Field' onClick="deleteFormField('${index-1}')"><i class='fa fa-times'></i></button></div>`;
            
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
        });
    }
    $("#mobile-view-data").html(htmlData);
}

// Delete Button Function To Delete Form Index/Form Field
function deleteFormField(element_index){ 
    questions.splice(element_index, 1);
    mobileView();
}

// Save Button Function To Save/Insert Form Data
function saveForm(){
    validateFlag = 0;

    var formName = $("#formTitle").val();
    var formFields = {
        "_csrf" : $("#_csrf").val(),
        "formName" : formName,
        "description" : $("#formDescription").val(),
    };

    if(!formName){
        errorMessage ="Form Name Required!";
        validateFlag = 1;
    } else if(!questions.length){
        errorMessage ="Atleast One Form Field Required!";
        validateFlag = 1;
    } else {
        validateFlag = 0;
    }

    if(validateFlag == 1){
        $("#alertSection").show("slow");
        setTimeout(function(){ $("#alertSection").hide("slow"); }, 3000);
        $("#alertStatus").removeClass("alert-success");
        $("#alertStatus").addClass("alert-danger");
        $("#message").html(errorMessage); 
        return false; 
    }   

    for(i=0; i < questions.length; i++){
        orderNm = parseInt(1) + i;
        questions[i].orderNo = orderNm;
    }

    formFields.questions=questions;
    console.log(formFields);

    $.ajax({
        type: 'POST',
        url: '/form/create-form',
        data: formFields,
        dataType: "json",
        success: function (data) {
            $("#alertSection").show("slow");
            setTimeout(function(){ $("#alertSection").hide("slow"); }, 3000);
            $("#alertStatus").removeClass("alert-danger");
            $("#alertStatus").addClass("alert-success");
            $("#message").html(data.message);
            blankFormData();
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

// Reset Button Function To Reset/Cancel Form Data
function resetForm(){
    questions=[];
    if(!questions.length){
        $("#alertSection").show("slow");
        setTimeout(function(){ $("#alertSection").hide("slow"); }, 3000);
        $("#alertStatus").removeClass("alert-danger");
        $("#alertStatus").addClass("alert-success");
        $("#message").html("Form Has Been Cancelled!");
    }
    mobileView();
    blankFormData();
}

// Reset Form Data (Blank Form Data)
function blankFormData(){

    /**************Blank Fields**************/
    $("#question").val('');
    $("#fieldPlaceHolder").val('');
    $('#isRequired').prop('checked', false); 
    $("#fileSize").val('');
    $("#optionLabel1").val('');
    $(".added_field").remove();

    $("#fieldDetails").hide();
    $("#fieldOptions").hide();
    $("#fileValid").hide();
    $("#saveField").hide();
    $("#optionSelectTypeField").hide();
}

