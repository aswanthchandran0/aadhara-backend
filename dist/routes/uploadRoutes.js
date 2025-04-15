"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadController_1 = require("../controller/uploadController");
const router = (0, express_1.Router)();
router.post('/', uploadController_1.processImages);
exports.default = router;
