var dateTabel, dateGrafic, dateGsel = undefined;

var Tabel = new c3.Table({
    anchor: '#table',
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
    }]
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
        // console.log('obi', obi);
        return obi});
    // console.log('dT',dateTabel);
    // console.log('dG',dateGrafic);
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
            // document.querySelector('#current_selection').innerText = selectia;
            dateGsel = dateG.filter(function (d) {
                return d.cod == selectia
            });
            // console.log('dateGsel', dateGsel[0]);
            Graficul(dateGsel[0])
        }
    };
    Tabel.render();
    }

function Graficul(date) {
    var dtt = Object.values(date);
    console.log('dg', dtt);
    propChart.data.columns = [];
    propChart.data.columns[0] = dtt;
    //TODO cod in types
    chart = c_3.generate(propChart);
}

var propChart = {
    data: {
        columns: [
            ['data1', 30, 20, 50, 40, 60, 50],
        ],
        types: {
            data1: 'bar',
            data2: 'bar',
        },
    },
    axis: {
        x: {
            type: 'categorized'
        }
    }};

console.log('pc', propChart);

var chart = c_3.generate(propChart);