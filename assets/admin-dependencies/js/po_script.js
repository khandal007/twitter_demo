
(function (document) {
	 //Form submit start
     $("#invoiceform").submit(function(e){
    	 
     	var valid = $('#invoiceform')[0].checkValidity();

                if(!valid){
                	  $("#trLoader").hide();
                    alert("Please fill the form correctly");
                    return false;
                }
         var allData = {};
         allData['formData'] = {};
         var formData = $("#invoiceform").serializeArray();
         console.log(formData);
         formData.map(function(d){
         	allData['formData'][d.name] = d.value;
         })
         allData['_csrf'] = $("#_csrf").val();
         
              
         var cells, displayCells,productIds, totalCells, a, i,gstVal;
         var allProducts = [];
         var totalObj = {};

         for (var a = document.querySelectorAll('table.inventory tbody tr'), i = 0; a[i]; ++i) {
         	cells = a[i].querySelectorAll('.productCell');
			displayCells = a[i].querySelectorAll('.productPriceSpan');
			productIds = a[i].querySelectorAll('.productIdVal');
			gstVal = parseFloat(a[i].querySelector('.rowGst').value);
			var productObj = {};
			console.log(productIds);
			productObj["goods_id"] = parseInt(productIds[0].value);
			productObj["goods_gst"] = gstVal;
			productObj["goods_quantity"] = parseFloat(cells[0].value);
			productObj["goods_rate"] = parseFloat(cells[1].value);
			productObj["goods_amount"] = parseFloat(displayCells[0].innerHTML);
			productObj["goods_cgst"] =  parseFloat(displayCells[1].innerHTML);
			productObj["goods_sgst"] =  parseFloat(displayCells[2].innerHTML);
			productObj["goods_igst"] =  parseFloat(displayCells[3].innerHTML);
			productObj["goods_total"] =  parseFloat(displayCells[4].innerHTML);
			allProducts.push(productObj);
         }

         allData['allProducts']  = allProducts

         // get balance cells
		totalCells = document.querySelectorAll('.productTotalSpan');

		// set total
		totalObj["transaction_basic"] = parseFloat(totalCells[0].innerHTML);
		totalObj["transaction_cgst"] = parseFloat(totalCells[1].innerHTML);
		totalObj["transaction_sgst"] = parseFloat(totalCells[2].innerHTML);
		totalObj["transaction_igst"] = parseFloat(totalCells[3].innerHTML);
		totalObj["transaction_expense_cost"] = parseFloat($("#expenseVal").val());
		totalObj["transaction_amount"] = parseFloat(totalCells[4].innerHTML);
      
		 allData['totalObj']  = totalObj;
         console.log(allData);
        // return false;
        
        switch(parseInt($("#invoiceMode").val())) {
     		case 1:
     			//GRN
     			var accName = $("#headName").val();
     			var str = `Are you sure you want to create GRN of amount ${parseFloat(totalObj.transaction_amount)}/- from ${accName} ?`;
     			break;
     		case 2:
     			//STN
     			var stockName = $("#stockVal option:selected").text();
     			var projectName = $("#projectVal").val();
     			var str = `Are you sure you want to create STN from ${stockName} for project ${projectName}`;
     			break;
     		case 3:
     			//SRN
     			var siteName = $("#siteVal").val();
     			var stockName = $("#stockVal option:selected").text();
     			var str = `Are you sure you want to create SRN from ${siteName} to stock ${stockName}`;
     			break;
     		case 4:
     			//PO
     			var accName = $("#headName").val();
     			var str = `Are you sure you want to create PO of amount ${parseFloat(totalObj.transaction_amount)}/- from ${accName} ?`;
     			break;	
     		default:
     			break;	
     	}
     	if(!str){
     		alert("Please try again");
     		return false
     	}else{
     		var checkMode = confirm(str);
     		if(checkMode){
     			 $("#trLoader").show();
     			   $.ajax({
                    type: 'post',
                    url: '/generateInvoice',
                    data: allData,
                    datatype: 'json',
                    success: function (data) {
                        if(data.status == "success"){
                           alert("Success");
                           //location.reload(); 
                           $("#trLoader").hide();
                           $("#invoiceform")[0].reset();
                           $(".inventoryBody > tr").remove();
                           showData(data.newTransaction.id,4);
                        // setTimeout(function(){
                                              
                        //    $("#trLoader").hide();
                        //    alert("Success");
                        //    location.reload();
                            
                        // }, 10000);
                            
                        } else if(data.status == "error"){
                            alert(error);
                            $("#trLoader").hide();
                           
                        } else {
                                $("#trLoader").hide();
                         
                          
                    }
                },
                error: function (data) {
                      $("#trLoader").hide();
                     if(data.status == 401){
                        throwSessionOut();
                      }
                    
                  }
                 });
     		}else{
     			 $("#trLoader").hide();
     			return false;
     		}
     	}
     	

     

     });
     //Form submit ends

	var expenseOptions = {
		url: function(phrase){ return "/getExpenseList"; },
		getValue: function(element){ 
				//console.log(element);
			 
				return element.label; 
		},    
		list: {
				onSelectItemEvent: function() {
								 var element = $("#expenseHeadVal").getSelectedItemData();
									if(element.id){
												$("#expenseId").val(element.id);              	
										}else{
											$("#expenseId").val(0); 											 
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
						data.phrase = $("#expenseHeadVal").val();
						return data;
				},
			requestDelay: 400
		};
		$("#expenseHeadVal").easyAutocomplete(expenseOptions);
	
	var projectOptions = {
		url: function(phrase){ return "/getProjectMaster"; },
		getValue: function(element){ 
				//console.log(element);
			 
				return element.label; 
		},    
		list: {
				onSelectItemEvent: function() {
								 var element = $("#projectVal").getSelectedItemData();
									if(element.id){
												$("#projectId").val(element.id);   
												if($("#invoiceMode").val() > 1 && $("#invoiceMode").val() < 4){
													$("#headId").val(element.project_client);  
													$("#headName").val(element.labelName);     
													$("#accountStateId").val(element.state_id); 
													$("#accountWorkType").val(element.account_work_type);
													//$("#invoiceCategoryText").text(element.account_work_type_text);
													console.log(element.account_category);
													if(element.account_category != 3){
														if($("#accountStateId").val() == $("#companyStateId").val()){
														//alert("Same State");
														$("#invoiceTypeText").text("CGST/SGST");
														$("#gstType").val(1);
														}else{
															//alert("Other State");
															$("#gstType").val(2);
															$("#invoiceTypeText").text("IGST");
														}		
													}else{
														$("#gstType").val(0);
														$("#invoiceTypeText").text("Unregistered");
													} 
												}												

										}else{
											$("#projectId").val(0); 
											if($("#invoiceMode").val() > 1 && $("#invoiceMode").val() < 4){
												$("#headId").val(0);   
												$("#headName").val("");   
												$("#accountStateId").val(0);
												$("#accountWorkType").val(0);	
											}
																					 
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
						data.phrase = $("#projectVal").val();
						return data;
				},
			requestDelay: 400
		};
		$("#projectVal").easyAutocomplete(projectOptions);


	/*var companyOptions = {
		url: function(phrase){ return "/getCompanyMasters"; },
		getValue: function(element){ 
				//console.log(element);
			 
				return element.label; 
		},    
		list: {
				onSelectItemEvent: function() {
								 var element = $("#companyMasterVal").getSelectedItemData();
									if(element.id){
												$("#companyId").val(element.id); 
												$("#companyStateId").val(element.state_id);           	
										}else{
											$("#companyId").val(0); 
											$("#companyStateId").val(0);						 
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
						data.phrase = $("#companyMasterVal").val();
						return data;
				},
			requestDelay: 400
		};
		$("#companyMasterVal").easyAutocomplete(companyOptions);*/

	


	if($('#headVal').length > 0){
	var options = {
		url: function(phrase){ return "/form/headList"; },
		getValue: function(element){ 
				//console.log(element);
			 
				return element.label+" "+element.stateName; 
		},    
		list: {
						onSelectItemEvent: function() {
								 var element = $("#headVal").getSelectedItemData();
									if(element.id){
												$("#headId").val(element.id);  
												$("#headName").val(element.labelName);     
												$("#accountStateId").val(element.state_id); 
												$("#accountWorkType").val(element.account_work_type);
												//$("#invoiceCategoryText").text(element.account_work_type_text);
												console.log(element.account_category);
												if(element.account_category != 3){
													if($("#accountStateId").val() == $("#companyStateId").val()){
													//alert("Same State");
													$("#invoiceTypeText").val("CGST/SGST");
													$("#gstType").val(1);
													}else{
														//alert("Other State");
														$("#gstType").val(2);
														$("#invoiceTypeText").val("IGST");
													}		
												}else{
													$("#gstType").val(0);
													$("#invoiceTypeText").val("Unregistered");
												}
												 updateProductRow();
										}else{
												$("#headId").val(0);   
												$("#headName").val("");   
												$("#accountStateId").val(0);
												$("#accountWorkType").val(0);
												updateProductRow();
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
						data.phrase = $("#headVal").val();

						return data;
				},
			requestDelay: 400
		};
		$("#headVal").easyAutocomplete(options);
		}

		var siteoptions = {
		url: function(phrase){ return "/getSiteList"; },
		getValue: function(element){ 
				//console.log(element);
			 
				return element.label; 
		},    
		list: {
						onSelectItemEvent: function() {
								 var element = $("#siteVal").getSelectedItemData();
									if(element.id){
												$("#siteId").val(element.id);  
										}else{
												$("#siteId").val(0);   
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
						data.phrase = $("#siteVal").val();
						if($("#projectId").val() != ""){
							data.project_id = $("#projectId").val()
						}
						return data;
				},
			requestDelay: 400
		};
		$("#siteVal").easyAutocomplete(siteoptions);

	var
	head = document.head = document.getElementsByTagName('head')[0] || document.documentElement,
	elements = 'article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output picture progress section summary time video x'.split(' '),
	elementsLength = elements.length,
	elementsIndex = 0,
	element;

	while (elementsIndex < elementsLength) {
		element = document.createElement(elements[++elementsIndex]);
	}

	element.innerHTML = 'x<style>' +
		'article,aside,details,figcaption,figure,footer,header,hgroup,nav,section{display:block}' +
		'audio[controls],canvas,video{display:inline-block}' +
		'[hidden],audio{display:none}' +
		'mark{background:#FF0;color:#000}' +
	'</style>';

	return head.insertBefore(element.lastChild, head.firstChild);
})(document);

/* Prototyping
/* ========================================================================== */

(function (window, ElementPrototype, ArrayPrototype, polyfill) {
	function NodeList() { [polyfill] }
	NodeList.prototype.length = ArrayPrototype.length;

	ElementPrototype.matchesSelector = ElementPrototype.matchesSelector ||
	ElementPrototype.mozMatchesSelector ||
	ElementPrototype.msMatchesSelector ||
	ElementPrototype.oMatchesSelector ||
	ElementPrototype.webkitMatchesSelector ||
	function matchesSelector(selector) {
		return ArrayPrototype.indexOf.call(this.parentNode.querySelectorAll(selector), this) > -1;
	};

	ElementPrototype.ancestorQuerySelectorAll = ElementPrototype.ancestorQuerySelectorAll ||
	ElementPrototype.mozAncestorQuerySelectorAll ||
	ElementPrototype.msAncestorQuerySelectorAll ||
	ElementPrototype.oAncestorQuerySelectorAll ||
	ElementPrototype.webkitAncestorQuerySelectorAll ||
	function ancestorQuerySelectorAll(selector) {
		for (var cite = this, newNodeList = new NodeList; cite = cite.parentElement;) {
			if (cite.matchesSelector(selector)) ArrayPrototype.push.call(newNodeList, cite);
		}

		return newNodeList;
	};

	ElementPrototype.ancestorQuerySelector = ElementPrototype.ancestorQuerySelector ||
	ElementPrototype.mozAncestorQuerySelector ||
	ElementPrototype.msAncestorQuerySelector ||
	ElementPrototype.oAncestorQuerySelector ||
	ElementPrototype.webkitAncestorQuerySelector ||
	function ancestorQuerySelector(selector) {
		return this.ancestorQuerySelectorAll(selector)[0] || null;
	};
})(this, Element.prototype, Array.prototype);
/* Calculation functions 
/* ========================================================================== */
function changeWorkType(obj){
	//alert($(obj).val());
	if($("#accountWorkType").val() != ""){
			if($("#accountWorkType").val().indexOf($(obj).val()) == -1){
				alert("Sorry this account does not have this criteria");
				$(obj).prop('selectedIndex',0);
				return false;
			}
	}
}

/* Helper Functions
/* ========================================================================== */


function generateTableRow() {
	var emptyColumn = document.createElement('tr');
	//var rowsCount = document.querySelector('table.inventory tbody').getElementsByTagName("tr").length+1;
	var totalCount = $("#totalRows").val();
	var rowsCount = parseInt(totalCount)+1;
	emptyColumn.innerHTML = '<td class="td-easy"><a class="cut">-</a><input class="product-easy product-name" type="text" value="" id="productId-'+rowsCount+'"/><input type="hidden" id="productIdVal-'+rowsCount+'" value="" class="productIdVal" /> </td>' +
		'<td><span id="productIdHsn-'+rowsCount+'">-</span></td>'+
		'<td><span id="productIdUom-'+rowsCount+'">-</span></td>' +
		'<td><span class="gstGstSpan" id="productIdGst-'+rowsCount+'"></span><input type="hidden" name="" value="" id="productIdGstValue-'+rowsCount+'" class="rowGst" /></td>' +
		'<td><input size="14" class="productCell" id="productIdQty-'+rowsCount+'" onchange="updateProductRow()" onkeydown="updateProductRow()" type="text" value="0" /></td>' +
		'<td><input size="14" class="productCell" id="productIdRate-'+rowsCount+'" onchange="updateProductRow()" onkeydown="updateProductRow()" type="text" value="0" /></td>' +
		'<td><span data-prefix>&#8377;</span><span class="productPriceSpan" id="productIdAmount-'+rowsCount+'">-</span></td>' +
		'<td><span data-prefix>&#8377;</span><span class="productPriceSpan" id="productIdCGST-'+rowsCount+'">0.00</span></td>' +
		'<td><span data-prefix>&#8377;</span><span class="productPriceSpan" id="productIdSGST-'+rowsCount+'">0.00</span></td>' +
		'<td><span data-prefix>&#8377;</span><span class="productPriceSpan" id="productIdIGST-'+rowsCount+'">0</span></td>'+
		'<td><span data-prefix>&#8377;</span><span class="productPriceSpan" id="productIdTotal-'+rowsCount+'">0</span></td>';

	$("#totalRows").val(rowsCount);
	return emptyColumn;
}
function updateExpense(obj){
	var expenseTotal = parseFloat($(obj).val());
	var cells = document.querySelectorAll('.productTotalSpan');
			
		var total = 0;
	if(expenseTotal != "" || expenseTotal != 0){
		
		for(var i=0;i<= cells.length-1;i++){
			console.log(cells[0]);
			console.log(cells[i]);
			if( i != 4){

				var taxTotal = parseFloat(cells[i].innerHTML); 
				console.log("ppp"+taxTotal);
				total += taxTotal
			}
		}
		total += expenseTotal;
		cells[4].innerHTML = roundToFixed(total);
	}else{
		for(var i=0;i<= cells.length-1;i++){
			console.log(cells[0]);
			console.log(cells[i]);
			if( i != 4){

				var taxTotal = parseFloat(cells[i].innerHTML); 
				console.log("ppp"+taxTotal);
				total += taxTotal
			}
		}
		cells[4].innerHTML = roundToFixed(total);
	}
	

}

function updateProductRow(){
	var total = 0;
	var taxTotal = 0;
	var cgstTotal = 0;
	var sgstTotal = 0;
	var igstTotal = 0;
	
	var cells, displayCells, price, total, a, i,gstVal;

	// update inventory cells
	// ======================
	var gstType = $("#gstType").val();

	for (var a = document.querySelectorAll('table.inventory tbody tr'), i = 0; a[i]; ++i) {
		// get inventory row cells
		cells = a[i].querySelectorAll('.productCell');
		displayCells = a[i].querySelectorAll('.productPriceSpan');
		gstVal = parseFloat(a[i].querySelector('.rowGst').value);
		//console.log(cells);
		// set price as cell[2] * cell[3]
		price = parseFloat(cells[0].value) * parseFloat(cells[1].value);
		//console.log(price);

		

		// set row total
		displayCells[0].innerHTML = price;


		if(gstType == 1){
			//CGST/SGST
			var gst_tax = parseFloat(price*(gstVal/100)/2);
			var rowTotal = parseFloat(price+ gst_tax+ gst_tax);			
			cgstTotal += gst_tax;
			sgstTotal += gst_tax;
			igstTotal += 0;
			displayCells[1].innerHTML = roundToFixed(gst_tax);
			displayCells[2].innerHTML = roundToFixed(gst_tax);
			displayCells[3].innerHTML = 0;
			displayCells[4].innerHTML = roundToFixed(rowTotal);

		}else if(gstType == 2){
			//IGST
			var gst_tax = parseFloat(price*(gstVal/100));
			var rowTotal = parseFloat(price + gst_tax);
			cgstTotal += 0;
			sgstTotal += 0;
			igstTotal += gst_tax;
			displayCells[1].innerHTML = 0;
			displayCells[2].innerHTML = 0;
			displayCells[3].innerHTML = roundToFixed(gst_tax);
			displayCells[4].innerHTML = roundToFixed(rowTotal);
		}else{
			//Non registered
			
			var rowTotal = parseFloat(price);
			console.log("Here We go--",displayCells);
			cgstTotal += 0;
			sgstTotal += 0;
			igstTotal += 0; 
			displayCells[1].innerHTML = 0;
			displayCells[2].innerHTML = 0;
			displayCells[3].innerHTML = 0;
			displayCells[4].innerHTML = roundToFixed(rowTotal);

		}

		// add price to total
		total += price;
		taxTotal += rowTotal;

		//console.log(total);

	}


		// update balance cells
	// ====================

	// get balance cells
	cells = document.querySelectorAll('.productTotalSpan');

	// set total
	cells[0].innerHTML = roundToFixed(total);
	cells[1].innerHTML = roundToFixed(cgstTotal);
	cells[2].innerHTML = roundToFixed(sgstTotal);
	cells[3].innerHTML = roundToFixed(igstTotal);
	cells[4].innerHTML = roundToFixed(taxTotal);



}

function roundToFixed(val){
	var newVal = parseFloat(Math.round(val));
	return newVal.toFixed(2);
}

function parseFloatHTML(element) {
	return parseFloat(element.innerHTML.replace(/[^\d\.\-]+/g, '')) || 0;
}

function parsePrice(number) {
	return number.toFixed(2).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1,');
}

/* Update Number
/* ========================================================================== */

function updateNumber(e) {
	var
	activeElement = document.activeElement,
	value = parseFloat(activeElement.innerHTML),
	wasPrice = activeElement.innerHTML == parsePrice(parseFloatHTML(activeElement));

	if (!isNaN(value) && (e.keyCode == 38 || e.keyCode == 40 || e.wheelDeltaY)) {
		e.preventDefault();

		value += e.keyCode == 38 ? 1 : e.keyCode == 40 ? -1 : Math.round(e.wheelDelta * 0.025);
		value = Math.max(value, 0);

		activeElement.innerHTML = wasPrice ? parsePrice(value) : value;
	}

	//updateInvoice();
}

/* Update Invoice
/* ========================================================================== */

function updateInvoice() {
	var total = 0;
	var cells, price, total, a, i;

	// update inventory cells
	// ======================

	for (var a = document.querySelectorAll('table.inventory tbody tr'), i = 0; a[i]; ++i) {
		// get inventory row cells
		cells = a[i].querySelectorAll('span:last-child');

		// set price as cell[2] * cell[3]
		price = parseFloatHTML(cells[2]) * parseFloatHTML(cells[3]);

		// add price to total
		total += price;

		// set row total
		cells[4].innerHTML = price;
	}

	// update balance cells
	// ====================

	// get balance cells
	cells = document.querySelectorAll('table.balance td:last-child span:last-child');

	// set total
	cells[0].innerHTML = total;

	// set balance and meta balance
	cells[2].innerHTML = document.querySelector('table.meta tr:last-child td:last-child span:last-child').innerHTML = parsePrice(total - parseFloatHTML(cells[1]));

	// update prefix formatting
	// ========================

	//var prefix = document.querySelector('#prefix').innerHTML;
	//for (a = document.querySelectorAll('[data-prefix]'), i = 0; a[i]; ++i) a[i].innerHTML = prefix;

	// update price formatting
	// =======================

	for (a = document.querySelectorAll('span[data-prefix] + span'), i = 0; a[i]; ++i) if (document.activeElement != a[i]) a[i].innerHTML = parsePrice(parseFloatHTML(a[i]));
}
function checkFinancialYear(checkDay){

		$("#trLoader").show();
		var allData = {mode:$("#invoiceMode").val(),checkDate:checkDay,pageMode:$("#pageMode").val()}	
		  $.ajax({
                    type: 'GET',
                    url: '/getSerialNumber',
                    data: allData,
                    datatype: 'json',
                    success: function (data) {
                        if(data.status == "success"){
                          // / alert("Success");
                          $("#inv_no").text(data.printSerialNo); 
                          $("#serialNo").val(data.serialNo);
                           $("#trLoader").hide();	
                        } else if(data.status == "error"){
                            alert(error);
                            $("#trLoader").hide();
                           
                        } else {
                                $("#trLoader").hide();                       
                          
                    }
                },
                error: function (data) {
                      $("#trLoader").hide();
                     if(data.status == 401){
                        throwSessionOut();
                      }                    
                  }
                 });



		


	}
/* On Content Load
/* ========================================================================== */

function onContentLoad() {
	 //updateInvoice();
	 //Invoice Date
	 if($('#txn_date').length > 0){
	 	 $('#txn_date').datepicker({ format : 'dd/mm/yyyy', autoclose: true }); 
	 	 $('#txn_date').datepicker('update', new Date());
	 }
	

	 //GRN/STN Date
	 $('#mode_date').datepicker({ format : 'dd/mm/yyyy' ,autoclose: true}).on('changeDate', function (ev) {
	 		// /alert(111);
		   checkFinancialYear($('#mode_date').val());
	 });

	//$('#mode_date').datepicker()
	$('#mode_date').datepicker('update', new Date())

	 //checkFinancialYear($('#mode_date').val());

	 // alert(1);
	var
	input = document.querySelector('input'),
	image = document.querySelector('img');

	function onClick(e) {
		var element = e.target.querySelector('[contenteditable]'), row;

		element && e.target != document.documentElement && e.target != document.body && element.focus();
		
		if (e.target.matchesSelector('.add')) {
			if($("#invoiceTypeText").val() === ""){
				alert("Please fill above things properly");
				return false;
			}
			document.querySelector('table.inventory tbody').appendChild(generateTableRow());
			//var rowsCount = document.querySelector('table.inventory tbody').getElementsByTagName("tr").length;
			//console.log(rowsCount);
			var rowsCount = parseInt($("#totalRows").val());
			var productOptions = {
					url: function(phrase){ return "/getProductList"; },
					getValue: function(element){ 
							//console.log(element);
						
							return element.label; 
					},    
					list: {
						onSelectItemEvent: function() {
								 var element = $("#productId-"+rowsCount).getSelectedItemData();
									if(element.id){

										$("#productIdVal-"+rowsCount).val(element.id);
										$("#productIdHsn-"+rowsCount).text(element.goods_hsn);
										$("#productIdUom-"+rowsCount).text(element.goods_uom);
										$("#productIdGst-"+rowsCount).text(element.goods_gst+"%");
										$("#productIdGstValue-"+rowsCount).val(element.goods_gst);
										if(element.goods_balance){

										 $("#productIdQty-"+rowsCount).val(element.goods_balance);
										 $("#productIdQty-"+rowsCount).attr("max",element.goods_balance);
										 $("#productIdRate-"+rowsCount).val(element.goods_outrate);
										 $("#productIdRate-"+rowsCount).attr("readonly","true");
										}
										// updateProductRow();
										
	
										}else{
										$("#productIdVal-"+rowsCount).val(element.id);
										$("#productIdHsn-"+rowsCount).text("-");
										$("#productIdUom-"+rowsCount).text("-");	
										$("#productIdGst-"+rowsCount).text("-");
										//$("#productIdGstValue-"+rowsCount).val(0);
										// $("#productIdQty-"+rowsCount).val(0);
										// $("#productIdRate-"+rowsCount).val(0);
										// updateProductRow();
											//	$("#headId").val(0);   
											//	$("#headName").val("");  
										//		$( "#btnSubmit" ).prop( "disabled", true ); 
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
						if($("#stockVal").length > 0){
							data.site_id = $("#stockVal").val();
						}
						data.phrase = $("#productId-"+rowsCount).val();
						return data;
				},
			requestDelay: 400
		};
		$("#productId-"+rowsCount).easyAutocomplete(productOptions);
		console.log($("#productId-"+rowsCount).length);
		}
		else if (e.target.className == 'cut') {
			row = e.target.ancestorQuerySelector('tr');
			row.parentNode.removeChild(row);
			var rowsCount = document.querySelector('table.inventory tbody').getElementsByTagName("tr").length;
			console.log(rowsCount);
			updateProductRow();
		}

		//updateInvoice();
	}

	function onEnterCancel(e) {
		e.preventDefault();

		image.classList.add('hover');
	}

	function onLeaveCancel(e) {
		e.preventDefault();

		image.classList.remove('hover');
	}

	function onFileInput(e) {
		image.classList.remove('hover');

		var
		reader = new FileReader(),
		files = e.dataTransfer ? e.dataTransfer.files : e.target.files,
		i = 0;

		reader.onload = onFileLoad;

		while (files[i]) reader.readAsDataURL(files[i++]);
	}

	function onFileLoad(e) {
		var data = e.target.result;

		image.src = data;
	}

	if (window.addEventListener) {
		document.addEventListener('click', onClick);

		document.addEventListener('mousewheel', updateNumber);
		document.addEventListener('keydown', updateNumber);

		// document.addEventListener('keydown', updateInvoice);
		// document.addEventListener('keyup', updateInvoice);

		input.addEventListener('focus', onEnterCancel);
		input.addEventListener('mouseover', onEnterCancel);
		input.addEventListener('dragover', onEnterCancel);
		input.addEventListener('dragenter', onEnterCancel);

		input.addEventListener('blur', onLeaveCancel);
		input.addEventListener('dragleave', onLeaveCancel);
		input.addEventListener('mouseout', onLeaveCancel);

		input.addEventListener('drop', onFileInput);
		input.addEventListener('change', onFileInput);
	}
}

window.addEventListener && document.addEventListener('DOMContentLoaded', onContentLoad);