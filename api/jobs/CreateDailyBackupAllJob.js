//CreateDailyBackupJob.js
//let util = require('util');
module.exports = function(agenda) {
      var job = {

        // job name (optional) if not set,
        // Job name will be the file name or subfolder.filename (without .js)
        name: 'CreateDailyBackupAll',

        // set true to disabled this hob
        //disabled: false,

        // method can be 'every <interval>', 'schedule <when>' or now
        //frequency supports cron strings
        // frequency: 'every 5 seconds',
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
            var jobData = job.attrs.data;
            //console.log(jobData);
            //console.log('injob');
            TransactionService.downloadExcelAll(jobData,function(err,data){
                console.log(err);
                console.log(data);
                done();
            });
        },
    };
     agenda.on('complete', function(job) {
       // sails.log.info(util.format("[%s] job '%s'... %dMB", new Date().toISOString(), job.attrs.name, ((process.memoryUsage().rss / 1024) / 1024).toFixed(1)));
       //  if ('gc' in global) {
       //      global.gc();
       //  }
       console.log("Coming here");
      if (job.attrs.name == 'CreateDailyBackup') {
        console.log("Coming here also");
        job.remove();
      }
    });
    return job;
}