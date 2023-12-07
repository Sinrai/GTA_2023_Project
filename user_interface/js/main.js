document.addEventListener("DOMContentLoaded", function() {
    const toolbar = document.querySelector('.toolbar');

    function checkWindowSize() {
        if (window.innerWidth <= 768) {
            // Wenn der Bildschirm klein ist (mobile Ansicht)
            toolbar.classList.remove('collapsed');
        } else {
            // Wenn der Bildschirm groß ist (Desktop-Ansicht)
            toolbar.classList.add('collapsed');
        }
    }

    // Initialisierung beim Laden der Seite
    checkWindowSize();

    // Eventlistener für Änderungen der Bildschirmgröße
    window.addEventListener('resize', function() {
        checkWindowSize();
    });

    // Restlicher Code bleibt unverändert
    document.getElementById("home_page").addEventListener("click", function() {
        loadContent('home.html');
    });
    document.getElementById("analysis_page").addEventListener("click", function() {
        if (isLoggedIn == true){
            loadContent('analysis.html');
        } else {
            alert("please login to access this page")
        }

    });
    
    document.getElementById("provider_page").addEventListener("click", function() {
        loadContent('provider_map.html');
        /*
        if (isLoggedIn == true){
            loadContent('provider_map.html');
        } else {
            alert("please login to access this page")
        }
        */
    });
    
    document.getElementById("faq_page").addEventListener("click", function() {
        loadContent('faq.html');
    });

    $(document).ready(function() {
        // Load content from home.html initially
        loadContent('home.html');
    });
});

function loadContent(page) {
    $.ajax({
        url: page,
        dataType: 'html',
        success: function(data) {
            $('#content').html(data);
        }
    });
}

let faqItems;
let loginButton;
let loginContainer;
let trackButton;
let userID;
let isLoggedIn; //Anmeldestatus vefolgen
let isTracking = false; //Tracking-Status verfolgen
let submitLogin;
let userID_empty;

let barwidth;
let height;
let balken;
let textElement;

let response_statisitc;
let response_netspeed;
let userStats;
let userStat;

function saveLoginStatus(status) {
    localStorage.setItem('isLoggedin', JSON.stringify(status));
}
