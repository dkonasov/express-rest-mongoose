import * as express from "express";

export abstract class ExpressRest {

    public getRouter(): express.Router {
        const router = express.Router();
        router.get('/', this._getList.bind(this));
        router.post('/', this._create.bind(this));
        router.get('/:id', this._get.bind(this));
        router.put('/:id', this._update.bind(this));
        router.delete('/:id', this._delete.bind(this));
        return router;
    }
    protected abstract _getList(req: express.Request, res: express.Response): void;
    protected abstract _get(req: express.Request, res: express.Response): void;
    protected abstract _create(req: express.Request, res: express.Response): void;
    protected abstract _update(req: express.Request, res: express.Response): void;
    protected abstract _delete(req: express.Request, res: express.Response): void;
}