/**
 * Created by UltraUSER on 8/21/2016.
 */
const kinveyBaseUrl ="https://baas.kinvey.com/";
const kinveyAppKey ="kid_ByzFBSP9";
const kinveyAppSecret ="19643d0a834640ce8d8a9b22818b2a71";
const kinveyAuthHeaders = {
    'Authorization': "Basic " + btoa(kinveyAppKey + ":" + kinveyAppSecret)
};
const guestUserHeader = {
    'Authorization': 'Kinvey 42c87b2c-dcc6-4ec5-a43f-ecb464c25ea0.4D/KSMnjRMQRvENIEeSmGxKaxSY6+3MVyPygEMfu7T0='
};

function showInfo(message) {
    $('#infoBox').text(message);
    $('#infoBox').show();

}
function showInfo1(message) {
    $('#infoBox1').text(message);
    $('#infoBox1').show();

}
function showInfo3(message) {
    $('#infoBox3').text(message);
    $('#infoBox3').show();

}
function showInfo4(message) {
    $('#infoBox4').text(message);
    $('#infoBox4').show();

}
function showInfo5(message) {
    $('#infoBox5').text(message);
    $('#infoBox5').show();

}
function showInfo6(message) {
    $('#infoBox6').text(message);
    $('#infoBox6').show();

}
function showInfo7(message) {
    $('#infoBox7').text(message);
    $('#infoBox7').show();

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
        window.location.reload();
        showInfo()
    }
}
function listOffers() {
    const kinveyOffersUrl = kinveyBaseUrl + "appdata/" + kinveyAppKey + "/Offers";
    const userAuthHeader = {
        "Authorization": "Kinvey " + sessionStorage.authToken
    };

    $.ajax({
        method: "GET",
        url: kinveyOffersUrl,
        headers: isUserLoggedIn() ? userAuthHeader : guestUserHeader,
        success: loadOffersSuccess,
        error: handleAjaxError
    });
}



function loadOffersSuccess(Offers) {
    console.log('Offers loaded.');

    if (Offers.length == 0) {
        $('#Offers').text('No Offers to Display.');
    } else {
        for (let offer of Offers) {
            $("#Offers").append([
                '<div class="col-xs-4 offer">',
                '   <h2 class="offer-title" ">' + offer.Title + '</h2>',
                '   <div class="text-info offer-name">' + offer.FullName + '</div>',
                '   <div class="text-info offer-description">' + offer.Description + '</div>',
                '   <div class="row">',
                '      <div class="col-xs-8 offer-phone">' + offer.PhoneNumber + '</div>',
                '   </div>',
                '      <div class="col-xs-4 offer-price">' + offer.Price + '</div>',
                '   </div>',
                '</div>'
            ].join(''));
        }
    }
}
    function logout() {
        sessionStorage.clear();
        window.location.reload();
        showInfo1();
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

        let requestData = {
            username: user.username,
            password: user.password,
            name: user.name
        };
        if (requestData.username.length < 5) {
            showInfo5()
            return;
        }
        if (requestData.password !== user.repassword ) {
            showInfo3()
            return;
        }
        if (user.name === "" ||
            user.password === "" ||
            user.username === "") {
        showInfo4()
            return;
        }

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
            showInfo6()
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
        if (
            $('#OfferTitle').val() === "" ||
        $('#OfferFullName').val() === "" ||
            $('#OfferPhoneNumber').val() === "" ||
            $('#OfferPrice').val() === "" ||
            $('#OfferDescription').val() === "") {
            showInfo4()
            return;
        }
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
            showInfo7()
        }

    }


    $("#register-form").on('submit', register);
    $("#login-nav").on('submit', login);
    $("#createOffer-form").on('submit', createOffer);

    var page = page || '';

    if (page === 'viewoffers') {
        listOffers();
    }

    $(function () {
        $navbar = $('.navbar-right');

        if (isUserLoggedIn()) {
            var logoutElement = $('<li><a href="Home.html">Log Out</a></li>');
            logoutElement.on('click', logout);
            $navbar.html(logoutElement);
        }
    });

    $(function () {
        if (isUserLoggedIn()) {
            $navbar = $('#posttheoffer').show();

        }
    });
