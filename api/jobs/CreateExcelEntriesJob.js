//CreateExcelUploadJob.js
const util = require('util');

module.exports = function(agenda) {
	var job = {
        name: 'CreateExcelEntries',
        // Jobs options
        options: {
            // priority: highest: 20, high: 10, default: 0, low: -10, lowest: -20
            priority: 20
        },

        // Jobs data
        data: {},

        // execute job
        run: async function(job, done) {
            var jobData = job.attrs.data;
          console.log(jobData);
            if(jobData.mode == 1){
                await commonCreate.addGoodsMaster(jobData, async function(err,data){
                console.log(data);
                    done();
                });
            }else if(jobData.mode == 2){
              await commonCreate.checkSingleTransaction(jobData, async function(err,data){
                console.log(data);
                  done();
              });
            }else if(jobData.mode == 4){
              await commonCreate.addProjectSites(jobData, async function(err,data){
                console.log(data);
                  done();
              });
              
            }else{
              await commonCreate.checkHeadTransaction(jobData, async function(err,data){
                console.log(data);
                  done();
              });
              
            }
          
        },
    };

    agenda.on('success', function(job) {
      // sails.log.info(util.format("[%s] job '%s'... %dMB", new Date().toISOString(), job.attrs.name, ((process.memoryUsage().rss / 1024) / 1024).toFixed(1)));
      if ('gc' in global) {
        global.gc();
      }

      //console.log(job);
      if (job.attrs.name == 'CreateExcelEntries') {
        console.log("job removed");
        job.remove();
      }

    });

    return job;
}