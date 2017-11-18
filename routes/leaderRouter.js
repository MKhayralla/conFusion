const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req,res,next)=>{
  res.statusCode = 200 ;
  res.setHeader('Content-Type', 'text/plain') ;
  next();
})
.get((req,res,next)=>{
  res.end('Will send all the leaders to you!')
})
.post((req,res,next)=>{
  res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req,res,next)=>{
  res.statusCode = 403 ;
  res.end('the PUT method is not available for /leaders');
})
.delete((req,res,next)=>{
  res.end('Will delete all the leaders !');
});

leaderRouter.route('/:leaderId')
.all((req,res,next)=>{
  res.statusCode = 200 ;
  res.setHeader('Content-Type', 'text/plain') ;
  next();
})
.get((req,res,next)=>{
  res.end('Will send the leader'+req.params.leaderId+' to you!')
})
.post((req,res,next)=>{
  res.statusCode = 403 ;
  res.end('the POST method is not available for /leaders/'+req.params.leaderId);
})
.put((req,res,next)=>{
  res.write('Will update the data of leader '+req.params.leaderId+'\n');
  res.end('name : '+req.body.name+'\ndescription : '+req.body.description);
})
.delete((req,res,next)=>{
  res.end('Will delete the data of leader'+req.params.leaderId);
});

module.exports = leaderRouter;
