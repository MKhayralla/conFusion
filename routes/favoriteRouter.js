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
    if (fav !== null) {
      for (var i = 0; i < list.length; i++) {
        if(fav.favoriteDishes.indexOf(list[i]) == -1){
          fav.favoriteDishes = fav.favoriteDishes.concat(list[i]);
        };
      };
      Favorites.findByIdAndUpdate(fav._id,{favoriteDishes : fav.favoriteDishes},{new : true})
      .then(() => next() , (err) => next(err))
      .catch((err)=>next(err));
    }
    else {
      Favorites.create({ owner : req.user , favoriteDishes : list})
    };
    res.statusCode = 200 ;
    res.setHeader('Content-Type','application/json') ;
    res.json({favListUpdatedWith : list}) ;
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
    if (fav !== null){
      if(fav.favoriteDishes.indexOf(req.params.dishId) == -1){
      fav.favoriteDishes = fav.favoriteDishes.concat(req.params.dishId);
      Favorites.findByIdAndUpdate(fav._id,{favoriteDishes : fav.favoriteDishes})
      .then(() => next() , (err) => next(err))
      .catch((err)=>next(err));
      };
    }
    else {
      Favorites.create({owner : req.user , favoriteDishes : req.params.dishId}) ;
    }
    res.statusCode = 200 ;
    res.setHeader('Content-Type','application/json');
    res.json({added : req.params.dishId});
  }, (err) => next(err))
  .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
  Favorites.findOne({owner : req.user })
  .then((fav) => {
    if (fav !== null) {
      var dishIndex = fav.favoriteDishes.indexOf(req.params.dishId) ;
      if (dishIndex !== -1) {
        fav.favoriteDishes.splice(dishIndex , 1) ;
      }
      Favorites.findByIdAndUpdate(fav._id , {$set : {favoriteDishes : fav.favoriteDishes}},{new : true})
      .then(() =>next(),(err) =>next(err))
      .catch((err) => next(err));
    }
    res.statusCode = 200 ;
    res.setHeader('Content-Type','application/json');
    res.json({deleted : req.params.dishId});
  },(err) =>next(err))
  .catch((err)=> next(err));
});


module.exports = favoriteRouter;
