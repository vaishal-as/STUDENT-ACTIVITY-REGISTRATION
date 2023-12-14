const express=require("express");
const mysql = require("mysql2");
const router = express.Router();
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
        console.log("Mysql connection successfull in adding")
    }
})
router.get("/",(req,res)=>{
    res.render("index")
})
let globalname;
let globalclass;
let globalactivity;
let globaldate;
router.post("/payment",(req,res)=>{
    const {inputField1,inputField2,myselect,inputField4}=req.body;
    globalname=inputField1;
    globalclass=inputField2;
    globalactivity=myselect;
    globaldate=inputField4;
    db.query("select * from activities where name=?",[inputField1],(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            var datetime = new Date().toISOString().slice(0,10);
            if(result.length>0){
                if(result[0].date==inputField4 || result[0].name==inputField1){
                    return res.redirect("/home?msg=Already%20Registered%20or%20provide%20different%20date&msg_type=error");
                }
                if(datetime>inputField4){
                    return res.redirect("/home?msg=Provide%20current%20or%20Future%20date&msg_type=error");
                }
                else{
                    db.query("select count(*) as count_of_activities from activities where activity=?",[myselect],(err,result)=>{
                        if(err){
                            console.log(err)
                        }else{
                            console.log(result)
                            if(result[0].count_of_activities<=10){
                                res.render("dashboard");
                            }
                            else{
                                res.redirect("/home?msg=Activity%20Slot%20over%20Book%20another&msg_type=error");
                            }
                        }
                    })
                }
            }else{
                if(datetime>inputField4){
                    return res.redirect("/home?msg=Provide%20current%20or%20Future%20date&msg_type=error");
                }else{
                    db.query("select count(*) as count_of_activities from activities where activity=?",[myselect],(err,result)=>{
                        if(err){
                            console.log(err)
                        }else{
                            if(result[0].count_of_activities<10){
                                res.render("dashboard");
                            }
                            else{
                                res.redirect("/home?msg=Activity%20Slot%20over%20Book%20another&msg_type=error");
                            }
                        }
                    })
            }
            }
        }
    })
})
router.get("/admin",(req,res)=>{
    res.render("admin_login")
})
router.post("/adminpage/:id",(req,res)=>{
    let id=req.params.id;
    var datetime = new Date().toISOString().slice(0,10);
    const {inputField1,inputField2,myselect,inputField4}=req.body;
    console.log(id,inputField1,inputField2,myselect,inputField4)
    if(inputField4>=datetime){
        db.query("update activities set name=?,class=?,activity=?,date=? where id=?",[inputField1,inputField2,myselect,inputField4,id],(err,result)=>{
            if(err){
                console.log(err)
            }
            else{
                db.query("select * from activities",(err,result)=>{
                    if(!err){
                        var datetime = new Date().toISOString().slice(0,10);
                        db.query("select * from activities where date>=?",[datetime],(err,recent)=>{
                            res.render("adminhome",{result,recent})
                        })
                    }
                })
            }
        })
    }else{
        res.render("edit",{msg:"Enter current date or future date"});
    }
})
router.post("/homepage",(req,res)=>{
    db.query("select * from activities where name=?",[globalname],(err,result)=>{
        if(err){
            console.log(err)
        }else{
            if(result.length>0){
                res.redirect("/home?msg=Already%20Registered&msg_type=good");
            }else{
                db.query("insert into activities set ?",{name:globalname,class:globalclass,activity:globalactivity,date:globaldate},(err,result)=>{
                    if(err){
                        console.log(err)
                    }else{
                        res.redirect("/home?msg=Successfully%20Registered%20Your%20Activity&msg_type=good");
                    }
                })
            }
        }
    })
    
})
router.get("/home",(req,res)=>{
       // Access values from query parameters
       const msg = req.query.msg;
       const msg_type = req.query.msg_type;
       db.query("select count(*) as count from activities where activity='Jocking'",(err,jocking)=>{
        if(!err){
            db.query("select count(*) as count from activities where activity='Walking'",(err,walking)=>{
                if(!err){
                    db.query("select count(*) as count from activities where activity='Cycling'",(err,cycling)=>{
                        if(!err){
                            db.query("select count(*) as count from activities where activity='Yoga'",(err,yoga)=>{
                                if(!err){
                                    db.query("select count(*) as count from activities where activity='Dance'",(err,dance)=>{
                                        if(!err){
                                            db.query("select count(*) as count from activities where activity='Swimming'",(err,swimming)=>{
                                                if(!err){
                                                    jocking[0].count=10-jocking[0].count
                                                    walking[0].count=10-walking[0].count
                                                    cycling[0].count=10-cycling[0].count
                                                    yoga[0].count=10-yoga[0].count
                                                    dance[0].count=10-dance[0].count
                                                    swimming[0].count=10-swimming[0].count
                                                    res.render("home",{jocking,walking,cycling,yoga,dance,swimming,msg,msg_type})
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
       })
   
       // Use the values as needed, e.g., pass them to the view
})
module.exports=router;