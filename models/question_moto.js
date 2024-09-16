'use strict';
module.exports = (sequelize, DataTypes) => {
  const question_moto = sequelize.define('question_moto', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true  // Cho phép null
    }
  }, {});
  question_moto.associate = function(models) {
    // Định nghĩa mối quan hệ nếu có
  };
  return question_moto;
};
