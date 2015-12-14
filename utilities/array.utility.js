angular.module("composer")

    .factory("arrayUtility", function () {
        "use strict";

        return {
            //for woring with general arrays of objects
            findIndex : findIndex,
            add: add,
            remove: remove,
            move: move,
            up : up,
            down : down,

            //for working with arrays of objects where each object has an _id property
            findById : findById,
            findIndexById : findIndexById,
            addById : addById,
            removeById : removeById,
            moveById : moveById,
            upById  : upById,
            downById  : downById,
            shiftObject: shiftObject,

            //extra
            extendArray : extendArray,
            getProvider : getProvider,
            fill : fill,
            objectToArray : objectToArray
        };

        /**
         * Finds the index of the specified object in the array.
         * NOTE: compare based on reference to object in memory.
         * @param {Object} item
         * @param {Array} array
         * @returns {Number}
         */
        function findIndex (item, array) {
            return array.indexOf(item);
        }

        /**
         * Adds an item to an array if the item isn't already in the array.
         * NOTE: compare based on reference to object in memory.
         * @param {Array} array
         * @param {Object} item
         * @param {Boolean} [first=false] Add item to the front of the array or the end (default: end)
         * @returns {Number} The length of the array or -1 if not added
         */
        function add(item, array, first) {
            if(array.indexOf(item) === -1) {
                return first ? array.unshift(item) : array.push(item);
            }
            return -1;
        }

        /**
         * Removes an item from an array if the item is in the array.
         * NOTE: compare based on reference to object in memory.
         * @param {Array} array
         * @param {Object} item
         * @returns {Object} The removed item or undefined if not removed
         */
        function remove(item, array) {
            var index = array.indexOf(item);
            if(index !== -1) {
                return array.splice(index, 1)[0];
            }
        }

        /**
         * Moves an object from one array to another.
         * NOTE: compare based on reference to object in memory.
         * @param {Object} item
         * @param {Array} toArray
         * @param {Array} fromArray
         * @returns {Object} A reference to the item that was passed to the function
         */
        function move(item, toArray, fromArray) {
            item = remove(item, fromArray);
            if(typeof item !== "undefined") {
                add(item, toArray);
                return item;
            }
        }

        /**
         * Moves the item towards 0 by 1
         * NOTE: compare based on reference to object in memory.
         * @param item
         * @param array
         * @returns {Object} A reference to the item that was passed to the function
         */
        function up(item, array) {
            var index = findIndex(item, array),
                toIndex = index - 1;

            if(index !== -1 && toIndex > -1) {
                array.splice(toIndex, 0, array.splice(index, 1)[0]);
            }
            return item;
        }

        /**
         * Moves the item towards array.length by 1
         * NOTE: compare based on reference to object in memory.
         * @param item
         * @param array
         * @returns {Object} A reference to the item that was passed to the function
         */
        function down(item, array) {
            var index = findIndex(item, array),
                toIndex = index + 1;

            if(index !== -1 && toIndex < array.length) {
                array.splice(toIndex, 0, array.splice(index, 1)[0]);
            }
            return item;
        }

        /**
         * Move an object in an array to a specific position and shifts the other
         * elements down
         * @param  array
         * @param (target) Object to move
         * @param (position) new position is array
         * @returns {Array} new sorted array
         */
        function shiftObject(array, target, position) {
            var sorted = [];
            _.forEach(array,function(item,i) {
                if (i == position)
                    sorted.push(target);

                if (target != item)
                    sorted.push(item);
            });
            return sorted;
        }

        /**
         * Finds an object in an array based on the id specified.
         * NOTE: compare based on _id property
         * @param {String|Number} id
         * @param {Array} array
         * @returns {Object} A reference to the object that has the specified id
         */
        function findById(id, array) {
            for(var i = 0; i < array.length; i++) {
                if( array[i]._id === id) {
                    return array[i];
                }
            }
        }

        /**
         * Finds the index of the specified object in the array.
         * NOTE: compare based of _id property
         * @param {String|Number} id
         * @param {Array} array
         * @returns {Number}
         */
        function findIndexById(id, array) {
            for(var i = 0; i < array.length; i++) {
                if( array[i]._id === id) {
                    return i;
                }
            }
            return -1;
        }

        /**
         * Adds an item to an array if the item isn't already in the array.
         * NOTE: compare based of _id property
         * @param {Array} array
         * @param {Object} item
         * @param {Boolean} [first=false] Add item to the front of the array or the end (default: end)
         * @returns {Number} The new length of the array or -1 if not added
         */
        function addById(item, array, first) {
            var index = findIndexById(item._id, array);
            if(index === -1) {
                return first ? array.unshift(item) : array.push(item);
            }
            return -1;
        }

        /**
         * Removes an item from an array if the item is in the array.
         * NOTE: compare based of _id property
         * @param {String|Number} id
         * @param {Array} array
         * @returns {Object} The removed item or undefined if not removed
         */
        function removeById(id, array) {
            var index = findIndexById(id, array);
            if(index !== -1) {
                return array.splice(index, 1)[0];
            }
        }

        /**
         * Moves an object from one array to another.
         * NOTE: compare based of _id property
         * @param {String|Number} id
         * @param {Array} toArray
         * @param {Array} fromArray
         * @returns {Object} A reference to the item that was passed to the function
         */
        function moveById(id, toArray, fromArray) {
            var item = removeById(id, fromArray);
            if(typeof item !== "undefined") {
                addById(item, toArray);
                return item;
            }
        }

        /**
         * Moves the item towards 0 by 1
         * NOTE: compare based of _id property
         * @param {String|Number} id
         * @param array
         * @returns {Object} A reference to the item that was passed to the function
         */
        function upById(id, array) {
            var index = findIndexById(id, array),
                toIndex = index - 1,
                item;

            if(index !== -1 && toIndex > -1) {
                item = array.splice(index, 1)[0];
                array.splice(toIndex, 0, item);
            }
            return item;
        }

        /**
         * Moves the item towards array.length by 1
         * NOTE: compare based of _id property
         * @param {String|Number} id
         * @param array
         * @returns {Object} A reference to the item that was passed to the function
         */
        function downById(id, array) {
            var index = findIndexById(id, array),
                toIndex = index + 1,
                item;

            if(index !== -1 && toIndex < array.length) {
                item = array.splice(index, 1)[0];
                array.splice(toIndex, 0, item);
            }
            return item;
        }

        /**
         * Concats 2 arrays together by adding all items in srcArray to the end of dstArray and returns dstArray.
         * NOTE: this method differes from Array.concat in that it does not create a new array.
         * @param {Array} dstArray
         * @param {Array} srcArray
         * @returns {Array}
         */
        function extendArray(dstArray, srcArray) {
            dstArray.push.apply(dstArray, srcArray);
            return dstArray;
        }

        /**
         * Gets an array of objects that can be used in ng-options for a select dropdown.
         * NOTE: set ng-options="item.value as item.text for item in array" for proper list population.
         * @param {Array} array
         * @param {String} [textProp=undefined]
         * @param {String} [valueProp=undefined]
         * @returns {Array}
         */
        function getProvider(array, textProp, valueProp) {
            return array.map(function (item) {
                if(!angular.isObject(item)) {
                    return { text : item, value : item };
                } else {
                    return { text : item[textProp], value : item[valueProp] };
                }
            });
        }

        /**
         * Fills an array with objects until it reaches the specified size
         * @param {Array} array
         * @param {Number} size
         * @param {function} [createMethod=undefined]
         * @returns {Array}
         */
        function fill(array, size, createMethod) {
            if(array.length < size) {
                createMethod = createMethod || function () { return {}; };
                for(var i = 0; i < size; i++) {
                    array.push(createMethod(i));
                }
            }
            return array;
        }

        /**
         * Converts an array of objects to an array values based on key
         * @param {Array} array
         * @param {String} key
         * @returns {Array}
         */
        function objectToArray(array, key) {
            return array.map(function (item) {
                return item[key];
            });
        }
    });
