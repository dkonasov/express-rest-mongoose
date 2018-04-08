/// <reference types="mongoose" />
/// <reference types="express" />
import * as express from "express";
import * as mongoose from "mongoose";
import { ExpressRest } from "express-rest";
export declare class ExpressRestMongooseHandler<T extends mongoose.Document> extends ExpressRest {
    private _model;
    private _getBy;
    protected _getList(req: express.Request, res: express.Response): void;
    protected _get(req: express.Request, res: express.Response): void;
    protected _update(req: express.Request, res: express.Response): void;
    protected _create(req: express.Request, res: express.Response): void;
    protected _delete(req: express.Request, res: express.Response): void;
    private _getSingleEntityFilter(req);
    constructor(_model: mongoose.Model<T>, _getBy?: string);
}
