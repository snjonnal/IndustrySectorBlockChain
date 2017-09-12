const MAX_ROWS = 10;
$(document).ready(function() {

  $(document).on('mouseenter', '.mightOverflow', function() {
    let $t = $(this);
    let title = $t.attr('title');
    if (!title) {
      if (this.offsetWidth < this.scrollWidth) $t.attr('title', $t.text())
    } else {
      if (this.offsetWidth >= this.scrollWidth && title == $t.text()) $t.removeAttr('title')
    }
  });

  //$.getJSON("data/data.json", function(data) {
  $.ajax({
    url: 'opp_data?sales_stage=07-Won',
    success: function(response) {

      if (!response.success) return console.log(response.extras.msg);
      var data = response.extras.data;
      var opportunityTable = new OpportunityTable(data,"oppr_table", ["Industry", "Qtr"],
        ["industrySelect", "qtrSelect"], "reset");
      opportunityTable.createTable();
    }
  });

  $.ajax({
    url: 'opp_data?sales_stage=05,06',
    success: function(response) {

      if (!response.success) return console.log(response.extras.msg);
      var data1 = response.extras.data;
      var opportunityTable1 = new OpportunityTable(data1,"oppr_table1", ["Industry", "Qtr"],
        ["industrySelect1", "qtrSelect1"], "reset1");
      opportunityTable1.createTable();
    }
  });
});

function showOpportunityModal(placementId, oppDataObj) {

  var html = '<div id="modalWindow" tabindex="-1" class="modal hide"role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">';
  html += '<div class="modal-dialog modal-lg" role="document">';
  html += '<div class="modal-content">';
  html += '<div class="modal-header">';
  html += '<button type="button" class="close" style="height:1em;" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span></button>';
  html += '<h5 class="modal-title" id="modalLabel">' + oppDataObj["Client name"] + '</h5>';
  html += '</div>';
  html += '<div class="modal-body">';
  // html += "<img class=\"center-block img-fluid img-responsive\" src=\"images/" + oppDataObj.Image + "\" class=\"img-fluid\" alt=\"\">";


  html += '<div id="desc">';
  html += '<h3 class="no-margin">Opportunity Number</h3>';
  html += '<p>' + oppDataObj["Opportunity Number"] + '</p>';
  html += '</div>';

  html += '<div id="desc">';
  html += '<h3 class="no-margin">Description</h3>';
  html += '<p>' + oppDataObj["Description"] + '</p>';
  html += '</div>';

  html += '<div id="engaged_cic">';
  html += '<h3 class="no-margin">Engaged CIC</h3>'
  html += '<p>' + oppDataObj["Engaged CIC"] + '</p>';
  html += '</div>';
  html += '<div id="industry">';
  html += '<h3 class="no-margin">Industry</h3>';
  html += '<p>' + oppDataObj["Industry"] + '</p>';
  html += '</div>';
  html += '<div id="owner">';
  html += '<h3 class="no-margin">Opportunity Owner </h3>';
  html += '<p>' + oppDataObj["Opportunity Owner"] + '</p>';
  html += '</div>';

  html += '</div>';
  html += '<div class="modal-footer">';

  html += '<span class="btn btn-secondary btn-close link" data-dismiss="modal">Close</span>';

  html += '</div>'; // footer
  html += '</div>'; // modalWindow
  $("#" + placementId).html(html);
  $("#modalWindow").modal();


}
