//SocketService
module.exports = {

	sendCustomRoomMessages:async function(req,params,callBack){
		var response = {};
 		sails.sockets.broadcast(params.toIds, params.methodName,params.data);
 		response.data = params.data;
 		response.status = "success";
 		callBack(response);
	},

	sendUpdateSocket:async function(req,callBack){
		let Obj = {};
		Obj.toIds = [req.me.id];
		Obj.methodName = "updateTransactionList";
		Obj.data = {
			"session_id":sails.sid
		}
		//console.log(req.session.sid);
		await SocketService.sendCustomRoomMessages(req,Obj,function functionName(res){
			callBack(res);
		}) 
	}	

}