'use strict';
const {
  Model, DATE
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsTo(
        models.User,
        { foreignKey: 'organizerId' }
      )
      Group.belongsToMany(models.User, {
        through: models.Membership
      })
      Group.hasMany(models.GroupImage, {
        foreignKey: "groupId",
        onDelete: 'CASCADE'
      })
      Group.hasMany(models.Venue, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE'
      })
      Group.hasMany(models.Event, {foreignKey: "groupId", onDelete: 'CASCADE'});

      Group.hasMany(models.Membership, {as: 'Members',foreignKey: "groupId"});
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE"
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    about: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Group',
    defaultScope: {
      attributes: {
        exclude: ["groupId", "updatedAt", "createdAt"]
      }
    },
    scopes: {
      getMembers: {
        attributes: {
          exclude: ["updatedAt", "createdAt", "state", "city", "private", "type", "about", "name", "organizerId", "id"]
        }
      }
    }
  });
  return Group;
};
