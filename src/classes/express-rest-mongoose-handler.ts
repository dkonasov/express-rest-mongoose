import * as express from "express";
import * as mongoose from "mongoose";
import { ExpressRest } from "express-rest";

export class ExpressRestMongooseHandler<T extends mongoose.Document> extends ExpressRest {

    protected _getList(req: express.Request, res: express.Response): void {
        const skip = parseInt(req.query.offset, 10) ? parseInt(req.query.offset, 10) : 0;
        const limit = parseInt(req.query.limit, 10) ? parseInt(req.query.limit, 10) : 0;
        const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
        let sort: any = {};
        if (req.query.sort && req.query.order)  {
            sort[req.query.sort] = req.query.order;
        }
        this._model.find(filter).skip(skip).limit(limit).sort(sort).then((entities: T[]) => {
            const response: T[] = [];
            for(const entity of entities) {
                response.push(entity.toJSON({
                    virtuals: true
                }));
            }
            let countPromise: Promise<void> = Promise.resolve();
            if (limit > 0) {
                countPromise = this._model.count(filter).then((count: number) => {
                    let contentRangeHeader = `entities ${skip + 1}-${skip + limit < count ? skip + limit : count}/${count}`;
                    res.setHeader("Content-Range", contentRangeHeader);
                })
                .catch((err) => {
                    Promise.reject(err);
                });
            }
            countPromise.then(() => {
                if(req.query["headers_only"]) {
                    res.sendStatus(204);
                } else {
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

    protected _get(req: express.Request, res: express.Response): void {
        this._model.findOne(this._getSingleEntityFilter(req)).then((entity: T) => {
            if (!entity) {
                res.sendStatus(404);
                return;
            }
            res.json(entity.toJSON({
                virtuals: true
            }));
        })
        .catch((err: Error) => {
            console.error(err);
            res.sendStatus(500);
        })
    }

    protected _update(req: express.Request, res: express.Response): void {
        this._model.findOneAndUpdate(this._getSingleEntityFilter(req), req.body, {
            runValidators: true
        }).then((entity: T) => {
            if (!entity) {
                res.sendStatus(404);
                return;
            }
            res.json(entity.toJSON({
                virtuals: true
            }));
        })
        .catch((err: Error) => {
            console.error(err);
            res.sendStatus(500);
        })
    }

    protected _create(req: express.Request, res: express.Response): void {
        this._model.create(req.body).then((entity: T) => {
            res.json(entity.toJSON({
                virtuals: true
            }));
        })
        .catch((err: Error) => {
            console.error(err);
            res.sendStatus(500);
        })
    }

    protected _delete(req: express.Request, res: express.Response): void {
        this._model.findOne(this._getSingleEntityFilter(req)).then((entity: T) => {
            if (!entity) {
                res.sendStatus(404);
                return;
            }
            entity.set({deleted: true});
            entity.save().then(() => {
                res.sendStatus(204);
            })
            .catch((err: Error) => {
                console.error(err);
                res.sendStatus(500);
            });
        })
        .catch((err: Error) => {
            console.error(err);
            res.sendStatus(500);
        });
    }

    private _getSingleEntityFilter(req: express.Request): any {
        const filter = {};
        filter[this._getBy] = req.params.id;
        return filter;
    }
    constructor(private _model: mongoose.Model<T>, private _getBy = "id") {
        super();
    }
}