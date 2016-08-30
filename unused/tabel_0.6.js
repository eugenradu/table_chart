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

var obi = {
    data: {
        x : 'x',
        columns: [[], [], []],
        types: {},
        axes: {}
    },
    tooltip: {
        grouped: false,
        format: {

        }

    },
    axis: {
        x: {
            type: 'timeseries',
            tick : {format: "%b %Y",
                culling: false,
                rotate: 75}
        },
        y2: {show: true}
    }};

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
    dateGrafic = rows.map(function (obiect) {return obiect});
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
            // console.log('dateGsel', dateGsel);
            Graficul(dateGsel[0])
        }
    };
    Tabel.render();
    }

function Graficul(date) {
    var valX = ['x']; var valYbar = [date.nume]; var valYline = ['Realizat, cumulat:'];
    var s = 0;
    // console.log('dg', date);
    Object.keys(date).forEach(function (cheie) {
        if (cheie === 'cod') {obi.cod = date[cheie]}
        else if (cheie === 'nume') {obi.nume = date[cheie]}
        else if (cheie === 'tinta') {obi.tinta = +date[cheie]}
        else {
            valX.push(new Date(cheie));
            valYbar.push(+date[cheie]);
            s += +date[cheie];
            valYline.push(s)}
    });
    // console.log('vyl', valYline);
    scrieValorileinObiect(valX, valYbar, valYline)
}

function situatiiParticulare() {
    var tot = undefined;
    if (!isNaN(obi.tinta)) {
        tot = obi.data.columns[2].slice(-1)[0];
        console.log('tot', tot);
        if (obi.cod == "int_t_nn" || obi.cod == "mf_h") {
            var vL = [];
            obi.data.columns[2].forEach(function (element, index) {
                if (isNaN(element)) {
                    vL.push('Realizat, procente')
                }
                else {
                    vL.push(Math.round(obi.data.columns[1][index] * 100 / obi.tinta))
                }
            });
            obi.data.columns[2] = vL;
            obi.data.axes[vL[0]] = 'y2';
        }
        else if (obi.cod == "trsf_nn") {
            vL = [];
            obi.data.columns[2].forEach(function (element, index) {
                if (isNaN(element)) {
                    vL.push('Realizat, procente:')
                }
                else {
                    vL.push(Math.round((6 - obi.data.columns[1][index]) * 100 / obi.tinta))
                }
            });
            obi.data.columns[2] = vL;
            obi.data.axes[vL[0]] = 'y2';
        }
        else {
            vL = [];
            obi.data.columns[2].forEach(function (element, index) {
                if (isNaN(element)) {
                    vL.push('Realizat, procente:')
                }
                else {
                    vL.push(Math.round(obi.data.columns[2][index]) * 100 / tot)
                }
            });
            obi.data.columns[2] = vL;
            obi.data.axes[vL[0]] = 'y2';
        }
    }
    else if (isNaN(obi.tinta)) {
        obi.tinta = obi.data.columns[2].slice(-1)[0];
            }
    console.log('obi', obi);
    c_3.generate(obi)
}

function scrieValorileinObiect(valX, valYbar, valYline){
    obi.data.columns[0] = valX;
    obi.data.columns[1] = valYbar;
    obi.data.columns[2] = valYline;
    obi.data.types[valYbar[0]] = 'bar';
    obi.data.types[valYline[0]] = 'area';
    obi.data.axes[valYbar[0]] = 'y';
    obi.data.axes[valYline[0]] = 'y2';
    situatiiParticulare();
}