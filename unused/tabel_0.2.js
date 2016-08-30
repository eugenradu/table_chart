var dateTabel, dateGrafic, dateGsel = undefined;

var bar_layer, line_layer;

var luniProiect = [
    //TODO mapeaza numele coloanelor din all.csv pe stringuri tip "ian 2015"
];

var Tabel = new c3.Table({
    anchor: '#table_example',
    width: 500,
    selectable: 'single',
    columns: [{
        header: {
            text: "Indicator"
        },
        cells: {
            styles: {
                color: 'black'
            }
        }
    }] //,
    //    handlers: {
    //        'select': function (selections) {

    //console.log(selections);
    //document.querySelector('#current_selection').innerText = selections}

    //    },
});

var plot = new c3.Plot({
    anchor: $('<div></div>').appendTo($('#plot_legend_example'))[0],
    anchor_styles: {'display': 'inline-block'},
    height: 300,
    width: '80%',
    axes: [
        new c3.Axis.X({
            grid: true,
            label: "Luna",
            scale: d3.scale.linear().domain([1, 20]),
        }),
        new c3.Axis.Y({
            grid: true,
            label: "Valori absolute",
            scale: d3.scale.linear().domain([0, 100]),
        }),
        new c3.Axis.Y({
            label: "Procente",
            orient: 'right',
            scale: d3.scale.linear().domain([0, 100]),
            //tick_label: (n) => "$" + n.toLocaleString() + "t",
            //axis_size: 75,
        })
    ],
    layers:     [
        bar_layer = new c3.Plot.Layer.Bar({
            name: "Bar Chart",
            x: [1, 20],
            //y: (d) => d[1, 20].val(),

        }),
        line_layer = new c3.Plot.Layer.Line({
            name: "Series 1",
            options: {
                styles: { 'stroke': 'red' },
            }}),

    ]
});

var legend = new c3.Legend.PlotLegend({
    anchor: $('<div></div>').appendTo($('#plot_legend_example'))[0],
    anchor_styles: {
        'display': 'inline-block',
        'vertical-align': 'top',
    },
    width: '20%',
    plot: plot,
});

iaDatele(prelDatele);

function iaDatele(callback) {
    d3.csv("csv/all.csv")
        .row(function(d) {
            return d;
        })
        .get(function(error, rows) {
            if (error) return console.error(error);
            // console.log('rows', rows);
            callback(rows)
        })
}

function prelDatele(rows) {
    dateTabel = rows.map(function (obiect) {
        return {
            cod: obiect.cod,
            nume: obiect.nume
        }
    });
    dateGrafic = rows.map(function (obiect) {
        var datac = [];
        var obi ={};
        var sir = '';
        Object.keys(obiect).forEach(
            function (cheie) {
                if (/20\d\d-/.test(cheie)) {
                // console.log('cheia', cheie);
                datac.push(cheie)}
            }
        );
        // console.log('datac', datac);
        obi.cod = obiect.cod;
        obi.tinta = +obiect.tinta;
        datac.forEach(function (elem) {
            sir += 'obi["' + eval(new Date(elem.toString())) + '"] = +obiect["' + elem.toString() + '"];';
            return eval(sir);
        });
        return obi});
    console.log('dT',dateTabel);
    console.log('dG',dateGrafic);
    Tabelul(dateTabel, dateGrafic);
}

function Tabelul (dateT, dateG) {

    Tabel.data = dateT;
    Tabel.columns[0].cells.text = function (d) {
        return d.nume
    };
    Tabel.columns[0].cells.value = function (d) {
        return d.cod
    };
    Tabel.handlers = {
        'select': function (d) {
            var selectia = d.map(function (d) {
                return d.cod;
            });
            document.querySelector('#current_selection').innerText = selectia;
            dateGsel = dateG.filter(function (d) {
                return d.cod == selectia
            });
            Graficul(dateGsel[0])
        }
    };
    Tabel.render();
    }

function Graficul(date) {
    var s= 0;
    var tinta = date.tinta;
    var valX =[], valYa=[], valYp=[];
    Object.keys(date).map(function(key){
        if (/^20/.test(key)){
            s += date[key];
            valX.push(key);
            valYa.push(date[key]);
            valYp.push(s);
        }
    });
    if (isNaN(tinta)) {
        tinta = valYa.reduce((a, b) => a + b, 0)
    }
    console.log(tinta, valX, valYa, valYp);
    plot.data = date;
    plot.layers[0].y = date;
    //plot.axes[1].scale.linear.domain([0,d3.max(date)]);
    //plot.layers[0].data = date;
    //plot.layers[1].data = date;
    plot.render()}



//despre iteratii http://stackoverflow.com/questions/3010840/loop-through-an-array-in-javascript
//simple d3 table and graph http://bl.ocks.org/d3noob/473f0cf66196a008cf99
//table-driven chart http://bl.ocks.org/mmparker/3670696