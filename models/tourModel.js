const mongoose = require('mongoose');

// eslint-disable-next-line import/no-extraneous-dependencies
const slugify = require('slugify')

const tourSchema = new mongoose.Schema({
  name:{
      type: 'string',
      required: [true, 'A tour must have a name'],
      unique: true
    },
    slug: String,
    duration:{
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize:{
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    ratingsQuantity:{
      type: Number,
      default: 0
    },
    difficulty:{
      type: String,
      required: [true, 'A tour must have a difficulty']
    },
    priceDiscount:Number,
    ratingsAverage:{
      type: Number,
      default: 4.5
    },
    price:{
      type: Number,
      required: [true, 'A tour must have a price']
    },
    summary:{
      type: String,
      trim: true
    },
    description:{
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    imageCover:{
      type: String,
      required: [true, 'A tour must have a image cover']
    },
    images: [String],
    createdAt:{
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    SecretTour: {
      type: Boolean,
      default: false
    }
},
{
  toJSON: {virtuals: true},
  toObject : {virtuals: true}
});


tourSchema.virtual('durationWeeks').get(function(){
  return this.duration/7;
})


//Document Middleware
tourSchema.pre('save', function(next){
  this.slug = slugify(this.name, { lower: true});
  next();
})

// // eslint-disable-next-line prefer-arrow-callback
// tourSchema.pre('save', function(next){
//   console.log('will save document...');
//   next();
// })

// // eslint-disable-next-line prefer-arrow-callback
// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// })


//Query Middleware


// eslint-disable-next-line prefer-arrow-callback
// tourSchema.pre('find', function(next){
tourSchema.pre(/^find/, function(next){
  this.find({SecretTour: {$ne:true}})
  this.start = Date.now();
  next();
})

// eslint-disable-next-line prefer-arrow-callback
tourSchema.post(/^find/, function(docs,next){
  console.log(`Query took ${Date.now() - this.start} ms`)
  
  next();
})


//Agregation Middleware
tourSchema.pre('aggregate', function(next){

  this.pipeline().unshift({$match: {SecretTour: {$ne: true}}})
  console.log(this.pipeline());
  next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
