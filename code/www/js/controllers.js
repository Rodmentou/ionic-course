angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl',
function($scope, $timeout, User, Recommendations, $ionicLoading) {

  var showLoading = function () {
    $ionicLoading.show({
      template: '<i class="ion-loading-c"></i>',
      noBackdrop: true
    });
  };

  var hideLoading = function () {
    $ionicLoading.hide();
  };

  $scope.nextAlbumImg = function () {
    if (Recommendations.queue.length > 1) {
      return Recommendations.queue[1].image_large;
    }

    return '';
  };

  $scope.sendFeedBack = function (bool) {


    if (bool) User.addSongToFavorites($scope.currentSong);

    $scope.currentSong.rated = bool;
    $scope.currentSong.hide = true;

    Recommendations.nextSong();

    $timeout( function () {
      $scope.currentSong = Recommendations.queue[0];
      $scope.currentSong.loaded = false;
    }, 250);

    Recommendations.playCurrentSong().then(function () {
      $scope.currentSong.loaded = true;
    });
  };

  Recommendations.init()
    .then( function () {
      hideLoading();
      $scope.currentSong = Recommendations.queue[0];
      return Recommendations.playCurrentSong();
  }).then ( function () {
    hideLoading();
    $scope.currentSong.loaded = true;
  });

  showLoading();

})

.controller('SplashCtrl', function ($scope, $state, User) {
  $scope.submitForm = function (username, signingUp) {
    User.auth(username, signingUp).then( function () {
      $state.go('tab.discover');
    }, function () {
      alert('Hmm.. try another username.');
    });
  };


})
/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope, User, $window) {

  $scope.username = User.username;

  $scope.openSong = function (song) {
    $window.open(song.open_url, "_system");
  };

  $scope.favorites = User.favorites;
  $scope.removeSong = function (song, index) {
    User.removeSongFromFavorites(song, index);
  };

})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope, Recommendations, User, $window) {

  $scope.favCount = User.favoriteCount;

  $scope.logout = function () {
    User.destroySession();

    $window.location.href = 'index.html';
  };

  $scope.enteringFavorites = function () {
    User.newFavorites = 0;
    Recommendations.haltAudio();
  };

  $scope.leavingFavorites = function () {
    Recommendations.init();
  };



});
