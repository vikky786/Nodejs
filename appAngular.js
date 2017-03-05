var app = angular.module('chat',['btford.socket-io']);

app.factory('socket', function ($rootScope) {
  var socket = io.connect('http://localhost:3000/');
  
  //return mySocket;
   return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };

  
});

app.controller('chat_socket',['$scope' , 'socket' , '$interval', function($scope, socket, $interval){
   
    $scope.messages = []
    
    // catch event
    socket.on('send:message', function (message) {
      $scope.msgname = false
      $scope.messages.push({msg:message.msg, name:message.name});
  });

  //typing event function

   $scope.typing = function(){
     $scope.Name = [];
    socket.emit('type:true' , {
      typing:$scope.name
    })
  }

  $scope.typingHide = function(){
      $scope.msgname = false
  }

  //catch typing event

  socket.on('type:true', function(data){
    
    console.log(data)
    $scope.msgname = true
    $scope.Name = data; 

    $interval($scope.typingHide , 3000)
  })

//Online user event

socket.on('Online:user' , function(data){
  console.log(data);
     $scope.users = data
     console.log($scope.users);
  })


$scope.chatUser = function(){
  $scope.chat = true

  socket.emit('Online:user', $scope.name)
  
}

// send message
  $scope.sendMessage = function () {
    socket.emit('send:message', {
      message: $scope.message,
      name:$scope.name
    });

    // add the message to our model locally
    $scope.messages.push({msg:$scope.message, name:$scope.name});

    // clear message box
    $scope.message = '';
  }

}])

