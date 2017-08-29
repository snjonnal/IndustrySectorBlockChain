$(document).ready(function() {


$.ajax({
  url: 'opp_based_on_industry',
  success: function(response){

    google.charts.load("visualization", "1", {
			packages: ["corechart"]
		});
		google.charts.setOnLoadCallback(drawChart2(response));


    function drawChart2(response) {

    var industries = response.extras.industries;
    var qtrs = response.extras.qtrs;
    var data = response.extras.data;

    var chartData = [];

    //for - qtrs
    //  for - industries

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

    console.log('chartData');
    console.log(chartData);

      var options = {
        title: 'Opportunities value (USD mn)',
        hAxis: {
          title: 'Year 2017',
          titleTextStyle: {
            color: 'red'
          }
        }
      };
      var dataTable = google.visualization.arrayToDataTable(chartData);
      var chart = new google.visualization.ColumnChart(document.getElementById('chart_div1'));
      chart.draw(dataTable, options);
    }

    //console.log('response for opp_based_on_industry');
    //console.log(response);
    //drawChart2(response);


    google.charts.load("visualization", "1", {
			packages: ["corechart"]
		});

		$(window).resize(function() {
			drawChart2(response);
		});


  }
})

});
