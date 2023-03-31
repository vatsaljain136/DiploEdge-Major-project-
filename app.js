//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _=require("lodash");
const mongoose = require("mongoose");


//=================================Data Base development==============================================================

mongoose.connect("mongodb://127.0.0.1:27017/mainDB");//to solve buffer timeout error //Very importanat to use 127.0.0.1 rather than localhost,mainDB is the name of main Data base
    

//============defining schema for all the download data collections in the data base===================//

const downloadSchema =new mongoose.Schema({
  contentTitle: String,
  contentLink:String,
  contentBranch:String
});

//=================defining schema for all the miscellaneous collections in the data base====================



const noticeSchema ={
  noticeTitle: String,
  noticeContent:String,
  noticeLink:String
};

const articleSchema =new mongoose.Schema({
  articleTitle: String,
  articleContent:String,
  articleLink:String,
  articleImg:String
});

//===========================================modelling collections based on schemas===============================


const Download =mongoose.model("Download",downloadSchema);
const Notice =mongoose.model("Notice",noticeSchema);
const Article =mongoose.model("Article",articleSchema);


//=================================App Devlopment=================================================




const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

//app.use(express.json());//to solve error of undefined

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//let posts =[];//global array

app.get("/",function(req,res)                    //view home routes 
{                                             
  Notice.find({},function(err,Postarray){
    console.log(Postarray);
    res.render("home",{homeContent:homeStartingContent,posts:Postarray});
  }); 
  
})

app.get("/about",function(req,res)              //view about route
{                                             
  res.render("about",{aboutContent:aboutContent});
})

app.get("/contact",function(req,res){     //view contact route
  res.render("contact",{contactContent:contactContent});
})

app.get("/compose",function(req,res){       //view compose route
  res.render("compose");
})

//====================================//post routes for downloads =======================================================

app.post("/download",function(req,res){    
  
  
  const download = new Download({
    contentTitle: req.body.Title,
    contentLink:req.body.Link,
    contentBranch:req.body.Branch
  });
  Download.insertMany([download]);
  
  res.redirect("/downloads");
})


//====================================//post routes =======================================================

app.post("/notices",function(req,res){      //post notice route
  
  
  const notice = new Notice({
    noticeTitle: req.body.Title,
    noticeContent:req.body.Content,
    noticeLink:req.body.Link
  });
  Notice.insertMany([notice]);
  
  res.redirect("/notices");
})

app.post("/article",function(req,res){      //post articles route
  
  
  const article = new Article({
    articleTitle: req.body.Title,
    articleContent:req.body.Content,
    articleLink:req.body.Link,
    articleImg:req.body.imgLink
  });
  Article.insertMany([article]);

  res.redirect("/article");
})

//=================================download routes===============

app.get("/downloads",function(req,res)                    //view download routes 
{                                             
  Download.find({},function(err,downloadarray){
    if(err){
      console.log(err);
    }
    else{
      res.render("download",{downloadarray:downloadarray});
    }
  })
  
})

app.get("/article",function(req,res)                    //view download routes 
{                                             
  Article.find({},function(err,Postarray){
  
    res.render("article",{posts:Postarray});
  }); 
  
})

app.get("/notices",function(req,res)                    //view download routes 
{                                             
  Notice.find({},function(err,noticearray){
    if(err){
      console.log(err);
    }
    else{
      res.render("notice",{posts:noticearray});
    }
    
  }); 
  
})


//======================complex parameter route for articles=========================================

app.get("/post/:articleTitle",function(req,res) // getting value in parameter
{

      const requestedTitle = _.lowerCase(req.params.articleTitle);
      console.log(requestedTitle);
    
      Article.find({},function(err,articlearray){
        if(err){
          console.log(err);
        }
        else{
          articlearray.forEach(function(article){
            console.log(article);
            if(_.lowerCase(article.articleTitle)==requestedTitle){
              res.render("post",{
                articleTitle:article.articleTitle,
                articleContent:article.articleContent,
                articleImg:article.articleImg,
                articleLink:article.articleLink
              })

            }
            
          });
        }
      })
      


})









app.listen(8000, function() {
  console.log("Server started on port 8000");
})

