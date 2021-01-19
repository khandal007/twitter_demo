//EverydayBackupJob.js
module.exports = function(agenda) {
	  var job = {

        // job name (optional) if not set,
        // Job name will be the file name or subfolder.filename (without .js)
        name: 'EverydayBackup',

        // set true to disabled this hob
        //disabled: false,

        // method can be 'every <interval>', 'schedule <when>' or now
        //frequency supports cron strings
        frequency: 'every 24 hours',
        // frequency: 'now',

        // Jobs options
        options: {
            // priority: highest: 20, high: 10, default: 0, low: -10, lowest: -20
            priority: 20
        },

        // Jobs data
        data: {},

        // execute job
        run: function(job, done) {
            //var jobData = job.attrs.data;
            //console.log(jobData);
            // TransactionService.downloadExcel({ userId: 1 },function(err,data){
            // 	console.log(err);
            // 	console.log(data);
            // 	
            // });
            done();
        },
    };
    return job;
}    