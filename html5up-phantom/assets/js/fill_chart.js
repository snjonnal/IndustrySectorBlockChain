$(document).ready(function() {


$.ajax({
  url: 'opp_based_on_industry',
  success: function(response){

    google.charts.load("visualization", "1", {
			packages: ["corechart"]
		});
		google.charts.setOnLoadCallback(drawChart);


    function drawChart() {
      var industries = response.extras.industries;
      var qtrs = response.extras.qtrs;
      var data = response.extras.data;
      var chartData = [];
      var objArr = ['Year'].concat(industries);
      chartData.push(objArr);

      qtrs.forEach((qtr) => {
        objArr = [];
        objArr.push(qtr);
        industries.forEach((industry) => {
          if(data.hasOwnProperty(qtr)) {
            if(data[qtr].hasOwnProperty(industry)){
              objArr.push(data[qtr][industry]);
            }
            else{
              objArr.push(0.0);
            }
          }
        });
        chartData.push(objArr);
      });

        var options = {
          title: 'Opportunities value (USD mn)',
          hAxis: {
            title: 'Year 2017',
            titleTextStyle: {
              color: 'red'
            }
          },
          height: 450
        };
        var dataTable = google.visualization.arrayToDataTable(chartData);
        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div1'));
        chart.draw(dataTable, options);

        var pieChartData = [];
        pieChartData.push(['Industry', 'Opportunities value (USD mn)']);
        industries.forEach((industry) => {
          var value = 0.0;
          qtrs.forEach((qtr) =>{
            if(data.hasOwnProperty(qtr)){
              if(data[qtr].hasOwnProperty(industry)){
                value += parseFloat(data[qtr][industry]);
              }
            }
          });
          pieChartData.push([industry, value]);
        });

        //console.log('piechartdata');
        //console.log(pieChartData);

        var dataPie = google.visualization.arrayToDataTable(pieChartData);

        var optionsPie = {
          title: 'Blockchain by Industry',
          pieStartAngle: 30,
          height: 450
        };

        chart = new google.visualization.PieChart(document.getElementById('chart_div2'));
        chart.draw(dataPie, optionsPie);
        chart.setSelection([{row: 0}]);

    }

    google.charts.load("visualization", "1", {
			packages: ["corechart"]
		});

		$(window).resize(function() {
			drawChart();
		});
  }
})

});
