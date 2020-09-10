/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./node_modules/ts-loader/index.js!./src/raytracer-cpu/compute.worker.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/ts-loader/index.js!./src/raytracer-cpu/compute.worker.ts":
/*!**********************************************************************!*\
  !*** ./node_modules/ts-loader!./src/raytracer-cpu/compute.worker.ts ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst camera_1 = __importDefault(__webpack_require__(/*! ../camera */ \"./src/camera.ts\"));\nconst deserialize_1 = __webpack_require__(/*! ../serializing/deserialize */ \"./src/serializing/deserialize.ts\");\nconst util_1 = __webpack_require__(/*! ../util */ \"./src/util.ts\");\nconst vec3_1 = __importDefault(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst deserializermap_1 = __webpack_require__(/*! ./deserializermap */ \"./src/raytracer-cpu/deserializermap.ts\");\nconst hittablelist_1 = __webpack_require__(/*! ./hittablelist */ \"./src/raytracer-cpu/hittablelist.ts\");\nconst ray_1 = __webpack_require__(/*! ./ray */ \"./src/raytracer-cpu/ray.ts\");\nconst workerinterfaces_1 = __webpack_require__(/*! ./workerinterfaces */ \"./src/raytracer-cpu/workerinterfaces.ts\");\nconst map = deserializermap_1.DeserializerMap;\nconst _controllerCtx = self;\nlet _id;\nconst writeColor = (array, offset, color, ssp) => {\n    let r = color.r;\n    let g = color.g;\n    let b = color.b;\n    // Divide the color total by the number of samples and gamma-correct for gamma=2.0.\n    const scale = 1.0 / ssp;\n    r = Math.sqrt(scale * r);\n    g = Math.sqrt(scale * g);\n    b = Math.sqrt(scale * b);\n    // Write the translated [0,255] value of each color component.\n    array[offset++] = r * 255;\n    array[offset++] = g * 255;\n    array[offset++] = b * 255;\n};\nconst start = (msg) => {\n    _id = msg.data.workerId;\n    const camera = deserialize_1.deserialize(camera_1.default, msg.data.camera);\n    const world = deserialize_1.deserialize(hittablelist_1.HittableList, msg.data.world);\n    const background = deserialize_1.deserialize(vec3_1.default, msg.data.background);\n    const imageWidth = msg.data.imageWidth;\n    const imageHeight = msg.data.imageHeight;\n    const scanlineCount = msg.data.scanlineCount;\n    const startLine = msg.data.startLine;\n    const ssp = msg.data.samplesPerPixel;\n    const maxBounces = msg.data.maxBounces;\n    console.log(`worker[${_id}] startLine: ${startLine}`);\n    console.log(`worker[${_id}] linecount: ${scanlineCount}`);\n    const dataArray = new Uint8ClampedArray(imageWidth * scanlineCount * 3);\n    let offset = 0;\n    const endLine = startLine + 1 - scanlineCount;\n    let linesToCalc = scanlineCount;\n    for (let j = startLine; j >= endLine; j--) {\n        console.log(`worker[${_id}] scanlines remaining ${linesToCalc--}`);\n        for (let i = 0; i < imageWidth; i++) {\n            let pixelColor = new vec3_1.default(0, 0, 0);\n            for (let s = 0; s < ssp; s++) {\n                //pixelColor = randomColor;\n                const u = (i + util_1.randomNumber()) / (imageWidth - 1);\n                const v = (j + util_1.randomNumber()) / (imageHeight - 1);\n                const r = camera.getRay(u, v);\n                pixelColor = vec3_1.default.addVec3(pixelColor, ray_1.rayColor(r, background, world, maxBounces));\n            }\n            writeColor(dataArray, offset, pixelColor, ssp);\n            offset += 3;\n        }\n    }\n    const computeEndMessage = {\n        cmd: workerinterfaces_1.ComputeCommands.END,\n        data: {\n            workerId: _id,\n            pixelArray: dataArray,\n            startLine,\n            scanlineCount,\n        },\n    };\n    _controllerCtx.postMessage(computeEndMessage);\n};\n// Respond to message from parent thread\n_controllerCtx.addEventListener('message', (event) => {\n    const msg = event.data;\n    switch (msg.cmd) {\n        case workerinterfaces_1.ComputeCommands.START:\n            start(msg);\n            break;\n        default:\n            break;\n    }\n});\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/compute.worker.ts?./node_modules/ts-loader");

/***/ }),

/***/ "./src/camera.ts":
/*!***********************!*\
  !*** ./src/camera.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst vec3_1 = __importDefault(__webpack_require__(/*! ./vec3 */ \"./src/vec3.ts\"));\nconst ray_1 = __importDefault(__webpack_require__(/*! ./raytracer-cpu/ray */ \"./src/raytracer-cpu/ray.ts\"));\nconst util_1 = __webpack_require__(/*! ./util */ \"./src/util.ts\");\nconst serializing_1 = __webpack_require__(/*! ./serializing */ \"./src/serializing/index.ts\");\nlet Camera = class Camera {\n    constructor() {\n        //\n    }\n    init(lookFrom, lookAt, vUp, fovY, aspectRatio, aperture, focusDist, t0 = 0, t1 = 0) {\n        const theta = util_1.degreeToRadians(fovY);\n        const h = Math.tan(theta / 2);\n        const viewport_height = 2 * h;\n        const viewport_width = aspectRatio * viewport_height;\n        this.w = vec3_1.default.unitVector(vec3_1.default.subVec3(lookFrom, lookAt));\n        this.u = vec3_1.default.unitVector(vec3_1.default.cross(vUp, this.w));\n        this.v = vec3_1.default.cross(this.w, this.u);\n        this.lookFrom = lookFrom;\n        this.horizontal = vec3_1.default.multScalarVec3(this.u, focusDist * viewport_width);\n        this.vertical = vec3_1.default.multScalarVec3(this.v, focusDist * viewport_height);\n        const half_horizontal = vec3_1.default.divScalarVec(this.horizontal, 2);\n        const half_vertical = vec3_1.default.divScalarVec(this.vertical, 2);\n        const focusW = vec3_1.default.multScalarVec3(this.w, focusDist);\n        this.lowerLeftCorner = vec3_1.default.subVec3(vec3_1.default.subVec3(vec3_1.default.subVec3(this.lookFrom, half_horizontal), half_vertical), focusW);\n        this.lenseRadius = aperture / 2;\n        this.time0 = t0;\n        this.time1 = t1;\n    }\n    getRay(s, t) {\n        const rd = vec3_1.default.multScalarVec3(vec3_1.default.randomInUnitdisk(), this.lenseRadius);\n        const vecU = vec3_1.default.multScalarVec3(this.u, rd.x);\n        const vecV = vec3_1.default.multScalarVec3(this.v, rd.y);\n        const offset = vec3_1.default.addVec3(vecU, vecV);\n        const sHor = vec3_1.default.multScalarVec3(this.horizontal, s);\n        const tVer = vec3_1.default.multScalarVec3(this.vertical, t);\n        return new ray_1.default(vec3_1.default.addVec3(this.lookFrom, offset), vec3_1.default.subVec3(vec3_1.default.subVec3(vec3_1.default.addVec3(vec3_1.default.addVec3(this.lowerLeftCorner, sHor), tVer), this.lookFrom), offset), util_1.randomNumberRange(this.time0, this.time1));\n    }\n    getUniformArray() {\n        const array = [];\n        array.push(...this.lookFrom.array, 0.0); // vec4 because of memory alignment\n        array.push(...this.lowerLeftCorner.array, 0.0);\n        array.push(...this.horizontal.array, 0.0);\n        array.push(...this.vertical.array, 0.0);\n        array.push(...this.u.array, 0.0);\n        array.push(...this.v.array, 0.0);\n        array.push(...this.w.array, 0.0);\n        array.push(this.lenseRadius);\n        return new Float32Array(array);\n    }\n};\nCamera = __decorate([\n    serializing_1.serializable\n], Camera);\nexports.default = Camera;\n\n\n//# sourceURL=webpack:///./src/camera.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/aabb.ts":
/*!***********************************!*\
  !*** ./src/raytracer-cpu/aabb.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nvar AABB_1;\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst vec3_1 = __importDefault(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nlet AABB = AABB_1 = class AABB {\n    constructor(min, max) {\n        this._min = min !== null && min !== void 0 ? min : new vec3_1.default();\n        this._max = max !== null && max !== void 0 ? max : new vec3_1.default();\n    }\n    copyTo(dest) {\n        dest._min = this._min;\n        dest._max = this._max;\n    }\n    get min() {\n        return this._min;\n    }\n    get max() {\n        return this._max;\n    }\n    /*\n    public hit(r: Ray, tmin: number, tmax: number): boolean {\n      for (let a = 0; a < 3; a++) {\n        const rOriginA = r.origin.array[a];\n        const rDirectionA = r.direction.array[a];\n        const t0 = Math.min((this._min.array[a] - rOriginA) / rDirectionA, (this._max.array[a] - rOriginA) / rDirectionA);\n        const t1 = Math.max((this._min.array[a] - rOriginA) / rDirectionA, (this._max.array[a] - rOriginA) / rDirectionA);\n  \n        tmin = Math.max(t0, tmin);\n        tmax = Math.min(t1, tmax);\n  \n        if (tmax <= tmin) {\n          return false;\n        }\n      }\n  \n      return true;\n    }*/\n    hit(r, tmin, tmax) {\n        for (let a = 0; a < 3; a++) {\n            const invD = 1.0 / r.direction.array[a];\n            let t0 = (this._min.array[a] - r.origin.array[a]) * invD;\n            let t1 = (this._max.array[a] - r.origin.array[a]) * invD;\n            if (invD < 0.0) {\n                const tmp = t0;\n                t0 = t1;\n                t1 = tmp;\n            }\n            tmin = t0 > tmin ? t0 : tmin;\n            tmax = t1 < tmax ? t1 : tmax;\n            if (tmax <= tmin) {\n                return false;\n            }\n        }\n        return true;\n    }\n    static surroundingBox(box0, box1) {\n        const small = new vec3_1.default(Math.min(box0.min.x, box1.min.x), Math.min(box0.min.y, box1.min.y), Math.min(box0.min.z, box1.min.z));\n        const big = new vec3_1.default(Math.max(box0.max.x, box1.max.x), Math.max(box0.max.y, box1.max.y), Math.max(box0.max.z, box1.max.z));\n        return new AABB_1(small, big);\n    }\n};\nAABB = AABB_1 = __decorate([\n    serializing_1.serializable\n], AABB);\nexports.default = AABB;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/aabb.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/aarect.ts":
/*!*************************************!*\
  !*** ./src/raytracer-cpu/aarect.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.YZRect = exports.XZRect = exports.XYRect = void 0;\nconst aabb_1 = __importDefault(__webpack_require__(/*! ./aabb */ \"./src/raytracer-cpu/aabb.ts\"));\nconst hittable_1 = __webpack_require__(/*! ./hittable */ \"./src/raytracer-cpu/hittable.ts\");\nconst vec3_1 = __importDefault(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nlet XYRect = class XYRect extends hittable_1.Hittable {\n    constructor(x0, x1, y0, y1, k, material) {\n        super();\n        this._x0 = x0;\n        this._x1 = x1;\n        this._y0 = y0;\n        this._y1 = y1;\n        this._k = k;\n        this._material = material;\n    }\n    hit(r, t_min, t_max, rec) {\n        const t = (this._k - r.origin.z) / r.direction.z;\n        if (t < t_min || t > t_max) {\n            return false;\n        }\n        const x = r.origin.x + t * r.direction.x;\n        const y = r.origin.y + t * r.direction.y;\n        if (x < this._x0 || x > this._x1 || y < this._y0 || y > this._y1) {\n            return false;\n        }\n        rec.u = (x - this._x0) / (this._x1 - this._x0);\n        rec.v = (y - this._y0) / (this._y1 - this._y0);\n        rec.t = t;\n        const outwardNormal = new vec3_1.default(0, 0, 1);\n        rec.setFaceNormal(r, outwardNormal);\n        rec.mat = this._material;\n        rec.p = r.at(t);\n        return true;\n    }\n    boundingBox(outputBox) {\n        // The bounding box must have non-zero width in each dimension, so pad the Z\n        // dimension a small amount.\n        const newOutputBox = new aabb_1.default(new vec3_1.default(this._x0, this._y0, this._k - 0.0001), new vec3_1.default(this._x1, this._y1, this._k + 0.0001));\n        newOutputBox.copyTo(outputBox);\n        return true;\n    }\n};\nXYRect = __decorate([\n    serializing_1.serializable\n], XYRect);\nexports.XYRect = XYRect;\nlet XZRect = class XZRect extends hittable_1.Hittable {\n    constructor(x0, x1, z0, z1, k, material) {\n        super();\n        this._x0 = x0;\n        this._x1 = x1;\n        this._z0 = z0;\n        this._z1 = z1;\n        this._k = k;\n        this._material = material;\n    }\n    hit(r, t_min, t_max, rec) {\n        const t = (this._k - r.origin.y) / r.direction.y;\n        if (t < t_min || t > t_max) {\n            return false;\n        }\n        const x = r.origin.x + t * r.direction.x;\n        const z = r.origin.z + t * r.direction.z;\n        if (x < this._x0 || x > this._x1 || z < this._z0 || z > this._z1) {\n            return false;\n        }\n        rec.u = (x - this._x0) / (this._x1 - this._x0);\n        rec.v = (z - this._z0) / (this._z1 - this._z0);\n        rec.t = t;\n        const outwardNormal = new vec3_1.default(0, 1, 0);\n        rec.setFaceNormal(r, outwardNormal);\n        rec.mat = this._material;\n        rec.p = r.at(t);\n        return true;\n    }\n    boundingBox(outputBox) {\n        // The bounding box must have non-zero width in each dimension, so pad the Z\n        // dimension a small amount.\n        const newOutputBox = new aabb_1.default(new vec3_1.default(this._x0, this._k - 0.0001, this._z0), new vec3_1.default(this._x1, this._k + 0.0001, this._z1));\n        newOutputBox.copyTo(outputBox);\n        return true;\n    }\n};\nXZRect = __decorate([\n    serializing_1.serializable\n], XZRect);\nexports.XZRect = XZRect;\nlet YZRect = class YZRect extends hittable_1.Hittable {\n    constructor(y0, y1, z0, z1, k, material) {\n        super();\n        this._y0 = y0;\n        this._y1 = y1;\n        this._z0 = z0;\n        this._z1 = z1;\n        this._k = k;\n        this._material = material;\n    }\n    hit(r, t_min, t_max, rec) {\n        const t = (this._k - r.origin.x) / r.direction.x;\n        if (t < t_min || t > t_max) {\n            return false;\n        }\n        const y = r.origin.y + t * r.direction.y;\n        const z = r.origin.z + t * r.direction.z;\n        if (y < this._y0 || y > this._y1 || z < this._z0 || z > this._z1) {\n            return false;\n        }\n        rec.u = (y - this._y0) / (this._y1 - this._y0);\n        rec.v = (z - this._z0) / (this._z1 - this._z0);\n        rec.t = t;\n        const outwardNormal = new vec3_1.default(1, 0, 0);\n        rec.setFaceNormal(r, outwardNormal);\n        rec.mat = this._material;\n        rec.p = r.at(t);\n        return true;\n    }\n    boundingBox(outputBox) {\n        // The bounding box must have non-zero width in each dimension, so pad the Z\n        // dimension a small amount.\n        const newOutputBox = new aabb_1.default(new vec3_1.default(this._k - 0.0001, this._y0, this._z0), new vec3_1.default(this._k + 0.0001, this._y1, this._z1));\n        newOutputBox.copyTo(outputBox);\n        return true;\n    }\n};\nYZRect = __decorate([\n    serializing_1.serializable\n], YZRect);\nexports.YZRect = YZRect;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/aarect.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/bvhnode.ts":
/*!**************************************!*\
  !*** ./src/raytracer-cpu/bvhnode.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nvar BVHNode_1;\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst hittable_1 = __webpack_require__(/*! ./hittable */ \"./src/raytracer-cpu/hittable.ts\");\nconst aabb_1 = __importDefault(__webpack_require__(/*! ./aabb */ \"./src/raytracer-cpu/aabb.ts\"));\nconst util_1 = __webpack_require__(/*! ../util */ \"./src/util.ts\");\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\n//let _id = 0;\nlet BVHNode = BVHNode_1 = class BVHNode extends hittable_1.Hittable {\n    //private id = _id;\n    constructor() {\n        super();\n        this.box = new aabb_1.default();\n        //console.log(`BVH-Node ${this.id}`);\n        //_id++;\n    }\n    static createFromHitableList(list) {\n        const node = new BVHNode_1();\n        node.init(list.objects, 0, list.objects.length);\n        return node;\n    }\n    static createFromObjects(objects, start, end) {\n        const node = new BVHNode_1();\n        node.init(objects, start, end);\n        return node;\n    }\n    init(objects, start, end) {\n        const axis = util_1.randomInt(0, 2);\n        const comparator = axis === 0 ? boxXCompare : axis === 1 ? boxYCompare : boxZCompare;\n        const objectSpan = end - start;\n        if (objectSpan === 1) {\n            this.left = this.right = objects[start];\n        }\n        else if (objectSpan === 2) {\n            if (comparator(objects[start], objects[start + 1]) === -1) {\n                this.left = objects[start];\n                this.right = objects[start + 1];\n            }\n            else {\n                this.left = objects[start + 1];\n                this.right = objects[start];\n            }\n        }\n        else {\n            util_1.sortArrayRange(objects, start, end, comparator);\n            const mid = start + Math.floor(objectSpan / 2);\n            this.left = BVHNode_1.createFromObjects(objects, start, mid);\n            this.right = BVHNode_1.createFromObjects(objects, mid, end);\n        }\n        const boxLeft = new aabb_1.default();\n        const boxRight = new aabb_1.default();\n        if (!this.left.boundingBox(boxLeft) || !this.right.boundingBox(boxRight)) {\n            console.error('No bounding box in bvh_node constructor.');\n        }\n        this.box = aabb_1.default.surroundingBox(boxLeft, boxRight);\n    }\n    // public hit(r: Ray, tMin: number, tMax: number, rec: HitRecord): boolean {\n    //   //console.time(`BVH-hit #${this.id}`);\n    //   if (!this.box.hit(r, tMin, tMax)) {\n    //     return false;\n    //     //console.timeEnd(`BVH-hit #${this.id}`);\n    //   }\n    //   const hitLeft = this.left.hit(r, tMin, tMax, rec);\n    //   const hitRight = this.right.hit(r, tMin, hitLeft ? rec.t : tMax, rec);\n    //   //console.timeEnd(`BVH-hit #${this.id}`);\n    //   return hitLeft || hitRight;\n    // }\n    hit(r, tMin, tMax, rec) {\n        if (this.box.hit(r, tMin, tMax)) {\n            if (this.left.hit(r, tMin, tMax, rec)) {\n                this.right.hit(r, tMin, rec.t, rec);\n                return true;\n            }\n            else {\n                return this.right.hit(r, tMin, tMax, rec);\n            }\n        }\n        return false;\n    }\n    boundingBox(outputBox) {\n        this.box.copyTo(outputBox);\n        return true;\n    }\n};\nBVHNode = BVHNode_1 = __decorate([\n    serializing_1.serializable\n], BVHNode);\nexports.default = BVHNode;\nfunction boxCompare(a, b, axis) {\n    const boxA = new aabb_1.default();\n    const boxB = new aabb_1.default();\n    if (!a.boundingBox(boxA) || !b.boundingBox(boxB)) {\n        console.error('No bounding box in bvh_node constructor.');\n    }\n    return boxA.min.array[axis] < boxB.min.array[axis] ? -1 : 1;\n}\nfunction boxXCompare(a, b) {\n    return boxCompare(a, b, 0);\n}\nfunction boxYCompare(a, b) {\n    return boxCompare(a, b, 1);\n}\nfunction boxZCompare(a, b) {\n    return boxCompare(a, b, 2);\n}\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/bvhnode.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/deserializermap.ts":
/*!**********************************************!*\
  !*** ./src/raytracer-cpu/deserializermap.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.DeserializerMap = void 0;\nconst aabb_1 = __importDefault(__webpack_require__(/*! ./aabb */ \"./src/raytracer-cpu/aabb.ts\"));\nconst aarect_1 = __webpack_require__(/*! ./aarect */ \"./src/raytracer-cpu/aarect.ts\");\nconst bvhnode_1 = __importDefault(__webpack_require__(/*! ./bvhnode */ \"./src/raytracer-cpu/bvhnode.ts\"));\nconst dielectric_1 = __importDefault(__webpack_require__(/*! ./dielectric */ \"./src/raytracer-cpu/dielectric.ts\"));\nconst diffuselight_1 = __importDefault(__webpack_require__(/*! ./diffuselight */ \"./src/raytracer-cpu/diffuselight.ts\"));\nconst lambertian_1 = __importDefault(__webpack_require__(/*! ./lambertian */ \"./src/raytracer-cpu/lambertian.ts\"));\nconst metal_1 = __importDefault(__webpack_require__(/*! ./metal */ \"./src/raytracer-cpu/metal.ts\"));\nconst movingsphere_1 = __importDefault(__webpack_require__(/*! ./movingsphere */ \"./src/raytracer-cpu/movingsphere.ts\"));\nconst perlin_1 = __importDefault(__webpack_require__(/*! ./perlin */ \"./src/raytracer-cpu/perlin.ts\"));\nconst sphere_1 = __importDefault(__webpack_require__(/*! ./sphere */ \"./src/raytracer-cpu/sphere.ts\"));\nconst texture_1 = __webpack_require__(/*! ./texture */ \"./src/raytracer-cpu/texture.ts\");\n// eslint-disable-next-line @typescript-eslint/no-unused-vars\nexports.DeserializerMap = {\n    lambertianMaterial: lambertian_1.default,\n    metalMaterial: metal_1.default,\n    dielectricMaterial: dielectric_1.default,\n    sphere: sphere_1.default,\n    movingSphere: movingsphere_1.default,\n    bvhNode: bvhnode_1.default,\n    aabb: aabb_1.default,\n    checkerTexture: texture_1.CheckerTexture,\n    solidTexture: texture_1.SolidColor,\n    perlin: perlin_1.default,\n    noise: texture_1.NoiseTexture,\n    image: texture_1.ImageTexture,\n    diffuseLight: diffuselight_1.default,\n    xyRect: aarect_1.XYRect,\n    xzRect: aarect_1.XZRect,\n    yzRect: aarect_1.YZRect,\n};\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/deserializermap.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/dielectric.ts":
/*!*****************************************!*\
  !*** ./src/raytracer-cpu/dielectric.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst material_1 = __importDefault(__webpack_require__(/*! ./material */ \"./src/raytracer-cpu/material.ts\"));\nconst ray_1 = __importDefault(__webpack_require__(/*! ./ray */ \"./src/raytracer-cpu/ray.ts\"));\nconst util_1 = __webpack_require__(/*! ../util */ \"./src/util.ts\");\nconst vec3_1 = __importDefault(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nlet DielectricMaterial = class DielectricMaterial extends material_1.default {\n    constructor(refIdx) {\n        super();\n        this._refIdx = refIdx;\n    }\n    schlick(cosine, refIdx) {\n        let r0 = (1 - refIdx) / (1 + refIdx);\n        r0 = r0 * r0;\n        return r0 + (1 - r0) * Math.pow(1 - cosine, 5);\n    }\n    scatter(r_in, rec, attenuation, scattered) {\n        attenuation.set(1.0, 1.0, 1.0);\n        const etai_over_etat = rec.front_face ? 1 / this._refIdx : this._refIdx;\n        const unit_direction = vec3_1.default.unitVector(r_in.direction);\n        const cos_theta = Math.min(vec3_1.default.dot(unit_direction.negate(), rec.normal), 1);\n        const sin_theta = Math.sqrt(1 - cos_theta * cos_theta);\n        if (etai_over_etat * sin_theta > 1) {\n            const reflected = vec3_1.default.reflect(unit_direction, rec.normal);\n            new ray_1.default(rec.p, reflected, r_in.time).copyTo(scattered);\n            return true;\n        }\n        const reflect_prob = this.schlick(cos_theta, etai_over_etat);\n        if (util_1.randomNumber() < reflect_prob) {\n            const reflected = vec3_1.default.reflect(unit_direction, rec.normal);\n            new ray_1.default(rec.p, reflected, r_in.time).copyTo(scattered);\n            return true;\n        }\n        const refracted = vec3_1.default.refract(unit_direction, rec.normal, etai_over_etat);\n        new ray_1.default(rec.p, refracted, r_in.time).copyTo(scattered);\n        return true;\n    }\n};\nDielectricMaterial = __decorate([\n    serializing_1.serializable\n], DielectricMaterial);\nexports.default = DielectricMaterial;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/dielectric.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/diffuselight.ts":
/*!*******************************************!*\
  !*** ./src/raytracer-cpu/diffuselight.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nconst material_1 = __importDefault(__webpack_require__(/*! ./material */ \"./src/raytracer-cpu/material.ts\"));\nconst texture_1 = __webpack_require__(/*! ./texture */ \"./src/raytracer-cpu/texture.ts\");\nlet DiffuseLight = class DiffuseLight extends material_1.default {\n    constructor(color) {\n        super();\n        if (color) {\n            this._emit = new texture_1.SolidColor(color);\n        }\n    }\n    scatter(_r_in, _rec, _attenuation, _scattered) {\n        return false;\n    }\n    emitted(u, v, p) {\n        return this._emit.value(u, v, p);\n    }\n};\nDiffuseLight = __decorate([\n    serializing_1.serializable\n], DiffuseLight);\nexports.default = DiffuseLight;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/diffuselight.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/hittable.ts":
/*!***************************************!*\
  !*** ./src/raytracer-cpu/hittable.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.Hittable = exports.HitRecord = void 0;\nconst vec3_1 = __importDefault(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nclass HitRecord {\n    constructor() {\n        this.p = new vec3_1.default();\n        this.normal = new vec3_1.default();\n        this.t = 0;\n        this.u = 0;\n        this.v = 0;\n        this.front_face = true;\n    }\n    setFaceNormal(r, outward_normal) {\n        this.front_face = vec3_1.default.dot(r.direction, outward_normal) < 0;\n        this.normal = this.front_face ? outward_normal : outward_normal.negate();\n    }\n    copyTo(dest) {\n        dest.p = this.p;\n        dest.normal = this.normal;\n        dest.t = this.t;\n        dest.u = this.u;\n        dest.v = this.v;\n        dest.front_face = this.front_face;\n        dest.mat = this.mat;\n    }\n}\nexports.HitRecord = HitRecord;\nclass Hittable {\n}\nexports.Hittable = Hittable;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/hittable.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/hittablelist.ts":
/*!*******************************************!*\
  !*** ./src/raytracer-cpu/hittablelist.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.HittableList = void 0;\nconst hittable_1 = __webpack_require__(/*! ./hittable */ \"./src/raytracer-cpu/hittable.ts\");\nconst aabb_1 = __importDefault(__webpack_require__(/*! ./aabb */ \"./src/raytracer-cpu/aabb.ts\"));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nlet HittableList = class HittableList extends hittable_1.Hittable {\n    constructor(object) {\n        super();\n        this._objects = [];\n        if (object) {\n            this.add(object);\n        }\n    }\n    get objects() {\n        return this._objects;\n    }\n    clear() {\n        this._objects.length = 0;\n    }\n    add(object) {\n        this._objects.push(object);\n    }\n    hit(r, t_min, t_max, rec) {\n        const temp_rec = new hittable_1.HitRecord();\n        let hit_anything = false;\n        let closest_so_far = t_max;\n        for (const object of this._objects) {\n            if (object.hit(r, t_min, closest_so_far, temp_rec)) {\n                hit_anything = true;\n                closest_so_far = temp_rec.t;\n                temp_rec.copyTo(rec);\n            }\n        }\n        return hit_anything;\n    }\n    boundingBox(outputBox) {\n        if (this._objects.length === 0) {\n            return false;\n        }\n        const tempBox = new aabb_1.default();\n        let firstBox = true;\n        for (const object of this._objects) {\n            if (!object.boundingBox(tempBox)) {\n                return false;\n            }\n            if (firstBox) {\n                tempBox.copyTo(outputBox);\n            }\n            else {\n                aabb_1.default.surroundingBox(outputBox, tempBox).copyTo(outputBox);\n            }\n            firstBox = false;\n        }\n        return true;\n    }\n};\nHittableList = __decorate([\n    serializing_1.serializable\n], HittableList);\nexports.HittableList = HittableList;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/hittablelist.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/lambertian.ts":
/*!*****************************************!*\
  !*** ./src/raytracer-cpu/lambertian.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst material_1 = __importDefault(__webpack_require__(/*! ./material */ \"./src/raytracer-cpu/material.ts\"));\nconst ray_1 = __importDefault(__webpack_require__(/*! ./ray */ \"./src/raytracer-cpu/ray.ts\"));\nconst vec3_1 = __importDefault(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nconst texture_1 = __webpack_require__(/*! ./texture */ \"./src/raytracer-cpu/texture.ts\");\nlet LambertianMaterial = class LambertianMaterial extends material_1.default {\n    constructor(color) {\n        super();\n        if (color) {\n            this.albedo = new texture_1.SolidColor(color);\n        }\n    }\n    set texture(texture) {\n        this.albedo = texture;\n    }\n    scatter(r_in, rec, attenuation, scattered) {\n        const scatter_direction = vec3_1.default.addVec3(rec.normal, vec3_1.default.randomUnitVector());\n        new ray_1.default(rec.p, scatter_direction, r_in.time).copyTo(scattered);\n        const col = this.albedo.value(rec.u, rec.v, rec.p);\n        col.copyTo(attenuation);\n        return true;\n    }\n};\nLambertianMaterial = __decorate([\n    serializing_1.serializable\n], LambertianMaterial);\nexports.default = LambertianMaterial;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/lambertian.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/material.ts":
/*!***************************************!*\
  !*** ./src/raytracer-cpu/material.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst vec3_1 = __importDefault(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nclass Material {\n    emitted(_u, _v, _p) {\n        return new vec3_1.default(0, 0, 0);\n    }\n}\nexports.default = Material;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/material.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/metal.ts":
/*!************************************!*\
  !*** ./src/raytracer-cpu/metal.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst material_1 = __importDefault(__webpack_require__(/*! ./material */ \"./src/raytracer-cpu/material.ts\"));\nconst ray_1 = __importDefault(__webpack_require__(/*! ./ray */ \"./src/raytracer-cpu/ray.ts\"));\nconst vec3_1 = __importDefault(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nlet MetalMaterial = class MetalMaterial extends material_1.default {\n    constructor(color, roughness) {\n        super();\n        this.albedo = color;\n        this.roughness = roughness;\n    }\n    scatter(r_in, rec, attenuation, scattered) {\n        const reflect = vec3_1.default.reflect(vec3_1.default.unitVector(r_in.direction), rec.normal);\n        new ray_1.default(rec.p, vec3_1.default.addVec3(reflect, vec3_1.default.multScalarVec3(vec3_1.default.randomInUnitSphere(), this.roughness)), r_in.time).copyTo(scattered);\n        this.albedo.copyTo(attenuation);\n        return vec3_1.default.dot(scattered.direction, rec.normal) > 0;\n    }\n};\nMetalMaterial = __decorate([\n    serializing_1.serializable\n], MetalMaterial);\nexports.default = MetalMaterial;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/metal.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/movingsphere.ts":
/*!*******************************************!*\
  !*** ./src/raytracer-cpu/movingsphere.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nconst vec3_1 = __importDefault(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst hittable_1 = __webpack_require__(/*! ./hittable */ \"./src/raytracer-cpu/hittable.ts\");\nlet MovingSphere = class MovingSphere extends hittable_1.Hittable {\n    constructor(center0, center1, t0, t1, radius, mat) {\n        super();\n        this.center0 = center0;\n        this.center1 = center1;\n        this.time0 = t0;\n        this.time1 = t1;\n        this.radius = radius;\n        this.mat = mat;\n    }\n    hit(r, t_min, t_max, rec) {\n        const oc = vec3_1.default.subVec3(r.origin, this.center(r.time));\n        const a = r.direction.lengthSquared();\n        const half_b = vec3_1.default.dot(oc, r.direction);\n        const c = oc.lengthSquared() - this.radius * this.radius;\n        const discriminat = half_b * half_b - a * c;\n        if (discriminat > 0) {\n            const root = Math.sqrt(discriminat);\n            let temp = (-half_b - root) / a;\n            if (temp < t_max && temp > t_min) {\n                rec.t = temp;\n                rec.p = r.at(rec.t);\n                const outward_normal = vec3_1.default.divScalarVec(vec3_1.default.subVec3(rec.p, this.center(r.time)), this.radius);\n                rec.setFaceNormal(r, outward_normal);\n                rec.mat = this.mat;\n                return true;\n            }\n            temp = (-half_b + root) / a;\n            if (temp < t_max && temp > t_min) {\n                rec.t = temp;\n                rec.p = r.at(rec.t);\n                const outward_normal = vec3_1.default.divScalarVec(vec3_1.default.subVec3(rec.p, this.center(r.time)), this.radius);\n                rec.setFaceNormal(r, outward_normal);\n                rec.mat = this.mat;\n                return true;\n            }\n        }\n        return false;\n    }\n    center(time) {\n        const timeDiff = (time - this.time0) / (this.time1 - this.time0);\n        const centerDiff = vec3_1.default.subVec3(this.center1, this.center0);\n        return vec3_1.default.addVec3(this.center0, vec3_1.default.multScalarVec3(centerDiff, timeDiff));\n    }\n    boundingBox(outputBox) {\n        // TODO!\n        /*\n        const newOutputBox = new AABB(\n          Vec3.subVec3(this.center, new Vec3(this.radius, this.radius, this.radius)),\n          Vec3.addVec3(this.center, new Vec3(this.radius, this.radius, this.radius))\n        );\n        newOutputBox.copyTo(outputBox);\n        */\n        return true;\n    }\n};\nMovingSphere = __decorate([\n    serializing_1.serializable\n], MovingSphere);\nexports.default = MovingSphere;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/movingsphere.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/perlin.ts":
/*!*************************************!*\
  !*** ./src/raytracer-cpu/perlin.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nvar Perlin_1;\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nconst util_1 = __webpack_require__(/*! ../util */ \"./src/util.ts\");\nconst vec3_1 = __importDefault(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nlet Perlin = Perlin_1 = class Perlin {\n    constructor() {\n        this._ranVecs = new Array(Perlin_1._pointCount);\n        for (let i = 0; i < Perlin_1._pointCount; i++) {\n            this._ranVecs[i] = vec3_1.default.unitVector(vec3_1.default.randomRange(-1, 1));\n        }\n        this._permX = Perlin_1.perlinGeneratePerm();\n        this._permY = Perlin_1.perlinGeneratePerm();\n        this._permZ = Perlin_1.perlinGeneratePerm();\n    }\n    noise(p) {\n        let u = p.x - Math.floor(p.x);\n        let v = p.y - Math.floor(p.y);\n        let w = p.z - Math.floor(p.z);\n        // const i = Math.trunc(4 * p.x) & 255;\n        // const j = Math.trunc(4 * p.y) & 255;\n        // const k = Math.trunc(4 * p.z) & 255;\n        u = u * u * (3 - 2 * u);\n        v = v * v * (3 - 2 * v);\n        w = w * w * (3 - 2 * w);\n        const i = Math.floor(p.x);\n        const j = Math.floor(p.y);\n        const k = Math.floor(p.z);\n        const c = [\n            [[], []],\n            [[], []],\n        ];\n        for (let di = 0; di < 2; di++)\n            for (let dj = 0; dj < 2; dj++)\n                for (let dk = 0; dk < 2; dk++)\n                    c[di][dj][dk] = this._ranVecs[this._permX[(i + di) & 255] ^ this._permY[(j + dj) & 255] ^ this._permZ[(k + dk) & 255]];\n        // const noise = this._ranFloat[this._permX[i] ^ this._permY[j] ^ this._permZ[k]];\n        const noise = trilinearInterp(c, u, v, w);\n        return noise;\n    }\n    turb(p, depth = 7) {\n        let accum = 0.0;\n        let temp_p = p;\n        let weight = 1.0;\n        for (let i = 0; i < depth; i++) {\n            accum += weight * this.noise(temp_p);\n            weight *= 0.5;\n            temp_p = vec3_1.default.multScalarVec3(temp_p, 2);\n        }\n        return Math.abs(accum);\n    }\n    static perlinGeneratePerm() {\n        const array = new Array(Perlin_1._pointCount);\n        for (let i = 0; i < Perlin_1._pointCount; i++) {\n            array[i] = i;\n        }\n        Perlin_1.permute(array, Perlin_1._pointCount);\n        return array;\n    }\n    static permute(array, n) {\n        for (let i = n - 1; i > 0; i--) {\n            const target = util_1.randomInt(0, i);\n            const tmp = array[i];\n            array[i] = array[target];\n            array[target] = tmp;\n        }\n    }\n};\nPerlin._pointCount = 256;\nPerlin = Perlin_1 = __decorate([\n    serializing_1.serializable\n], Perlin);\nexports.default = Perlin;\nfunction trilinearInterp(c, u, v, w) {\n    const uu = u * u * (3 - 2 * u);\n    const vv = v * v * (3 - 2 * v);\n    const ww = w * w * (3 - 2 * w);\n    let accum = 0.0;\n    for (let i = 0; i < 2; i++) {\n        for (let j = 0; j < 2; j++) {\n            for (let k = 0; k < 2; k++) {\n                const weight = new vec3_1.default(u - i, v - j, w - k);\n                // prettier-ignore\n                accum += (i * uu + (1 - i) * (1 - uu))\n                    * (j * vv + (1 - j) * (1 - vv))\n                    * (k * ww + (1 - k) * (1 - ww))\n                    * vec3_1.default.dot(c[i][j][k], weight);\n            }\n        }\n    }\n    return accum;\n}\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/perlin.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/ray.ts":
/*!**********************************!*\
  !*** ./src/raytracer-cpu/ray.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.rayColor = void 0;\nconst vec3_1 = __importDefault(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst hittable_1 = __webpack_require__(/*! ./hittable */ \"./src/raytracer-cpu/hittable.ts\");\nclass Ray {\n    constructor(origin, direction, time = 0.0) {\n        if (origin) {\n            this._orig = origin;\n        }\n        if (direction) {\n            this._dir = direction;\n        }\n        this._time = time;\n    }\n    copyTo(dest) {\n        dest._orig = this._orig;\n        dest._dir = this._dir;\n        dest._time = this._time;\n    }\n    get origin() {\n        return this._orig;\n    }\n    set origin(origin) {\n        this._orig = origin;\n    }\n    get direction() {\n        return this._dir;\n    }\n    set direction(direction) {\n        this._dir = direction;\n    }\n    get time() {\n        return this._time;\n    }\n    at(t) {\n        return vec3_1.default.addVec3(this._orig, vec3_1.default.multScalarVec3(this._dir, t));\n    }\n}\nexports.default = Ray;\nfunction rayColor(r, background, world, depth) {\n    const rec = new hittable_1.HitRecord();\n    // If we've exceeded the ray bounce limit, no more light is gathered.\n    if (depth <= 0) {\n        return new vec3_1.default(0, 0, 0);\n    }\n    // If the ray hits nothing, return the background color.\n    if (!world.hit(r, 0.001, Number.POSITIVE_INFINITY, rec)) {\n        return background;\n    }\n    const scattered = new Ray();\n    const attenuation = new vec3_1.default();\n    const emitted = rec.mat.emitted(rec.u, rec.v, rec.p);\n    if (!rec.mat.scatter(r, rec, attenuation, scattered)) {\n        return emitted;\n    }\n    return vec3_1.default.addVec3(emitted, vec3_1.default.multVec3(attenuation, rayColor(scattered, background, world, depth - 1)));\n    /*\n    const unit_direction = Vec3.unitVector(r.direction);\n    const t = 0.5 * (unit_direction.y + 1);\n    const color1 = Vec3.multScalarVec3(new Vec3(1, 1, 1), 1 - t);\n    const color2 = Vec3.multScalarVec3(new Vec3(0.5, 0.7, 1.0), t);\n  \n    return Vec3.addVec3(color1, color2);\n    */\n}\nexports.rayColor = rayColor;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/ray.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/sphere.ts":
/*!*************************************!*\
  !*** ./src/raytracer-cpu/sphere.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst hittable_1 = __webpack_require__(/*! ./hittable */ \"./src/raytracer-cpu/hittable.ts\");\nconst vec3_1 = __importDefault(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst aabb_1 = __importDefault(__webpack_require__(/*! ./aabb */ \"./src/raytracer-cpu/aabb.ts\"));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nfunction getSphereUV(p) {\n    const phi = Math.atan2(p.z, p.x);\n    const theta = Math.asin(p.y);\n    const u = 1 - (phi + Math.PI) / (2 * Math.PI);\n    const v = (theta + Math.PI / 2) / Math.PI;\n    return { u, v };\n}\nlet Sphere = class Sphere extends hittable_1.Hittable {\n    constructor(center, radius, mat) {\n        super();\n        this.center = center;\n        this.radius = radius;\n        this.mat = mat;\n    }\n    hit(r, t_min, t_max, rec) {\n        const oc = vec3_1.default.subVec3(r.origin, this.center);\n        const a = r.direction.lengthSquared();\n        const half_b = vec3_1.default.dot(oc, r.direction);\n        const c = oc.lengthSquared() - this.radius * this.radius;\n        const discriminat = half_b * half_b - a * c;\n        if (discriminat > 0) {\n            const root = Math.sqrt(discriminat);\n            let temp = (-half_b - root) / a;\n            if (temp < t_max && temp > t_min) {\n                rec.t = temp;\n                rec.p = r.at(rec.t);\n                const outward_normal = vec3_1.default.divScalarVec(vec3_1.default.subVec3(rec.p, this.center), this.radius);\n                rec.setFaceNormal(r, outward_normal);\n                const uv = getSphereUV(vec3_1.default.divScalarVec(vec3_1.default.subVec3(rec.p, this.center), this.radius));\n                rec.u = uv.u;\n                rec.v = uv.v;\n                rec.mat = this.mat;\n                return true;\n            }\n            temp = (-half_b + root) / a;\n            if (temp < t_max && temp > t_min) {\n                rec.t = temp;\n                rec.p = r.at(rec.t);\n                const outward_normal = vec3_1.default.divScalarVec(vec3_1.default.subVec3(rec.p, this.center), this.radius);\n                rec.setFaceNormal(r, outward_normal);\n                const uv = getSphereUV(vec3_1.default.divScalarVec(vec3_1.default.subVec3(rec.p, this.center), this.radius));\n                rec.u = uv.u;\n                rec.v = uv.v;\n                rec.mat = this.mat;\n                return true;\n            }\n        }\n        return false;\n    }\n    boundingBox(outputBox) {\n        const newOutputBox = new aabb_1.default(vec3_1.default.subVec3(this.center, new vec3_1.default(this.radius, this.radius, this.radius)), vec3_1.default.addVec3(this.center, new vec3_1.default(this.radius, this.radius, this.radius)));\n        newOutputBox.copyTo(outputBox);\n        return true;\n    }\n};\nSphere = __decorate([\n    serializing_1.serializable\n], Sphere);\nexports.default = Sphere;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/sphere.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/texture.ts":
/*!**************************************!*\
  !*** ./src/raytracer-cpu/texture.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nvar ImageTexture_1;\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.ImageTexture = exports.NoiseTexture = exports.CheckerTexture = exports.SolidColor = exports.Texture = void 0;\nconst vec3_1 = __importDefault(__webpack_require__(/*! ../vec3 */ \"./src/vec3.ts\"));\nconst serializing_1 = __webpack_require__(/*! ../serializing */ \"./src/serializing/index.ts\");\nconst perlin_1 = __importDefault(__webpack_require__(/*! ./perlin */ \"./src/raytracer-cpu/perlin.ts\"));\nconst util_1 = __webpack_require__(/*! ../util */ \"./src/util.ts\");\nclass Texture {\n}\nexports.Texture = Texture;\nlet SolidColor = class SolidColor extends Texture {\n    constructor(color) {\n        super();\n        this._color = color;\n    }\n    value(_u, _v, _p) {\n        return this._color;\n    }\n};\nSolidColor = __decorate([\n    serializing_1.serializable\n], SolidColor);\nexports.SolidColor = SolidColor;\nlet CheckerTexture = class CheckerTexture extends Texture {\n    constructor(odd, even) {\n        super();\n        this._odd = new SolidColor(odd);\n        this._even = new SolidColor(even);\n    }\n    value(u, v, p) {\n        const sines = Math.sin(10 * p.x) * Math.sin(10 * p.y) * Math.sin(10 * p.z);\n        if (sines < 0) {\n            return this._odd.value(u, v, p);\n        }\n        else {\n            return this._even.value(u, v, p);\n        }\n    }\n};\nCheckerTexture = __decorate([\n    serializing_1.serializable\n], CheckerTexture);\nexports.CheckerTexture = CheckerTexture;\nlet NoiseTexture = class NoiseTexture extends Texture {\n    constructor(scale) {\n        super();\n        this._noise = new perlin_1.default();\n        this._scale = scale;\n    }\n    value(u, v, p) {\n        // return Vec3.multScalarVec3(\n        //   Vec3.multScalarVec3(new Vec3(1, 1, 1), 0.5),\n        //   1.0 + this._noise.noise(Vec3.multScalarVec3(p, this._scale))\n        // );\n        //return Vec3.multScalarVec3(new Vec3(1, 1, 1), this._noise.turb(Vec3.multScalarVec3(p, this._scale)));\n        return vec3_1.default.multScalarVec3(vec3_1.default.multScalarVec3(new vec3_1.default(1, 1, 1), 0.5), 1.0 + Math.sin(this._scale * p.z + 10 * this._noise.turb(p)));\n    }\n};\nNoiseTexture = __decorate([\n    serializing_1.serializable\n], NoiseTexture);\nexports.NoiseTexture = NoiseTexture;\nlet ImageTexture = ImageTexture_1 = class ImageTexture extends Texture {\n    constructor() {\n        super();\n        this._width = 0;\n        this._height = 0;\n        this._bytesPerScanLine = 0;\n    }\n    async load(imageUrl) {\n        const response = await fetch(imageUrl);\n        const blob = await response.blob();\n        const imgBitmap = await createImageBitmap(blob);\n        // Firefox do not support 2D context on OffscreenCanvas :-(\n        //const canvas = new OffscreenCanvas(imgBitmap.width, imgBitmap.height);\n        const canvas = document.createElement('canvas');\n        canvas.width = imgBitmap.width;\n        canvas.height = imgBitmap.height;\n        const ctx = canvas.getContext('2d');\n        ctx.drawImage(imgBitmap, 0, 0);\n        const imgData = ctx.getImageData(0, 0, imgBitmap.width, imgBitmap.height);\n        this._width = imgData.width;\n        this._height = imgData.height;\n        this._data = imgData.data;\n        this._bytesPerScanLine = ImageTexture_1.BytesPerPixel * this._width;\n    }\n    value(u, v, _p) {\n        // If we have no texture data, then return solid cyan as a debugging aid.\n        if (!this._data || this._data.length === 0) {\n            return new vec3_1.default(0, 1, 1);\n        }\n        // Clamp input texture coordinates to [0,1] x [1,0]\n        u = util_1.clamp(u, 0.0, 1.0);\n        v = 1.0 - util_1.clamp(v, 0.0, 1.0); // Flip V to image coordinates\n        let i = Math.trunc(u * this._width);\n        let j = Math.trunc(v * this._height);\n        // Clamp integer mapping, since actual coordinates should be less than 1.0\n        if (i >= this._width)\n            i = this._width - 1;\n        if (j >= this._height)\n            j = this._height - 1;\n        const colorScale = 1.0 / 255.0;\n        let pixelOffset = j * this._bytesPerScanLine + i * ImageTexture_1.BytesPerPixel;\n        return new vec3_1.default(this._data[pixelOffset++] * colorScale, this._data[pixelOffset++] * colorScale, this._data[pixelOffset++] * colorScale);\n    }\n};\nImageTexture.BytesPerPixel = 4;\nImageTexture = ImageTexture_1 = __decorate([\n    serializing_1.serializable\n], ImageTexture);\nexports.ImageTexture = ImageTexture;\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/texture.ts?");

/***/ }),

/***/ "./src/raytracer-cpu/workerinterfaces.ts":
/*!***********************************************!*\
  !*** ./src/raytracer-cpu/workerinterfaces.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.ComputeCommands = exports.ControllerCommands = void 0;\nvar ControllerCommands;\n(function (ControllerCommands) {\n    ControllerCommands[ControllerCommands[\"START\"] = 0] = \"START\";\n    ControllerCommands[ControllerCommands[\"STOP\"] = 1] = \"STOP\";\n    ControllerCommands[ControllerCommands[\"END\"] = 2] = \"END\";\n})(ControllerCommands = exports.ControllerCommands || (exports.ControllerCommands = {}));\nvar ComputeCommands;\n(function (ComputeCommands) {\n    ComputeCommands[ComputeCommands[\"START\"] = 0] = \"START\";\n    ComputeCommands[ComputeCommands[\"END\"] = 1] = \"END\";\n})(ComputeCommands = exports.ComputeCommands || (exports.ComputeCommands = {}));\n\n\n//# sourceURL=webpack:///./src/raytracer-cpu/workerinterfaces.ts?");

/***/ }),

/***/ "./src/serializing/decorators.ts":
/*!***************************************!*\
  !*** ./src/serializing/decorators.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.serializable = void 0;\nconst metadata_1 = __webpack_require__(/*! ./metadata */ \"./src/serializing/metadata.ts\");\n// eslint-disable-next-line @typescript-eslint/no-explicit-any\nfunction serializable(type) {\n    metadata_1.addClassName(type);\n}\nexports.serializable = serializable;\n\n\n//# sourceURL=webpack:///./src/serializing/decorators.ts?");

/***/ }),

/***/ "./src/serializing/deserialize.ts":
/*!****************************************!*\
  !*** ./src/serializing/deserialize.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.deserialize = void 0;\nconst interfaces_1 = __webpack_require__(/*! ./interfaces */ \"./src/serializing/interfaces.ts\");\nconst metadata_1 = __webpack_require__(/*! ./metadata */ \"./src/serializing/metadata.ts\");\nfunction _deserialize(type, data) {\n    const instance = Object.create(type.prototype);\n    for (const k in data) {\n        const v = data[k];\n        if (Array.isArray(v)) {\n            instance[k] = v.map((val) => {\n                const className = val[interfaces_1.CLASSNAME_KEY];\n                if (className) {\n                    const newtype = metadata_1.getClassConstructor(val[interfaces_1.CLASSNAME_KEY]);\n                    return _deserialize(newtype, val);\n                }\n                return val;\n            });\n        }\n        else if (typeof v === 'object') {\n            const newtype = metadata_1.getClassConstructor(v[interfaces_1.CLASSNAME_KEY]);\n            instance[k] = _deserialize(newtype, v);\n        }\n        else {\n            instance[k] = v;\n        }\n    }\n    return instance;\n}\nfunction deserialize(type, data) {\n    return _deserialize(type, data);\n}\nexports.deserialize = deserialize;\n\n\n//# sourceURL=webpack:///./src/serializing/deserialize.ts?");

/***/ }),

/***/ "./src/serializing/index.ts":
/*!**********************************!*\
  !*** ./src/serializing/index.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __exportStar = (this && this.__exportStar) || function(m, exports) {\n    for (var p in m) if (p !== \"default\" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\n__exportStar(__webpack_require__(/*! ./interfaces */ \"./src/serializing/interfaces.ts\"), exports);\n__exportStar(__webpack_require__(/*! ./serialize */ \"./src/serializing/serialize.ts\"), exports);\n__exportStar(__webpack_require__(/*! ./deserialize */ \"./src/serializing/deserialize.ts\"), exports);\n__exportStar(__webpack_require__(/*! ./decorators */ \"./src/serializing/decorators.ts\"), exports);\n\n\n//# sourceURL=webpack:///./src/serializing/index.ts?");

/***/ }),

/***/ "./src/serializing/interfaces.ts":
/*!***************************************!*\
  !*** ./src/serializing/interfaces.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.CLASSNAME_KEY = void 0;\nexports.CLASSNAME_KEY = '__CLASSNAME__';\n\n\n//# sourceURL=webpack:///./src/serializing/interfaces.ts?");

/***/ }),

/***/ "./src/serializing/metadata.ts":
/*!*************************************!*\
  !*** ./src/serializing/metadata.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/* eslint-disable @typescript-eslint/no-explicit-any */\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.getClassConstructor = exports.addClassName = void 0;\nconst _metaMap = new Map();\nfunction addClassName(type) {\n    //console.log(`add constructor of ${type.name} to map`);\n    _metaMap.set(type.name, type);\n}\nexports.addClassName = addClassName;\nfunction getClassConstructor(name) {\n    if (_metaMap.has(name)) {\n        return _metaMap.get(name);\n    }\n    console.error(`${name} not serializable, use the @serializable decorator`);\n    return null;\n}\nexports.getClassConstructor = getClassConstructor;\n\n\n//# sourceURL=webpack:///./src/serializing/metadata.ts?");

/***/ }),

/***/ "./src/serializing/serialize.ts":
/*!**************************************!*\
  !*** ./src/serializing/serialize.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.serialize = void 0;\nconst interfaces_1 = __webpack_require__(/*! ./interfaces */ \"./src/serializing/interfaces.ts\");\nfunction _serialize(type, instance) {\n    const target = {};\n    const props = Object.getOwnPropertyNames(instance);\n    for (const k of props) {\n        const v = instance[k];\n        if (Array.isArray(v)) {\n            target[k] = v.map((val) => {\n                if (typeof val === 'object') {\n                    return _serialize(val.constructor, val);\n                }\n                return val;\n            });\n        }\n        else if (v instanceof Int8Array ||\n            v instanceof Uint8Array ||\n            v instanceof Uint8ClampedArray ||\n            v instanceof Int16Array ||\n            v instanceof Uint16Array ||\n            v instanceof Int32Array ||\n            v instanceof Uint32Array ||\n            v instanceof Float32Array ||\n            v instanceof Float64Array) {\n            target[k] = Array.from(v);\n        }\n        else if (typeof v === 'object') {\n            target[k] = _serialize(v.constructor, v);\n        }\n        else {\n            target[k] = v;\n        }\n    }\n    target[interfaces_1.CLASSNAME_KEY] = instance.constructor.name;\n    return target;\n}\nfunction serialize(type, instance) {\n    return _serialize(type, instance);\n}\nexports.serialize = serialize;\n\n\n//# sourceURL=webpack:///./src/serializing/serialize.ts?");

/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.sortArrayRange = exports.randomInt = exports.clamp = exports.randomNumberRange = exports.randomNumber = exports.degreeToRadians = void 0;\nfunction degreeToRadians(degrees) {\n    return (degrees * Math.PI) / 180;\n}\nexports.degreeToRadians = degreeToRadians;\nfunction randomNumber() {\n    return Math.random();\n}\nexports.randomNumber = randomNumber;\nfunction randomNumberRange(min, max) {\n    return min + (max - min) * randomNumber();\n}\nexports.randomNumberRange = randomNumberRange;\nfunction clamp(x, min, max) {\n    if (x < min) {\n        return min;\n    }\n    if (x > max) {\n        return max;\n    }\n    return x;\n}\nexports.clamp = clamp;\nfunction randomInt(min, max) {\n    // Returns a random integer in [min,max].\n    return Math.floor(randomNumberRange(min, max + 1));\n}\nexports.randomInt = randomInt;\nfunction sortArrayRange(array, start, end, compareFn) {\n    array = [].concat(...array.slice(0, start), ...array.slice(start, start + end).sort(compareFn), ...array.slice(start + end, array.length));\n}\nexports.sortArrayRange = sortArrayRange;\n\n\n//# sourceURL=webpack:///./src/util.ts?");

/***/ }),

/***/ "./src/vec3.ts":
/*!*********************!*\
  !*** ./src/vec3.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar Vec3_1;\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.writeColor = void 0;\nconst util_1 = __webpack_require__(/*! ./util */ \"./src/util.ts\");\nconst serializing_1 = __webpack_require__(/*! ./serializing */ \"./src/serializing/index.ts\");\nlet Vec3 = Vec3_1 = class Vec3 {\n    constructor(x, y, z) {\n        this.x = 0;\n        this.y = 0;\n        this.z = 0;\n        this.x = x !== null && x !== void 0 ? x : 0;\n        this.y = y !== null && y !== void 0 ? y : 0;\n        this.z = z !== null && z !== void 0 ? z : 0;\n    }\n    get array() {\n        return [this.x, this.y, this.z];\n    }\n    set(x, y, z) {\n        this.x = x;\n        this.y = y;\n        this.z = z;\n    }\n    copyTo(dest) {\n        dest.x = this.x;\n        dest.y = this.y;\n        dest.z = this.z;\n    }\n    get r() {\n        return this.x;\n    }\n    set r(r) {\n        this.x = r;\n    }\n    get g() {\n        return this.y;\n    }\n    set g(g) {\n        this.y = g;\n    }\n    get b() {\n        return this.z;\n    }\n    set b(b) {\n        this.z = b;\n    }\n    length() {\n        return Math.sqrt(this.lengthSquared());\n    }\n    lengthSquared() {\n        return this.x * this.x + this.y * this.y + this.z * this.z;\n    }\n    negate() {\n        return new Vec3_1(-this.x, -this.y, -this.z);\n    }\n    add(v) {\n        this.x += v.x;\n        this.y += v.y;\n        this.z += v.z;\n        return this;\n    }\n    multiplyScalar(t) {\n        this.x *= t;\n        this.y *= t;\n        this.z *= t;\n        return this;\n    }\n    divideScalar(t) {\n        this.x /= t;\n        this.y /= t;\n        this.z /= t;\n        return this;\n    }\n    toString() {\n        return `${this.x}, ${this.y}, ${this.z}`;\n    }\n    static addVec3(u, v) {\n        return new Vec3_1(u.x + v.x, u.y + v.y, u.z + v.z);\n    }\n    static subVec3(u, v) {\n        return new Vec3_1(u.x - v.x, u.y - v.y, u.z - v.z);\n    }\n    static multVec3(u, v) {\n        return new Vec3_1(u.x * v.x, u.y * v.y, u.z * v.z);\n    }\n    static multScalarVec3(v, t) {\n        return new Vec3_1(t * v.x, t * v.y, t * v.z);\n    }\n    static divScalarVec(v, t) {\n        return new Vec3_1(v.x / t, v.y / t, v.z / t);\n    }\n    static dot(u, v) {\n        return u.x * v.x + u.y * v.y + u.z * v.z;\n    }\n    static cross(u, v) {\n        // prettier-ignore\n        return new Vec3_1(u.y * v.z - u.z * v.y, u.z * v.x - u.x * v.z, u.x * v.y - u.y * v.x);\n    }\n    static unitVector(v) {\n        return Vec3_1.divScalarVec(v, v.length());\n    }\n    static random() {\n        return new Vec3_1(util_1.randomNumber(), util_1.randomNumber(), util_1.randomNumber());\n    }\n    static randomRange(min, max) {\n        return new Vec3_1(util_1.randomNumberRange(min, max), util_1.randomNumberRange(min, max), util_1.randomNumberRange(min, max));\n    }\n    static randomInUnitSphere() {\n        // eslint-disable-next-line no-constant-condition\n        while (true) {\n            const p = Vec3_1.randomRange(-1, 1);\n            if (p.lengthSquared() >= 1) {\n                continue;\n            }\n            return p;\n        }\n    }\n    static randomUnitVector() {\n        const a = util_1.randomNumberRange(0, 2 * Math.PI);\n        const z = util_1.randomNumberRange(-1, 1);\n        const r = Math.sqrt(1 - z * z);\n        return new Vec3_1(r * Math.cos(a), r * Math.sin(a), z);\n    }\n    static randomInHemisphere(normal) {\n        const in_unit_sphere = Vec3_1.randomInUnitSphere();\n        if (Vec3_1.dot(in_unit_sphere, normal) > 0.0) {\n            // In the same hemisphere as the normal\n            return in_unit_sphere;\n        }\n        else {\n            return in_unit_sphere.negate();\n        }\n    }\n    static reflect(v, n) {\n        return Vec3_1.subVec3(v, Vec3_1.multScalarVec3(n, 2 * Vec3_1.dot(v, n)));\n    }\n    static refract(uv, n, etai_over_etat) {\n        const cos_theta = Vec3_1.dot(uv.negate(), n);\n        const uvTheta = Vec3_1.addVec3(uv, Vec3_1.multScalarVec3(n, cos_theta));\n        const r_out_parallel = Vec3_1.multScalarVec3(uvTheta, etai_over_etat);\n        const r_out_perp = Vec3_1.multScalarVec3(n, -Math.sqrt(1 - r_out_parallel.lengthSquared()));\n        return Vec3_1.addVec3(r_out_parallel, r_out_perp);\n    }\n    static randomInUnitdisk() {\n        // eslint-disable-next-line no-constant-condition\n        while (true) {\n            const p = new Vec3_1(util_1.randomNumberRange(-1, 1), util_1.randomNumberRange(-1, 1), 0);\n            if (p.lengthSquared() >= 1) {\n                continue;\n            }\n            return p;\n        }\n    }\n};\nVec3 = Vec3_1 = __decorate([\n    serializing_1.serializable\n], Vec3);\nexports.default = Vec3;\nfunction writeColor(array, offset, color, samples_per_pixel) {\n    let r = color.r;\n    let g = color.g;\n    let b = color.b;\n    // Divide the color total by the number of samples and gamma-correct for gamma=2.0.\n    const scale = 1.0 / samples_per_pixel;\n    r = Math.sqrt(scale * r);\n    g = Math.sqrt(scale * g);\n    b = Math.sqrt(scale * b);\n    // Write the translated [0,255] value of each color component.\n    array[offset++] = r * 255;\n    array[offset++] = g * 255;\n    array[offset++] = b * 255;\n    array[offset++] = 255;\n}\nexports.writeColor = writeColor;\n\n\n//# sourceURL=webpack:///./src/vec3.ts?");

/***/ })

/******/ });