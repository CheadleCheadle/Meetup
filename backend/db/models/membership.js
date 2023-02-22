'use strict';
const {
  Model
} = require('sequelize');
const { all } = require('underscore');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Membership.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      Membership.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })
    }
  }
  Membership.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Membership',
    scopes: {
      currentUserScope: {
        attributes: { exclude: ['userId', 'groupId', 'status', 'createdAt', 'updatedAt']}
      }
    }
  });
  return Membership;
};
