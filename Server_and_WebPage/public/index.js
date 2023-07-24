var socket = io.connect('192.168.1.101:5001', {'forceNew':true});
var explodedValues = [4];


socket.on('desde_servidor_temp_c', function(data){
    //console.log(data);
    //data_JSON = JSON.parse(data)
    var cadena = `<div> <strong> Temperatura:  <font color="gray">` + data + `°C</font></strong> </div>`;
    document.getElementById("div_temperatura_c").innerHTML = cadena;
    
    explodedValues[0] = parseFloat(data);
    drawVisualization();
});

socket.on('desde_servidor_temp_f', function(data){
    //console.log(data);
    //data_JSON = JSON.parse(data)
    var cadena = `<div> <strong> Temperatura:  <font color="blue">` + data + `°F</strong> </div>`;
    document.getElementById("div_temperatura_f").innerHTML = cadena;
    explodedValues[1] = parseFloat(data);
    drawVisualization();
});

socket.on('desde_servidor_hum', function(data){
    //console.log(data);
    //data_JSON = JSON.parse(data)
    var cadena = `<div> <strong> Humedad:  <font color="green">` + data + `%</strong> </div>`;
    document.getElementById("div_humedad").innerHTML = cadena;
    explodedValues[2] = parseFloat(data);
    drawVisualization();
});

socket.on('desde_servidor_otro', function(data){
    //console.log(data);
    //data_JSON = JSON.parse(data)
    var cadena = `<div> <strong> Otro:  <font color="orange">` + data + `</strong> </div>`;
    document.getElementById("div_otro").innerHTML = cadena;
    explodedValues[3] = parseFloat(data);
    drawVisualization();
});

function encender()
{
    socket.emit("desde_cliente","ON");
}

function apagar()
{
    socket.emit("desde_cliente","OFF");
}

function enviar_comando()
{
    var comando = document.getElementById('txt_comando').value;
    socket.emit('desde_cliente',comando);

}


function drawVisualization() {
    // Create and populate the data table from the values received via websocket
    var data = google.visualization.arrayToDataTable([
        ['Tracker', '1',{ role: 'style' }],
        ['Temp[C]', explodedValues[0],'color: gray'],
        ['Temp[F]', explodedValues[1],'color: blue'],
        ['Hum[%]', explodedValues[2],'color: green'],
        ['Otro',   explodedValues[3],'color: orange']
    ]);
    
    // use a DataView to 0-out all the values in the data set for the initial draw
    var view = new google.visualization.DataView(data);
    view.setColumns([0, {
        type: 'number',
        label: data.getColumnLabel(1),
        calc: function () {return 0;}
    }]);
    
    // Create and draw the plot
    var chart = new google.visualization.BarChart(document.getElementById('div_grafica'));
    
    var options = {
        title:"Monitoreo",
        width: 1200,
        height: 300,
        bar: { groupWidth: "95%" },
        legend: { position: "none" },
        animation: {
            duration: 0
        },
        hAxis: {
            // set these values to make the initial animation smoother
            minValue: 0,
            maxValue: 200
        }
    };
    
    var runOnce = google.visualization.events.addListener(chart, 'ready', function () {
        google.visualization.events.removeListener(runOnce);
        chart.draw(data, options);
    });
    
    chart.draw(view, options);
}

google.load('visualization', '1', {packages: ['corechart'], callback: drawVisualization});


