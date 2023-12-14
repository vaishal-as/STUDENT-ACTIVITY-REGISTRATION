const express=require("express");
const control=require("../controller/users");
const router = express.Router();

router.post('/register',control.register);
router.post('/login',control.login);
router.post('/adminlogin',control.adminlogin);
router.get('/edit/:id',control.edit);
router.get('/delete/:id',control.delete);
module.exports=router;