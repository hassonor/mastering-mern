import express, {Router} from 'express';
import {authMiddleware} from '@global/helpers/auth-middleware';
import {Add} from '@reaction/controllers/addReactions.controller';
import {Remove} from '@reaction/controllers/removeReactions.controller';
import {GetReactions} from '@reaction/controllers/getReactions.controller';


class ReactionRoutes {
    private readonly router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.get('/post/reactions/:postId', authMiddleware.checkAuthentication, GetReactions.prototype.reactions);
        this.router.get('/post/single/reaction/username/:username/:postId', authMiddleware.checkAuthentication, GetReactions.prototype.singleReactionByUsername);
        this.router.get('/post/reactions/username/:username/', authMiddleware.checkAuthentication, GetReactions.prototype.reactionsByUsername);

        this.router.post('/post/reaction', authMiddleware.checkAuthentication, Add.prototype.reaction);

        this.router.delete('/post/reaction/:postId/:previousReaction/:postReactions', authMiddleware.checkAuthentication, Remove.prototype.reaction);

        return this.router;
    }
}

export const reactionRoutes: ReactionRoutes = new ReactionRoutes();