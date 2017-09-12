$(document).ready(function() {
  $.ajax({
    url: 'mvp_data',
    success: function(response) {
      if (!response.success) return console.log(response.extras.msg);
      var data = response.extras.data;

      for (var i = 0; i < data.length; i++) {
        data[i].Image = getImageName(data[i]["Title"]) + ".jpg";
      }
      console.log(data);
      processMVPData(data);
      $('.mvp-modal').on('click', showModal);

      function processMVPData(mvpData) {
        $('#mvp-content').empty();
        var htmlStr = "";
        mvpData.forEach(function(mvpDetails) {
          htmlStr += "<div class=\"col-md-4 col-sm-4 card-style\"><div class=\"card\"><div class=\"view overlay hm-white-slight mx-auto\">" +
            "<img class=\"card-img-top img-fluid\" src=\"images/" + mvpDetails["Image"] + "\" style=\"margin: 0 auto\" alt=\"\">" +
            "<a href=\"#\"> <div class=\"mask\"></div></a></div>" + "<div class=\"card-block\"><h4 class=\"card-title\">" +
            mvpDetails["Title"] + "</h4> <table class\"modal-table\"> <tr><td> " + mvpDetails["Title Description"]
            /* + "</td> </tr>" + "<tr><td><p class=\"card-text\">Problem Statement:</p> </td><td>" + mvpDetails["Problem Statement"]*/ + "</td> </tr> </table>" +
            "<a href=\"#\" class=\"btn btn-primary mvp-modal\" data=\"" + mvpDetails["Title"] + "\">Read more</a></div></div></div>";
        });
        $(htmlStr).appendTo('#mvp-content');
      }

      function showModal(event) {
        event.preventDefault();
        var mvpTitle = $(this).attr('data');
        var mvpObj = getMVPObject(mvpTitle);
        if (mvpObj != null) {
          showMVPModal('idMyModal', mvpObj);
        }
      }

      function getMVPObject(mvpTitle) {
        var mvpObj = null;
        if (data != undefined && Object.prototype.toString.call(data) === '[object Array]') {
          data.every(function(mvp, index) {
            if (mvp["Title"] === mvpTitle) {
              mvpObj = mvp;
              return false;
            }
            return true;
          });
        }
        return mvpObj;
      }

      function showMVPModal(placementId, mvpDetail) {

        var html = '<div id="modalWindow" tabindex="-1" class="modal hide"role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">';
        html += '<div class="modal-dialog modal-lg" role="document">';
        html += '<div class="modal-content">';
        html += '<div class="modal-header" style="background-color:rgb(212, 214, 216);">';
        html += '<button type="button" class="close" style="height:1em;" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span></button>';
        html += '<h5 class="modal-title" id="modalLabel">' + mvpDetail.Title + '</h5>';
        html += '</div>';
        html += '<div class="modal-body">';
        html += "<img class=\"center-block img-fluid img-responsive\" src=\"images/" + mvpDetail.Image + "\" class=\"img-fluid\" alt=\"\">";


        html += '<div id="desc">';
        html += '<h3 class="no-margin">Title Description</h3>';
        html += '<p>' + mvpDetail["Title Description"] + '</p>';
        html += '</div>';
        html += '<div id="problem_statement">';
        html += '<h3 class="no-margin">Problem Statement</h3>'
        html += '<p>' + mvpDetail["Problem Statement"] + '</p>';
        html += '</div>';
        html += '<div id="proposed_solution">';
        html += '<h3 class="no-margin">Proposed Solution</h3>';
        html += '<p>' + mvpDetail["Proposed Solution"] + '</p>';
        html += '</div>';
        html += '<div id="references">';
        html += '<h3 class="no-margin">Demo-URL/References: </h3>';
        html += '<a href="' + mvpDetail["References"] +  '">' + mvpDetail["References"] + '</a>';
        html += '</div>';


        // html += '<table>';
        // html += '<tr><td>Account Spoc</td><td>' + data.account_spoc + '</td></tr>';
        // html += '<tr><td>Shortlisted Usecase</td><td>' + data.usecase + '</td></tr>';
        // html += '<tr><td>Sector</td><td>' + data.sector + '</td></tr>';
        // html += '<tr><td>Industry</td><td>' + data.industry + '</td></tr>';
        // html += '<tr><td>Status</td><td>' + data.status + '</td></tr>';
        // html += '</table>';
        html += '</div>';
        html += '<div class="modal-footer">';

        html += '<span class="btn btn-secondary btn-close link" data-dismiss="modal">Close</span>';

        html += '</div>'; // footer
        html += '</div>'; // modalWindow
        $("#" + placementId).html(html);
        $("#modalWindow").modal();


      }

    }
  });

})

function getImageName(str) {
  // removing special chars
  str = str.replace(/[^a-zA-Z0-9_ ]/g, '');
  // replacing spaces with _
  var newString = str.replace(/\s+/g, '_');
  //var newString = str.replace(/[^a-zA-Z0-9]/ig, "_");
  console.log(newString.toLowerCase());
  return newString.toLowerCase();
}
