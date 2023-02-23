'use strict';
const {
  Model
} = require('sequelize');
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
      Membership.belongsTo(models.Group,  { as: "Members",
        foreignKey: 'groupId'
      })
    }
  }
  Membership.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
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
      allowNull: true,
    }
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
