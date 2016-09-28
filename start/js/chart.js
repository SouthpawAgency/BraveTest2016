$(function() {
        // Create the chart
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'gender',
                backgroundColor: "none",
                border: "none",
                type: 'pie'

            },
            title: {
                text: ''
            },
            exporting: { 
            	enabled: false 
            },
            credits: {
			    enabled: false
			},
            yAxis: {
                title: {
                    text: ''
                }
            },
            plotOptions: {
                pie: {
                    shadow: false
                }
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.point.name +'</b>: '+ this.y +' %';
                }
            },
            series: [{
                name: 'Gender',
                data: [["Female",40],["Male",60],],
                size: '60%',
                innerSize: '50%',
                showInLegend:false,
                dataLabels: {
                    enabled: false
                }


            }]
        });
    });