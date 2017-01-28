angular.module('nasaViewer').directive('liveClock', function($interval) {
  return {
    scope: true, //isolates directive
    restrict: 'E',
    template: "<span class='live-clock-greeting'>{{greeting}}, the current time is: <br /></span><span class='live-clock-time'>{{date.now() | date: timeFormat}}</span>",
    link: function(scope, element, attributes) {

      timeRefresh();

      function timeRefresh() {
        scope.timeFormat = (attributes.format === '12') ? 'hh:mm a' : 'HH:mm';
        scope.date = Date;

        var myDate = new Date();
        /* hour is before noon */
        if (myDate.getHours() < 12) {
          scope.greeting = "Good Morning";
        } else /* Hour is from noon to 5pm (actually to 5:59 pm) */
        if (myDate.getHours() >= 12 && myDate.getHours() <= 17) {
          scope.greeting = "Good Afternoon";
        } else /* the hour is after 5pm, so it is between 6pm and midnight */
        if (myDate.getHours() > 17 && myDate.getHours() <= 24) {
          scope.greeting = "Good Evening";;
        } else /* the hour is not between 0 and 24, so something is wrong */ {
          scope.greeting = "Hello";
        }


      }


      $interval(timeRefresh, 1000);
    }
  }
})