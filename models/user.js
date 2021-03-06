'use strict';

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid email address'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 254],
          msg: 'password must be between 8 and 254 chars'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 254],
          msg: 'name must be between 1 and 254 chars'
        }
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        models.user.belongsToMany(models.job, {through: "usersJobs"});
      }
    },
    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      },
      toJSON: function() {
        var jsonUser = this.get();
        delete jsonUser.password;
        return jsonUser;
      }
    },
    hooks: {
      beforeCreate: function(createdUser, options, cb) {
        // hash password and save hash to user
        // console.log(createdUser); hits this one fine.
        console.log(createdUser.password);
        var hash = bcrypt.hashSync(createdUser.password, 10);
        // console.log(hash); //doesn't hit this console log!!!!
        createdUser.password = hash;
        cb(null, createdUser);
      }
    }
  });
  return user;
};
