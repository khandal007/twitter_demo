(function (document) {
	// if($('.stockVal').length > 0){
	// 	$('.stockVal').select2();
	// }

	$("#siteVal").select2();
	
	if($("#transaction_po").length > 0){
		$("#transaction_po").change(function(e){
			let pageURL = $(location).attr("href");
			let po_id = $(this).val();
			location.replace(pageURL+"&po_id="+po_id);
			
		})
	}	

	if($("#stockSiteMode").length > 0){
		$("#stockSiteMode").change(function(e){
			if($(this).val() != ""){
				$("#siteVal").attr("disabled",false);
				if($(this).val() == 1){
					$("#siteVal").next(".select2-container").hide();
				
					$("#siteStockVal").show();
					$("#siteStockVal").prop("required",true);					
					$("#siteVal").prop("required",false);
				}else{
					$("#siteStockVal").hide();
					
					$("#siteVal").next(".select2-container").show();
					$("#siteVal").prop("required",true);										
					$("#siteStockVal").prop("required",false);
				}
				  doAjaxCall('/servicetype',{value:$(this).val(),mode:$("#invoiceMode").val()},"GET",false,'',function(data,type){
										            if(type == 1){
										              //  $("#prevHeadsDiv").show();
										             
										                    var str = "<option value=''> Select Head</option>";
										                    data.rows.map(function(res){
										                    str =`${str}<option value="${res.id}">${res.account_name} (${res.balance})</option>`;
										                    });
										                    $("#drHeadVal").html(str);
										                    changeAllCostCenters();
										            }else{
										               // $("#prevHeadsDiv").hide();
										            }
								});
			}else{
				$("#siteVal").attr("disabled",true);
			}
			
		})
	}

	

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
         //console.log(formData);
          var sel = $('.invCat:checked').map(function(_, el) {
                return $(el).val();
            }).get();
         formData.map(function(d){
         	allData['formData'][d.name] = d.value;
         })
         allData['formData']['invCategory'] = sel;
         allData['_csrf'] = $("#_csrf").val();
         
              
         var cells, displayCells,productIds, totalCells, a, i,gstVal;
         var allProducts = [];
         var totalObj = {};

         for (var a = document.querySelectorAll('table.inventory tbody tr'), i = 0; a[i]; ++i) {
         	cells = a[i].querySelectorAll('.productCell');
			displayCells = a[i].querySelectorAll('.productPriceSpan');
			productIds = a[i].querySelectorAll('.productIdVal');
			gstVal = parseFloat(a[i].querySelector('.rowGst').value);			
			goodSiteVal = parseInt(a[i].querySelector('.goodSite').value);

			var productObj = {};
			//console.log(productIds);
			var billBack = 0;
			
			if(displayCells[6].checked == true){
				billBack = 1;
			}
			productObj["goods_id"] = parseInt(productIds[0].value);		
			productObj["service_cycle"] = displayCells[5].value;
			productObj["goods_billback"] = billBack;	
			productObj["site_id"] = goodSiteVal;
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
		// if($("#gstType").val() == 1){
		// 		totalObj['tax_cgst'] = $("#tax_cgst").val();
		// 		totalObj['tax_sgst'] = $("#tax_sgst").val();

		// }else if($("#gstType").val() == 2){
		// 		totalObj['tax_igst'] = $("#tax_igst").val();
		// }else{

		// }



		totalObj["transaction_expense_cost"] = parseFloat($("#expenseVal").val());
		totalObj["transaction_amount"] = parseFloat(totalCells[4].innerHTML);
		totalObj["transaction_roundoff"] = parseFloat(totalCells[5].innerHTML);
		var totalSelected = parseFloat($("#totalInvAmount").val());
		console.log(totalSelected);
		console.log(totalObj["transaction_amount"]);
      	if(totalSelected != totalObj["transaction_amount"]){
				alert("Sorry value mismatch");
				return false;
			}
		 if(totalObj["transaction_roundoff"] != 0 ){
		 	if($("#round_off").val() == ""){
		 		alert("Please choose round off");
		 		return false;
		 	}
		 }
			 
		 if(totalObj["transaction_expense_cost"] > 0 ){
		 	if($("#expenseHeadVal").val() == ""){
		 		alert("Please choose expense");
		 		return false;
		 	}
		 }	
		 allData['totalObj']  = totalObj;
         console.log(allData);
        // return false;
        
        switch(parseInt($("#invoiceMode").val())) {
     		case 1:
     			//GRN
     			var accName = $("#headName").val();
     			var str = `Are you sure you want to create GRN of amount ${parseFloat(totalObj.transaction_amount)}/- from ${accName} ?`;
     			if($(".invCat:checked").length <= 0){
     				alert("Please choose Category");
     				return false;
     			}
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
     			var str = `Are you sure you want to create PO of amount ${parseFloat(totalObj.transaction_amount)}/- for ${accName} ?`;
     			if($(".invCat:checked").length <= 0){
     				alert("Please choose Category");
     				return false;
     			}
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
                           showTransactionData(data.newTransaction.id,"sidenavcontent");
                           //showData(data.newTransaction.id,4);
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
								 console.log(element);
									if(element.id){
												$("#expenseId").val(element.id);   
												$("#expenseHeadId").val(element.headid);           	
										}else{
											$("#expenseId").val(0);
											$("#expenseHeadId").val(0);
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
		//$("#expenseHeadVal").easyAutocomplete(expenseOptions);



	
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

												  doAjaxCall('/getSiteListByProject',{project_id:element.id},"GET",false,'',function(data,type){
										            if(type == 1){
										              //  $("#prevHeadsDiv").show();
										             
										                    var str = "<option value=''> Select Costcenter</option>";
										                    data.costcenters.map(function(res){
										                    str =`${str}<option value="${res.id}">${res.site_name}(${res.site_reference})</option>`;
										                    });
										                    $("#siteVal").html(str);
										                
										            }else{
										               // $("#prevHeadsDiv").hide();
										            }
										        });
												if($("#invoiceMode").val() == 2 || $("#invoiceMode").val() == 3){
													//$("#headId").val(element.project_client);  
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
											if($("#invoiceMode").val() != 1){
												//$("#headId").val(0);   
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
	//	$("#projectVal").easyAutocomplete(projectOptions);


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
		url: function(phrase){ return "/form/headList" },
		getValue: function(element){ 
				console.log(element);
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
//												console.log(element.account_category);
												if($("#invoiceMode").val() == 1){
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
												
												 updateProductRow();
										}else{
												$("#headId").val(0);   
												$("#headName").val("");   
												$("#accountStateId").val(0);
												$("#accountWorkType").val(0);
												updateProductRow();
										}
								//console.log("click hone ke bad",);
								onchangetocheckinvoice('GRN');
						}, 	
						onChooseEvent: function() {
							var element = $("#headVal").getSelectedItemData();
							//console.log("Here");
							//console.log(element);
							  onchangetocheckinvoice('GRN');
							  doAjaxCall('/getAccountPO',{account_id:element.id},"GET",false,'',function(data,type){
					            if(type == 1){
					              //  $("#prevHeadsDiv").show();
					             
					                    var str = "<option value=''> Select PO</option>";
					                    data.allPoIds.map(function(res){
					                    str =`${str}<option value="${res.id}" data-podate="${res.transaction_for_date}">${res.transaction_uid}</option>`;
					                    });
					                    $("#transaction_po").html(str);
					                
					            }else{
					               // $("#prevHeadsDiv").hide();
					            }
					        });
						} 
				},        
				ajaxSettings: {
						dataType: "json",
						method: "GET",
						data: { dataType: "json" }
				},
				preparePostData: function(data) {
						data.phrase = $("#headVal").val();
						data.forInvoice = 1;
						var typeList = $("#crType").val();	
						if(typeList != ""){
							data.accountType = typeList;
						}
						return data;
				},
			requestDelay: 400
		};

		$("#headVal").easyAutocomplete(options);
		}

		// var siteoptions = {
		// url: function(phrase){ return "/getSiteList"; },
		// getValue: function(element){ 
		// 		//console.log(element);
			 
		// 		return element.label; 
		// },    
		// list: {
		// 				onSelectItemEvent: function() {
		// 						 var element = $("#siteVal").getSelectedItemData();
		// 							if(element.id){
		// 										$("#siteId").val(element.id);  
		// 								}else{
		// 										$("#siteId").val(0);   
		// 								}
		// 						//console.log("click hone ke bad",);
		// 				}
		// 		},        
		// 		ajaxSettings: {
		// 				dataType: "json",
		// 				method: "GET",
		// 				data: { dataType: "json" }
		// 		},
		// 		preparePostData: function(data) {
		// 				data.phrase = $("#siteVal").val();
		// 				if($("#projectId").val() != ""){
		// 					data.project_id = $("#projectId").val()
		// 				}
		// 				return data;
		// 		},
		// 	requestDelay: 400
		// };
		// $("#siteVal").easyAutocomplete(siteoptions);

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

//Expense Change option
function getExpenseHead(obj){
	var val = $(obj).val();
	if(val != ""){
		$("#expenseId").val(val);
		$("#expenseHeadId").val($('option:selected', obj).attr('data-head'));
	}else{
		$("#expenseId").val(0);
		$("#expenseHeadId").val(0);
	}
}

//Dr Head change function
function getExpense(obj){
	var val = $(obj).val();
	if(val != ""){
		doAjaxCall('/getExpenseCategories',{head_id:val},"GET",false,'',function(data,type){
				console.log(data);	
			var str = "<option value=''> Select Expense Category</option>";
			if(data.expenses.length > 0){
				data.expenses.map(function(res){
				 str =`${str}<option value="${res.id}">${res.expense_name}</option>`;
				});
			}
			 
			$("#expenseCat").html(str);	
			$("#expenseCat").select2();	
		})
	}else{
		$("#expenseCat").empty();
	}
}

//Project change function
function getProjectSites(obj){
	var val = $(obj).val();
					if(val != ""){
		 						doAjaxCall('/getSiteListByProject',{project_id:val},"GET",false,'',function(data,type){
										            if(type == 1){
										              //  $("#prevHeadsDiv").show();
										             
										                    var str = "<option value=''> Select Costcenter</option>";
										                    data.costcenters.map(function(res){
										                    str =`${str}<option value="${res.id}">${res.site_name}(${res.site_reference})</option>`;
										                    });
										                    $("#siteVal").html(str);
										                
										            }else{
										               // $("#prevHeadsDiv").hide();
										            }
										        });
												if($("#invoiceMode").val() == 2 || $("#invoiceMode").val() == 3){
													//$("#headId").val(element.project_client);  
													//$("#headName").val(element.labelName);     
													$("#accountStateId").val($(obj).attr('data-state')); 
													$("#accountWorkType").val($(obj).attr('data-worktype'));
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
									$("#accountStateId").val(0); 
									$("#accountWorkType").val("");
									$("#gstType").val(0);
									$("#invoiceTypeText").text("Unregistered");
								}
	changeAllCostCenters();
}

/* Helper Functions
/* ========================================================================== */


function generateTableRow() {
	var emptyColumn = document.createElement('tr');
	//var rowsCount = document.querySelector('table.inventory tbody').getElementsByTagName("tr").length+1;
	var totalCount = $("#totalRows").val();
	var rowsCount = parseInt(totalCount)+1;
	emptyColumn.innerHTML = '<td class="td-easy"><a class="cut">-</a> <select><option value="">Category</option></select></td>' +
		'<input class="product-easy product-name" type="text" value="" id="productId-'+rowsCount+'"/><input type="hidden" id="productIdVal-'+rowsCount+'" value="" class="productIdVal" />'+
		'<td><span id="productIdHsn-'+rowsCount+'">-</span></td>'+
		'<td><span id="productIdUom-'+rowsCount+'">-</span></td>' +
		'<td><span class="gstGstSpan" id="productIdGst-'+rowsCount+'"></span><input type="hidden" name="" value="" id="productIdGstValue-'+rowsCount+'" class="rowGst" /></td>' +
		'<td><input maxlength="8" class="productCell" id="productIdQty-'+rowsCount+'" onchange="updateProductRow(event)" onkeyup="updateProductRow(event)" type="text" value="0" /></td>' +
		'<td><input maxlength="8" class="productCell" id="productIdRate-'+rowsCount+'" onchange="updateProductRow(event)" onkeyup="updateProductRow(event)" type="text" value="0" /></td>' +
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

function updateProductRow(event, data, roundType){
	 //$(this).val($(this).val().replace(/[^0-9\.]/g,''));
	 if(event){
	 	    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
	 }
	var total = 0;
	var taxTotal = 0;
	var cgstTotal = 0;
	var sgstTotal = 0;
	var igstTotal = 0;
	var roundTotal = 0;
	
	var cells, displayCells, expenseCell,price, total, a, id,gstVal;
	var expenseVal = 0.0;
	var expenseGST = 0.0;
	var checklength = 0;
	expenseCell = document.querySelectorAll('.expenseCell')
	if (expenseCell[1].checked == false) {
    	checklength = 0;
	} else {
	    checklength = 1;
	}
	//expenseCell = document.querySelectorAll('.expenseCell')

	// update inventory cells
	// ======================
	var gstType = $("#gstType").val();
	var expenseGstRate = $("#expenseHeadTax").val();
	if($("#expenseVal").length > 0){
			var calVal = 0;
			if(expenseCell[0].value != ""){
				expenseVal = parseFloat(expenseCell[0].value);
				if(!isNaN(expenseVal)){
				var taxExp = expenseCell[1].value;

				if(checklength == 1){
						if(!expenseGstRate){
							alert("Please choose GST percentage for this operation");
							return false;
						}

						if(gstType == 1){
						expenseGST = expenseVal * ((expenseGstRate/2)/100);						
						}else if(gstType == 2){
						expenseGST = expenseVal * (expenseGstRate/100);		
						}else{
						expenseGST = 0;	
						}
					}else{
						expenseGST = 0;
					}
				}
			}else{
				expenseVal = 0;
				expenseGST = 0;
			}
		}

	for (var a = document.querySelectorAll('table.inventory tbody tr'), i = 0; a[i]; ++i) {
		// get inventory row cells
		cells = a[i].querySelectorAll('.productCell');
		displayCells = a[i].querySelectorAll('.productPriceSpan');
		gstVal = parseFloat(a[i].querySelector('.rowGst').value);
		price = parseFloat(cells[0].value) * parseFloat(cells[1].value);
		if(data){
				var maxvalue = parseFloat($(data).attr('max'));

				//checking for the maximum value
				if(cells[0].value>maxvalue){
					alert('Quantity must not be greater than ' + maxvalue);
					$(data).val(maxvalue);
					event.preventDefault();
				}
		}
		

		// set row total
		displayCells[0].innerHTML = roundToFixed(price);

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
			//console.log("Here We go--",displayCells);
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
	}
	//total = total;
	if(gstType == 1){
		cgstTotal += expenseGST;
		sgstTotal += expenseGST;
	}else if(gstType == 2){
		igstTotal += expenseGST;
	}else{

	}
	
	taxTotal = parseFloat(roundToFixed(total))+parseFloat(roundToFixed(cgstTotal))+parseFloat(roundToFixed(sgstTotal))+parseFloat(roundToFixed(igstTotal))+parseFloat(roundToFixed(expenseVal));

	console.log(taxTotal);
		// update balance cells
	// ====================

	// get balance cells
	cells = document.querySelectorAll('.productTotalSpan');

	// set total
	cells[0].innerHTML = roundToFixed(total);
	cells[1].innerHTML = roundToFixed(cgstTotal);
	cells[2].innerHTML = roundToFixed(sgstTotal);
	cells[3].innerHTML = roundToFixed(igstTotal);
	var totalInvoiceAmount = $("#totalInvAmount");
	var oldTotal = taxTotal;
	if(roundType){
		switch(roundType){
			case 1:
					
					cells[4].innerHTML = roundToFixed(taxTotal,1);
					totalInvoiceAmount.val(roundToFixed(taxTotal,1));
					roundTotal = Math.ceil(oldTotal) - oldTotal;
					cells[5].innerHTML = roundToFixed(roundTotal);
					break;
			case 2: 
					cells[4].innerHTML = roundToFixed(taxTotal,2);
					totalInvoiceAmount.val(roundToFixed(taxTotal,2));
					roundTotal = Math.floor(oldTotal) - oldTotal;
					cells[5].innerHTML = roundToFixed(roundTotal);
					break;
			default:
					break;				
		}
	}else{
		cells[5].innerHTML = roundToFixed(0);
		cells[4].innerHTML = roundToFixed(taxTotal);
		totalInvoiceAmount.val(roundToFixed(taxTotal));
	}
}

function roundToFixed(val,type){
	if(type){
		if(type == 1){
			val =Math.ceil(val);
		}else{
			val =Math.floor(val);
		}
	}
	var newVal = parseFloat(val);
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
	 if($('#inv_date').length > 0){
	 	 $('#inv_date').datepicker({ format : 'dd/mm/yyyy', autoclose: true }); 
	 	 $('#inv_date').datepicker('update', new Date());
	 } 
	 if($('#challan_date').length > 0){
	 	 $('#challan_date').datepicker({ format : 'dd/mm/yyyy', autoclose: true }); 
	 	// $('#challan_date').datepicker('update', new Date());
	 }
	 if($('#gate_date').length > 0){
	 	 $('#gate_date').datepicker({ format : 'dd/mm/yyyy', autoclose: true }); 
	 	 //$('#gate_date').datepicker('update', new Date());
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
		//document.addEventListener('click', onClick);

		//document.addEventListener('mousewheel', updateNumber);
		//document.addEventListener('keydown', updateNumber);

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

	setTimeout(function(){ 
		var container = document.getElementById("mainInvoice");
		if($("#editMode").val() > 0){
			html2canvas(container,{allowTaint : true}).then(function(canvas) {
			$("#editLogs").val(canvas.toDataURL("image/jpeg"));
			// var link = document.createElement("a");
			// document.body.appendChild(link);
			// link.download = "html_image.jpg";
			// link.href = canvas.toDataURL("image/jpeg");
			// link.target = '_blank';
			// link.click();
			});
		}
		
			// html2canvas(document.querySelector("#mainInvoice")).then(canvas => {
			//     	document.body.appendChild(canvas)
			// 	});
	 }, 1000);
}

window.addEventListener && document.addEventListener('DOMContentLoaded', onContentLoad);

function bringitems(count){
var idofcat = $("#catselect_"+count + " " + "option:selected").val();
var url = '';
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

$(document).on('keydown', function ( e ) {

    // You may replace `c` with whatever key you want
    //console.log(e.keyCode);
    //if ((e.metaKey || e.ctrlKey) && ( String.fromCharCode(e.which).toLowerCase() === 'c') )
    if ((e.metaKey || e.ctrlKey) && ( e.keyCode == 32) ) {
    	e.preventDefault();
    	generateTableRow2();
    } else if((e.metaKey || e.ctrlKey) && ( String.fromCharCode(e.which).toLowerCase() === 's')){
    	e.preventDefault();
    	$("#invoiceform").submit();
        //console.log( "You pressed CTRL + R" );

    }else if((e.metaKey || e.ctrlKey) && ( String.fromCharCode(e.which).toLowerCase() === 'g')){
   		e.preventDefault();
   		addGoodsMaster(-1);
    }else{
    	return true;
    }
});

function rounding(e,id){
	if(id=="roundup"){
    	updateProductRow(e,this,1);
	}
	else if(id=="rounddown"){
    	updateProductRow(e,this,2);
	}
	else{
    	updateProductRow();
	}
}


function generateTableRow2(){
  var totalCount = $("#totalRows2").val();
  var rowsCount = parseInt(totalCount)+1;
  var projectId = $("#projectId").val();
  var data = {rowsCount:rowsCount,project_id:(projectId)?projectId:null};
  doAjaxHTMLCall('/invoice/getgoods',data,"GET",true,'loaderOverlay',function(data){
      var emptyColumn = document.createElement('tr');
      emptyColumn.innerHTML = data;
      $("#totalRows2").val(rowsCount);
      document.querySelector('table.inventory tbody').appendChild(emptyColumn);
    initializeGoods(rowsCount);	
	changeAllCostCenters();
  //   alert(1);
		// var mode = $("#stockSiteMode").val();
		// if(mode == 1){
		// 	var $options = $("#siteVal > option").clone();
		// }else{
		// 	var $options = $("#siteStockVal > option").clone();
		// }
		// console.log($options);
  //   	$('#catselect_'+rowsCount).append($options);
  //   	alert(2);
  });
}

function changeAllCostCenters(){
		//var cells;
		var mode = $("#stockSiteMode").val();
		if(mode == 2){
			var options = $("#siteVal > option").clone();
			var selected = $("#siteVal").val();
		}else{
			var options = $("#siteStockVal > option").clone();
			var selected = $("#siteStockVal").val();
		}

		for (var a = document.querySelectorAll('table.inventory tbody tr'), i = 0; a[i]; ++i) {
		//var cells;
		// get inventory row cells
		var cells = a[i].querySelector('.goodSite');
		var dataselected = cells.getAttribute('data-id');
		
		//$(cells).find('option').remove();
		if(removeOptions(cells)){
			// console.log('there');
			// console.log("cells 1",cells);
			// console.log(options);
			//$(cells).append(options);
			options.map(function(it,d){
				//console.log(d);
				var option = document.createElement("option");
				option.text = d.text;
				option.value = d.value;
				if(selected == d.value){
					option.selected = true;
				}

				if(dataselected == d.value){
					option.selected = true;	
				}

				cells.add(option);
			})
			//console.log("cells 2",cells);
			//console.log('everywhere');
		}
					  //  .val('whatever')
		//console.log(11)
		//cells = null;
		
	}
}

function removeOptions(selectbox)
{
    var i;

    for(i = selectbox.options.length - 1 ; i >= 0 ; i--)
    {
    	//console.log("here")	
        selectbox.remove(i);
    }
    return true;
}


function initializeGoods(rowsCount){
	  var productOptions = {
					url: function(phrase){ return "/getProductList"; },
					getValue: function(element){ 
							return element.label; 
					},    
					list: {
						onChooseEvent:function(){
							//alert(1);
							var element = $("#productId-"+rowsCount).getSelectedItemData();
							if(element.id){
								//var maxvalue = element.goods_balance;
								//console.log(maxvalue);
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
								$("#productIdVal-"+rowsCount).val(0);
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
							$( "#productIdQty-" + rowsCount ).focus();
						},
						onSelectItemEvent: function() {	 
								//console.log("click hone ke bad",);
						}   
				},        
				ajaxSettings: {
						dataType: "json",
						method: "GET",
						data: { dataType: "json" }
				},
				preparePostData: function(data) {

					// if($('#catselect_' + rowsCount + " " + "option:selected").val()!=''){
					// 	var catId = $('#catselect_' + rowsCount + " " + "option:selected").val();
					// 	console.log(catId);
					// 	data.catid = catId;
					// }
					    if($("#invoiceMode").val() == 2){
					    	if($("#stockVal").length > 0){
								data.site_id = $("#stockVal").val();
							}
						}else if($("#invoiceMode").val() == 3){
							if($("#siteVal").length > 0){
								data.site_id = $("#siteVal").val();
							}
						}else{

						}
						
						data.phrase = $("#productId-"+rowsCount).val();
						return data;
				},
			requestDelay: 400
		};
		$("#productId-"+rowsCount).easyAutocomplete(productOptions).click(function(){ 
			        $(this).triggerHandler(jQuery.Event("keydown")) 
			});	
		$("#productId-"+rowsCount).keydown(function(e){
			if(e.keyCode == 27){
				removeRow2(e, this, 'totalRows2');
				// $("#productId-"+rowsCount).val('');
				// $("#productIdVal-"+rowsCount).val(0);
				// $("#productIdHsn-"+rowsCount).text("-");
				// $("#productIdUom-"+rowsCount).text("-");	
				// $("#productIdGst-"+rowsCount).text("-");
				// updateProductRow();
			}
		})
		$("#productId-"+rowsCount).focus();
		$("#catselect_"+rowsCount).select2();
		var getServiceDate = $("#productIdServiceMonth-"+rowsCount).attr('data-date');
	 	 $("#productIdServiceMonth-"+rowsCount).datepicker({
				    autoclose: true,
				    minViewMode: 1,
				    format: 'M-yyyy'
				});
	 	if(getServiceDate != ""){
	 		var setServiceDate = new Date(getServiceDate);
	 		$("#productIdServiceMonth-"+rowsCount).datepicker('update', setServiceDate);
	 	}
}
function removeRow2(e, obj, id){
  $(obj).parents('tr').remove();
  var total = $('#' + id).val();
  total = total - 1;
  $("#" + id).val(total);
  updateProductRow();
}

function onchangetocheckinvoice(pageMode){ 
  var url = '/checkinvoicenumb';
  var val = $('#party_invoice').val();
  var datecheck = $('#inv_date').val();
  var headid = $('#headId').val();
  var editMode = $("#editMode").val();
  ajaxData = {
    mode:6,
    modetype:pageMode,
    invoicenumber:val,
    datecheck:datecheck,
    headid:headid,
    editMode:editMode
 }
 if(headid!='' && datecheck!='' && val!=''){
	 doAjaxCall(url,ajaxData,"GET",false,'',function(data,type){
	 	if(data.count>0){
	 		alert('Same invoice exits for the user');
	 		$('#party_invoice').val('');
	 	}
	  });
 }
}

