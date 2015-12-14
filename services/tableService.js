angular.module("composer.common")

    .factory("tableService", function (arrayUtil, utilityService) {
        "use strict";

        return {
            createApi : createApi
        };

        /**
         * Get an api for building a dynamic table in angular.
         * NOTE: createApi is written to return an instance to support multiple tables on a page with separate apis.
         * @param tableData
         * @returns object
         */
        function createApi(tableData) {
            //optional param
            tableData = tableData || [];

            var api = {
                data : tableData,

                tableRows : [],
                totalRows : tableData.length,
                activeRow : null,

                page : 0,
                pageSize : 10,
                pageTotal : 0,

                sortProperty : "",
                sortOrder : "desc",

                filters : {},

                addRow : addRow,
                removeRow : removeRow,
                activateRow : activateRow,
                sortRows : sortRows,
                filterRows : filterRows,

                isActive : isActive,

                updateTableRows : updateTableRows,
                getPaginationStatus : getPaginationStatus
            };

            //populate table rows array based on default settings
            updateTableRows();

            //return api
            return api;

            //private methods

            /**
             * Sorts table rows based on property and order specified.
             * @param prop
             * @param order
             */
            function sortRows(prop, order) {
                api.sortProperty = prop;
                api.sortOrder = order;
                api.page = 0;
                api.activeRow = null;

                //clear sort
                if(api.sortOrder === "") {
                    api.sortProperty = "";
                }

                updateTableRows();
            }

            function filterRows(prop, value) {

                api.filters[prop] = value;

                if(angular.isUndefined(value) || value === null || value === "") {
                    delete api.filters[prop];
                }

                //reset
                api.page = 0;
                api.activeRow = null;

                updateTableRows();
            }

            /**
             * Adds a new row to the master data array and updates table rows.
             * @param row
             */
            function addRow(row) {
                //add to master array
                arrayUtil.add(row, api.data, true);
                //update table rows
                updateTableRows();
            }

            /**
             * Removes a row form the master data array and updates table rows.
             * @param row
             */
            function removeRow(row) {
                if(api.activeRow === row) {
                    api.activeRow = null;
                }

                //remove from master array
                arrayUtil.remove(row, api.data);
                //update table rows
                updateTableRows();
            }

            /**
             * Sets this row as the active row. Used for highlighting and editing rows.
             * @param row
             */
            function activateRow(row) {
                api.activeRow = (api.activeRow !== row) ? row : null;
            }

            /**
             * Returns true of false if the specified row is the active one.
             * @param row
             * @returns {boolean}
             */
            function isActive(row) {
                return (api.activeRow === row);
            }

            /**
             * Runs through the master data array appling sorting, filtering and paging then updates the table rows.
             */
            function updateTableRows() {
                //we will create a new array that we will fill with
                //all the rows that should still bee in the view.
                var rows;

                //step 1: apply filtering on all the rows
                rows = api.data.filter(function (row){
                    return applyFilters(row, api.filters);
                });

                //step 2: if the user has clicked a column, apply sorting
                if(api.sortProperty !== "") {
                    rows = rows.sort(getSorter(api.sortProperty, api.sortOrder));
                }

                api.totalRows = rows.length;

                //step 3: update pagination and apply
                if(api.pageSize > 0) {
                    rows = rows.splice(api.page * api.pageSize, api.pageSize);
                }

                api.tableRows.length = 0;
                arrayUtil.extendArray(api.tableRows, rows);
            }

            /**
             * Gets a string descibing the current pageing status of the table rows.
             * @returns {string}
             */
            function getPaginationStatus() {
                var start = api.page * api.pageSize,
                    end = start + Math.min(api.tableRows.length, api.pageSize);
                //if there are no records
                start = (end === 0) ? -1 : start;
                return "Displaying " + (start+1) + " - " + end + " of " + api.totalRows;
            }
        }

        function applyFilters(row, filters){
            var allow = true;

            // Loop through each property that exists on the filters object.
            Object.keys(filters).forEach(function(key) {

                // Get the row value for this column
                var rowValue = row[key],
                    filterValue = filters[key];

                // Check if allow is still true, because if not then another filter has removed this row already.
                if(allow) {
                    // If the rowValue is a boolean, do a boolean compare
                    if(rowValue === true || rowValue === false) {
                        allow = (rowValue === filterValue);
                    }
                    // The default filter is a basic string search filter.
                    // String search filter will match any characters in filterValue that appear in rowValue in the same order.
                    else
                    {
                        allow = stringSearchFilter(rowValue, filterValue);
                    }
                }
            });

            return allow;
        }

        function getSorter(prop, order){
            //TODO: add ability to sort number values with numberSorter()
            return stringSorter(prop, order);
        }

        function stringSorter (sortColumn, sortOrder) {
            return function (rowA, rowB) {
                var valueA = rowA[sortColumn],
                    valueB = rowB[sortColumn],
                    result = valueA.localeCompare(valueB);
                if(sortOrder === "asc") {
                    result *= -1;
                }
                return result;
            };
        }

        function numberSorter (sortColumn, sortOrder) {
            return function (rowA, rowB) {
                var valueA = rowA[sortColumn],
                    valueB = rowB[sortColumn],
                    result = (valueA - valueB);
                if(sortOrder === "asc") {
                    result *= -1;
                }
                return result;
            };
        }

        /**
         * Filters strings based on whether the row value contains the filter value.
         *
         * @param {string|number} rowValue     - ng-model value
         * @param {string|number} filterValue  - value to filter on
         * @return {boolean} - true if rowValue contains filterValue
         */
        function stringSearchFilter (rowValue, filterValue) {
            var value = rowValue ? rowValue.toString().toLowerCase() : "",
                filter = filterValue.toString().trim().toLowerCase();
            return (value.indexOf(filter) !== -1);
        }
    });
