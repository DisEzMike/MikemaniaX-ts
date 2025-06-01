import { Router } from 'express';
import * as line from '@line/bot-sdk';
import { currentUser, login } from '../controllers/auth.controller';
import { authMiddleware, checkAdmin } from '../middlewares/auth';
import { getAllUser, getUser } from '../controllers/user.controller';
import { LINE_CONFIG } from '../utils/contant';
import { callbackFn } from '../controllers/app.controller';


const router = Router();

router.get('/', (req, res) => {
	res.json({ text: 'Hello, world!' });
});


router.post('/login', login);
router.get('/current-user', authMiddleware, currentUser);
router.get('/user/:userId', checkAdmin, getUser);
router.get('/user', checkAdmin, getAllUser);


export { router };
