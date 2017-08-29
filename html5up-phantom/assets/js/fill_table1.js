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
      let iotSet = new Set();
      let industrySet = new Set();
      let salesStageSet = new Set();

      if(!response.success) return console.log(response.extras.msg);

      data = response.extras.data;
      //var data = JSON.parse(data);
      var jsonContent = data.filter(function(element){
        return element["Oppty Value (USD mn)"] == "10.00";
      });
      var recordPerPage = 5;

      // sorting the data based on the Oppty Value
      data.sort(function(a, b) {
        return parseFloat(b["Oppty Value (USD mn)"]) - parseFloat(a["Oppty Value (USD mn)"]);
      });

      updateTable("oppr_table", data, recordPerPage);
      //console.log(data);
      updateTable("oppr_table1", data, recordPerPage, function(element){
        return element["Engaged CIC"] === "India";
      });

      $("#oppr_table").tablesorter();
      $("#oppr_table1").tablesorter();

    }
  });

});

function updateTable(tableId, data, recordPerPage, filterFn) {
  var arrItems = []; // THE ARRAY TO STORE JSON ITEMS.

  $.each(data, function(index, value) {
    if (index == MAX_ROWS) {
      return false;
    }
    //console.log('index-' + index);
    arrItems.push(value); // PUSH THE VALUES INSIDE THE ARRAY.
  });
  if(filterFn) {
    //console.log('filtering');
    arrItems = arrItems.filter(filterFn);
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
      tableCellData += "<td data-th=\"" + col[j] + "\"><div style=\"height:15px; max-width: 100px; overflow:hidden;text-overflow: ellipsis; white-space: nowrap;\" title=\"" + arrItems[i][col[j]] + "\">" + arrItems[i][col[j]] + "</div></td>";
    }
    rowData += '<tr>' + tableCellData + '</tr>';
  }
  $("#" + tableId + " thead:last").after('<tbody >' + rowData + '</tbody>');
}
