
/* global: describe, it, expect, beforeEach, module, inject */
describe("Testing arrayUtil service", function () {
    "use strict";

    var arrayUtility,
        testData = [
            { _id : 101, name : "Bill", age : 27 },   //0
            { _id : 102, name : "Sue", age : 40 },    //1
            { _id : 103, name : "James", age : 36 },  //2
            { _id : 104, name : "Mary", age : 49 }    //3
        ];

    beforeEach(module("composer"));

    beforeEach(inject(function (_arrayUtility_) {
        arrayUtility = _arrayUtility_;
    }));

    describe("findIndex", function () {

        it("should return the index of an object in an array", function () {
            var person = testData[2],
                result = arrayUtility.findIndex(person, testData);

            expect(result).toEqual(2);
        });

        it("should return -1 if the object is not in the array", function () {
            var person = { _id : 5, name : "Larry", age : 53 },
                result = arrayUtility.findIndex(person, testData);

            expect(result).toEqual(-1);
        });

        it("should return -1 if a new object is created even if it has the same properties as one in the array", function () {
            var person = { _id : 2, name : "Sue", age : 40 },
                result = arrayUtility.findIndex(person, testData);

            expect(result).toEqual(-1);
        });
    });

    describe("add", function () {

        it("should add an object to the end of the array and return new array length", function () {
            var data = [].concat(testData),
                person = { _id : 105, name : "Larry", age : 53 },
                result = arrayUtility.add(person, data);

            expect(result).toEqual(5);
            expect(data[data.length-1]).toEqual(person);
        });

        it("should add an object to the beginning of the array if true is passed as the 3rd arg", function () {
            var data = [].concat(testData),
                person = { _id : 5, name : "Larry", age : 53 },
                result = arrayUtility.add(person, data, true);

            expect(data[0]).toEqual(person);
        });

        it("should not add an object that is already in the array", function () {
            var person = testData[0],
                result = arrayUtility.add(person, testData);

            expect(result).toEqual(-1);
            expect(testData[0]).toEqual(person);
        });
    });

    describe("remove", function () {

        it("should remove an object from the array and return the removed object", function () {
            var data = [].concat(testData),
                person = data[0],
                result = arrayUtility.remove(person, data);

            expect(result).toEqual(person);
            expect(data.length).toEqual(3);
        });

        it("should not remove an object that is not in the array and return undefined", function () {
            var data = [].concat(testData),
                person = { _id : 105, name : "Larry", age : 53 },
                result = arrayUtility.remove(person, data);

            expect(result).toBeUndefined();
            expect(data.length).toEqual(4);
        });
    });

    describe("move", function () {

        it("should remove an object from src array and add it to dest array", function () {
            var srcArray = [].concat(testData),
                destArray = [],
                person = srcArray[1],
                result = arrayUtility.move(person, destArray, srcArray);

            expect(result).toEqual(person);
            expect(srcArray.length).toEqual(3);
            expect(destArray.length).toEqual(1);
            expect(destArray[0]).toEqual(person);
        });

        it("should not add an item to dest array if not found in src array", function () {
            var srcArray = [].concat(testData),
                destArray = [],
                person = { _id : 105, name : "Larry", age : 53 },
                result = arrayUtility.move(person, destArray, srcArray);

            expect(result).toBeUndefined();
            expect(srcArray.length).toEqual(4);
            expect(destArray.length).toEqual(0);
        });
    });

    describe("up", function () {
        it("should change an object index toward 0 by 1 in array", function () {
            var array = [].concat(testData),
                person = array[2],
                result = arrayUtility.up(person, array);

            expect(result).toEqual(person);
            expect(array.indexOf(person)).toEqual(1);
        });
    });

    describe("down", function () {
        it("should change an object index toward array.length by 1 in array", function () {
            var array = [].concat(testData),
                person = array[2],
                result = arrayUtility.down(person, array);

            expect(result).toEqual(person);
            expect(array.indexOf(person)).toEqual(3);
        });
    });

    describe("findById", function () {
        it("should find the object in an array whos _id matches the supplied value", function () {
            var result = arrayUtility.findById(102, testData);
            expect(result).toEqual(testData[1]); // array is 0 based
        });
    });

    describe("findIndexById", function () {
        it("should find the index of the object in an array whos _id matches the supplied value", function () {
            var result = arrayUtility.findIndexById(102, testData);
            expect(result).toEqual(1); // array is 0 based
        });
    });

    describe("addById", function () {
        it("should add an object to the end of the array and return new array length", function () {
            var data = [].concat(testData),
                person = { _id : 105, name : "Larry", age : 53 },
                result = arrayUtility.addById(person, data);

            expect(result).toEqual(5);
            expect(data[data.length-1]).toEqual(person);
        });

        it("should add an object to the beginning of the array if true is passed as the 3rd arg", function () {
            var data = [].concat(testData),
                person = { _id : 105, name : "Larry", age : 53 },
                result = arrayUtility.addById(person, data, true);

            expect(result).toEqual(5);
            expect(data[0]).toEqual(person);
        });

        it("should not add an object that is already in the array based on _id property", function () {
            var fakePerson = { _id : 102 },
                result = arrayUtility.addById(fakePerson, testData);
            expect(result).toEqual(-1);
        });
    });

    describe("removeById", function () {

        it("should remove an object from the array based on _id and return the object", function () {
            var data = [].concat(testData),
                person = data[1],
                result = arrayUtility.removeById(102, data);

            expect(result).toEqual(person);
            expect(data.length).toEqual(3);
        });

        it("should not remove an object that is not in the array based on _id and return undefined", function () {
            var data = [].concat(testData),
                result = arrayUtility.removeById(105, data);

            expect(result).toBeUndefined();
            expect(data.length).toEqual(4);
        });
    });

    describe("moveById", function () {

        it("should remove an object from src array and add it to dest array based on _id", function () {
            var srcArray = [].concat(testData),
                destArray = [],
                person = srcArray[1],
                result = arrayUtility.moveById(102, destArray, srcArray);

            expect(result).toEqual(person);
            expect(srcArray.length).toEqual(3);
            expect(destArray.length).toEqual(1);
            expect(destArray[0]).toEqual(person);
        });

        it("should not add an item to dest array if not found in src array", function () {
            var srcArray = [].concat(testData),
                destArray = [],
                result = arrayUtility.moveById(106, destArray, srcArray);

            expect(result).toBeUndefined();
            expect(srcArray.length).toEqual(4);
            expect(destArray.length).toEqual(0);
        });
    });

    describe("upById", function () {
        it("should change an object index toward 0 by 1 in array based on _id prop", function () {
            var array = [].concat(testData),
                person = array[1],
                result = arrayUtility.upById(102, array);

            expect(result).toEqual(person);
            expect(array[0]).toEqual(person);
        });
    });

    describe("downById", function () {
        it("should change an object index toward array.length by 1 in array based on _id prop", function () {
            var array = [].concat(testData),
                person = array[1],
                result = arrayUtility.downById(102, array);

            expect(result).toEqual(person);
            expect(array[2]).toEqual(person);
        });
    });

    describe("extendArray", function () {
        it("should concat src array into dst array and return dst array", function () {
            var srcArray = [].concat(testData),
                dstArray = [{ _id : 5, name : "Larry", age : 53 }],
                result = arrayUtility.extendArray(dstArray, srcArray);

            expect(result).toEqual(dstArray);
            expect(result.length).toEqual(5);
            expect(result[0]._id).toEqual(5);
        });
    });

    describe("getProvider", function () {
        it("should return an array of objects each with a text and value prop", function () {
            var srcArray = [].concat(testData),
                result = arrayUtility.getProvider(srcArray, "name", "_id");

            expect(result.length).toEqual(srcArray.length);
            expect(result[0].text).toEqual(srcArray[0].name);
            expect(result[0].value).toEqual(srcArray[0]._id);
        });
    });

    describe("fill", function () {
        it("should add objects to the array until it reaches the specified size", function () {
            var srcArray = [],
                result = arrayUtility.fill(srcArray, 10);

            expect(result.length).toEqual(10);
            expect(srcArray).toEqual(result);
            expect(typeof result[0]).toEqual("object");
        });
    });
});
