const mongoose = require('mongoose');

const Schema = mongoose.Schema ;

const favoriteSchema = new Schema({
  owner : {
    type : mongoose.Schema.Types.ObjectId ,
    ref : 'User'
  },
  favoriteDishes : [{
    type : mongoose.Schema.Types.ObjectId ,
    ref : 'Dish'
  }]
},{
  timestamps : true
});

module.exports = mongoose.model('Favorite',favoriteSchema) ;
