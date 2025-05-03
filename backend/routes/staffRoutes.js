import express from 'express';
import staffController from '../controllers/staffController.js';

const router = express.Router();

router.post('/signup', staffController.signup);
router.post('/login', staffController.login);

export default router;