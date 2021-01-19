/**
 * MainController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    dashboard: async function (req, res) {
    	 		
    const params = _.extend(req.query || {}, req.params || {}, req.body || {});
    const { mode } = params;
    var debitLabel = "";
    var modeType = "";
    var page_title = "Dashboard";
    var href = ""; 
    if(mode){
      var modeArr = await sails.config.constants.payment_mode.filter(function(item){
        return mode == item.id
      });
      //console.log(modeArr);
      page_title = modeArr[0].modeName;
      if(modeArr[0].type == "expense"){
        if(modeArr[0].id == 2){
                      href = `/form/registeredform?mode=grn&modetype=${modeArr[0].id}`;
                    }else{
                      href = `/form/transactionForm?mode=${modeArr[0].id}`;
                    }
        debitLabel = "Costcenter";
      }else if(modeArr[0].type == "payment"){
        href = `/form/transactionForm?mode=${modeArr[0].id}`;
        debitLabel = "Debit Head";
      }else if(modeArr[0].type == "inventory"){
        href = `/invoice/entries?mode=${modeArr[0].modeName.toLowerCase()}`;
        debitLabel = "Costcenter";
      }
      else{
        debitLabel = "Costcenter";
      }
      modeType =modeArr[0].type;
    }

    if(href != ""){
      if(mode==6){
        var grnMode = "6,2";
      }else{
        var grnMode = mode;
      }
        page_title = `${page_title} <a href="${href}"><i class="fa fa-plus"></i><div class="ripple-container"></div></a> &nbsp; <a href="/allTrListByMode?mode=${grnMode}"><i class="fa fa-eye"></i><div class="ripple-container"></div></a>`;
    }
    
    var breadcrumbData = { 
            pageTitle : page_title
    };


     var balanceObject = {};
 
      res.view('pages/super-dashboard/homepage', { breadcrumb: breadcrumbData,remainingBalance:{},attMode:(mode)?mode:-1,debitLabel:debitLabel,attModeType:modeType } );
  	},
};
