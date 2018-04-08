/// <reference types="express" />
import * as express from "express";
export declare abstract class ExpressRest {
    getRouter(): express.Router;
    protected abstract _getList(req: express.Request, res: express.Response): void;
    protected abstract _get(req: express.Request, res: express.Response): void;
    protected abstract _create(req: express.Request, res: express.Response): void;
    protected abstract _update(req: express.Request, res: express.Response): void;
    protected abstract _delete(req: express.Request, res: express.Response): void;
}
