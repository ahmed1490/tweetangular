(function(){
  'use strict';

  angular.module('twitterApp.services')
   .factory('twitterService',['$q', function($q) {

    window.authorizationResult = false;

    var exports = {
      initialize: function() {
          //initialize OAuth.io with public key of the application
          OAuth.initialize('1VJ_dky1jmZfvXL2eNi5m22LmOQ', {cache:true});
          //try to create an authorization result when the page loads, this means a returning user won't have to click the twitter button again
          authorizationResult = OAuth.create('twitter');

          //OAuth.callback('twitter');
      },
      isReady: function() {
          return (authorizationResult);
      },
      connectTwitter: function() {
          var deferred = $q.defer();
          OAuth.popup('twitter', {cache:true}, function(error, result) { //cache means to execute the callback if the tokens are already present
              if (!error) {
                  authorizationResult = result;
                  deferred.resolve();
                  // authorizationResult.me().done(function(user_data){
                  //   exports.userProviderID = user_data.raw.id_str;
                  // })
              } else {
                  //do something if there's an error
              }
          });
          return deferred.promise;
      },
      userProviderID: undefined,
      clearCache: function() {
          OAuth.clearCache('twitter');
          authorizationResult = false;
      },

      getLatestTweets: function () {
          var deferred = $q.defer();
          var promise = authorizationResult.get('/1.1/statuses/home_timeline.json').done(function(data) { //https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
              deferred.resolve(data)
          });
          return deferred.promise;
      },
      getRelatedTweets: function (search_term) {
          var deferred = $q.defer();
          var promise = authorizationResult.get('/1.1/search/tweets.json?q='+search_term).done(function(data) {
              deferred.resolve(data.statuses)
          });
          return deferred.promise;
      },
      retweetStatus: function (tweet_id) {
        var deferred = $q.defer();
        var promise = authorizationResult.post('/1.1/statuses/retweet/'+tweet_id+'.json').done(function(data) {
            deferred.resolve(data)
        });
        return deferred.promise;
      }//,

      // removeRetweet: function (tweet_id) {
      //   var deferred = $q.defer();
      //   exports.getUserRetweetStatusId(tweet_id).then(function(data){
      //     exports.removeStatus(data.id_str).then(function(new_data){
      //       deferred.resolve(new_data);
      //     });
      //   });
      //   return deferred.promise;
      // },

      // getUserRetweetStatusId: function(original_tweet_id){
      //   var deferred = $q.defer();
      //   // authorizationResult.get('1.1/statuses/retweets/'+original_tweet_id+'.json').done(function(retweets){
      //   //   console.log(retweets);
      //   // })

      //   $q.all([
      //      exports.getUserData(),
      //      authorizationResult.get('1.1/statuses/retweets/'+original_tweet_id+'.json')
      //   ]).then(function(data) {
      //      var userData = data[0];
      //      var statusRetweets = data[1];
      //      $deferred.resolve(statusRetweets[i].id_str)
      //   });

      //   return deferred.promise;
      // },

      // removeStatus: function (tweet_id) {
      //   var deferred = $q.defer();
      //   var promise = authorizationResult.del('1.1/statuses/destroy/'+tweet_id+'.json').done(function(data) {
      //       deferred.resolve(data)
      //   });
      //   return deferred.promise;
      // },

      // getUserData: function(){
      //   var deferred = $q.defer();
      //   if( typeof(userData) === 'undefined' ){
      //     authorizationResult.me().done(function(data){
      //       userData = data;
      //       deferred.resolve(data);
      //     });
      //   }
      //   else{
      //     deferred.resolve(userData);
      //   }
      //  return deferred.promise;
      // }
    }

    return exports;

  }]);

})();
