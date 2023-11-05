$(document).ready(function() {
    document.getElementById("show_map").addEventListener("click", function() {
        loadContent('user_map.html');
    });

    function generateValues() {
        const values = [10 ,20 ,60];

        for (let i = 0; i < values.length; i++) {
            const balken = document.getElementById(`balken${i + 1}`);
            balken.style.width = `${values[i]}%`;
        }
    }
});
