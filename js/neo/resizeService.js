angular.module('nasaViewer').service('resizeService', function() {

  this.calculateElementWidth = (element) => {  
    if (!element.offsetWidth) {    
      return 0;  
    }
      
    var style = window.getComputedStyle(element);  
    var width = element.offsetWidth;  
    var margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);  
    var padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);  
    var border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
      
    return width ;
  }

  this.calculateElementHeight = (element) => {  
    if (!element.offsetHeight) {    
      return 0;  
    }
      
    var style = window.getComputedStyle(element);  
    var height = element.offsetHeight;  
    var margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom);  
    var padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);  
    var border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
      
    return height ;

  }

});