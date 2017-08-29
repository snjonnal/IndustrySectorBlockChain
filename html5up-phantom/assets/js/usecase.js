$(document).ready(function() {

  $.ajax({
    url: 'usecase_data',
    success: function(response) {
      if (!response.success) return console.log(response.extras.msg);
      var data = response.extras.data;
      //console.log(data.length);

      var accountData = [];
      let industrySet = new Set();
      let accountSet = new Set();
      let statusSet = new Set();
      let industryFilter;
      let accountFilter;
      let statusFilter;
      let filterArray = [];

      data.forEach(function(usecase) {
        var accountDetails = getAccount(accountData, usecase["Account"]);
        //console.log(accountDetails);
        industrySet.add(usecase["Industry"]);
        accountSet.add(usecase["Account"]);
        statusSet.add(usecase["Status"]);

        if (accountDetails === null) {
          accountDetails = {};
          accountDetails["Sector"] = [];
          accountDetails["Industry"] = [];
          //accountDetails["Account Manager"] = [];
          accountDetails["Account SPOC"] = [];
          accountDetails["Shortlisted Use Case"] = [];
          accountDetails["Status"] = [];
          //accountDetails["Comments"] = [];
          //accountDetails["Final Status"] = [];

          accountDetails["Image"] = usecase["Image"];
          accountDetails["Account"] = usecase["Account"];
          accountDetails["Number of Usecases"] = 1;

          accountDetails["Sector"].push(usecase["Sector"]);
          accountDetails["Industry"].push(usecase["Industry"]);
          //accountDetails["Account Manager"].push(usecase["Account Manager"]);
          accountDetails["Account SPOC"].push(usecase["Account SPOC"]);
          accountDetails["Shortlisted Use Case"].push(usecase["Shortlisted Use Case"]);
          accountDetails["Status"].push(usecase["Status"]);
          //accountDetails["Comments"].push(usecase["Comments"]);
          //accountDetails["Final Status"].push(usecase["Final Status"]);

          accountData.push(accountDetails);
        } else {
          accountDetails["Number of Usecases"] += 1;
          accountDetails["Sector"].push(usecase["Sector"]);
          accountDetails["Industry"].push(usecase["Industry"]);
          //accountDetails["Account Manager"].push(usecase["Account Manager"]);
          accountDetails["Account SPOC"].push(usecase["Account SPOC"]);
          accountDetails["Shortlisted Use Case"].push(usecase["Shortlisted Use Case"]);
          accountDetails["Status"].push(usecase["Status"]);
          //accountDetails["Comments"].push(usecase["Comments"]);
          //accountDetails["Final Status"].push(usecase["Final Status"]);
        }
      });
      var accountDataFiltered = accountData;
      //console.log("accountData size: " + accountData.length);
      //console.log(accountData);

      function getAccount(accountData, accountName) {
        var accountDetailsObj = null;
        if (accountData != undefined && Object.prototype.toString.call(accountData) === '[object Array]') {
          accountData.every(function(accountDetails, index) {
            if (accountDetails["Account"] === accountName) {
              accountDetailsObj = accountDetails;
              return false;
            }
            return true;
          });
        }
        return accountDetailsObj;
      }

      function updateSelect(selectId, valueSet) {
        $('#' + selectId).empty();
        //$('#' + selectId).append('Choose...')
        $('<option>').val("Choose...").text("Choose...").appendTo('#' + selectId);
        for (let item of valueSet) {
          $('<option>').val(item).text(item).appendTo('#' + selectId);
        }
      }

      updateSelect("industrySelect", industrySet);
      updateSelect("accountSelect", accountSet);
      updateSelect("statusSelect", statusSet);

      processAccountData(accountData);
      $('.usecase-modal').on('click', showModal);

      function processAccountData(accountData) {
        $('#usecase-content').empty();
        var htmlStr = "";
        accountData.forEach(function(accountDetails) {
          htmlStr += "<div class=\"col-md-4 col-sm-6 card-style\"><div class=\"card\"><div class=\"view overlay hm-white-slight mx-auto\">" +
            "<img class=\"card-img-top img-fluid\" src=\"images/" + accountDetails["Image"] + "\" class=\"img-fluid\" alt=\"\">" +
            "<a href=\"#\"> <div class=\"mask\"></div></a></div>" + "<div class=\"card-block\"><h4 class=\"card-title\">" +
            accountDetails["Account"] + "</h4><p class=\"card-text\">" + "Number of Usecases: " + accountDetails["Number of Usecases"] +
            "</p> <a href=\"#\" class=\"btn btn-primary usecase-modal\" data=\"" + accountDetails["Account"] + "\">Read more</a></div></div></div>"
        });
        $(htmlStr).appendTo('#usecase-content');
      }

      function industryEvent(event) {
        //console.log(this.value);
        var industryFilterValue = this.value
        industryFilter = (industryFilterValue.indexOf("Choose") == -1) ? industryFilterValue : undefined;
        updateFilterArray("industry", industryFilter);
        filterData();
      }

      function accountEvent(event) {
        var accountFilterValue = this.value
        accountFilter = (accountFilterValue.indexOf("Choose") == -1) ? accountFilterValue : undefined;
        updateFilterArray("account", accountFilter);
        filterData();
      }

      function statusEvent(event) {
        //console.log(this.value);
        var statusFilterValue = this.value
        statusFilter = (statusFilterValue.indexOf("Choose") == -1) ? statusFilterValue : undefined;
        updateFilterArray("status", statusFilter);
        filterData();
      }

      function updateFilterArray(filterName, filterValue) {
        //console.log("filterName-" + filterName);
        //console.log("filterValue-" + filterValue);
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
        if (filtername === 'account') accountFilter = undefined;
        if (filtername === 'industry') industryFilter = undefined;
        if (filtername === 'status') statusFilter = undefined;
      }

      function resetFilters() {
        industryFilter = undefined;
        accountFilter = undefined;
        statusFilter = undefined;
        filterData();
      }

      function deepCopy(obj) {
        //console.log("inside deepcopy");
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
        //console.log(newObj);
        return newObj;
      }

      function filterData() {
        // console.log(accountFilter);
        // console.log(industryFilter);
        // console.log(statusFilter);
        // console.log(filterArray);
        // if (accountFilter === undefined && industryFilter === undefined && statusFilter === undefined) {
        //   processAccountData(accountData);
        //   $('.usecase-modal').on('click', showModal);
        //   return;
        // }
        accountDataFiltered = [];
        // account-filter
        accountData.every(function(accountDetails, index) {
          //accountDataFiltered.push(accountDetails);
          var accountDetailsFiltered = {};
          if (accountFilter !== undefined) {
            if (accountDetails["Account"] === accountFilter) {
              accountDetailsFiltered = deepCopy(accountDetails);
              accountDataFiltered.push(accountDetailsFiltered);
            }
          } else {
            accountDetailsFiltered = deepCopy(accountDetails);
            accountDataFiltered.push(accountDetailsFiltered);
          }
          return true;
        });

        // industryFilter
        if (industryFilter !== undefined) {
          accountDataFiltered.every(function(accountDetails, index) {

            for (var i = 0; i < accountDetails["Industry"].length; i++) {
              if (accountDetails["Industry"][i] !== industryFilter) {
                accountDetails["Industry"].splice(i, 1);
                accountDetails["Sector"].splice(i, 1);
                accountDetails["Shortlisted Use Case"].splice(i, 1);
                accountDetails["Status"].splice(i, 1);
                accountDetails["Account SPOC"].splice(i, 1);
                accountDetails["Number of Usecases"] -= 1;
                --i;
              }
            }
            return true;
          });
        }

        // statusFilter
        if (statusFilter !== undefined) {
          accountDataFiltered.every(function(accountDetails, index) {
            for (var i = 0; i < accountDetails["Status"].length; i++) {
              if (accountDetails["Status"][i] !== statusFilter) {
                accountDetails["Status"].splice(i, 1);
                accountDetails["Sector"].splice(i, 1);
                accountDetails["Shortlisted Use Case"].splice(i, 1);
                accountDetails["Industry"].splice(i, 1);
                accountDetails["Account SPOC"].splice(i, 1);
                accountDetails["Number of Usecases"] -= 1;
                --i;
              }
            }
            return true;
          });
        }

        if (statusFilter === undefined) statusSet.clear();
        if (accountFilter === undefined) accountSet.clear();
        if (industryFilter === undefined) industrySet.clear();

        for (var i = 0; i < accountDataFiltered.length; i++) {
          if (accountDataFiltered[i]["Number of Usecases"] === 0) {
            accountDataFiltered.splice(i--, 1);
          } else {
            var arrLength = accountDataFiltered[i]["Number of Usecases"];
            if (accountFilter === undefined) {
              var accountValue = accountDataFiltered[i]["Account"];
              if (accountValue !== undefined && accountValue !== '') {
                accountSet.add(accountValue);
              }
            }
            if (industryFilter === undefined || statusFilter === undefined)
              for (var j = 0; j < arrLength; j++) {
                if (industryFilter === undefined) {
                  var industryValue = accountDataFiltered[i]["Industry"][j];
                  if (industryValue !== undefined && industryValue !== '') {
                    industrySet.add(industryValue);
                  }
                }
                if (statusFilter === undefined) {
                  var statusValue = accountDataFiltered[i]["Status"][j];
                  if (statusValue !== undefined && statusValue !== '') {
                    statusSet.add(statusValue);
                  }
                }
              }
          }
        }

        if (statusFilter === undefined) updateSelect("statusSelect", statusSet);
        if (accountFilter === undefined) updateSelect("accountSelect", accountSet);
        if (industryFilter === undefined) updateSelect("industrySelect", industrySet);
        processAccountData(accountDataFiltered);
        $('.usecase-modal').on('click', showModal);
        return true;
      }

      $('#industrySelect').on('change', industryEvent);
      $('#accountSelect').on('change', accountEvent);
      $('#statusSelect').on('change', statusEvent);

      function showModal(event) {
        event.preventDefault();
        var accountName = $(this).attr('data');
        showUsecase('idMyModal', 0, accountName, "navigate();", null);
      }

      function showUsecase(placementId, index, accountName) {
        // get the account details Object
        var accountDetails = getAccount(accountDataFiltered, accountName);
        if (accountDetails !== null) {
          var data = {};
          data.image = accountDetails["Image"];
          data.account = accountDetails["Account"];
          data.account_spoc = accountDetails["Account SPOC"][index];
          data.industry = accountDetails["Industry"][index];
          data.sector = accountDetails["Sector"][index];
          data.usecase = accountDetails["Shortlisted Use Case"][index];
          data.status = accountDetails["Status"][index];
          //console.log(accountDetails["Number of Usecases"]);
          doModal('idMyModal', data, index, accountDetails["Number of Usecases"]);
        }
      }

      function doModal(placementId, data, currentIdx, noOfUsecases) {
        //console.log('noOfUsecases' + noOfUsecases);
        //console.log("doModal()");
        var html = '<div id="modalWindow" tabindex="-1" class="modal hide"role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">';
        html += '<div class="modal-dialog" role="document">';
        html += '<div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span></button>';
        html += '<h5 class="modal-title" id="modalLabel">' + data.account + '</h5>';
        html += '</div>';
        html += '<div class="modal-body">';
        html += "<img class=\"center-block img-fluid\" src=\"images/" + data.image + "\" class=\"img-fluid\" alt=\"\">";
        html += '<table>';
        html += '<tr><td>Account Spoc</td><td>' + data.account_spoc + '</td></tr>';
        html += '<tr><td>Shortlisted Usecase</td><td>' + data.usecase + '</td></tr>';
        html += '<tr><td>Sector</td><td>' + data.sector + '</td></tr>';
        html += '<tr><td>Industry</td><td>' + data.industry + '</td></tr>';
        html += '<tr><td>Status</td><td>' + data.status + '</td></tr>';
        html += '</table>';
        html += '</div>';
        html += '<div class="modal-footer">';
        var previousIdx = currentIdx == 0 ? 'disabled' : parseInt(currentIdx) - 1;
        var nextIdx = currentIdx >= noOfUsecases - 1 ? 'disabled' : parseInt(currentIdx) + 1;
        if (previousIdx === 'disabled')
          html += '<span class="btn btn-secondary disabled link" id="" >Prev</span>';
        else
          html += '<span class="btn btn-secondary btn-nav link" id="' + previousIdx + '">Prev</span>';
        if (nextIdx === 'disabled')
          html += '<span class="btn btn-secondary disabled link" id="" >Next</span>';
        else
          html += '<span class="btn btn-secondary btn-nav link" id="' + nextIdx + '" >Next</span>';
        html += '<span class="btn btn-secondary btn-close link" data-dismiss="modal">Close</span>';

        html += '</div>'; // footer
        html += '</div>'; // modalWindow
        $("#" + placementId).html(html);
        $("#modalWindow").modal();

        $('.btn-nav').on('click', (event) => {
          //console.log($(event.target).attr('id'));
          var idx = $(event.target).attr('id');
          $('.btn-close').click();
          showUsecase('idMyModal', idx, data.account, null, null);
        });
      }

      function hideModal() {
        // Using a very general selector - this is because $('#modalDiv').hide
        // will remove the modal window but not the mask
        $('.modal.in').modal('hide');
      }
      // reset function
      $('.reset').on('click', function(event) {
        if (filterArray.length > 0) {
          updateFilterArray(filterArray[0], undefined);
          filterData();
        }
      });
    }
  });
});
