'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stores extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Reviews, {
        sourceKey: 'storeId',
        foreignKey: 'storeId',
      });
      this.hasMany(models.Menus, {
        sourceKey: 'storeId',
        foreignKey: 'storeId',
      });
      this.belongsTo(models.Users, {
        targetKey: 'userId',
        foreignKey: 'userId',
      });
      this.hasMany(models.Orders, {
        sourceKey: 'storeId',
        foreignKey: 'storeId',
      });
    }
  }
  Stores.init(
    {
      storeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,

        type: DataTypes.INTEGER,
      },
      storeName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      storeAddress: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      // storeSales: {
      //   allowNull: false,
      //   defaultValue: 0,
      //   type: DataTypes.INTEGER,
      // },
      storeUrl: {
        type: DataTypes.STRING,
      },
      storeRating: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'Stores',
    }
  );
  return Stores;
};
