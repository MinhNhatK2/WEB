'use strict';
module.exports = (sequelize, DataTypes) => {
  const question_oto = sequelize.define('question_oto', {
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
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true  // Cho phép null
    }
  }, {});
  question_oto.associate = function(models) {
    // Định nghĩa mối quan hệ nếu có
  };
  return question_oto;
};
