'use strict';
const { Model } = require('sequelize');
const { generatePassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	User.init(
		{
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: {
					args: true,
					msg: 'Email already registered',
				},
				validate: {
					isEmail: {
						args: true,
						msg: 'Email format is invalid',
					},
					notEmpty: {
						args: true,
						msg: 'Email cannot empty',
					},
					notNull: {
						args: true,
						msg: 'Email cannot null',
					},
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: {
						args: true,
						msg: 'Password cannot empty',
					},
					notNull: {
						args: true,
						msg: 'Password cannot null',
					},
					minLength(value) {
						if (value.length < 6) {
							throw new Error('Password must be minimal 6 characters');
						}
					},
				},
			},
			role: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'User',
		}
	);
	User.beforeCreate((user, options) => {
		user.password = generatePassword(user.password);
		user.role = 'customer';
	});
	return User;
};
