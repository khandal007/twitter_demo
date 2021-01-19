/**
 * UserAgent.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	tableName : 'account_user_agent',
	primaryKey:'id',
 	attributes: {
	  	id:{
	      type: 'number',
          autoIncrement: true,
          columnType: 'bigint',
	    },
	    
	    device_id:{
	      type:'string',
		  columnType:'varchar(100)',
		  allowNull: true,
	    },
	    
	    user_agent:{
	      type:'string',
       	  columnType:'Text',
          allowNull: true
	    },
	    
	    device_info:{
	      type:'string',
       	  columnType:'Text',
          allowNull: true
	    },
	    
	    fcm_token:{
	      type: 'string',
	      allowNull: true,
	      description: 'A unique token used to verify the user\'s identity.'
	    },
	    
	    device_type:{
	      type:'number',
          columnType: 'tinyint',
          defaultsTo:1,
          description:'1=web, 2=android, 3=ios, 4=other'
	    },
	    
	    max_login_attempt_at:{
	      type:"ref",
          columnType:"date"
	    },

	    isActive:{
          type:'number',
          columnType: 'tinyint',
          defaultsTo:1
        },
        
        sessionUserAgent:{
	      collection:"UserLoginSession",
	      via:"user_agent_id"
	    },
  	}
};
