/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var defaultOptions = {
    maxWidth: 600,
    maxHeight: 600,
    clamp: 16,
    colorChoices: 10,
    rgbFloor: 64,
    rgbCeil: 232
};
function ReadFileAsBuffer(file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onerror = reject;
        reader.onabort = reject;
        reader.onload = function (ev) {
            resolve(ev.target.result);
        };
        reader.readAsDataURL(file);
    });
}
function componentToHex(c) {
    var hex = (c - 0).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function CalculateImageDimensions(img, maxWidth, maxHeight) {
    var width = img.width;
    var height = img.height;
    if ((width < maxWidth) && (height < maxHeight)) {
        maxWidth = width;
        maxHeight = height;
    }
    var ratioW = width / maxWidth;
    var ratioH = height / maxHeight;
    var ratio = Math.max(ratioW, ratioH);
    width = Math.round(width / ratio);
    height = Math.round(height / ratio);
    return [width, height];
}
function PrimaryColor(file, options) {
    var _this = this;
    if (options === void 0) { options = defaultOptions; }
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var img, _a, ex_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    img = document.createElement("img");
                    img.onload = function () {
                        var _a = CalculateImageDimensions(img, options.maxWidth, options.maxHeight), width = _a[0], height = _a[1];
                        var canvas = document.createElement("canvas");
                        canvas.width = width;
                        canvas.height = height;
                        var context = canvas.getContext("2d");
                        context.drawImage(img, 0, 0, width, height);
                        var imageData = context.getImageData(0, 0, width, height).data;
                        var length = imageData.length;
                        var CLAMP = options.clamp;
                        var rgbComponent = {};
                        for (var i = 0; i < length; i += 4) {
                            var r = Math.ceil(imageData[i] / CLAMP) * CLAMP, g = Math.ceil(imageData[i + 1] / CLAMP) * CLAMP, b = Math.ceil(imageData[i + 2] / CLAMP) * CLAMP;
                            //we don't know what wild future we live in. 
                            //There's always "The Colour out of space."
                            if (r > 255)
                                r = 255;
                            if (g > 255)
                                g = 255;
                            if (b > 255)
                                b = 255;
                            if (r < options.rgbFloor && g < options.rgbFloor && b < options.rgbFloor)
                                continue; //don't grab too dark.
                            if (r > options.rgbCeil && g > options.rgbCeil && b > options.rgbCeil)
                                continue; //don't grab too bright.
                            var hexShift = (r << 16) | (g << 8) | (b);
                            if (!rgbComponent[hexShift])
                                rgbComponent[hexShift] = 0;
                            rgbComponent[hexShift]++;
                        }
                        var popularList = new Array(options.colorChoices);
                        popularList.fill(0, 0, options.colorChoices);
                        var max = 0;
                        //can definitely sort this better.
                        //will re-write later.
                        for (var x in rgbComponent) {
                            for (var y in popularList) {
                                if (!rgbComponent[popularList[y]]) {
                                    popularList[y] = x;
                                    break;
                                }
                                max = Math.max(rgbComponent[popularList[y]], rgbComponent[x]);
                                if (max == rgbComponent[x]) {
                                    popularList[y] = x;
                                    break;
                                }
                            }
                        }
                        var list = popularList.map(function (el) {
                            return rgbToHex((el & 0xff0000) >> 16, (el & 0x00ff00) >> 8, (el & 0x0000ff));
                        }).filter(function (el) { return el != "#000000"; });
                        resolve(list);
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    _a = img;
                    return [4 /*yield*/, ReadFileAsBuffer(file)];
                case 2:
                    _a.src = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    ex_1 = _b.sent();
                    reject(ex_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
}

export default PrimaryColor;
//# sourceMappingURL=index.es.js.map
