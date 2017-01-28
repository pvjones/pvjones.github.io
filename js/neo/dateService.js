  angular.module('nasaViewer').service('dateService', function() {

  this.getCurrentDate = function() {
    return new Date();
  }

  function getFormattedDates(date) {

    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    var yyyy = date.getFullYear();
    return {
      apiFormat: ([
        yyyy,
        "-",
        ((mm > 9) ? '' : '0') + mm,
        "-",
        ((dd > 9) ? '' : '0') + dd
      ]).join(''),
      displayFormat: ([
        ((mm > 9) ? '' : '0') + mm,
        "-",
        ((dd > 9) ? '' : '0') + dd,
        "-",
        yyyy
      ]).join('')
    }
  }

  function addDays(date, days) {
    var newDateMs = date.getTime() + 60 * 60 * 24 * 1000 * days;
    return new Date(newDateMs);
  }

  function createWeek(startDate) {
    return {
      startDate: getFormattedDates(startDate),
      endDate: getFormattedDates(addDays(startDate, 7))
    }
  }

  this.createWeekArray = function(startDate, numberOfWeeks) {
    let weekArray = [];
    let dateCounter = startDate;
    for (let i = 0; i < numberOfWeeks; i++) {
      let newWeek = createWeek(dateCounter);
      weekArray.push(newWeek);
      dateCounter = addDays(dateCounter, 7);
    }
    return weekArray;
  }



});