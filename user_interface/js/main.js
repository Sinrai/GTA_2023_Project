document.addEventListener("DOMContentLoaded", function() {
    // Navigation menu
    document.getElementById("home_page").addEventListener("click", function() {
        loadContent('home.html');
    });
    document.getElementById("analysis_page").addEventListener("click", function() {
        loadContent('analysis.html');
    });
    document.getElementById("provider_page").addEventListener("click", function() {
        loadContent('provider_map.html');
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
