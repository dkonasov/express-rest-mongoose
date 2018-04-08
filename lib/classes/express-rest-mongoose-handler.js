"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_rest_1 = require("express-rest");
class ExpressRestMongooseHandler extends express_rest_1.ExpressRest {
    constructor(_model, _getBy = "id") {
        super();
        this._model = _model;
        this._getBy = _getBy;
    }
    _getList(req, res) {
        const skip = parseInt(req.query.offset, 10) ? parseInt(req.query.offset, 10) : 0;
        const limit = parseInt(req.query.limit, 10) ? parseInt(req.query.limit, 10) : 0;
        const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
        let sort = {};
        if (req.query.sort && req.query.order) {
            sort[req.query.sort] = req.query.order;
        }
        this._model.find(filter).skip(skip).limit(limit).sort(sort).then((entities) => {
            const response = [];
            for (const entity of entities) {
                response.push(entity.toJSON({
                    virtuals: true
                }));
            }
            let countPromise = Promise.resolve();
            if (limit > 0) {
                countPromise = this._model.count(filter).then((count) => {
                    let contentRangeHeader = `entities ${skip + 1}-${skip + limit < count ? skip + limit : count}/${count}`;
                    res.setHeader("Content-Range", contentRangeHeader);
                })
                    .catch((err) => {
                    Promise.reject(err);
                });
            }
            countPromise.then(() => {
                if (req.query["headers_only"]) {
                    res.sendStatus(204);
                }
                else {
                    res.json(response);
                }
            })
                .catch((err) => {
                console.error(err);
                res.sendStatus(500);
            });
        })
            .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
    }
    _get(req, res) {
        this._model.findOne(this._getSingleEntityFilter(req)).then((entity) => {
            if (!entity) {
                res.sendStatus(404);
                return;
            }
            res.json(entity.toJSON({
                virtuals: true
            }));
        })
            .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
    }
    _update(req, res) {
        this._model.findOneAndUpdate(this._getSingleEntityFilter(req), req.body, {
            runValidators: true
        }).then((entity) => {
            if (!entity) {
                res.sendStatus(404);
                return;
            }
            res.json(entity.toJSON({
                virtuals: true
            }));
        })
            .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
    }
    _create(req, res) {
        this._model.create(req.body).then((entity) => {
            res.json(entity.toJSON({
                virtuals: true
            }));
        })
            .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
    }
    _delete(req, res) {
        this._model.findOne(this._getSingleEntityFilter(req)).then((entity) => {
            if (!entity) {
                res.sendStatus(404);
                return;
            }
            entity.set({ deleted: true });
            entity.save().then(() => {
                res.sendStatus(204);
            })
                .catch((err) => {
                console.error(err);
                res.sendStatus(500);
            });
        })
            .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
    }
    _getSingleEntityFilter(req) {
        const filter = {};
        filter[this._getBy] = req.params.id;
        return filter;
    }
}
exports.ExpressRestMongooseHandler = ExpressRestMongooseHandler;
