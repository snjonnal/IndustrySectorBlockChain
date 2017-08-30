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
      let qtrSet = new Set();
      let industrySet = new Set();
      let industryFilter;
      let qtrFilter;
      let filterArray = [];

      if (!response.success) return console.log(response.extras.msg);

      data = response.extras.data;

      $.each(data, function(index, value) {
        if (value["Industry"] !== '') industrySet.add(value["Industry"]);
        if (value["Qtr"] !== '') qtrSet.add(value["Qtr"]);
      });

      function updateSelect(selectId, valueSet) {
        $('#' + selectId).empty();
        $('<option>').val("Choose...").text("Choose...").appendTo('#' + selectId);
        for (let item of valueSet) {
          $('<option>').val(item).text(item).appendTo('#' + selectId);
        }
      }

      updateSelect("industrySelect", industrySet);
      updateSelect("qtrSelect", qtrSet);

      function contentFilter(element) {
        if (industryFilter !== undefined && element["Industry"] !== industryFilter) return false;
        if (qtrFilter !== undefined && element["Qtr"] !== qtrFilter) return false;
        return true;
      }

      function industryEvent(event) {
        let industryFilterValue = this.value;
        industryFilter = (industryFilterValue.indexOf("Choose") == -1) ? industryFilterValue : undefined;
        updateFilterArray("industry", industryFilter);
        updateTable("oppr_table", data, contentFilter, sortOnOpptValue);
      }

      function qtrEvent(event) {
        let qtrFilterValue = this.value;
        qtrFilter = (qtrFilterValue.indexOf("Choose") == -1) ? qtrFilterValue : undefined;
        updateFilterArray("qtr", qtrFilter);
        updateTable("oppr_table", data, contentFilter, sortOnOpptValue);
      }

      $('#industrySelect').on('change', industryEvent);
      $('#qtrSelect').on('change', qtrEvent);

      // reset function
      $('#reset').on('click', function(event) {
        if (filterArray.length > 0) {
          updateFilterArray(filterArray[0], undefined);
          updateTable("oppr_table", data, contentFilter, sortOnOpptValue);
        }
      });

      function updateFilterArray(filterName, filterValue) {
        if (filterArray.indexOf(filterName) == -1 && filterValue !== undefined) {
          filterArray.push(filterName);
        } else {
          let idx = filterArray.indexOf(filterName);
          for (let i = idx + 1; i < filterArray.length; i++) {
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
        if (filtername === 'qtr') qtrFilter = undefined;
        if (filtername === 'industry') industryFilter = undefined;
      }

      function resetFilters() {
        industryFilter = undefined;
        accountFilter = undefined;
        statusFilter = undefined;
        updateTable("oppr_table", data, contentFilter, sortOnOpptValue);
      }

      updateTable("oppr_table", data, contentFilter, sortOnOpptValue);
      //console.log(data);
      // updateTable("oppr_table1", data, recordPerPage, function(element) {
      //   return element["Engaged CIC"] === "India";
      // }, sortOnOpptValue);
      $("#oppr_table").tablesorter();
      //$("#oppr_table1").tablesorter();

      function sortOnOpptValue(a, b) {
        return parseFloat(b["Oppty Value (USD mn)"]) - parseFloat(a["Oppty Value (USD mn)"]);
      }

      function updateTable(tableId, data, filterFn, sortfn) {
        $('#' + tableId).empty();
        let arrItems = []; // THE ARRAY TO STORE JSON ITEMS.
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
        let col = [];
        for (let i = 0; i < arrItems.length; i++) {
          for (let key in arrItems[i]) {
            if (col.indexOf(key) === -1) {
              col.push(key);
            }
          }
        }

        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
        let myTable = $('#' + tableId);
        let rowData = '';
        for (let i = 0; i < col.length; i++) {
          rowData += '<th><div>' + col[i] + '</th></div>'; // TABLE HEADER.
        }
        myTable.prepend(document.createElement('thead'));
        $('#' + tableId + ' thead').append(rowData);

        // ADD JSON DATA TO THE TABLE AS ROWS.
        rowData = '';
        for (let i = 0; i < arrItems.length; i++) {
          let tableCellData = '';
          for (let j = 0; j < col.length; j++) {
            tableCellData += "<td data-th=\"" + col[j] + "\"><div style=\"height:15px; max-width: 100px; overflow:hidden;text-overflow: ellipsis; white-space: nowrap;\" title=\"" + arrItems[i][col[j]] + "\">" + arrItems[i][col[j]] + "</div></td>";
          }
          rowData += '<tr>' + tableCellData + '</tr>';
        }
        $("#" + tableId + " thead:last").after('<tbody >' + rowData + '</tbody>');

        if (qtrFilter === undefined) qtrSet.clear();
        if (industryFilter === undefined) industrySet.clear();

        for (let i = 0; i < arrItems.length; i++) {

          if (industryFilter === undefined) {
            let industryValue = arrItems[i]["Industry"];
            if (industryValue !== undefined && industryValue !== '') {
              industrySet.add(industryValue);
            }
          }
          if (qtrFilter === undefined) {
            let qtrValue = arrItems[i]["Qtr"];
            if (qtrValue !== undefined && qtrValue !== '') {
              qtrSet.add(qtrValue);
            }
          }
        }
        if (qtrFilter === undefined) updateSelect("qtrSelect", qtrSet);
        if (industryFilter === undefined) updateSelect("industrySelect", industrySet);

      }


    }
  });

/////////////////////////////////////////

$.ajax({
  url: 'opp_data?sales_stage=05,06',
  success: function(response) {
    let qtrSet1 = new Set();
    let industrySet1 = new Set();
    let industryFilter1;
    let qtrFilter1;
    let filterArray1 = [];

    if (!response.success) return console.log(response.extras.msg);

    data1 = response.extras.data;

    $.each(data1, function(index, value) {
      if (value["Industry"] !== '') industrySet1.add(value["Industry"]);
      if (value["Qtr"] !== '') qtrSet1.add(value["Qtr"]);
    });

    function updateSelect1(selectId, valueSet) {
      $('#' + selectId).empty();
      $('<option>').val("Choose...").text("Choose...").appendTo('#' + selectId);
      for (let item of valueSet) {
        $('<option>').val(item).text(item).appendTo('#' + selectId);
      }
    }

    updateSelect1("industrySelect1", industrySet1);
    updateSelect1("qtrSelect1", qtrSet1);

    function contentFilter1(element) {
      if (industryFilter1 !== undefined && element["Industry"] !== industryFilter1) return false;
      if (qtrFilter1 !== undefined && element["Qtr"] !== qtrFilter1) return false;
      return true;
    }

    function industryEvent1(event) {
      let industryFilter1Value = this.value;
      industryFilter1 = (industryFilter1Value.indexOf("Choose") == -1) ? industryFilter1Value : undefined;
      updatefilterArray1("industry", industryFilter1);
      updateTable1("oppr_table1", data1, contentFilter1, sortOnOpptValue1);
    }

    function qtrEvent1(event) {
      let qtrFilter1Value = this.value;
      qtrFilter1 = (qtrFilter1Value.indexOf("Choose") == -1) ? qtrFilter1Value : undefined;
      updatefilterArray1("qtr", qtrFilter1);
      updateTable1("oppr_table1", data1, contentFilter1, sortOnOpptValue1);
    }

    $('#industrySelect1').on('change', industryEvent1);
    $('#qtrSelect1').on('change', qtrEvent1);

    // reset function
    $('#reset1').on('click', function(event) {
      if (filterArray1.length > 0) {
        updatefilterArray1(filterArray1[0], undefined);
        updateTable1("oppr_table1", data1, contentFilter1, sortOnOpptValue1);
      }
    });

    function updatefilterArray1(filterName, filterValue) {
      if (filterArray1.indexOf(filterName) == -1 && filterValue !== undefined) {
        filterArray1.push(filterName);
      } else {
        let idx = filterArray1.indexOf(filterName);
        for (let i = idx + 1; i < filterArray1.length; i++) {
          resetFilterWithName(filterArray1[i]);
          filterArray1.splice(i--, 1);
        }
        if (filterValue === undefined) {
          resetFilterWithName(filterName);
          filterArray1.splice(filterArray1.indexOf(filterName), 1);
        }
      }
    }

    function resetFilterWithName(filtername) {
      if (filtername === 'qtr') qtrFilter1 = undefined;
      if (filtername === 'industry') industryFilter1 = undefined;
    }


    updateTable1("oppr_table1", data1, contentFilter1, sortOnOpptValue1);
    //console.log(data1);
    // updateTable1("oppr_table1", data1, recordPerPage, function(element) {
    //   return element["Engaged CIC"] === "India";
    // }, sortOnOpptValue1);
    $("#oppr_table1").tablesorter();
    //$("#oppr_table1").tablesorter();

    function sortOnOpptValue1(a, b) {
      return parseFloat(b["Oppty Value (USD mn)"]) - parseFloat(a["Oppty Value (USD mn)"]);
    }

    function updateTable1(tableId, data1, filterFn, sortfn) {
      $('#' + tableId).empty();
      let arrItems = []; // THE ARRAY TO STORE JSON ITEMS.
      $.each(data1, function(index, value) {
        // if (index == MAX_ROWS) {
        //   return false;
        // }
        arrItems.push(deepCopy(value)); // PUSH THE VALUES INSIDE THE ARRAY.
      });
      if (filterFn) {
        // filtering the data1 based on the passed criteria
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
      let col = [];
      for (let i = 0; i < arrItems.length; i++) {
        for (let key in arrItems[i]) {
          if (col.indexOf(key) === -1) {
            col.push(key);
          }
        }
      }

      // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
      let myTable = $('#' + tableId);
      let rowData = '';
      for (let i = 0; i < col.length; i++) {
        rowData += '<th><div>' + col[i] + '</th></div>'; // TABLE HEADER.
      }
      myTable.prepend(document.createElement('thead'));
      $('#' + tableId + ' thead').append(rowData);

      // ADD JSON DATA TO THE TABLE AS ROWS.
      rowData = '';
      for (let i = 0; i < arrItems.length; i++) {
        let tableCellData = '';
        for (let j = 0; j < col.length; j++) {
          tableCellData += "<td data1-th=\"" + col[j] + "\"><div style=\"height:15px; max-width: 100px; overflow:hidden;text-overflow: ellipsis; white-space: nowrap;\" title=\"" + arrItems[i][col[j]] + "\">" + arrItems[i][col[j]] + "</div></td>";
        }
        rowData += '<tr>' + tableCellData + '</tr>';
      }
      $("#" + tableId + " thead:last").after('<tbody >' + rowData + '</tbody>');

      if (qtrFilter1 === undefined) qtrSet1.clear();
      if (industryFilter1 === undefined) industrySet1.clear();

      for (let i = 0; i < arrItems.length; i++) {

        if (industryFilter1 === undefined) {
          let industryValue = arrItems[i]["Industry"];
          if (industryValue !== undefined && industryValue !== '') {
            industrySet1.add(industryValue);
          }
        }
        if (qtrFilter1 === undefined) {
          let qtrValue = arrItems[i]["Qtr"];
          if (qtrValue !== undefined && qtrValue !== '') {
            qtrSet1.add(qtrValue);
          }
        }
      }
      if (qtrFilter1 === undefined) updateSelect1("qtrSelect1", qtrSet1);
      if (industryFilter1 === undefined) updateSelect1("industrySelect1", industrySet1);

    }


  }
});




});

function deepCopy(obj) {
  let newObj = {};
  for (let k in obj) {
    if (Object.prototype.toString.call(obj[k]) === '[object Array]') {
      let temp = [];
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
