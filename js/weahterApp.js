/**
 * Created by gutmac_2 on 7/10/16.
 */
(function () {
    var apikey="dc7afa473d1ae60c2917b26228818662";
    var apiUrl = "http://api.openweathermap.org/data/2.5/forecast?units=metric&lang=es&&apikey="+apikey+"&q=";
    var city = "mexico city, MX";
    var weekDays=['','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
    var months = ['','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

    $(document).ready(function () {
        loadData(city);
    });

    $('#find_button').click(function () {
        city = $('#city_text').val();
        loadData(city);
    });



    function loadData(city) {

        $.getJSON( apiUrl + city, function( data ) {
            var items = [];
            var currentDate="";
            $.each( data.list, function( key, val ) {
                var justDate = val.dt_txt.substr(0,10);
                var dateArray = justDate.split('-');

                if( justDate != currentDate){
                    currentDate = justDate;
                    var day = new Date(currentDate);
                    val.month = months[ Number(dateArray[1]) ];
                    val.weekDay = weekDays[day.getDay()];
                    val.day = Number(dateArray[2]);
                    items.push( val );
                }
            });

            setTodayWeather(data,items);
            createForecast(items);

            console.log(items);
        });


    }

    function clearInfo() {
        city = '';
        $('#todayWeather .location').html('');
        $('#todayWeather .degree .num').html( '');
        $('#todayWeather .forecast-icon img').attr('src','');
        $('#todayWeather .rainIcon').html('');
        $('#todayWeather .windIcon').html('');
        $('#todayWeather .compassIcon').html('');

        $('#dayName').html('');
        $('.date').html('');
    }

    function setTodayWeather(allData,allItems) {
        var todayItem = allItems[0];
        $('#todayWeather .location').html(allData.city.name +', ' + allData.city.country +' hoy: '+todayItem.weather[0].description);
        $('#todayWeather .degree .num').html( Math.round(todayItem.main.temp) +'<sup>o</sup>C');
        $('#todayWeather .forecast-icon img').attr('src','http://openweathermap.org/img/w/'+todayItem.weather[0].icon+'.png');

        if( Boolean(todayItem.rain['3h'])) {
            $('#todayWeather .rainIcon').html('<img src="images/icon-umberella.png">' + todayItem.rain['3h'] + 'mm');
        }
        $('#todayWeather .windIcon').html('<img src="images/icon-wind.png">'+todayItem.wind.speed+'m/s');
        $('#todayWeather .compassIcon').html('<img src="images/icon-compass.png">'+allData.city.coord.lat+","+allData.city.coord.lat);

        $('#dayName').html(todayItem.weekDay);
        $('.date').html(todayItem.dt_txt);
    }

    function createForecast(items) {
        $('.newItem').remove();

        $.each(items,function (key, val) {
            if(key > 0) {
                var newItem = document.createElement('div');

                newItem.setAttribute('class', 'forecast newItem');
                $(newItem).html('<div class="forecast-header">' +
                    '<div class="day">'+ val.weekDay +'</div>' +
                    '</div>' +
                    '<div class="forecast-content">' +
                    '<div class="forecast-icon">' +
                    '<img src="http://openweathermap.org/img/w/'+val.weather[0].icon+'.png" alt="" width=48>' +
                    '</div>' +
                    '<div class="degree">'+Math.round( val.main.temp )+'<sup>o</sup>C</div>' +
                    '</div>');

                $('#itemsContainer').append(newItem);
            }
        });

    }


})();