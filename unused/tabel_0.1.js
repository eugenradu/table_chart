var numeColoane = ["Data",
    "Spatii hematologie",
    "Teste moleculare realizate, procente",
    "Echipamente achizitionate",
    "Reactivi genetica achizitionati",
    "Nr. teste genetice realizate",
    "Reactivi citometrie achizitionati",
    "Markeri citometrie testati, media per caz",
    "Markeri citometrie testati, procente"
];

var table = new c3.Table({
    anchor: '#table_example',
    width: 500,
    selectable: 'multi',
    columns: [{
            header: {
                text: "Data"
            },
            sort_ascending: true,
            cells: {
                styles: {
                    color: 'black'
                }
            }
        }, {
            header: {
                text: "% amenajarea spatiilor"
            },
            cells: {}
        }, {
            header: {
                text: "% teste moleculare"
            },
            cells: {}
        }] //,
        //    handlers: {
        //        'select': function (selections) {

    //console.log(selections);
    //document.querySelector('#current_selection').innerText = selections}

    //    },
});



function iaDatele(callback) {
    d3.csv("csv/h1.csv")
        .row(function(d) {
            return {
                Data: new Date(d.data),
                sp_h: +d.sp_h,
                mol_h: +d.mol_h,
                echi_m_h: +d.echi_m_h,
                react_m_h: +d.react_m_h,
                tg_h: +d.tg_h,
                react_c_h: +d.react_c_h,
                mf_h: +d.mf_h,
                mrk_h: +d.mrk_h
            };
        })
        .get(function(error, rows) {
            if (error) return console.error(error);
            callback(rows)
        })
}


function folosesteDatele(rows) {
    console.log("rows", rows);
    table.data = rows;
    table.columns[0].cells.text = function(rows) {
        return rows.Data
    };
    table.columns[0].cells.value = function(rows) {
        return rows.Data
    };
    table.columns[1].cells.text = function(rows) {
        return +rows.sp_h * 100
    };
    table.columns[1].cells.value = function(rows) {
        return +rows.sp_h * 100
    };
    table.columns[2].cells.text = function(rows) {
        return +rows.mol_h * 100
    };
    table.columns[1].cells.value = function(rows) {
        return +rows.mol_h * 100
    };
    table.handlers = {
        'select': function(d) {
                var oful = d.map(function (d) {return d.Data;});
                console.log("v", oful);
                document.querySelector('#current_selection').innerText = oful;
            }
    };
    table.render()
}

iaDatele(folosesteDatele);


//TODO: Definit coloanele tabelului iterativ
//TODO: Format date in Tabel

//despre iteratii http://stackoverflow.com/questions/3010840/loop-through-an-array-in-javascript
//simple d3 table and graph http://bl.ocks.org/d3noob/473f0cf66196a008cf99
