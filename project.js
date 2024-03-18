var chart1 = document.getElementById('chart1');
var chart2 = document.getElementById('chart2');
var chart3 = document.getElementById('chart3');

var explain1 = document.getElementById('explain1');
var explain2 = document.getElementById('explain2');
var explain3 = document.getElementById('explain3');

var btn1 = document.getElementById('btn1');
var btn2 = document.getElementById('btn2');
var btn3 = document.getElementById('btn3');

chart1.style.display = 'none';
chart2.style.display = 'none';
chart3.style.display = 'none';
explain1.style.display = "none";
explain2.style.display = "none";
explain3.style.display = "none";


btn1.addEventListener('click', function() {
    if (chart1.style.display === 'block') {
        chart1.style.display = 'none';
        explain1.style.display = 'none';
    } else {
        chart1.style.display = 'block';
        explain1.style.display = 'block';
    }
});

btn2.addEventListener('click', function() {
    if (chart2.style.display === 'block') {
        chart2.style.display = 'none';
        explain2.style.display = 'none';
    } else {
        chart2.style.display = 'block';
        explain2.style.display = 'block';
    }
});

btn3.addEventListener('click', function() {
    if (chart3.style.display === 'block') {
        chart3.style.display = 'none';
        explain3.style.display = 'none';
    } else {
        chart3.style.display = 'block';
        explain3.style.display = 'block';
    }
});