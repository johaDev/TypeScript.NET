(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../../../../source/System/Collections/Array/Compare"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ArrayCompare = require("../../../../../source/System/Collections/Array/Compare");
    var assert = require('../../../../../node_modules/assert/assert');
    var a1 = [1, 2, 3];
    var a2 = [1, 2, 3];
    var b = [4, 5, 6];
    var c = [7, 8, 9, 10];
    var d = b.slice();
    var e = c.slice();
    d.length = e.length = 200000;
    describe(".areEqual()", function () {
        it("should be equal", function () {
            assert.ok(ArrayCompare.areEqual([], []));
            assert.ok(ArrayCompare.areEqual(a1, a1));
            assert.ok(ArrayCompare.areEqual(a1, a2));
        });
        it("should not be equal", function () {
            assert.ok(!ArrayCompare.areEqual(null, a1));
            assert.ok(!ArrayCompare.areEqual(a1, null));
            assert.ok(!ArrayCompare.areEqual(a1, b));
            assert.ok(!ArrayCompare.areEqual(b, c));
        });
    });
    describe(".areAllEqual()", function () {
        it("should be equal", function () {
            assert.ok(ArrayCompare.areAllEqual([[], [], []]));
            assert.ok(ArrayCompare.areAllEqual([a1, a1, a2]));
        });
        it("should not be equal", function () {
            assert.ok(!ArrayCompare.areAllEqual([a1, null]));
            assert.ok(!ArrayCompare.areAllEqual([a1, b, c]));
            assert.ok(!ArrayCompare.areAllEqual([a1, b], true, function () { return false; }));
        });
        it("should error for invalid", function () {
            assert.throws(function () { return ArrayCompare.areAllEqual(null); });
            assert.throws(function () { return ArrayCompare.areAllEqual([]); });
            assert.throws(function () { return ArrayCompare.areAllEqual([a1]); });
        });
    });
    describe(".areEquivalent()", function () {
        it("should be equivalent", function () {
            assert.ok(ArrayCompare.areEquivalent([1], [1]));
            assert.ok(ArrayCompare.areEquivalent(a1, a1));
            assert.ok(ArrayCompare.areEquivalent(a1, a2));
            assert.ok(ArrayCompare.areEquivalent(a1, a1.slice().reverse()));
        });
        it("should not be equivalent", function () {
            assert.ok(!ArrayCompare.areEquivalent([1], [2]));
            assert.ok(!ArrayCompare.areEquivalent(a1, b, function () { return 1; }));
            assert.ok(!ArrayCompare.areEquivalent(a1, b));
            assert.ok(!ArrayCompare.areEquivalent(d, e));
        });
    });
});

//# sourceMappingURL=Compare.js.map
