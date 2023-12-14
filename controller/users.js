const mysql = require("mysql2");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cookieparser=require("cookie-parser");
const db=mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE,
})
db.connect((err)=>{
    if (err){
        console.log(err);
    }
    else{
        console.log("Mysql connection successfull in aruth")
    }
})

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (err) {
            console.log(err);
        }
        else if(result.length>0){
        if (result[0].name==username) {
            return res.render("index", { msg: "Name Already Taken", msg_type: "error" });
        }
        if (result[0].email==email) {
            return res.render("index", { msg: "Email Already Taken", msg_type: "error" });
        }
    }else{
        try {
            let hashedPassword = await bcrypt.hash(password, 10);
            db.query("insert into users set ?",{name:username,email:email,pass:hashedPassword},(err,result)=>{
                if(err){
                    console.log(err)
                }
                else{
                    return res.render("index",{msg:"Registration Success Login To continoue",msg_type:"good"})
                }
            })
        } catch (error) {
            console.error("Error in hashing password:", error);
            // Handle error appropriately
        }
    }
    });
};
exports.login = async (req,res)=>{
    const {username , password} = req.body;
    if(!username || !password){
        return res.render("index",{msg:"Please Enter Name And Password",msg_type:"error"})
    }
    else{
        db.query("SELECT * FROM users WHERE name = ?", [username], async (err, result)=>{
            if(result.length<=0){
                return res.status(401).render("index",{mgs:"No such Username",msg_type:"error"})
            }else{

                if((!await bcrypt.compare(password,result[0].pass))){
                    return res.status(401).render("index",{mgs:"Email or Password Incorrect",msg_type:"error"})
                }else{
                    const name=result[0].name;
                    const token = jwt.sign({ id: name }, process.env.JWT_SECRET, {
                        expiresIn: '1d',
                      });
                      console.log("The Token is " + token);
                      const cookieoption={expire: new Date( Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60),httponly: true,}
                      res.cookie("jude",token,cookieoption);
                      res.redirect("/home")
                }
            }

        })
    }
}
exports.adminlogin = async (req,res)=>{
    const {username , password} = req.body;
    if(!username || !password){
        return res.render("index",{msg:"Please Enter Name And Password",msg_type:"error"})
    }
    else{
        db.query("SELECT * FROM admin WHERE name = ?", [username], async (err, result)=>{
            if(result.length<=0){
                return res.status(401).render("index",{mgs:"No such Username",msg_type:"error"})
            }else{

                if((!await bcrypt.compare(password,result[0].pass))){
                    return res.status(401).render("index",{mgs:"Email or Password Incorrect",msg_type:"error"})
                }else{
                    const name=result[0].name;
                    const token = jwt.sign({ id: name }, process.env.JWT_SECRET, {
                        expiresIn: '1d',
                      });
                      console.log("The Token is " + token);
                      const cookieoption={expire: new Date( Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60),httponly: true,}
                      res.cookie("jude",token,cookieoption);
                    db.query("select * from activities",(err,result)=>{
                        if(!err){
                            var datetime = new Date().toISOString().slice(0,10);
                            db.query("select * from activities where date=?",[datetime],(err,recent)=>{
                                res.render("adminhome",{result,recent})
                            })
                        }
                    })
                }
            }

        })
    }
}
exports.edit=async (req,res)=>{
    let id=req.params.id;
    console.log(id)
    db.query("select * from activities where id=?",[id],(err,result)=>{
       if(err){
        console.log(err)
       }
       else{
        console.log(result)
        res.render("edit",{result})
       }
    })
}   

exports.delete=async(req,res)=>{
    let id=req.params.id;
    console.log(id)
    db.query("delete from activities where id=?",[id],(err,result)=>{
        if(err){
            console.log(err)
        }else{
            db.query("select * from activities",(err,result)=>{
                if(!err){
                    var datetime = new Date().toISOString().slice(0,10);
                    db.query("select * from activities where date=?",[datetime],(err,recent)=>{
                        res.render("adminhome",{result,recent})
                    })
                }
            })
        }
    })
}