/**
 * Created by Eugen on 28/08/16.
 */

var chart = c_3.generate({
    data: {
        columns: [
            ['data1', 30, 20, 50, 40, 60, 50],
            ['data2', 200, 130, 90, 240, 130, 220],
            ['data3', 300, 200, 160, 400, 250, 250],
            ['data4', 200, 130, 90, 240, 130, 220],
            ['data5', 130, 120, 150, 140, 160, 150],
            ['data6', 90, 70, 20, 50, 60, 120],
        ],
        types: {
            data1: 'bar',
            data2: 'bar',
            data3: 'spline',
            data4: 'line',
            data5: 'bar',
            data6: 'area'
        },
        groups: [
            ['data1','data2']
        ]
    },
    axis: {
        x: {
            type: 'categorized'
        }
    }
});