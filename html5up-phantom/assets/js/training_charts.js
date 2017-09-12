$(document).ready(function() {

$.ajax({
  url: 'badge_data',
  success: function(response){

    google.charts.load("visualization", "1", {
			packages: ["corechart"]
		});
		google.charts.setOnLoadCallback(drawChart);


    function drawChart() {
      var badgeData  = response.extras.data;
      var badgesIndSectorArr = [];
      var badgesIndSectorPieArr = [];
      objArr = [];
      objArrPieChart = [];
      objArr.push('Sector');
      objArr.push('Badges Acquired-(%)');
      objArrPieChart.push('Sector');
      objArrPieChart.push('Badges Acquired');
      badgesIndSectorArr.push(objArr);
      badgesIndSectorPieArr.push(objArrPieChart);

      badgeData.forEach((badgeDetails) => {
        objArr = [];
        objArrPieChart = [];
        var percentValue;
        if(badgeDetails["Target"] && badgeDetails["Target"]!=='' && badgeDetails["Badges"] && badgeDetails["Badges"]!==''){
          percentValue = (badgeDetails["Badges"]/badgeDetails["Target"]) * 100;
        }
        objArr.push(badgeDetails["Sector"]);
        objArr.push(percentValue);
        objArrPieChart.push(badgeDetails["Sector"]);
        objArrPieChart.push(parseInt(badgeDetails["Badges"]));
        badgesIndSectorArr.push(objArr);
        badgesIndSectorPieArr.push(objArrPieChart);
      });

      var badgesIndSectorChartOptions = {
        title: 'Badges Acquired-(%)',
        hAxis: {
          title: 'Sector',
          titleTextStyle: {
            color: 'blue'
          }
        },
        height: 450
      };

      var badgesIndSectorPieChartOptions = {
        title: 'Badges Acquired',
        is3D: true,
        pieStartAngle: 30,
        height: 450
      };

      var badgesIndSectorChartData = google.visualization.arrayToDataTable(badgesIndSectorArr);
      var chart = new google.visualization.ColumnChart(document.getElementById('chart_div1'));
      chart.draw(badgesIndSectorChartData, badgesIndSectorChartOptions);

      var badgesIndSectorPieChartData = google.visualization.arrayToDataTable(badgesIndSectorPieArr);
      var pieChart = new google.visualization.PieChart(document.getElementById('chart_div2'));
      pieChart.draw(badgesIndSectorPieChartData, badgesIndSectorPieChartOptions);
    }

    google.charts.load("visualization", "1", {
			packages: ["corechart"]
		});

		$(window).resize(function() {
			drawChart();
		});
  }
});

$.ajax({
  url: 'blockchainAwarenessCourse_data',
  success:function(response){
    google.charts.load("visualization", "1", {
			packages: ["corechart"]
		});
		google.charts.setOnLoadCallback(drawChart);


    function drawChart() {
      var blockchainAwarenessCourseData  = response.extras.data;
      var blockchainAwarenessCourseIndSectorArr = [];
      var blockchainAwarenessCourseIndSectorPieArr = [];
      objArrBarChart = [];
      objArrPieChart = [];
      objArrBarChart.push('Sector');
      objArrBarChart.push('Target');
      objArrBarChart.push('Status');

      objArrPieChart.push('Sector');
      objArrPieChart.push('Status');
      blockchainAwarenessCourseIndSectorArr.push(objArrBarChart);
      blockchainAwarenessCourseIndSectorPieArr.push(objArrPieChart);

      blockchainAwarenessCourseData.forEach((badgeDetails) => {
        objArrBarChart = [];
        objArrPieChart = [];
        var percentValue;

        objArrBarChart.push(badgeDetails["Sector"]);
        objArrBarChart.push(parseInt(badgeDetails["Target"]));
        objArrBarChart.push(parseInt(badgeDetails["Course Completion"]));

        objArrPieChart.push(badgeDetails["Sector"]);
        objArrPieChart.push(parseInt(badgeDetails["Course Completion"]));

        blockchainAwarenessCourseIndSectorArr.push(objArrBarChart);
        blockchainAwarenessCourseIndSectorPieArr.push(objArrPieChart);
      });

      var blockchainAwarenessCoursesChartOptions = {
        title: 'Blockchain India Sector wise Status for Awareness Course',
        hAxis: {
          title: 'Sector',
          titleTextStyle: {
            color: 'blue'
          }
        },
        height: 450
      };

      var blockchainAwarenessCoursesPieChartOptions = {
        title: 'Block Chain Awareness Course Completion',
        is3D: true,
        pieStartAngle: 30,
        height: 450
      };

      var blockchainAwarenessCoursesChartData = google.visualization.arrayToDataTable(blockchainAwarenessCourseIndSectorArr);
      var chart = new google.visualization.ColumnChart(document.getElementById('chart_div3'));
      chart.draw(blockchainAwarenessCoursesChartData, blockchainAwarenessCoursesChartOptions);

      var blockchainAwarenessCoursesPieChartData = google.visualization.arrayToDataTable(blockchainAwarenessCourseIndSectorPieArr);
      var pieChart = new google.visualization.PieChart(document.getElementById('chart_div4'));
      pieChart.draw(blockchainAwarenessCoursesPieChartData, blockchainAwarenessCoursesPieChartOptions);
    }

    google.charts.load("visualization", "1", {
			packages: ["corechart"]
		});

		$(window).resize(function() {
			drawChart();
		});

  }
});


});
