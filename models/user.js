const
  mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  UserSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true, //prevents duplicates
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    favoriteBook: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    }
  });
  
  // authenticate input against database documents
  UserSchema.statics.authenticate = (email, password, fn) => {
    User.findOne({ email })
      .exec((error, user) => {
        if (error) {
          return fn(error);
        } else if (!user) {
          let err = new Error ('User not found.');
          err.status = 401;
          return fn(err);
        }
        bcrypt.compare(
          password,
          user.password, 
          (error, result) => {
            if (result === true) {
              return fn(null, user);
            } else {
              return fn();
            }
          }
        );
      });
  };
  // hash password before saving to database
  UserSchema.pre('save', function(next) {
    const user = this;
    bcrypt.hash(user.password, 10, (err, hash) => {
      console.log(user.password);
      if (err) {return next(err);}
      user.password = hash;
      next();
    });
  });
 
const User = mongoose.model('User', UserSchema);
  
module.exports = User;