$(function(){
  
  var google_api_key = 'AIzaSyA1_fp4d-TjUU8DwXVWb7NZYH2qCj03Y80';
  var openweathermap_api_key = '8597a93e664fd0d02e717f0a463b46e7';

  var scope = {};
  var isCelsius = true;
  var hasClickedSlider = false;
  
  function updateClock(){
 	var currentTime = new Date ( );
  	var currentHours = currentTime.getHours ( );
  	var currentMinutes = currentTime.getMinutes ( );
  	var currentSeconds = currentTime.getSeconds ( );

  	// Pad the minutes and seconds with leading zeros, if required
  	currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
  	currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

  	// Choose either "AM" or "PM" as appropriate
  	var timeOfDay = ( currentHours < 12 ) ? "AM" : "PM";

  	// Convert the hours component to 12-hour format if needed
  	currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;

  	// Convert an hours component of "0" to "12"
  	currentHours = ( currentHours == 0 ) ? 12 : currentHours;

  	// Compose the string for display
  	var currentTimeString = currentHours + ":" + currentMinutes + timeOfDay;
  	
   	$("#clock span").html(currentTimeString);
   	  	
 }

 function initSliderHover(){
   $('.slider').click(function(){
     $('.temperature').addClass('clicking');
     setTimeout(function(){
       $('.temperature').removeClass('clicking');
     }, 200);
     console.log('foo');
      hasClickedSlider = true;
    });
    
    $('.temperature').hover(function(){
      var css = getSliderChangeCss();
      $('.slider').animate({'top': css}, 500);
      isCelsius = !isCelsius;
    }, function(){
      if (!hasClickedSlider){
        var css = getSliderChangeCss(); 
      $('.slider').animate({'top': css}, 500);
        isCelsius = !isCelsius;
      }
      hasClickedSlider = false;
    });
 }
  
 function getSliderChangeCss(){
   var hgt = $('.celsius').outerHeight(true);
   if (isCelsius){
     return '-='+hgt+'px';
   }
   return '+='+hgt+'px';
 }
  
function resizeText(){
    var width = $('.app_space').outerWidth();
    var margin = 0.02 * width;
    var resizes = {
    'h2' : width * 0.09,
    'h3' : width * 0.07,
    '.weather_block_title': width * 0.05,
     '.weather_icon' : width * 0.21
    };
    
    for (var key in resizes){
      var size = resizes[key];
      var $obj = $('.weather_block '+key);
      $obj.css('font-size', size+"px");
       $span = $obj.children('span');
    $('.weather_block_title').css('margin-bottom', margin*1.5+'px');
     if (key == '.weather_icon'){
       $span.css('top', (margin *1.5)+"px");
    }
      else{
        $span.css('margin', margin+"px");
      }
    }
    
  }

function resizeTemp(){
  resizeTempSlider();
  resizeTempWindow();
} 
  
function tempWidth(){
    var fWidth = $('.farenheit span').outerWidth(true);
  var cWidth = $('.celsius span').outerWidth(true);
  var maxWidth = fWidth > cWidth ? fWidth : cWidth;
 return maxWidth;
}
  
function resizeTempSlider(){
 $('.slider').css('width', tempWidth());
}
  
function resizeTempWindow(){
   $('.temperature').css('width', tempWidth());
  $('.temperature').css('height', $('.celsius').outerHeight(true));
}
  
function fetchFromAPIs(){
  if (navigator.geolocation){  navigator.geolocation.getCurrentPosition(getPosition);
  }
  else{
    $(body).prepend("<span>Geolocation is not supported by this browser.</span>");
  }
}

function getWeather(){
  var url = 'https://api.openweathermap.org/data/2.5/weather?lat='+scope.latitude+'&lon='+scope.longitude+'&appid='+openweathermap_api_key+'&units=metric';
  $.get(url, function(data){
    scope.city = data['name'];
    scope.country = data['sys']['country'];
    scope.location = scope.city + ", " + scope.country;
    scope.temp = data['main']['temp'];
    scope.temp_string = Math.round(scope.temp)+'&deg;C';
    scope.weather_code = data['weather'][0]['id'];
    scope.weather = data['weather'][0]['main'];
    initWeather();
  });
}

function initWeather(){
  var time = dayOrNight();
  var className = 'wi-owm-'+time+'-'+scope.weather_code;
  $('.wi').addClass(className);
  $('.app_space').addClass(time);
  $('.location span').html(scope.location);
  $('.weather_description span').html(scope.weather);
  $('.celsius span').html(scope.temp_string);
  $('.farenheit span').html(convertToF(scope.temp)+' F');
  resizeTemp();
  initSliderHover();
  $('.loading').hide();
}
  
 function convertToF(cTempVal) {
   var fTempVal = Math.round((cTempVal * (9 / 5)) + 32);
   return fTempVal;
 }

function dayOrNight(){
  currentTime = new Date();
  time = currentTime.getTime();
  hours = currentTime.getHours();
  if ((hours < 6) || (hours >= 18)){
    return 'night';
  }
  return 'day';
}

function getPosition(position){
  scope.latitude = position.coords.latitude;
  scope.longitude = position.coords.longitude;
  getWeather();
}

  
  function init(){
    updateClock();
    setInterval(updateClock, 1000);
    fetchFromAPIs();
    resizeText();
    $(window).resize(function(){
      resizeText();
      resizeTemp();
    });
    

  }
  
  init();
  
});