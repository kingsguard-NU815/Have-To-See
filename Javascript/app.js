// band search JS file
var venueLat;
var venueLong;

var tourArray = [];

$(document).ready(function() {

function searchBandsInTown(artist) {

		// querying the bandsintown api upcoming artist events for the selected artist
	var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=havetosee";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {

    	// test functionality
    	console.log(response);

        var artistDates = response;

    	// if/else to address instances where there's no upcoming tour dates 
    	if (response.length === 0) {
    		var noShowsDiv = $("<div>");
    		noShowsDiv.addClass("text-center");
    		var noShowsPara = $("<p>");
    		noShowsPara.text("Sorry, we don't know of any upcoming shows for " + artist + ".");
    		noShowsDiv.append(noShowsPara);
    		$("#results-div").append(noShowsDiv);
    	}
    	else {

    		// for loop to dynamically create html elements with the AJAX response
    		for (var i = 0; i<response.length; i++) {

        		// create a new div for each response[i]
        		var newDiv = $("<div>");
        		// add bootstrap class to the div
        		newDiv.addClass("well");

        		// create a div within the newDiv for the date (for formatting purposes)
        		var dateDiv = $("<div>");
        		// dateDiv.addClass("col-sm-4");
        		dateDiv.addClass("date-div");

        		var datePara = $("<p>");
        		var timePara = $("<p>");

        		// date formatting with moment.js
        		var dateDivValue = response[i].datetime;

        		// test
        		// console.log(dateDivValue);
        		// console.log(moment(dateDivValue).format("MMM Do YYYY"));

        		var venueDate = moment(dateDivValue).format("MMM Do YYYY")
        		var doorsOpen = moment(dateDivValue).format("h:mm");

        		datePara.text(venueDate);
        		timePara.text(doorsOpen);

        		dateDiv.append(datePara);
        		dateDiv.append(timePara);
        		newDiv.append(dateDiv);

        		// vertical line <hr> attempt
    			var verticalLineDiv = $("<div>");
    			verticalLineDiv.addClass("verticalLine");
    			newDiv.append(verticalLineDiv);

        		// create a new div for the venue details (name, location) for formatting purposes
        		var venueDiv = $("<div>");
        		// venueDiv.addClass("col-sm-8");
        		venueDiv.addClass("venue-div");

        		// create a headline for the new div
        		var newDivHeadline = $("<h3>");
        		newDivHeadline.text(response[i].venue.name);
        		venueDiv.append(newDivHeadline);

        		// create snippet text for the new div
        		var newDivSnippet = $("<p>");
        		newDivSnippet.text(response[i].venue.city + ", " + response[i].venue.country);
        		venueDiv.append(newDivSnippet);

        		// append venueDiv to newDiv
        		newDiv.append(venueDiv);

        		// append the new divs to the #results-div
        		$("#results-div").append(newDiv);

                // test to see if I can log the lat/long values for each show
                // console.log("Venue: " + response[i].venue.name + " Lat: " + response[i].venue.latitude + " Long: " + response[i].venue.longitude);

                // assign values to global venueLat and venueLong variables for venue latitude and venue longitude
                venueLat = response[i].venue.latitude;
                venueLong = response[i].venue.longitude;

                // ajax call to airportsfinder API for each tour stop
                $.ajax({
                type: "GET",
                url: "https://cometari-airportsfinder-v1.p.mashape.com/api/airports/nearest?lat=" + venueLat + "&lng=" + venueLong,
                // url: "https://cometari-airportsfinder-v1.p.mashape.com/api/airports/by-text?berlin",
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("X-Mashape-Key", "YKavuk3HBMmshdVc1YxGBc83cJy7p1r1GBejsn5eMZzj7eGeYz");
                    xhr.setRequestHeader("Accept", "application/json");
                    }
                }).done(function(result){
                    console.log(result);

                    // artistDates[i].airportCode = result.code;

                })
    		}
    	}
    });
};

	// when user clicks #search-btn...
	$("#search-btn").on("click", function() {

	// empty the #results-div
	$("#results-div").empty();

	// place the search term user input into a variable
	var userArtist = $("#searchBand").val().trim();

	// console log the userArtist variable as a test
	console.log("User Search Input: " + userArtist);

	// call searchBandsInTown function 
	searchBandsInTown(userArtist);

	})

	// when user clicks #clear-btn...
	$("#clear-btn").on("click", function() {

		// empty the #results-div
		$("#results-div").empty();

		// empty the #searchBand input
		$("#searchBand").val("");
	})
})