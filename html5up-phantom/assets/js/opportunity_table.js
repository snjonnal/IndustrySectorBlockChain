function OpportunityTable(oppData, tableId, filterNames, filterSelectId, resetId) {
  this.oppData = oppData;
  this.tableId = tableId;
  this.filterNames = filterNames;
  this.filterSelectId = filterSelectId;
  this.filterSetArr = [];
  this.filterValArr = [];
  this.resetId = resetId;
  this.filterArray = [];

  OpportunityTable.prototype.createTable = function(callback) {

    var that = this;
    // creating the empty sets and adding to array
    for(let i=0; i<filterSelectId.length;i++){
      that.filterSetArr.push(new Set());
      that.filterValArr.push(undefined);
    }
    console.log(that.filterValArr);

    updateFilters(that.oppData,that.filterNames, that.filterSetArr);

    //updating the filter Select Box
    for(let i=0; i<filterSelectId.length;i++){
      updateSelect(that.filterSelectId[i], that.filterSetArr[i]);
    }

    // function to do the content filtering
    function contentFilter(element) {
      for(let i=0; i<filterNames.length;i++){
        if(that.filterValArr[i]!==undefined && element[that.filterNames[i]] !== that.filterValArr[i] ){
          return false;
        }
      }
      return true;
    }

    // event handler for the industry
    function filterEvent(event) {
      let filterValue = this.value;
      var filterId = $(this).attr('id');
      filterValue = (filterValue.indexOf("Choose") == -1) ? filterValue : undefined;
      that.filterValArr[that.filterSelectId.indexOf(filterId)] = filterValue;
      updateFilterArray(that.filterNames[that.filterSelectId.indexOf(filterId)], filterValue);
      updateTable(tableId, oppData, contentFilter, sortOnOpptValue);
    }

    function sortOnOpptValue(a, b) {
        return parseFloat(b["Oppty Value (USD mn)"]) - parseFloat(a["Oppty Value (USD mn)"]);
    }

    // adding the event handler
      for(let i=0;i<filterSelectId.length;i++){
        $('#' + filterSelectId[i] ).on('change', filterEvent);
      }

      // reset function
      $('#' + resetId).on('click', function(event) {
        if (that.filterArray.length > 0) {
          updateFilterArray(that.filterArray[0], undefined);
          updateTable(tableId, oppData, contentFilter, sortOnOpptValue);
        }
      });

      // updating the filter array
      function updateFilterArray(filterName, filterValue) {
        if (that.filterArray.indexOf(filterName) == -1 && filterValue !== undefined) {
          that.filterArray.push(filterName);
        } else {
          let idx = that.filterArray.indexOf(filterName);
          for (let i = idx + 1; i < that.filterArray.length; i++) {
            resetFilterWithName(that.filterArray[i]);
            that.filterArray.splice(i--, 1);
          }
          if (filterValue === undefined) {
            resetFilterWithName(filterName);
            that.filterArray.splice(that.filterArray.indexOf(filterName), 1);
          }
        }
      }

      // resetting the filter with name
      function resetFilterWithName(filtername) {
        that.filterValArr[that.filterNames.indexOf(filtername)]=undefined;
      }

      // updating the table
      updateTable(tableId, oppData, contentFilter, sortOnOpptValue);
      $("#" + tableId).tablesorter();

      function updateTable(tableId, data, filterFn, sortfn) {
        $('#' + tableId).empty();
        let arrItems = []; // THE ARRAY TO STORE JSON ITEMS.
        $.each(data, function(index, value) {
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
            if (col[j] === "Opportunity Number") {
              tableCellData += "<td data-th=\"" + col[j] + "\"><div style=\"height:15px; max-width: 100px; overflow:hidden;text-overflow: ellipsis; white-space: nowrap;\" title=\"" + arrItems[i][col[j]] + "\"><a href=\"\" data=\"" + arrItems[i][col[j]] + "\" class=\"oppLink\">" + arrItems[i][col[j]] + "</a></div></td>";
            } else {
              tableCellData += "<td data-th=\"" + col[j] + "\"><div style=\"height:15px; max-width: 100px; overflow:hidden;text-overflow: ellipsis; white-space: nowrap;\" title=\"" + arrItems[i][col[j]] + "\">" + arrItems[i][col[j]] + "</div></td>";
            }
          }
          rowData += '<tr>' + tableCellData + '</tr>';
        }
        $("#" + tableId + " thead:last").after('<tbody >' + rowData + '</tbody>');

        for(let i=0; i<that.filterValArr.length;i++){
          if(that.filterValArr[i]===undefined) that.filterSetArr[i].clear();
        }

        console.log();
        for (let i = 0; i < arrItems.length; i++) {
          for(let j=0; j<that.filterValArr.length;j++){
            if(that.filterValArr[j]===undefined) {
              let filterValue = arrItems[i][that.filterNames[j]];
              if (filterValue !== undefined && filterValue !== '') {
                that.filterSetArr[j].add(filterValue);
              }
            }
          }
        }

        //updating the filter Select Box
        for(let i=0; i<filterSelectId.length;i++){
          if(that.filterValArr[i]===undefined) updateSelect(that.filterSelectId[i], that.filterSetArr[i]);
        }


        $('.oppLink').on('click', showModal);

        function showModal(event) {
          event.preventDefault();
          var oppNumber = $(this).attr('data');
          var opportunityData = getOpportunityObject(oppNumber);
          console.log(opportunityData);
          if (opportunityData != null || opportunityData !== undefined) {
            showOpportunityModal('oppModal', opportunityData);
          }
        }

        function getOpportunityObject(oppNumber) {
          var opportunityDataObj = null;
          if (arrItems != undefined && Object.prototype.toString.call(arrItems) === '[object Array]') {
            data.every(function(opportunity, index) {
              if (opportunity["Opportunity Number"] === oppNumber) {
                opportunityDataObj = opportunity;
                return false;
              }
              return true;
            });
          }
          return opportunityDataObj;
        }

      }
  }
}

function updateFilters(oppData, filterNames, filterSetArr){
  //adding the values to the filter sets
  $.each(oppData, function(index, value) {
    filterNames.forEach(function(filter){
      filterSetArr[filterNames.indexOf(filter)].add(value[filter]);
    });
  });
}

// function to update the select box
function updateSelect(selectId, valueSet) {
 $('#' + selectId).empty();
 $('<option>').val("Choose...").text("Choose...").appendTo('#' + selectId);
 for (let item of valueSet) {
   $('<option>').val(item).text(item).appendTo('#' + selectId);
 }
}

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
