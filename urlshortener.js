var express = require('express')
var path = require('path')
var app=express()
var mongo = require('mongodb').MongoClient
var url = process.env.MONGOLAB_URI
var port = process.env.PORT || 5000

var urlkey=0
var newUrl

//console.log("url = "+url)




    app.get('/',function(req,res){
       res.sendFile(path.join(__dirname + '/index.html'))
    })

    app.listen(process.env.PORT || port, function(err) {

     if (err) {return console.log('something bad happened', err)}
      console.log('server is listening on '+port)
     })

     app.route(/\d+/).get(function(req,res){
         var r = req.path.replace('/', '')
         var found
         var nx=parseInt(r)

         mongo.connect(url, function (err, db) {
           if (err) { console.log('Unable to connect to the mongoDB server. Error:', err)   } 
           else {    console.log('Connection established to', url)
                 var dbUrl=db.collection('nurl')
                 var sN={"code": nx}

                 //console.log(JSON.stringify(sN))

                 dbUrl.find(sN)
                 .toArray(function(err,dat){
                 if(err) throw err 
                 //console.log(JSON.stringify(dat))
                 found=dat[0].originalUrl
                 console.log(found)
                 //res.end("the found url for " + nx + " is : "+found)
                 res.redirect(found)
                 db.close()
                 })
                } 
          })
       })
     

    app.route(/\/new\/.+/)
      .get(function(req, res) {
        if (validUrl(req)) 
        {

        var zf=Math.random()*1234567890123456
        var hostname = "https://2bReplaced.herokuapp.com/"

        zf=Math.floor(zf)
        console.log("current req "+req.path)
        console.log("newUrl = "+newUrl)
        console.log(" url = "+url)
        //res.end('urlkey for '+newUrl+' = '+zf)

        mongo.connect(url, function (err, db) {
           if (err) { console.log('Unable to connect to the mongoDB server. Error:', err)   } 
           else {    console.log('Connection established to', url)
              var dbUrl=db.collection('nurl')
              var value={"originalUrl": newUrl, "code": zf}
              
              //console.log("value = "+value.originalUrl+" "+code)
              console.log("value = "+JSON.stringify(value))
              // do some work here with the database.
           
             dbUrl.insert(value,
             function(err, data) {
                 if (err) { throw err }
                  var ox={"originalUrl": newUrl, "shortUrl": hostname + zf}
                  ox=JSON.stringify(ox)
                  res.send(ox)
                 db.close()
             })
           }  
         }) 
       } 
      else 
       { res.json({"error": "URL Invalid"}) }
    })


    function validUrl(req) {
     var pattern = /https?:\/\/www\..+\.*/
     newUrl = req.path.replace('/new/', '')
  
      return newUrl.match(pattern)
      
     }
    
   


