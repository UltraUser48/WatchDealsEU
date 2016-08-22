/**
 * Created by UltraUSER on 8/21/2016.
 */

const kinveyBaseUrl ="https://baas.kinvey.com/";
const kinveyAppKey ="kid_ByzFBSP9";
const kinveyAppSecret ="19643d0a834640ce8d8a9b22818b2a71";

function showInfo(message) {
    $('#infoBox').text(message);
    $('#infoBox').show();
    setTimeout(function() { $('#infoBox').fadeOut()},3000);
}
function showError(errorMsg) {
    $('#errorBox').text("Error: " + errorMsg);
    $('#errorBox').show();
}


function login() {
    const kinveyLoginUrl = kinveyBaseUrl + "user/" + kinveyAppKey + "/login";
    const kinveyAuthHeaders = {
        'Authorization': "Basic " + btoa(kinveyAppKey + ":" + kinveyAppSecret)
    };
    let userData = {
        username: $('#usr').val(),
        password: $('#pwd').val()
    };
    $.ajax({
        method: "POST",
        url: kinveyLoginUrl,
        headers: kinveyAuthHeaders,
        data: userData,
        success: loginSuccess,
        error: handleAjaxError
    });
    function loginSuccess(response) {
        let userAuth = response._kmd.authtoken;
        sessionStorage.setItem('authToken', userAuth);
        showInfo('Login successful');
        ShowHomePage();
    }
        function handleAjaxError(response) {
            let errorMsg = JSON.stringify(response);
            if (response.readyState === 0)
                errorMsg = "Cannot connect due to network error.";
            if (response.responseJSON && response.responseJSON.description)
                errorMsg = response.responseJSON.description;
            showError(errorMsg);
        }


    function register() {
        const kinveyRegisterUrl = kinveyBaseUrl + "user/" + kinveyAppKey + "/";
        const kinveyAuthHeaders = {
            'Authorization': "Basic " + btoa(kinveyAppKey + ":" + kinveyAppSecret),
        };
        let userData = {
            username: $('#username1').val(),
            password: $('#password1').val()
        };
        $.ajax({
            method: "POST",
            url: kinveyRegisterUrl,
            headers: kinveyAuthHeaders,
            data: userData,
            success: registerSuccess,
            error: handleAjaxError
        });
        function registerSuccess(response) {
            let userAuth = response._kmd.authtoken;
            sessionStorage.setItem('authToken', userAuth);
            showInfo('User registration successful.');
        }
    }

    function listOffers() {
        const kinveyOffersUrl = kinveyBaseUrl + "appdata/" + kinveyAppKey + "/Offers";
        const kinveyAuthHeaders = {
            'Authorization': "Kinvey " + sessionStorage.getItem('suthToken'),
        };
        $.ajax({
            method: "GET",
            url: kinveyOffersUrl,
            headers: kinveyAuthHeaders,
            success: loadOffersSuccess,
            error : handleAjaxError
        });
        function loadOffersSuccess(Offers) {
            showInfo('Books loaded.');
            if (offers.length == 0) {
                $('#Offers').text('No Offers to Display.');
            } else {
                let OffersTable = $('<table>')
                    .append($('<tr>').append(
                        '<th>Title</th>',
                        '<th>FullName</th>',
                        '<th>PhoneNumber</th>',
                        '<th>Price</th>',
                        '<th>Description</th>')
                    );
                for (let offer of Offers) {
                    OffersTable.append($('<tr>').append(
                        $('<td>').text(offer.Title),
                        $('<td>').text(offer.FullName),
                        $('<td>').text(offer.PhoneNumber),
                        $('<td>').text(offer.Price),
                        $('<td>').text(offer.Description))
                    );
                }
                $('#Offers').append(OffersTable);
            }
        }
    }

    function createOffer() {
        const kinveyOffersUrl = kinveyBaseUrl + "appdata/" + kinveyAppKey + "/Offers";
        const kinveyAuthHeaders = {
            'Authorization': "Kinvey " + sessionStorage.getItem('authToken'),
        };
        let OfferData = {
            Title: $('#OfferTitle').val(),
            FullName: $('#OfferFullName').val(),
            PhoneNumber: $('#OfferPhoneNumber').val(),
            Price: $('#OfferPrice').val(),
            Description: $('#OfferDescription').val()
        };
        $.ajax({
            method: "POST",
            url: kinveyOffersUrl,
            headers: kinveyAuthHeaders,
            data: OfferData,
            success: createOfferSuccess,
            error: handleAjaxError
        });
        function createOfferSuccess(response) {
            showInfo('Offer created.');
        }

    }

    function logout() {
        sessionStorage.clear();

    }

    function ShowHomePage() {
        let _that = this;
        let templateUrl;

        $.get(templateUrl, function (template) {
            let renderedWrapper = Mustache.render(template, null);
            $(_that._wrapperSelector).html(renderedWrapper);

            $.get('Home.html', function (template) {
                let rendered = Mustache.render(template, null);
                $(_that._mainContentSelector).html(rendered);
            })
        })
    }
}
