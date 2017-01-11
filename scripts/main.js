$(document).ready(function() {
	var options = {
		enableHighAccuracy: true,
	};
	var latitude;
	var longitude;
	var celsius;
	var fahrenheit;
	var $body = $("body");
	var $mainIcon = $("#mainIcon");

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(getCoords, getError, options);
	}

	function getCoords(position) {
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
		showLocation();
		showWeather();
	}

	function getError(error) {
		alert("Geolocation Error: " + error);
	}

	function showLocation() {
		var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=AIzaSyBYMndgw-rBS8Hf9Yq-xHWOwSdo9OCA18g";
		$.ajax({
			method: "GET",
			dataType: "json",
			url: url,
			success: function(data) {
				/* Display approximate location via zip code. If zip code is unavailable,
				display the most specific location summary found. */
				var loc = "";
				var locArr = arrMeMatey(data.results.length);
				for (var i = 0; i < data.results.length; i++) {
					locArr[i][0] = data.results[i].formatted_address;
					locArr[i][1] = data.results[i].types;
					if (locArr[i][1].includes("postal_code")) {
						loc = locArr[i][0];
					}
				}
				if (!loc) {
					loc = locArr[0][0];
				}
				$("#location").text(loc);
			}
		});
	}

	function showWeather() {
		var url = "https://api.forecast.io/forecast/d51799294507dd5ff909fbd1ba1f81ec/" + latitude + "," + longitude;
		$.ajax({
			method: "GET",
			dataType: "jsonp",
			url: url,
			success: function(data) {
				// Assign values to variables from data
				var icon = data.currently.icon;
				var temperature = data.currently.temperature;
				var humidity = data.currently.humidity;
				var wind = "";
				var windSpeed = data.currently.windSpeed;
				var windBearing = data.currently.windBearing;
				var forecast = data.hourly.summary + data.daily.summary;

				// Change display only if values actually exist
				if (icon) {
					icon = "wi-forecast-io-" + data.currently.icon;
					$mainIcon.removeClass("wi-alien").addClass(icon);
				}
				if (temperature) {
					celsius = "<i class='wi wi-thermometer'></i> " + Math.round((temperature - 32) * 5 / 9) + "<i class='wi wi-celsius'></i>";
					fahrenheit = "<i class='wi wi-thermometer'></i> " + Math.round(temperature) + "<i class='wi wi-fahrenheit'></i>";
					$("#temperature").html(fahrenheit);
				}
				if (humidity) {
					humidity = "<i class='wi wi-humidity'></i> " + Math.round(humidity * 100);
					$("#humidity").html(humidity);
				}
				if (windSpeed && windBearing) {
					wind = "<i class='wi wi-wind from-" + windBearing + "-deg'></i> " + Math.round(windSpeed) + " mph";
					$("#wind").html(wind);
				} else if (windSpeed) {
					wind = "<i class='wi wi-strong-wind'></i> " + Math.round(windSpeed) + " mph";
					$("#wind").html(wind);
				}
				if (forecast) {
					forecast = data.hourly.summary + " " + data.daily.summary;
					forecast = forecast.replace("undefined", "");
					$("#forecast").text(forecast);
				} else {
					$("#forecast").text("No forecast available.");
				}

				// Change background based on weather icon
				changeBackground(icon);

				// Convert temperature using stored values
				$("#celsius").click(convertToC);
				$("#fahrenheit").click(convertToF);
			}
		});
	}

	function changeBackground(val) {
		if ($mainIcon.hasClass("wi-forecast-io-clear-day") || $mainIcon.hasClass("wi-forecast-io-partly-cloudy-day") || $mainIcon.hasClass("wi-forecast-io-wind")) {
			$body.css("background-color", "#009DFF");
			$body.css("background-image", "linear-gradient(#009DFF, #29ADE5)");
			$body.css("background-position", "0");
			$body.css("background-size", "auto");
		} else if ($mainIcon.hasClass("wi-forecast-io-cloudy") || $mainIcon.hasClass("wi-forecast-io-fog") || $mainIcon.hasClass("wi-forecast-io-rain") || $mainIcon.hasClass("wi-forecast-io-snow")) {
			$body.css("background-color", "#9C9FA1");
			$body.css("background-image", "linear-gradient(#9C9FA1, #C8CACC)");
			$body.css("background-position", "0");
			$body.css("background-size", "auto");
		} else if ($mainIcon.hasClass("wi-forecast-io-sleet") || $mainIcon.hasClass("wi-forecast-io-hail") || $mainIcon.hasClass("wi-forecast-io-thunderstorm") || $mainIcon.hasClass("wi-forecast-io-tornado")) {
			$body.css("background-color", "#474747");
			$body.css("background-image", "linear-gradient(#474747, #5A5B5C)");
			$body.css("background-position", "0");
			$body.css("background-size", "auto");
		}
	}

	function arrMeMatey(indices) { // Creates a 2D array of specified length
		var arr = [];
		for (var i = 0; i < indices; i++) {
			arr[i] = [];
		}
		return arr;
	}

	function convertToC() {
		$("#temperature").html(celsius);
	}

	function convertToF() {
		$("#temperature").html(fahrenheit);
	}
});
