var request = require('superagent')
    ,colors = require('colors')
    ,List = require('term-list')
    ,moment = require('moment')
    ,cp = require('copy-paste')

var API_ENDPOINT = 'http://search.maven.org';

module.exports = {
  search: function(keyword){
    console.log('Searching',keyword,'...');
    request
      .get(API_ENDPOINT + '/solrsearch/select')
      .query({
        q: keyword,
        rows: 20,
        wt: 'json'
      })
      .end(function(err,res){
        console.log(colors.green('Founded',res.body.response.numFound,'results'));
        if(!err){
          var list = new List({ marker: '\033[36m› \033[0m', markerLength: 2 });
          for (var i = 0; i < res.body.response.docs.length; i++) {
            var results = res.body.response.docs[i];
            list.add(results.id + ':' + results.latestVersion, results.id + ' ' + results.latestVersion.yellow + ' ' + moment(results.timestamp).format('YYYY-MM-DD').green);
            console.log(results.id)
          };
          list.start();
          list.on('keypress',function(key,item){
            switch(key.name){
              case 'return':
                cp.copy(item,function(){
                  list.stop();
                  console.log(colors.green('Copied',item));
                })
                break;
              case 'backspace':
                list.stop();
                break;
            }
          })
        } else {
          console.log(err)
        }
      })
  }
}