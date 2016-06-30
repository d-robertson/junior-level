'use strict';
module.exports = function(sequelize, DataTypes) {
  var job = sequelize.define('job', {
    title: DataTypes.STRING,
    company: DataTypes.STRING,
    location: DataTypes.STRING,
    url: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.job.belongsToMany(models.user, {through: "usersJobs"});
      }
    }
  });
  return job;
};