import { NextFunction, Request, Response } from "express";
import { createUser, logout, signInUser } from "../controllers/userController";
import { auth } from "../middleware/auth";

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'Express' });
});

router.post('/users/signup', createUser)
router.post('/users/login', signInUser)
router.get('/logout',auth, logout)

module.exports = router;
