const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 5;
const myPlaintextPassword = '';
const someOtherPlaintextPassword = 'not_bacon';
const port = process.env.PORT||3000;
var db= require('./connection.js');
const { RANDOM } = require('mysql/lib/PoolSelector');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));
var Smessage='';
var Amessage='';
app.get("/",function(req,res){
       res.render("index");
});
app.get("/StudentLoginSignup",function(req,res){
  res.render("StudentLogin",{message: Smessage});
});
app.post("/StudentLoginSignup",function(req,res){
  res.render("StudentLogin",{message:Smessage});
});
app.get("/AdminLoginSignup",function(req,res){
  res.render("adminLogin",{message:Amessage});
});

app.get("/showGrievances", function(req,res){

      var sql_grv= "SELECT * from Grievances where Gstatus=?";
          db.query(sql_grv,[0],function(err,results){
            console.log(results);

            res.render("Grievance",{Grecords:results});

        });
          
});

app.get("/showGrievances/:G_id", function(req,res){
  let {G_id}= req.params;

  var sql_resolve= "UPDATE Grievances set Gstatus=? where G_id=?";
  db.query(sql_resolve,[1,G_id],function(err,result){
        if(err)
          console.log(err);
        else{
            var sql_grv= "SELECT * from Grievances where Gstatus=?";
             db.query(sql_grv,[0],function(err,results){
            console.log(results);

            res.render("Grievance",{Grecords:results});

         });
        } 
  });

});

app.get("/showMessages/:G_id", function(req,res){
  let {G_id}= req.params;
            var sql_grv= "SELECT message from Grievances where G_id=?";
             db.query(sql_grv,[G_id],function(err,results){
            console.log(results);

            res.render("Message",{Grecords:results});

         });
         
  

});

 


/*app.get("/resolve/:G_id/:Cemail",function(req,res){

  let {G_id}=req.params;
  let {Cemail}=req.params;
  var sql_resolve= "UPDATE Grievances set Gstatus=? where G_id=?";
  db.query(sql_resolve,[1,G_id],function(err,result){
    if(err)
    throw err;
    else{
      var sql2 = "SELECT * from Admin WHERE email_id='"+Cemail+"'";
      
      db.query(sql2,function(err,results){
        console.log(results);
        var Cname=results[0].College_name;
        var Ccode=results[0].College_code;
        var Wname=results[0].Grievance_Manager;
        var Cph=results[0].Phone_no;
        var Cemail=results[0].email_id;


     var sql_grv= "SELECT * from Grievances where Gstatus=?";
     db.query(sql_grv,[0],function(err,results){
       console.log(results);

       res.render("AdminPortal",{Cname:Cname,Ccode:Ccode,Wname:Wname,Cph:Cph,Cemail:Cemail,Grecords:results});
    

   });
   });


    }
    

  });



});*/


app.post("/AdminLoginSignup",function(req,res){
   res.render("adminLogin",{message:Amessage});
});
app.post("/StudentLogin",function(req,res){
  var name= req.body.EnterName;
  var email=req.body.EnterEmail;
  var room=req.body.EnterRoom;
  var usn=req.body.EnterUSN;
  var phone=req.body.EnterPh;
  var password= req.body.EnterPass;

  bcrypt.hash(password, saltRounds, function(err, hash) {
    var sql1=`INSERT INTO student VALUES ('${usn}','${name}','${room}','${email}','${phone}','${hash}')`;
    db.query(sql1,function(error,result){
      if(error)
      {
        console.log(error);
  
      }else {
        console.log(result);
      }  
    });
    res.render("StudentLogin",{message:Smessage});
   });
});
 
  
 app.post("/StudentPortal",function(req,res){
      var Email= req.body.LoginEmail;
      var pass = req.body.LoginPass;
     

      var sql1="SELECT Email, Password FROM student WHERE Email='"+Email+"'";
      db.query(sql1,function(err,result){
        console.log(result);

        if(!result.length){
          Smessage="Wrong Credentials";
          res.redirect("/StudentLoginSignup");
         }

        else{
         
          var hash=result[0].Password;
          console.log(hash);
          bcrypt.compare(pass, hash, function(err, result) {
            if(result==true){
              Smessage='';
              var sql2 = "SELECT * from student WHERE Email='"+Email+"'";
              db.query(sql2,function(err,results){
                var name=results[0].S_Name;
                var usn=results[0].USN;
                var room=results[0].Room_No;
                var ph=results[0].Phone_No;
                res.render("StudentPortal",{name:name,Email:Email,Room:room,Usn:usn,phone:ph});
               });  
    
            }
            else{
              Smessage="Wrong Credentials";
              res.redirect("/StudentLoginSignup");
               }

          });
      }
 
        
      });

 });
 app.post("/AdminLogin",function(req,res){
  var code= req.body.EnterCcode;
  var cname=req.body.EnterCname;
  var wname=req.body.EnterWname;
  var email=req.body.EnterCemail;
  var phone=req.body.EnterCphone;
  var password= req.body.EnterCpass;
  bcrypt.hash(password, saltRounds, function(err, hash) {
  var sql1=`INSERT INTO Admin VALUES ('${code}','${cname}','${wname}','${email}','${phone}','${hash}')`;
  db.query(sql1,function(error,result){
    if(error)
    {
      console.log(error);

    }else {
      console.log(result);
    }  
  });
  res.render("adminLogin",{message:Amessage});
});
});

 app.post("/AdminPortal",function(req,res){
  var Email= req.body.LoginAEmail;
  var pass = req.body.LoginAPass;
  var sql1="SELECT email_id, Password FROM Admin WHERE email_id='"+Email+"'";
  db.query(sql1,function(err,result){
    if(!result.length){
      Amessage="Wrong Credentials";
      res.redirect("/AdminLoginSignup");
    }
   
    else{
         var hash= result[0].Password;
         console.log(hash);
         bcrypt.compare(pass, hash, function(err, result) {
          if(result==true){
            Amessage='';
            var sql2 = "SELECT * from Admin WHERE email_id='"+Email+"'";
            db.query(sql2,function(err,results){
             var Cname=results[0].College_name;
             var Ccode=results[0].College_code;
             var Wname=results[0].Grievance_Manager;
             var Cph=results[0].Phone_no;
             var Cemail=results[0].email_id;


          var sql_grv= "SELECT * from Grievances where Gstatus=?";
          db.query(sql_grv,[0],function(err,results){
            console.log(results);

            res.render("AdminPortal",{Cname:Cname,Ccode:Ccode,Wname:Wname,Cph:Cph,Cemail:Cemail,Grecords:results});

        });
        });

          }

          else{
            Amessage="Wrong Credentials";
            res.redirect("/AdminLoginSignup");

              }
        });


       }
  });
 });
app.post("/status_post_route",function(req,res){
  var name= req.body.Comname;
  var room=req.body.Comroom;
  var G_id=Math.floor((Math.random() * 101)+1);
  var cate=req.body.Comcategory;
  var usn=req.body.Comusn;
  var emp_id;
  console.log(cate);
  if(cate=="Wifi"){
    emp_id=2;
   }
  else if(cate=="Eletric"){   
    emp_id=1;
   }
  else if(cate=="Carpenter"){
    emp_id=3;
   }
  else{
    emp_id=4;
   }
  var unixTimestamp = Date.now();
  var datex = new Date(unixTimestamp);
  var date=datex.getDate()+"/"+(datex.getMonth()+1)+"/"+datex.getFullYear();
  var status=0;
  var message = req.body.description;
  console.log(message);
  var sql1=`INSERT INTO Grievances VALUES ('${G_id +room}','${cate}','${emp_id}','${usn}','${room}','${date}','${status}','${message}')`;

  db.query(sql1,function(error,result){
    if(error)
    {
      console.log(error);

    }else {
      console.log(result);
    }  
  });
  res.render("ThankYou");
});
app.get("/status/:Usn",function(req,res){
  let {Usn}= req.params;

  var sql_status="Select * from Grievances where USN=?";
  db.query(sql_status,[Usn],function(error,result){
    if(error)
    console.log(error);
    else{
      res.render("Status",{Grecords:result});
    }
  });     
});
app.get("/editstatus/:G_id/:usn",function(req,res){
  let {G_id}= req.params;
  let {usn}=req.params;
  var sql_status="Delete  from Grievances where G_id=?";
  db.query(sql_status,[G_id],function(error,result){
    if(error)
    console.log(error);
    else{
    var sql_grv= "SELECT * from Grievances where USN=?";
    db.query(sql_grv,[usn],function(err,results){
    console.log(results);
       res.render("Status",{Grecords:results});
       });
       
    }
  });     
});
app.listen(port, function(){
  console.log("Server started on port 3000");
});
