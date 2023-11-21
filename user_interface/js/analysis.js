$(document).ready(function() {
    document.getElementById("show_map").addEventListener("click", function() {
        loadContent('user_map.html');
    });

    let values = [Math.random() * 100, Math.random() * 100, Math.random() * 100];
    // console.log("thevalues", values);
    for (let i = 0; i < values.length; i++) {
        let balken = document.getElementById(`balken${i + 1}`);
        balken.style.height = `${values[i]}%`;
        balken.style.width = 50;
    }
});
