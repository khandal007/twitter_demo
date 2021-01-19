/**
 * TweetLogs.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName : 'tweet_logs',
    primaryKey:'id',
    attributes: {
        id:{
          type: 'number',
          autoIncrement: true,
          columnType: 'bigint',
        },
        
        request_user_id:{
          model:"User"
        },

        tweet_id:{
            model:'Tweet'
        },
        
        date:{
            type:'ref',
            columnType:'date'
        },

        isApprove:{
            type:'number',
            columnType:'tinyint',
            description:"1-approve, 2-disapprove, 3-pending"
        },

        request_name:{
            type:'number',
            columnType:"tinyint",
            description:'1-delete, 2-update'
        },

        update_tweet:{
          type:'string',
          columnType:'Text',
          allowNull: true
        },

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

};

