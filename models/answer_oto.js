"use strict";
module.exports = (sequelize, DataTypes) => {
  const answer_oto = sequelize.define(
    "answer_oto",
    {
      id_que: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {}
  );
  answer_oto.associate = function (models) {
    // Định nghĩa mối quan hệ nếu có
  };
  return answer_oto;
};
