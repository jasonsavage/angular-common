angular.module("composer.common")

    .factory("tableService", function (utilityService) {
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

                addRow : addRow,
                removeRow : removeRow,
                activateRow : activateRow,
                sortRows : sortRows,

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

                //clear sort
                if(api.sortOrder === "") {
                    api.sortProperty = "";
                }

                updateTableRows();
            }

            /**
             * Adds a new row to the master data array and updates table rows.
             * @param row
             */
            function addRow(row) {
                //add to master array
                utilityService.arrayAddItem(api.data, row, true);
                //update table rows
                updateTableRows();
            }

            /**
             * Removes a row form the master data array and updates table rows.
             * @param row
             */
            function removeRow(row) {
                //remove from master array
                utilityService.arrayRemoveItem(api.data, row);
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
                rows = api.data.filter(applyFilters);

                //step 2: if the user has clicked a column, apply sorting
                if(api.sortProperty !== "") {
                    rows = rows.sort(getSorter(api.sortProperty, api.sortOrder));
                }

                api.totalRows = rows.length;

                //step 3: update pagination and apply
                rows = rows.splice(api.page * api.pageSize, api.pageSize);

                api.tableRows.length = 0;
                for(var i=0; i < rows.length; i++){
                    api.tableRows.push(rows[i]);
                }
            }

            /**
             * Gets a string descibing the current pageing status of the table rows.
             * @returns {string}
             */
            function getPaginationStatus() {
                var start = api.page * api.pageSize,
                    end = start + Math.min(api.tableRows.length, api.pageSize);
                return "Displaying " + (start+1) + " - " + end + " of " + api.totalRows;
            }
        }

        function applyFilters(row){
            return true;
        }

        function getSorter(prop, order){
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
    });
