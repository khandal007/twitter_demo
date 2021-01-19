/**
 * MasterController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var moment = require('moment');
module.exports = {
	changeCompany:async function(req,res){
		const params = _.extend(req.query || {}, req.params || {}, req.body || {});
		console.log("params",params);
		//const { company_id } = params;
		var company_id =2;
		var obj;
		if(company_id){
			await req.session.allCompanies.map(async function(data){
				if(data.id == company_id){
					req.session.currentCompany = {};
					req.session.currentCompany = data;
					obj = {toIds: req.me.id, methodName: 'companyChange', data: data};
					
				}
			})
			if(req.xhr){
				await SocketService.sendCustomRoomMessages(req, obj, function (result){
					});
				return res.json({url:params.url});
			}else{
				return res.redirect("/module/dashboard")
			}
		}
	},
	
	homepage:async function(req,res){
		const params = _.extend(req.query || {}, req.params || {}, req.body || {});

		var obj = `SELECT tw.id, tw.tweet, au.id AS user_id, au.fullName, (SELECT id FROM tweet_logs WHERE tweet_id=tw.id AND isApprove=3) AS pending FROM tweet tw LEFT JOIN account_users au ON au.id = tw.user_id WHERE tw.isdelete =0 ORDER BY tw.id DESC`;

		var result = await sails.sendNativeQuery(obj);
		res.view('pages/super-dashboard/homepage', {allTweets: result.rows, req: req});
	},

	makeTweet: async function(req,res){
		const params = _.extend(req.query || {}, req.params || {}, req.body || {});
		console.log("asa",params);
		if(!params.tweet_id){
			var create = await Tweet.create({user_id: req.me.id, tweet: params.tweet}).fetch();
		}else{
			var create = await Tweet.update({tweet: params.tweet}).set({tweet: params.tweet}).fetch();
		}
		if(create){
			res.json({status: true, message:'success'});
		}
	},

	updateDeleteRequest: async function(req,res){
		const params = _.extend(req.query || {}, req.params || {}, req.body || {});
		console.log("asa",params);
		var request = await TweetLogs.create({request_user_id: req.me.id, tweet_id: params.tweet_id, date: moment().format("YYYY-MM-DD"), request_name: params.req_name, update_tweet: params.tweet, isApprove: 3 }).fetch();

		res.json({status: true, message:"Successfully delete"});
	},

	updateTweet: async function(req,res){
		const params = _.extend(req.query || {}, req.params || {}, req.body || {});
		console.log("asa",params);

		if(req.me.userRole==45){
			var create = await Tweet.update({id: params.tweet_id}).set({tweet: params.tweet}).fetch();
		}else{
			if(params.isApprove){
				var update = await TweetLogs.update({tweet_id: params.tweet_id}).set({isApprove: params.isApprove}).fetch();
				console.log("asdf",update);
				if(update[0].request_name==2){
					var create = await Tweet.update({id: params.tweet_id}).set({tweet: update[0].update_tweet}).fetch();
				}
			}
		}
		res.json({status: true, message: "success"});
	},

	tweetLogs: async function(req,res){
		const params = _.extend(req.query || {}, req.params || {}, req.body || {});

		var query = `SELECT tl.id, tl.date, tl.tweet_id, tw.tweet, au.fullName, tl.update_tweet, tl.isApprove, tl.request_name FROM tweet_logs tl
		LEFT JOIN tweet tw ON tw.id = tl.tweet_id
		LEFT JOIN account_users au ON au.id = tl.request_user_id`;

		var result = await sails.sendNativeQuery(query);
		res.view('pages/super-dashboard/tweetLogs',{data: result.rows});
	},

	deleteTweet: async function(req,res){
		const params = _.extend(req.query || {}, req.params || {}, req.body || {});
		console.log("asa",params);
		if(req.me.userRole==45){
			var deletes = await TweetLogs.create({request_user_id: req.me.id, tweet_id: params.tweet_id, date: moment().format("YYYY-MM-DD"), request_name: 1, isApprove: params.isApprove }).fetch();
			var create= await Tweet.update({id: params.tweet_id}).set({isdelete: 1}).fetch();
		}else{
			var update = await TweetLogs.update({tweet_id: params.tweet_id}).set({isApprove: params.isApprove});
			if(params.isApprove==1){
				var create= await Tweet.update({id: params.tweet_id}).set({isdelete: 1}).fetch();
			}
		}

		res.json({status: true, message:"Successfully delete"});
	}

	//------------------------------------------------End Company Master ----------------------------------------/
};
