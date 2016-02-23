/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(['../Types', './QueryParams', '../Collections/Dictionaries/OrderedStringKeyDictionary', '../Collections/Enumeration/Enumerator'], function(exports_1, context_1) {
    'use strict';
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Types_1, QueryParams, OrderedStringKeyDictionary_1, Enumerator_1;
    var ENTRY_SEPARATOR, KEY_VALUE_SEPARATOR, QueryBuilder;
    return {
        setters:[
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (QueryParams_1) {
                QueryParams = QueryParams_1;
            },
            function (OrderedStringKeyDictionary_1_1) {
                OrderedStringKeyDictionary_1 = OrderedStringKeyDictionary_1_1;
            },
            function (Enumerator_1_1) {
                Enumerator_1 = Enumerator_1_1;
            }],
        execute: function() {
            ENTRY_SEPARATOR = "&", KEY_VALUE_SEPARATOR = "=";
            QueryBuilder = (function (_super) {
                __extends(QueryBuilder, _super);
                function QueryBuilder(query, decodeValues) {
                    if (decodeValues === void 0) { decodeValues = true; }
                    _super.call(this);
                    this.importQuery(query, decodeValues);
                }
                QueryBuilder.init = function (query, decodeValues) {
                    if (decodeValues === void 0) { decodeValues = true; }
                    return new QueryBuilder(query, decodeValues);
                };
                QueryBuilder.prototype.importQuery = function (query, decodeValues) {
                    if (decodeValues === void 0) { decodeValues = true; }
                    if (Types_1.default.isString(query)) {
                        this.importFromString(query, decodeValues);
                    }
                    else if (Array.isArray(query) || Enumerator_1.isEnumerable(query)) {
                        this.importPairs(query);
                    }
                    else {
                        this.importMap(query);
                    }
                    return this;
                };
                QueryBuilder.prototype.importFromString = function (values, deserialize, decodeValues) {
                    if (deserialize === void 0) { deserialize = true; }
                    if (decodeValues === void 0) { decodeValues = true; }
                    var _ = this;
                    QueryParams.parse(values, function (key, value) {
                        if (_.containsKey(key)) {
                            var prev = _.getValue(key);
                            if (Array.isArray(prev))
                                prev.push(value);
                            else
                                _.setValue(key, [prev, value]);
                        }
                        else
                            _.setValue(key, value);
                    }, deserialize, decodeValues);
                    return this;
                };
                QueryBuilder.prototype.encode = function (prefixIfNotEmpty) {
                    var entries = [];
                    var keys = this.keys;
                    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                        var k = keys_1[_i];
                        var value = this.getValue(k);
                        for (var _a = 0, _b = Array.isArray(value) ? value : [value]; _a < _b.length; _a++) {
                            var v = _b[_a];
                            entries.push(k + KEY_VALUE_SEPARATOR
                                + QueryParams.encodeValue(v));
                        }
                    }
                    return (entries.length && prefixIfNotEmpty ? '?' : '')
                        + entries.join(ENTRY_SEPARATOR);
                };
                QueryBuilder.prototype.toString = function () {
                    return this.encode();
                };
                return QueryBuilder;
            }(OrderedStringKeyDictionary_1.default));
            exports_1("default", QueryBuilder);
        }
    }
});
//# sourceMappingURL=QueryBuilder.js.map