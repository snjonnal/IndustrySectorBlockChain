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

        var dataPie = google.visualization.arrayToDataTable(pieChartData);
        var optionsPie = {
          title: 'Blockchain by Industry',
          pieStartAngle: 30,
          height: 450
        };
        chart = new google.visualization.PieChart(document.getElementById('chart_div2'));
        chart.draw(dataPie, optionsPie);
        chart.setSelection([{row: 0}]);

        var qtrIndSectorArr = [];
        objArr = [];
        objArr.push('Quarter');
        objArr.push('Oppty Value');
        qtrIndSectorArr.push(objArr);

        qtrs.forEach((qtr) => {
          objArr = [];
          objArr.push(qtr);
          let sum = 0;
          for(var industry in data[qtr]){
            if(data[qtr].hasOwnProperty(industry)){
              sum += data[qtr][industry];
            }
          }
          objArr.push(sum);
          qtrIndSectorArr.push(objArr);
        });

        var qtrIndSectorChartOptions = {
          title: 'Opportunities value (USD mn)',
          hAxis: {
            title: 'Quarter',
            titleTextStyle: {
              color: 'blue'
            }
          },
          height: 450
        };

        var qtrIndSectorChartData = google.visualization.arrayToDataTable(qtrIndSectorArr);
        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div3'));
        //chart.draw(qtrIndSectorChartData, {width: 400, height: 240, is3D: true, title: 'Company Performance'});
        chart.draw(qtrIndSectorChartData, qtrIndSectorChartOptions);


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
