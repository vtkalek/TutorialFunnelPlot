/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                // TODO: refactor & focus DataViewTransform into a service with well-defined dependencies.
                var DataViewTransform;
                (function (DataViewTransform) {
                    // TODO: refactor this, setGrouped, and groupValues to a test helper to stop using it in the product
                    function createValueColumns(values, valueIdentityFields, source) {
                        if (values === void 0) { values = []; }
                        var result = values;
                        setGrouped(result);
                        if (valueIdentityFields) {
                            result.identityFields = valueIdentityFields;
                        }
                        if (source) {
                            result.source = source;
                        }
                        return result;
                    }
                    DataViewTransform.createValueColumns = createValueColumns;
                    function setGrouped(values, groupedResult) {
                        values.grouped = groupedResult
                            ? function () { return groupedResult; }
                            : function () { return groupValues(values); };
                    }
                    DataViewTransform.setGrouped = setGrouped;
                    /** Group together the values with a common identity. */
                    function groupValues(values) {
                        var groups = [], currentGroup;
                        for (var i = 0, len = values.length; i < len; i++) {
                            var value = values[i];
                            if (!currentGroup || currentGroup.identity !== value.identity) {
                                currentGroup = {
                                    values: []
                                };
                                if (value.identity) {
                                    currentGroup.identity = value.identity;
                                    var source = value.source;
                                    // allow null, which will be formatted as (Blank).
                                    if (source.groupName !== undefined) {
                                        currentGroup.name = source.groupName;
                                    }
                                    else if (source.displayName) {
                                        currentGroup.name = source.displayName;
                                    }
                                }
                                groups.push(currentGroup);
                            }
                            currentGroup.values.push(value);
                        }
                        return groups;
                    }
                    DataViewTransform.groupValues = groupValues;
                })(DataViewTransform = dataview.DataViewTransform || (dataview.DataViewTransform = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataRoleHelper;
                (function (DataRoleHelper) {
                    function getMeasureIndexOfRole(grouped, roleName) {
                        if (!grouped || !grouped.length) {
                            return -1;
                        }
                        var firstGroup = grouped[0];
                        if (firstGroup.values && firstGroup.values.length > 0) {
                            for (var i = 0, len = firstGroup.values.length; i < len; ++i) {
                                var value = firstGroup.values[i];
                                if (value && value.source) {
                                    if (hasRole(value.source, roleName)) {
                                        return i;
                                    }
                                }
                            }
                        }
                        return -1;
                    }
                    DataRoleHelper.getMeasureIndexOfRole = getMeasureIndexOfRole;
                    function getCategoryIndexOfRole(categories, roleName) {
                        if (categories && categories.length) {
                            for (var i = 0, ilen = categories.length; i < ilen; i++) {
                                if (hasRole(categories[i].source, roleName)) {
                                    return i;
                                }
                            }
                        }
                        return -1;
                    }
                    DataRoleHelper.getCategoryIndexOfRole = getCategoryIndexOfRole;
                    function hasRole(column, name) {
                        var roles = column.roles;
                        return roles && roles[name];
                    }
                    DataRoleHelper.hasRole = hasRole;
                    function hasRoleInDataView(dataView, name) {
                        return dataView != null
                            && dataView.metadata != null
                            && dataView.metadata.columns
                            && dataView.metadata.columns.some(function (c) { return c.roles && c.roles[name] !== undefined; }); // any is an alias of some
                    }
                    DataRoleHelper.hasRoleInDataView = hasRoleInDataView;
                    function hasRoleInValueColumn(valueColumn, name) {
                        return valueColumn
                            && valueColumn.source
                            && valueColumn.source.roles
                            && (valueColumn.source.roles[name] === true);
                    }
                    DataRoleHelper.hasRoleInValueColumn = hasRoleInValueColumn;
                })(DataRoleHelper = dataview.DataRoleHelper || (dataview.DataRoleHelper = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObject;
                (function (DataViewObject) {
                    function getValue(object, propertyName, defaultValue) {
                        if (!object) {
                            return defaultValue;
                        }
                        var propertyValue = object[propertyName];
                        if (propertyValue === undefined) {
                            return defaultValue;
                        }
                        return propertyValue;
                    }
                    DataViewObject.getValue = getValue;
                    /** Gets the solid color from a fill property using only a propertyName */
                    function getFillColorByPropertyName(object, propertyName, defaultColor) {
                        var value = getValue(object, propertyName);
                        if (!value || !value.solid) {
                            return defaultColor;
                        }
                        return value.solid.color;
                    }
                    DataViewObject.getFillColorByPropertyName = getFillColorByPropertyName;
                })(DataViewObject = dataview.DataViewObject || (dataview.DataViewObject = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObjects;
                (function (DataViewObjects) {
                    /** Gets the value of the given object/property pair. */
                    function getValue(objects, propertyId, defaultValue) {
                        if (!objects) {
                            return defaultValue;
                        }
                        return dataview.DataViewObject.getValue(objects[propertyId.objectName], propertyId.propertyName, defaultValue);
                    }
                    DataViewObjects.getValue = getValue;
                    /** Gets an object from objects. */
                    function getObject(objects, objectName, defaultValue) {
                        if (objects && objects[objectName]) {
                            return objects[objectName];
                        }
                        return defaultValue;
                    }
                    DataViewObjects.getObject = getObject;
                    /** Gets the solid color from a fill property. */
                    function getFillColor(objects, propertyId, defaultColor) {
                        var value = getValue(objects, propertyId);
                        if (!value || !value.solid) {
                            return defaultColor;
                        }
                        return value.solid.color;
                    }
                    DataViewObjects.getFillColor = getFillColor;
                    function getCommonValue(objects, propertyId, defaultValue) {
                        var value = getValue(objects, propertyId, defaultValue);
                        if (value && value.solid) {
                            return value.solid.color;
                        }
                        if (value === undefined
                            || value === null
                            || (typeof value === "object" && !value.solid)) {
                            return defaultValue;
                        }
                        return value;
                    }
                    DataViewObjects.getCommonValue = getCommonValue;
                })(DataViewObjects = dataview.DataViewObjects || (dataview.DataViewObjects = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                // powerbi.extensibility.utils.dataview
                var DataRoleHelper = powerbi.extensibility.utils.dataview.DataRoleHelper;
                var converterHelper;
                (function (converterHelper) {
                    function categoryIsAlsoSeriesRole(dataView, seriesRoleName, categoryRoleName) {
                        if (dataView.categories && dataView.categories.length > 0) {
                            // Need to pivot data if our category soure is a series role
                            var category = dataView.categories[0];
                            return category.source &&
                                DataRoleHelper.hasRole(category.source, seriesRoleName) &&
                                DataRoleHelper.hasRole(category.source, categoryRoleName);
                        }
                        return false;
                    }
                    converterHelper.categoryIsAlsoSeriesRole = categoryIsAlsoSeriesRole;
                    function getSeriesName(source) {
                        return (source.groupName !== undefined)
                            ? source.groupName
                            : source.queryName;
                    }
                    converterHelper.getSeriesName = getSeriesName;
                    function isImageUrlColumn(column) {
                        var misc = getMiscellaneousTypeDescriptor(column);
                        return misc != null && misc.imageUrl === true;
                    }
                    converterHelper.isImageUrlColumn = isImageUrlColumn;
                    function isWebUrlColumn(column) {
                        var misc = getMiscellaneousTypeDescriptor(column);
                        return misc != null && misc.webUrl === true;
                    }
                    converterHelper.isWebUrlColumn = isWebUrlColumn;
                    function getMiscellaneousTypeDescriptor(column) {
                        return column
                            && column.type
                            && column.type.misc;
                    }
                    converterHelper.getMiscellaneousTypeDescriptor = getMiscellaneousTypeDescriptor;
                    function hasImageUrlColumn(dataView) {
                        if (!dataView || !dataView.metadata || !dataView.metadata.columns || !dataView.metadata.columns.length) {
                            return false;
                        }
                        return dataView.metadata.columns.some(function (column) { return isImageUrlColumn(column) === true; });
                    }
                    converterHelper.hasImageUrlColumn = hasImageUrlColumn;
                })(converterHelper = dataview.converterHelper || (dataview.converterHelper = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObjectsParser = (function () {
                    function DataViewObjectsParser() {
                    }
                    DataViewObjectsParser.getDefault = function () {
                        return new this();
                    };
                    DataViewObjectsParser.createPropertyIdentifier = function (objectName, propertyName) {
                        return {
                            objectName: objectName,
                            propertyName: propertyName
                        };
                    };
                    DataViewObjectsParser.parse = function (dataView) {
                        var dataViewObjectParser = this.getDefault(), properties;
                        if (!dataView || !dataView.metadata || !dataView.metadata.objects) {
                            return dataViewObjectParser;
                        }
                        properties = dataViewObjectParser.getProperties();
                        for (var objectName in properties) {
                            for (var propertyName in properties[objectName]) {
                                var defaultValue = dataViewObjectParser[objectName][propertyName];
                                dataViewObjectParser[objectName][propertyName] = dataview.DataViewObjects.getCommonValue(dataView.metadata.objects, properties[objectName][propertyName], defaultValue);
                            }
                        }
                        return dataViewObjectParser;
                    };
                    DataViewObjectsParser.isPropertyEnumerable = function (propertyName) {
                        return !DataViewObjectsParser.InnumerablePropertyPrefix.test(propertyName);
                    };
                    DataViewObjectsParser.enumerateObjectInstances = function (dataViewObjectParser, options) {
                        var dataViewProperties = dataViewObjectParser && dataViewObjectParser[options.objectName];
                        if (!dataViewProperties) {
                            return [];
                        }
                        var instance = {
                            objectName: options.objectName,
                            selector: null,
                            properties: {}
                        };
                        for (var key in dataViewProperties) {
                            if (dataViewProperties.hasOwnProperty(key)) {
                                instance.properties[key] = dataViewProperties[key];
                            }
                        }
                        return {
                            instances: [instance]
                        };
                    };
                    DataViewObjectsParser.prototype.getProperties = function () {
                        var _this = this;
                        var properties = {}, objectNames = Object.keys(this);
                        objectNames.forEach(function (objectName) {
                            if (DataViewObjectsParser.isPropertyEnumerable(objectName)) {
                                var propertyNames = Object.keys(_this[objectName]);
                                properties[objectName] = {};
                                propertyNames.forEach(function (propertyName) {
                                    if (DataViewObjectsParser.isPropertyEnumerable(objectName)) {
                                        properties[objectName][propertyName] =
                                            DataViewObjectsParser.createPropertyIdentifier(objectName, propertyName);
                                    }
                                });
                            }
                        });
                        return properties;
                    };
                    return DataViewObjectsParser;
                }());
                DataViewObjectsParser.InnumerablePropertyPrefix = /^_/;
                dataview.DataViewObjectsParser = DataViewObjectsParser;
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var funnelRvisualVer03;
            (function (funnelRvisualVer03) {
                "use strict";
                var DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;
                var VisualSettings = (function (_super) {
                    __extends(VisualSettings, _super);
                    function VisualSettings() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.rcv_script = new rcv_scriptSettings();
                        return _this;
                    }
                    return VisualSettings;
                }(DataViewObjectsParser));
                funnelRvisualVer03.VisualSettings = VisualSettings;
                var rcv_scriptSettings = (function () {
                    function rcv_scriptSettings() {
                    }
                    return rcv_scriptSettings;
                }());
                funnelRvisualVer03.rcv_scriptSettings = rcv_scriptSettings;
            })(funnelRvisualVer03 = visual.funnelRvisualVer03 || (visual.funnelRvisualVer03 = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var funnelRvisualVer03;
            (function (funnelRvisualVer03) {
                "use strict";
                //END
                var Visual = (function () {
                    //user edit END: declare private variables
                    function Visual(options) {
                        this.imageDiv = document.createElement("div");
                        this.imageDiv.className = "rcv_autoScaleImageContainer";
                        this.imageElement = document.createElement("img");
                        this.imageElement.className = "rcv_autoScaleImage";
                        this.imageDiv.appendChild(this.imageElement);
                        options.element.appendChild(this.imageDiv);
                        //BEGIN
                        this.settings_funnel = {
                            lineColor: "blue",
                            conf1: "0.95",
                            conf2: "0.999"
                        };
                        this.settings_scatter = {
                            pointColor: "orange",
                            weight: 10,
                            percentile: 40,
                            sparsify: true
                        };
                        this.settings_axes = {
                            colLabel: "gray",
                            textSize: 12,
                            scaleXformat: "comma",
                            scaleYformat: "none",
                            sizeTicks: "8",
                            axisXisPercentage: true
                        };
                        //END
                    }
                    Visual.prototype.update = function (options) {
                        if (!options ||
                            !options.type ||
                            !options.viewport ||
                            !options.dataViews ||
                            options.dataViews.length === 0 ||
                            !options.dataViews[0]) {
                            return;
                        }
                        var dataView = options.dataViews[0];
                        this.settings = Visual.parseSettings(dataView);
                        var imageUrl = null;
                        //BEGIN
                        this.updateObjects(dataView.metadata.objects);
                        //END
                        if (dataView.scriptResult && dataView.scriptResult.payloadBase64) {
                            imageUrl = "data:image/png;base64," + dataView.scriptResult.payloadBase64;
                        }
                        if (imageUrl) {
                            this.imageElement.src = imageUrl;
                        }
                        else {
                            this.imageElement.src = null;
                        }
                        this.onResizing(options.viewport);
                    };
                    Visual.prototype.onResizing = function (finalViewport) {
                        this.imageDiv.style.height = finalViewport.height + "px";
                        this.imageDiv.style.width = finalViewport.width + "px";
                    };
                    Visual.parseSettings = function (dataView) {
                        return funnelRvisualVer03.VisualSettings.parse(dataView);
                    };
                    //BEGIN
                    /**
                     * This function gets called by the update function above. You should read the new values of the properties into
                     * your settings object so you can use the new value in the enumerateObjectInstances function below.
                     *
                     * Below is a code snippet demonstrating how to expose a single property called "lineColor" from the object called "settings"
                     * This object and property should be first defined in the capabilities.json file in the objects section.
                     * In this code we get the property value from the objects (and have a default value in case the property is undefined)
                     */
                    Visual.prototype.updateObjects = function (objects) {
                        this.settings_funnel = {
                            lineColor: funnelRvisualVer03.getValue(objects, 'settings_funnel_params', 'lineColor', 'blue'),
                            conf1: funnelRvisualVer03.getValue(objects, 'settings_funnel_params', 'conf1', "0.95"),
                            conf2: funnelRvisualVer03.getValue(objects, 'settings_funnel_params', 'conf2', "0.999")
                        };
                        this.settings_scatter = {
                            pointColor: funnelRvisualVer03.getValue(objects, 'settings_scatter_params', 'pointColor', 'orange'),
                            weight: funnelRvisualVer03.getValue(objects, 'settings_scatter_params', 'weight', 10),
                            percentile: funnelRvisualVer03.getValue(objects, 'settings_scatter_params', 'percentile', 40),
                            sparsify: funnelRvisualVer03.getValue(objects, 'settings_scatter_params', 'sparsify', true)
                        };
                        this.settings_axes = {
                            colLabel: funnelRvisualVer03.getValue(objects, 'settings_axes_params', 'colLabel', "gray"),
                            textSize: funnelRvisualVer03.getValue(objects, 'settings_axes_params', 'textSize', 12),
                            scaleXformat: funnelRvisualVer03.getValue(objects, 'settings_axes_params', 'scaleXformat', "comma"),
                            scaleYformat: funnelRvisualVer03.getValue(objects, 'settings_axes_params', 'scaleYformat', "none"),
                            sizeTicks: funnelRvisualVer03.getValue(objects, 'settings_axes_params', 'sizeTicks', "8"),
                            axisXisPercentage: funnelRvisualVer03.getValue(objects, 'settings_axes_params', 'axisXisPercentage', true)
                        };
                    };
                    //END
                    /**
                     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
                     * objects and properties you want to expose to the users in the property pane.
                     */
                    Visual.prototype.enumerateObjectInstances = function (options) {
                        //begin
                        var objectName = options.objectName;
                        var objectEnumeration = [];
                        switch (objectName) {
                            case 'settings_funnel_params':
                                objectEnumeration.push({
                                    objectName: objectName,
                                    properties: {
                                        lineColor: this.settings_funnel.lineColor,
                                        conf1: this.settings_funnel.conf1,
                                        conf2: this.settings_funnel.conf2
                                    },
                                    selector: null
                                });
                                break;
                            case 'settings_scatter_params':
                                objectEnumeration.push({
                                    objectName: objectName,
                                    properties: {
                                        pointColor: this.settings_scatter.pointColor,
                                        weight: funnelRvisualVer03.inMinMax(this.settings_scatter.weight, 1, 50),
                                        percentile: this.settings_scatter.percentile,
                                        sparsify: this.settings_scatter.sparsify,
                                    },
                                    selector: null
                                });
                                break;
                            case 'settings_axes_params':
                                objectEnumeration.push({
                                    objectName: objectName,
                                    properties: {
                                        colLabel: this.settings_axes.colLabel,
                                        textSize: this.settings_axes.textSize,
                                        sizeTicks: this.settings_axes.sizeTicks,
                                        scaleXformat: this.settings_axes.scaleXformat,
                                        axisXisPercentage: this.settings_axes.axisXisPercentage,
                                        scaleYformat: this.settings_axes.scaleYformat
                                    },
                                    selector: null
                                });
                                break;
                        }
                        ;
                        return objectEnumeration;
                        //end
                        // return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
                    };
                    return Visual;
                }());
                funnelRvisualVer03.Visual = Visual;
            })(funnelRvisualVer03 = visual.funnelRvisualVer03 || (visual.funnelRvisualVer03 = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var funnelRvisualVer03;
            (function (funnelRvisualVer03) {
                /**
                 * Gets property value for a particular object.
                 *
                 * @function
                 * @param {DataViewObjects} objects - Map of defined objects.
                 * @param {string} objectName       - Name of desired object.
                 * @param {string} propertyName     - Name of desired property.
                 * @param {T} defaultValue          - Default value of desired property.
                 */
                function getValue(objects, objectName, propertyName, defaultValue) {
                    if (objects) {
                        var object = objects[objectName];
                        if (object) {
                            var property = object[propertyName];
                            if (property !== undefined) {
                                return property;
                            }
                        }
                    }
                    return defaultValue;
                }
                funnelRvisualVer03.getValue = getValue;
                /**
                 * Gets property value for a particular object.
                 *
                 * @function
                 * @param {DataViewObjects} objects - Map of defined objects.
                 * @param {string} objectName       - Name of desired object.
                 * @param {string} propertyName     - Name of desired property.
                 * @param {T} defaultValue          - Default value of desired property.
                 */
                function getValueMinMax(objects, objectName, propertyName, defaultValue, minVal, maxVal) {
                    if (objects) {
                        var object = objects[objectName];
                        if (object) {
                            var property = object[propertyName];
                            if (property < minVal) {
                                return minVal;
                            }
                            if (property > maxVal) {
                                return maxVal;
                            }
                            if (property !== undefined) {
                                return property;
                            }
                        }
                    }
                    return defaultValue;
                }
                funnelRvisualVer03.getValueMinMax = getValueMinMax;
                /**
                * Gets property value for a particular object.
                *
                * @function
                * @param {DataViewObjects} objects - Map of defined objects.
                * @param {string} objectName       - Name of desired object.
                * @param {string} propertyName     - Name of desired property.
                * @param {T} defaultValue          - Default value of desired property.
                */
                function getValueNumberMinMax(objects, objectName, propertyName, defaultValue, minValue, maxValue) {
                    if (objects) {
                        var object = objects[objectName];
                        if (object) {
                            var property = object[propertyName];
                            if (property !== undefined) {
                                if (property > maxValue) {
                                    return maxValue;
                                }
                                if (property < minValue) {
                                    return minValue;
                                }
                                return property;
                            }
                        }
                    }
                    return defaultValue;
                }
                funnelRvisualVer03.getValueNumberMinMax = getValueNumberMinMax;
                /**
                     * Gets conditional property value for a particular object of type string
                     *
                     * @function
                     * @param {string} inVal     -  current value of parameter
                     * @param {string} contrVal   - control value
                     * @param {string} contrVal2Compare     - specific string to be compared with contrVal
                     * @param {boolean} logic          -  true / false "logic"
                     * @param {string} outValIfCondTrue          - output value if comparison (contrVal == contrVal2Compare) comes out as "logic"
                     */
                function ifStringReturnString(inVal, contrVal, contrVal2Compare, outValIfCondTrue, logic, applyNow) {
                    if (applyNow && contrVal == contrVal2Compare && logic == true)
                        return outValIfCondTrue;
                    if (applyNow && contrVal != contrVal2Compare && logic == false)
                        return outValIfCondTrue;
                    return inVal;
                }
                funnelRvisualVer03.ifStringReturnString = ifStringReturnString;
                function ifStringReturnStringClustersMethod(numClustersMethods, numOfClusters) {
                    if (numOfClusters != "auto")
                        return "None";
                    if (numOfClusters == "auto" && numClustersMethods == "None")
                        return "fast";
                    return numClustersMethods;
                }
                funnelRvisualVer03.ifStringReturnStringClustersMethod = ifStringReturnStringClustersMethod;
                function inMinMax(a, mi, ma) {
                    if (a < mi)
                        return mi;
                    if (a > ma)
                        return ma;
                    return a;
                }
                funnelRvisualVer03.inMinMax = inMinMax;
                /**
                 * Gets property value for a particular object in a category.
                 *
                 * @function
                 * @param {DataViewCategoryColumn} category - List of category objects.
                 * @param {number} index                    - Index of category object.
                 * @param {string} objectName               - Name of desired object.
                 * @param {string} propertyName             - Name of desired property.
                 * @param {T} defaultValue                  - Default value of desired property.
                 */
                function getCategoricalObjectValue(category, index, objectName, propertyName, defaultValue) {
                    var categoryObjects = category.objects;
                    if (categoryObjects) {
                        var categoryObject = categoryObjects[index];
                        if (categoryObject) {
                            var object = categoryObject[objectName];
                            if (object) {
                                var property = object[propertyName];
                                if (property !== undefined) {
                                    return property;
                                }
                            }
                        }
                    }
                    return defaultValue;
                }
                funnelRvisualVer03.getCategoricalObjectValue = getCategoricalObjectValue;
            })(funnelRvisualVer03 = visual.funnelRvisualVer03 || (visual.funnelRvisualVer03 = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var plugins;
        (function (plugins) {
            plugins.funnelRvisualVer03 = {
                name: 'funnelRvisualVer03',
                displayName: 'funnelRvisualVer03',
                class: 'Visual',
                version: '1.0.3',
                apiVersion: '1.7.0',
                create: function (options) { return new powerbi.extensibility.visual.funnelRvisualVer03.Visual(options); },
                custom: true
            };
        })(plugins = visuals.plugins || (visuals.plugins = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
//# sourceMappingURL=visual.js.map