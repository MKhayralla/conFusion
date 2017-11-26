const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const cors = require('./cors');
const Favorites = require('../models/favorites');

const favoriteRouter = express.Router() ;
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
  Favorites.findOne({owner : req.user})
  .populate('owner')
  .populate('favoriteDishes')
  .then((favs)=>{
    res.statusCode = 200 ;
    res.setHeader('Content-Type','application/json');
    res.json(favs) ;
  },(err) => next(err))
  .catch((err) => next(err)) ;
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req , res , next ) => {
  Favorites.findOne({owner : req.user})
  .then((fav) => {
    var list = req.body ;
    for (var i = 0; i < list.length; i++) {
      list[i] = list[i]._id ;
    };
    if (fav) {
      for (var i = 0; i < list.length; i++) {
        if(fav.favoriteDishes.indexOf(list[i]) < 0){
          fav.favoriteDishes = fav.favoriteDishes.concat(list[i]);
        }
      }
      fav.save()
      .then((resp) => {
        res.statusCode = 200 ;
        res.setHeader('Content-Type','application/json') ;
        res.json(resp) ;
      } , (err) => next(err))
      .catch((err)=>next(err));
    }
    else {
      Favorites.create({ owner : req.user , favoriteDishes : list})
      .then((resp)=>{
        res.statusCode = 200 ;
        res.setHeader('Content-Type','application/json') ;
        res.json(resp) ;
      } , (err) => next(err))
      .catch((err) => next(err)) ;
    }
  },(err) => next(err))
  .catch((err) => next(err)) ;
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req , res , next) =>{
  Favorites.remove({owner : req.user})
  .then((resp) => {
    res.statusCode = 200 ;
    res.setHeader('Content-Type','application/json');
    res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions,authenticate.verifyUser,(req , res , next) => {
  Favorites.findOne({owner : req.user })
  .then((fav) => {
    if (fav){
      if(fav.favoriteDishes.indexOf(req.params.dishId) < 0){
      fav.favoriteDishes = fav.favoriteDishes.concat(req.params.dishId);
      fav.save()
      .then((resp) => {
        res.statusCode = 200 ;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
      } , (err) => next(err))
      .catch((err)=>next(err));
      }
      else {
        res.statusCode = 403 ;
        res.setHeader('Content-Type','text/plain');
        res.end("duplicate fav");
      }
    }
    else {
      Favorites.create({owner : req.user , favoriteDishes : req.params.dishId})
      .then((resp)=>{
        res.statusCode = 200 ;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
      }, (err) => next(err))
      .catch(err => next(err));
    }
  }, (err) => next(err))
  .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
  Favorites.findOne({owner : req.user })
  .then((fav) => {
    if (fav) {
      var dishIndex = fav.favoriteDishes.indexOf(req.params.dishId) ;
      if (dishIndex > -1) {
        fav.favoriteDishes.splice(dishIndex , 1) ;
      }
      fav.save()
      .then((resp) => {
        res.statusCode = 200 ;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
      },(err) =>next(err))
      .catch((err) => next(err));
    }
    else {
      res.statusCode = 404 ;
      res.setHeader('Content-Type','text/plain');
      res.end('favorite list not found');
    }
  },(err) =>next(err))
  .catch((err)=> next(err));
});


module.exports = favoriteRouter;
