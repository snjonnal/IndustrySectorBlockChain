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
      let industryFilter;
      let iotFilter;
      let salesStageFilter;
      let filterArray = [];

      if (!response.success) return console.log(response.extras.msg);

      data = response.extras.data;

      $.each(data, function(index, value) {
        if (value["Industry"] !== '') industrySet.add(value["Industry"]);
        if (value["IOT"] !== '') iotSet.add(value["IOT"]);
        if (value["Sales Stage"] !== '') salesStageSet.add(value["Sales Stage"]);
      });

      function updateSelect(selectId, valueSet) {
        $('#' + selectId).empty();
        //$('#' + selectId).append('Choose...')
        $('<option>').val("Choose...").text("Choose...").appendTo('#' + selectId);
        for (let item of valueSet) {
          $('<option>').val(item).text(item).appendTo('#' + selectId);
        }
      }

      updateSelect("industrySelect", industrySet);
      updateSelect("iotSelect", iotSet);
      updateSelect("salesStageSelect", salesStageSet);

      //var data = JSON.parse(data);
      var jsonContent = data.filter(function(element) {
        return element["Oppty Value (USD mn)"] == "10.00";
      });
      var recordPerPage = 5;


      function contentFilter(element) {
        if (industryFilter !== undefined && element["Industry"] !== industryFilter) return false;
        if (iotFilter !== undefined && element["IOT"] !== iotFilter) return false;
        if (salesStageFilter !== undefined && element["Sales Stage"] !== salesStageFilter) return false;
        return true;
      }

      function industryEvent(event) {
        var industryFilterValue = this.value;
        industryFilter = (industryFilterValue.indexOf("Choose") == -1) ? industryFilterValue : undefined;
        updateFilterArray("industry", industryFilter);
        updateTable("oppr_table", data, recordPerPage, contentFilter, sortOnOpptValue);
      }

      function iotEvent(event) {
        var iotFilterValue = this.value;
        iotFilter = (iotFilterValue.indexOf("Choose") == -1) ? iotFilterValue : undefined;
        updateFilterArray("iot", iotFilter);
        updateTable("oppr_table", data, recordPerPage, contentFilter, sortOnOpptValue);
      }

      function salesStageEvent(event) {
        var salesStageFilterValue = this.value
        salesStageFilter = (salesStageFilterValue.indexOf("Choose") == -1) ? salesStageFilterValue : undefined;
        updateFilterArray("salesStage", salesStageFilter);
        updateTable("oppr_table", data, recordPerPage, contentFilter, sortOnOpptValue);
      }

      $('#industrySelect').on('change', industryEvent);
      $('#iotSelect').on('change', iotEvent);
      $('#salesStageSelect').on('change', salesStageEvent);

      // reset function
      $('.reset').on('click', function(event) {
        if (filterArray.length > 0) {
          updateFilterArray(filterArray[0], undefined);
          updateTable("oppr_table", data, recordPerPage, contentFilter, sortOnOpptValue);
        }
      });

      function updateFilterArray(filterName, filterValue) {
        if (filterArray.indexOf(filterName) == -1 && filterValue !== undefined) {
          filterArray.push(filterName);
        } else {
          var idx = filterArray.indexOf(filterName);
          for (var i = idx + 1; i < filterArray.length; i++) {
            resetFilterWithName(filterArray[i]);
            filterArray.splice(i--, 1);
          }
          if (filterValue === undefined) {
            resetFilterWithName(filterName);
            filterArray.splice(filterArray.indexOf(filterName), 1);
          }
        }
      }

      function resetFilterWithName(filtername) {
        if (filtername === 'iot') iotFilter = undefined;
        if (filtername === 'industry') industryFilter = undefined;
        if (filtername === 'salesStage') salesStageFilter = undefined;
      }

      function resetFilters() {
        industryFilter = undefined;
        accountFilter = undefined;
        statusFilter = undefined;
        updateTable("oppr_table", data, recordPerPage, contentFilter, sortOnOpptValue);
      }

      updateTable("oppr_table", data, recordPerPage, contentFilter, sortOnOpptValue);
      //console.log(data);
      // updateTable("oppr_table1", data, recordPerPage, function(element) {
      //   return element["Engaged CIC"] === "India";
      // }, sortOnOpptValue);
      $("#oppr_table").tablesorter();
      //$("#oppr_table1").tablesorter();

      function sortOnOpptValue(a, b) {
        return parseFloat(b["Oppty Value (USD mn)"]) - parseFloat(a["Oppty Value (USD mn)"]);
      }

      function updateTable(tableId, data, recordPerPage, filterFn, sortfn) {
        $('#' + tableId).empty();
        var arrItems = []; // THE ARRAY TO STORE JSON ITEMS.
        $.each(data, function(index, value) {
          // if (index == MAX_ROWS) {
          //   return false;
          // }
          arrItems.push(deepCopy(value)); // PUSH THE VALUES INSIDE THE ARRAY.
        });
        if (filterFn) {
          // filtering the data based on the passed criteria
          arrItems = arrItems.filter(filterFn);
        }

        if (sortfn) {
          // sort the filtered Array
          arrItems.sort(sortfn);
        }

        // taking the MAX_ROWS
        if (MAX_ROWS < arrItems.length) {
          arrItems.splice(MAX_ROWS, arrItems.length - MAX_ROWS);
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
        var myTable = $('#' + tableId);
        var rowData = '';
        for (var i = 0; i < col.length; i++) {
          rowData += '<th><div>' + col[i] + '</th></div>'; // TABLE HEADER.
        }
        myTable.prepend(document.createElement('thead'));
        $('#' + tableId + ' thead').append(rowData);

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

        if (salesStageFilter === undefined) salesStageSet.clear();
        if (iotFilter === undefined) iotSet.clear();
        if (industryFilter === undefined) industrySet.clear();

        for (var i = 0; i < arrItems.length; i++) {

          if (industryFilter === undefined) {
            var industryValue = arrItems[i]["Industry"];
            if (industryValue !== undefined && industryValue !== '') {
              industrySet.add(industryValue);
            }
          }
          if (iotFilter === undefined) {
            var iotValue = arrItems[i]["IOT"];
            if (iotValue !== undefined && iotValue !== '') {
              iotSet.add(iotValue);
            }
          }
          if (salesStageFilter === undefined) {
            var salesStageValue = arrItems[i]["Sales Stage"];
            if (salesStageValue !== undefined && salesStageValue !== '') {
              salesStageSet.add(salesStageValue);
            }
          }
        }
        if (salesStageFilter === undefined) updateSelect("salesStageSelect", salesStageSet);
        if (iotFilter === undefined) updateSelect("iotSelect", iotSet);
        if (industryFilter === undefined) updateSelect("industrySelect", industrySet);

      }


    }
  });
});

function deepCopy(obj) {
  var newObj = {};
  for (var k in obj) {
    if (Object.prototype.toString.call(obj[k]) === '[object Array]') {
      var temp = [];
      obj[k].forEach(function(value) {
        temp.push(value);
      });
      newObj[k] = temp;
    } else if (typeof obj[k] !== 'object') {
      newObj[k] = obj[k];
    }

  }
  return newObj;
}
