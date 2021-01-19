/**
 * LoginSession.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'account_login_session',
	primaryKey:'id',
  	attributes: {
  		id:{
	      type: 'number',
          autoIncrement: true,
          columnType: 'bigint',
	    },
	    user_id:{
	      model:"User",
	    },
	    user_agent_id:{
	      model:"UserAgent",
	    },
	    failed_attempts:{
	      type:'number',
          columnType: 'tinyint',
          defaultsTo:0
	    },
	    info:{
	      type:'string',
       	  columnType:'Text',
          allowNull: true
	    },
	    ip_address:{
	      type:'number',
	      allowNull: true
	    },
	    login_via:{
	      type:'number',
          columnType: 'tinyint',
          defaultsTo:1,
          description:'1=web, 2=android, 3=ios, 4=other'
	    },
	    login_at:{
	      type:"ref",
      	  columnType:"datetime"
	    },
	    logout_at:{
	      type:"ref",
          columnType:"datetime"
	    },
	    isActive:{
          type:'number',
          columnType: 'tinyint',
          defaultsTo:1
        },
  	}
};
