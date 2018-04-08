"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class ExpressRest {
    getRouter() {
        const router = express.Router();
        router.get('/', this._getList.bind(this));
        router.post('/', this._create.bind(this));
        router.get('/:id', this._get.bind(this));
        router.put('/:id', this._update.bind(this));
        router.delete('/:id', this._delete.bind(this));
        return router;
    }
}
exports.ExpressRest = ExpressRest;
