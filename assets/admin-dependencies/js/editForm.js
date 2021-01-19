/*******************Global Variables**********************/
var questions = formData.questions
var questionId;
var validateFlag = 0;
var errorMessage;

$(document).ready(function(e){
    
    $("#formTitle").val(formData.formName);
    $("#formDescription").val(formData.description);
    $("#formId").val(formData.formId);   

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

    mobileView();

});


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
        "questionId" : parseInt(((questions.length > 0) ? ((questions[questions.length-1].questionId) ? questions[questions.length-1].questionId :0) : 0 )) + parseInt(1) ,
        "elementId" : $("#elementId").val(),
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
            if(element.isActive == 1 || element.isActive == "1"){
                htmlData += "<div class='col-sm-12 margin-1em-top'><div class='col-sm-9 padding-none'><label>"+index+"."+element.question+"";
            } else {
                htmlData += "<div class='col-sm-12 margin-1em-top deactive-form-field'><div class='col-sm-9 padding-none'><label>"+index+"."+element.question+"";
            }
            
            if(element.isRequired == true ||  element.isRequired == "true"){
                htmlData += "*</label></div>";
            } else {
                htmlData += "</label></div>";
            }

            htmlData += `<div class='col-sm-3 padding-none'> <a class='btn-round-sm btn-danger' title='Delete Field' onClick="deleteFormField('${index-1}')"><i class='fa fa-times'></i></a>  <a class='btn-round-sm btn-primary' title='Edit Field' onClick="editModal('${index-1}')"><i class='fa fa-pencil'></i></a></div>`;
            
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
        "id" : $("#formId").val(),
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
        type: 'PUT',
        url: '/form/updateFormData',
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


//----------------------- Form Field Edit Section ------------------------------------  


// Edit Modal Function To Edit Form Fields
function editModal(element_index){
    $("#modal-default").show("slow");
    $("#element_index").val(element_index);
    $("#oldElementId").val(questions[element_index].elementId);

    if(questions[element_index].isActive =="1"){
        $('#activeFieldStatus').prop('checked', true);
    } else {
        $('#deactiveFieldStatus').prop('checked', true);  
    }

    $("#editElementId option[value='"+questions[element_index].elementId+"']").attr("selected", "selected");
    $("#editQuestion").val(questions[element_index].question);
    $("#editFieldPlaceHolder").val(questions[element_index].fieldPlaceHolder);

    if(questions[element_index].isRequired == "true"){
        $("#editIsRequired").prop( "checked", true );
    }

    var ElementId = questions[element_index].elementId;
    if(ElementId == 6 || ElementId == 7 || ElementId == 18 || ElementId == 20){
         //Option code goes here   
         showOptions(questions[element_index].options);
    }

    if(ElementId == 10){
        $("#editFileType option[value='"+questions[element_index].imageOptions.fileType+"']").attr("selected", "selected");
        $("#editFileSize").val(questions[element_index].imageOptions.fileSize);
        $("#editFileSelectType option[value='"+questions[element_index].imageOptions.fileSelectType+"']").attr("selected", "selected");
    }

    onModalSelectElement(questions[element_index].elementId, questions[element_index].elementSlug, questions[element_index].element_type);
}

function showOptions(arr){
    $(".options_tab").empty();
    $("#editSelectOption").val(arr.length);
    $.each(arr, function(i, item) {
        if(i == 0){
            $(".options_tab").append(`<div class="col-sm-8"><input type="text" id="editOptionLabel${i}" class="form-control" value="${item.optionLabel}"></div> <div class="col-sm-4"><button class="btn btn-primary" onClick="addNewOptionTab();">Add More Fields</button></div>`);
        } else {
            $(".options_tab").append(`<div class='optionDiv${i}'><div class="col-sm-8"><input type="text" id="editOptionLabel${i}" class="form-control" value="${item.optionLabel}"></div> <div class="col-sm-4"><button class="btn btn-danger" onClick="deleteOptionTab(${i})">Remove</button></div></div>`);
        }   
  });
}

function addNewOptionTab(){
    var i = parseInt($("#editSelectOption").val()); 
    
    $(".options_tab").append(`<div class='optionDiv${i}'><div class="col-sm-8"><input type="text" id="editOptionLabel${i}" class="form-control"></div> <div class="col-sm-4"><button class="btn btn-danger" onClick="deleteOptionTab(${i})">Remove</button></div></div>`);
    i++;

    $("#editSelectOption").val(i);
}

function deleteOptionTab(index){
    $( ".optionDiv"+index ).remove(); 
}

// Calling This Function On Select Field Type Dropdown 
function onModalSelectElement(ElementId, slug,element_type){
    if(ElementId){
        $("#editFieldDetails").show("slow");
        $("#editElementSlug").val(slug);
        $("#editElement_type").val(element_type);

    } else{
        $("#editFieldDetails").hide();
        $("#editFieldOptions").hide();
        $("#editFileValid").hide();
    }
    
    if(ElementId == 10){
        $("#editFileValid").show("slow");
        $("#editFieldOptions").hide();
    } else {
       $("#editFieldOptions").hide();
       $("#editFileValid").hide(); 
    }
    
    if(ElementId == 6 || ElementId == 7 || ElementId == 18 || ElementId == 20){
        $("#editFileValid").hide();
        $("#editFieldOptions").show("slow");
    } else{
        $("#editFieldOptions").hide();
    }

    if(ElementId == 18 || ElementId == 20){  
        $("#editOptionSelectTypeField").show("slow");
    } else{
        $("#editOptionSelectTypeField").hide();
    } 
}

// Save Changes Function To Edit selected Form Field
function editField(){
    var element_index = $("#element_index").val();
    
    questions[element_index].elementId          =               $("#editElementId").val();
    questions[element_index].elementSlug        =               $("#editElementSlug").val();
    questions[element_index].element_type       =               $("#editElement_type").val();
    questions[element_index].question           =               $("#editQuestion").val();
    questions[element_index].fieldPlaceHolder   =               $("#editFieldPlaceHolder").val();

    if($('#editIsRequired').is(":checked")){
        questions[element_index].isRequired = true;
    } else {
        questions[element_index].isRequired = false;
    }
    
    if($("#activeFieldStatus").prop("checked")){
        questions[element_index].isActive =  parseInt(1); 
    } else {
        questions[element_index].isActive =  parseInt(0);
    }

    var oldElementId = $("#oldElementId").val();
    var ElementId =  parseInt(questions[element_index].elementId);
    if( ElementId == 10){
        var imageOption = {
            fileType : $("#editFileType").val(),
            fileSize : $("#editFileSize").val(),
            fileSelectType : $("#editFileSelectType").val()
        }

        questions[element_index].imageOptions=imageOption;
    }

    if(ElementId == 18 || ElementId == 20){
        questions[element_index].optionFieldAttribute = $("#editOptionSelectType").val();
    }

    // Function To Remove Unwanted Json Data From
    check_json(ElementId, oldElementId);

    if(ElementId == 6 || ElementId == 7 || ElementId == 18 || ElementId == 20){ 
        var option =[]; 
        var selectedOptions=$("#editSelectOption").val();
        for (i = 0; i <= selectedOptions; i++) {
            var optionLabel = $("#editOptionLabel"+i).val();
                if(optionLabel==""){
                    validateFlag = 1;
                    errorMessage ="Option Label "+i+" Can't Be Blank!";
                } else {
                    validateFlag = 0;
                }
        }

        if(validateFlag == 0){
            for (i = 0; i <= selectedOptions; i++) { 
                var optionLabel =$("#editOptionLabel"+i).val();
                if(typeof(optionLabel) != "undefined"){
                    var optionData= {
                        "id": parseInt(i),
                        "optionLabel" : optionLabel,
                    }
                    option.push(optionData);
                }
            }
            questions[element_index].options=option;
        }
    }

    close_model();
    mobileView();

    console.log(questions[element_index]);
}

function check_json(ElementId, oldElementId){
    var element_index = $("#element_index").val();
    if(ElementId != oldElementId){

        if(oldElementId == 6 || oldElementId == 7 || oldElementId == 18 || oldElementId == 20){
           delete questions[element_index].options; 
        }

        if(oldElementId == 10){
            delete questions[element_index].imageOptions;
        }
    }
}

// Close Modal Function To Close Modal Showing Mobile Frame
function close_model(){ $("#modal-default").hide("slow"); }