/**
 * Created by UltraUSER on 8/21/2016.
 */
const kinveyBaseUrl ="https://baas.kinvey.com/";
const kinveyAppKey ="kid_ByzFBSP9";
const kinveyAppSecret ="19643d0a834640ce8d8a9b22818b2a71";
const kinveyAuthHeaders = {
    'Authorization': "Basic " + btoa(kinveyAppKey + ":" + kinveyAppSecret)
};

window.kinvey = {
    kinveyBaseUrl,
    kinveyAppKey,
    kinveyAppSecret,
    kinveyAuthHeaders
};

function showInfo(message) {
    $('#infoBox').text(message);
    $('#infoBox').show();
    setTimeout(function() { $('#infoBox').fadeOut()},3000);
}

function showError(errorMsg) {
    $('#errorBox').text("Error: " + errorMsg);
    $('#errorBox').show();
}

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response);

    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error.";

    if (response.responseJSON && response.responseJSON.description)
        errorMsg = response.responseJSON.description;

        console.log("Fail", errorMsg);

    // showError(errorMsg);
}

function login(e) {
    e.preventDefault();

    const kinveyLoginUrl = kinveyBaseUrl + "user/" + kinveyAppKey + "/login";

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


        console.log("User logged in");

        // showInfo('Login successful');
        // ShowHomePage();
    }
}
function listOffers() {
    const kinveyOffersUrl = kinveyBaseUrl + "appdata/" + kinveyAppKey + "/Offers";
    const userAuthHeader = {
        "Authorization": kinveyAuthHeaders.Authorization + "; Kinvey " + sessionStorage.authToken
    };
    $.ajax({
        method: "GET",
        url: kinveyOffersUrl,
        headers: userAuthHeader,
        success: loadOffersSuccess,
        error: handleAjaxError
    });
}



        function loadOffersSuccess(Offers) {
            showInfo('Offers loaded.');
            if (Offers.length == 0) {
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

function register(e) {
    e.preventDefault();

    const kinveyRegisterUrl = kinveyBaseUrl + "user/" + kinveyAppKey + "/";

    let user = {
        name: $('#name').val(),
        username: $('#username').val(),
        password: $('#password').val(),
        repassword: $('#confirm').val()
    };

    if (user.password !== user.repassword) {
        //TODO: Display error
        return;
    }

    if (user.name === "" ||
        user.password === "" ||
        user.username === "") {
        //TODO: Display error
        return;
    }

    let requestData = {
        username: user.username,
        password: user.password,
        name: user.name,
    };

    $.ajax({
        method: "POST",
        url: kinveyRegisterUrl,
        headers: kinveyAuthHeaders,
        data: requestData,
        success: registerSuccess,
        error: handleAjaxError
    });

    function registerSuccess(response) {
        let userAuth = response._kmd.authtoken;
        sessionStorage.setItem('authToken', userAuth);
        console.log('User registration successful.');
    }
}

function isUserLoggedIn() {
    return sessionStorage.hasOwnProperty('authToken');
}

function createOffer(e) {
    e.preventDefault();

    const kinveyOffersUrl = kinveyBaseUrl + "appdata/" + kinveyAppKey + "/Offers";
    const userAuthHeader = {
        "Authorization": "Kinvey " + sessionStorage.authToken
    };

    if (!isUserLoggedIn()) {
        //TODO: Show error
        return;
    }

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
        headers: userAuthHeader,
        data: OfferData,
        success: createOfferSuccess,
        error: handleAjaxError
    });

    function createOfferSuccess(response) {
        console.log("Offer Created");
        showInfo('Offer created.');
    }

}



$("#register-form").on('submit', register);
$("#login-nav").on('submit', login);
$("#createOffer-form").on('submit', createOffer);
$("#list").click(listOffers);

