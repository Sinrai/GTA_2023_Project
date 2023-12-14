document.addEventListener("DOMContentLoaded", function() {

    // check window size to adapt toolbar style
    const toolbar = document.querySelector('.toolbar');
    function checkWindowSize() {
        if (window.innerWidth <= 768) {
            toolbar.classList.remove('collapsed');
        } else {
            toolbar.classList.add('collapsed');
        }
    }
    checkWindowSize();

    window.addEventListener('resize', function() {
        checkWindowSize();
    });

    //change to home page
    document.getElementById("home_page").addEventListener("click", function() {
        loadContent('home.html');
    });

    // change to personal data analysis page if logged in
    document.getElementById("analysis_page").addEventListener("click", function() {
        if (isLoggedIn == true){
            loadContent('analysis.html');
        } else {
            alert("please login to access this page")
        }
    });
    
    // change to network coverage page
    document.getElementById("provider_page").addEventListener("click", function() {
        loadContent('provider_map.html');
    });
    
    // change to faq page
    document.getElementById("faq_page").addEventListener("click", function() {
        loadContent('faq.html');
    });

    // load content from home.html initially
    $(document).ready(function() {
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

// initialize all variables used later on
let loginButton;
let loginContainer;
let trackButton;
let userID;
let isLoggedIn; 
let isTracking = false; 
let submitLogin;
let userID_empty;

let barwidth;
let height;
let balken;
let textElement;
let response_statisitc;
let response_netspeed;
let userStats;

let faqItems;

// save login status in local storage
function saveLoginStatus(status) {
    localStorage.setItem('isLoggedin', JSON.stringify(status));
}
