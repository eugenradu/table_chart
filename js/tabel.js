var dateTabel, dateGrafic, dateGsel = undefined;

var Tabel = new c3.Table({
    anchor: '#table',
    width: '75%',
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
        x: 'x',
        columns: [[], [], []],
        types: {},
        axes: {},
        colors: {}
    },
    tooltip: {
        grouped: true,
        format: {
            value: function (value) {
                return Math.round(value);
            }
        }
    },
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: "%b %Y",
                culling: false,
                rotate: 75
            }
        },
        y2: {
            show: true,
        }
    }
};

var initial = {
    "2015-01-01": "0",
    "2015-02-01": "0",
    "2015-03-01": "0",
    "2015-04-01": "0",
    "2015-05-01": "0",
    "2015-06-01": "0",
    "2015-07-01": "0",
    "2015-08-01": "0",
    "2015-09-01": "0",
    "2015-10-01": "173",
    "2015-11-01": "197",
    "2015-12-01": "163",
    "2016-01-01": "122",
    "2016-02-01": "72",
    "2016-03-01": "220",
    "2016-04-01": "188",
    "2016-05-01": "151",
    "2016-06-01": "156",
    "2016-07-01": "74",
    "2016-08-01": "0",
    "cod": "pi_g",
    "nume": "Ob-Gin - Numar paciente inscrise in proiect",
    "tinta": "1500"
};

iaDatele(prelDatele);

function iaDatele(callback) {
    d3.csv("csv/all.csv")
        .row(function (d) {
            return d;
        })
        .get(function (error, rows) {
            if (error) return console.error(error);
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
        return obiect
    });
    Tabelul(dateTabel, dateGrafic);
}

function Tabelul(dateT, dateG) {

    Tabel.data = dateT;
    Tabel.columns[0].cells.text = function (d) {
        return d.nume
    };
    Tabel.columns[0].cells.value = function (d) {
        return d.cod
    };
    Tabel.handlers = {
        'select': function (d) {
            selectia = d.map(function (d) {
                return d.cod;
            });
            dateGsel = dateG.filter(function (d) {
                return d.cod == selectia
            });
            Graficul(dateGsel[0]);

        }
    };
    Tabel.render();
}

function Graficul(date) {
    var valX = ['x'];
    var valYbar = [date.nume];
    var valYline = ['Realizat, cumulat'];
    var s = 0;
    Object.keys(date).forEach(function (cheie) {
        if (cheie === 'cod') {
            obi.cod = date[cheie]
        }
        else if (cheie === 'nume') {
            obi.nume = date[cheie]
        }
        else if (cheie === 'tinta') {
            obi.tinta = +date[cheie]
        }
        else {
            valX.push(new Date(cheie));
            valYbar.push(+date[cheie]);
            s += +date[cheie];
            valYline.push(s)
        }
    });
    scrieValorileinObiect(valX, valYbar, valYline)
}

function situatiiParticulare() {
    if (!isNaN(obi.tinta)) {
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
            obi.data.colors[vL[0]] = 'darkred';
            obi.data.types[vL[0]] = 'area';
        }
        else if (obi.cod == "trsf_nn") {
            vL = [];
            obi.data.columns[2].forEach(function (element, index) {
                if (isNaN(element)) {
                    vL.push('Realizat, procente')
                }
                else {
                    vL.push(Math.round((6 - obi.data.columns[1][index]) * 100 / obi.tinta))
                }
            });
            obi.data.columns[2] = vL;
            obi.data.axes[vL[0]] = 'y2';
            obi.data.colors[vL[0]] = 'darkred';
            obi.data.types[vL[0]] = 'area';
        }
        else {
            vL = [];
            obi.data.columns[2].forEach(function (element, index) {
                if (isNaN(element)) {
                    vL.push('Realizat, procente')
                }
                else {
                    vL.push(obi.data.columns[2][index] * 100 / obi.tinta)
                }
            });
            obi.data.columns[2] = vL;
            obi.data.axes[vL[0]] = 'y2';
            obi.data.colors[vL[0]] = 'darkred';
            obi.data.types[vL[0]] = 'area';
        }
    }
    else if (isNaN(obi.tinta)) {
        obi.tinta = obi.data.columns[2].slice(-1)[0];
    }
    c_3.generate(obi)
}

function scrieValorileinObiect(valX, valYbar, valYline) {
    obi.data.columns[0] = valX;
    obi.data.columns[1] = valYbar;
    obi.data.columns[2] = valYline;
    obi.data.types[valYbar[0]] = 'bar';
    obi.data.types[valYline[0]] = 'area';
    obi.data.axes[valYbar[0]] = 'y';
    obi.data.axes[valYline[0]] = 'y2';
    obi.data.colors[valYline[0]] = 'darkred';
    situatiiParticulare();
}

window.onload = function () {
    Graficul(initial);
};