const MAX_ROWS = 10;
$(document).ready(function() {

  $(document).on('mouseenter', '.mightOverflow', function() {
    var $t = $(this);
    var title = $t.attr('title');
    if (!title) {
      if (this.offsetWidth < this.scrollWidth) $t.attr('title', $t.text())
    } else {
      if (this.offsetWidth >= this.scrollWidth && title == $t.text()) $t.removeAttr('title')
    }
  });

  //$.getJSON("data/data.json", function(data) {
  $.ajax({
    url: 'opp_data',
    success: function(response) {
      if(!response.success) return console.log(response.extras.msg);
      data = response.extras.data;
      //var data = JSON.parse(data);
      var jsonContent = data.filter(function(element){
        return element["Oppty Value (USD mn)"] == "10.00";
      });
      console.log(jsonContent);
      var recordPerPage = 5;

      data.sort(function(a, b) {
        return parseFloat(b["Oppty Value (USD mn)"]) - parseFloat(a["Oppty Value (USD mn)"]);
      });

      updateTable("oppr_table", data, recordPerPage);
      //console.log(data);
      updateTable("oppr_table1", data, recordPerPage, function(element){
        return element["Engaged CIC"] === "India";
      });

      $('.pageNumber').click(function(event) {
        //console.log(tableId);
        console.log($(this.closest('table')).attr('id'));
        var tableId = $(this.closest('table')).attr('id');
        var tr = $('#' + tableId + ' tbody tr:has(td)');
        $('#' + tableId).find('tbody tr:has(td)').hide();
        var nBegin = ($(this).text() - 1) * recordPerPage;
        var nEnd = $(this).text() * recordPerPage - 1;
        for (var i = nBegin; i <= nEnd; i++) {
          $(tr[i]).show();
        }
        $('html, body').animate({
          scrollTop: $("#"+tableId).offset().top
        }, 200);
      });

      $("#oppr_table").tablesorter();
    }
  });




});

function updateTable(tableId, data, recordPerPage, filterFn) {
  var arrItems = []; // THE ARRAY TO STORE JSON ITEMS.

  $.each(data, function(index, value) {
    if (index == MAX_ROWS) {
      return false;
    }
    arrItems.push(value); // PUSH THE VALUES INSIDE THE ARRAY.
  });
  if(filterFn) {
    //console.log('filtering');
    arrItems = arrItems.filter(filterFn);
  }
  var totalRows = arrItems.length;
  var rowstoShow = totalRows > MAX_ROWS ? MAX_ROWS : totalRows;
  var totalPages = Math.ceil(rowstoShow / recordPerPage);
  console.log('totalPages: ' + totalPages);
  var $pages = $("<div id=\"pages-" + tableId + "\"></div>");
  for (i = 0; i < totalPages; i++) {
    $("<span class=\"pageNumber\" id=\"pageNumber-" +(i + 1) + tableId + "\">&nbsp;" + (i + 1) + '</span>').appendTo($pages);
  }

  // EXTRACT VALUE FOR TABLE HEADER.
  var col = [];
  for (var i = 0; i < arrItems.length; i++) {
    for (var key in arrItems[i]) {
      if (col.indexOf(key) === -1) {
        col.push(key);
      }
    }
  }

  // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
  var rowData = '';
  for (var i = 0; i < col.length; i++) {
    rowData += '<th><div>' + col[i] + '</th></div>'; // TABLE HEADER.
  }

  $('#' + tableId + ' thead').before('<thead>' + rowData + '</thead>');

  // ADD JSON DATA TO THE TABLE AS ROWS.
  rowData = '';
  for (var i = 0; i < arrItems.length; i++) {
    var tableCellData = '';
    for (var j = 0; j < col.length; j++) {
      tableCellData += "<td data-th=\"" + col[j] + "\"><div style=\"height:28px; max-width: 100px; overflow:hidden;text-overflow: ellipsis; white-space: nowrap;\" title=\"" + arrItems[i][col[j]] + "\">" + arrItems[i][col[j]] + "</td><div>";
    }
    rowData += '<tr>' + tableCellData + '</tr>';
  }
  $("#" + tableId + " thead:last").after('<tbody>' + rowData + '</tbody>');
  $pages.appendTo('#' + tableId);

  $('.pageNumber').hover(
    function() {
      $(this).addClass('focus');
    },
    function() {
      $(this).removeClass('focus');
    }
  );

  $('#' + tableId).find('tbody tr:has(td)').hide();
  var tr = $('#' + tableId + ' tbody tr:has(td)');
  //console.log(tr);
  for (var i = 0; i <= recordPerPage - 1; i++) {
    $(tr[i]).show();
  }
}
