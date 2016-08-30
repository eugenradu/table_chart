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
            console.log('rows', rows);
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
    dateGrafic = rows.map(function (obiect) {return obiect});
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
    var obi = {
        data: {
            columns: [
                [],
                [],
                []
            ],
            types: {
            },
        },
        axis: {
            x: {
                type: 'categorized'
            }
        }};
    var valX = ['x']; var valYbar = [date.nume]; var valYline = ['Realizat'];
    var s = 0;
    Object.keys(date).forEach(
        function (cheie) {
            if (cheie === 'cod') {obi.cod = date[cheie]}
            else if (cheie === 'nume') {obi.nume = date[cheie]}
            else if (cheie === 'tinta') {obi.tinta = +date[cheie]}
            else {
                valX.push(cheie);
                valYbar.push(+date[cheie]);
                s += +date[cheie];
                valYline.push(s);
                }});
    obi.data.columns[0] = valX;
    obi.data.columns[1] = valYbar;
    obi.data.columns[2] = valYline;
    if (isNaN(obi.tinta )) {
        obi.tinta = obi.data.columns[2].slice(-1)[0];}
    console.log('obi', obi);
    propChart = obi;
    c_3.generate(propChart)
}

var propChart = {
    data: {
        columns: [
            ['data1', 30, 20, 50, 40, 60, 50],
        ],
        types: {
            data1: 'bar'
        },
    },
    axis: {
        x: {
            type: 'categorized'
        }
    }};
c_3.generate(propChart);