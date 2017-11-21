const Sequelize = require("sequelize");
const shortid = require("shortid");

const sequelize = new Sequelize("test", "root", "pendrive", {
	host: "localhost",
	dialect: "mysql",
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
	dialectOptions: {
		supportBigNumbers: true,
		bigNumberStrings: true
	},
	replication: {
		read: [{ host: "localhost", username: "root", password: "pendrive" }],
		write: { host: "localhost", username: "root", password: "pendrive" }
	},
	operatorsAliases: false,
	logging: console.log
});

const memberSchema = {
	id: {
		type: Sequelize.STRING,
		allowNull: false,
		primaryKey: true,
		defaultValue: () => {
			return shortid.generate();
		}
	},
	password: { type: Sequelize.STRING },
	locale: { type: Sequelize.STRING },
	birthPlace: {
		type: Sequelize.GEOMETRY("POINT")
	}
};

const Member = sequelize.define("Member", memberSchema, {
	freezeTableName: true // Model tableName will be the same as the model name
});

const data = [{ locale: "ENGLISH" }, { locale: "HINDI" }, { locale: "THAI" }];

sequelize
	.sync({ force: true })
	.then(() => {
		return Member.bulkCreate(data);
	})
	.then(() => {
		return Member.findAll({});
	})
	.then(
		members => {
			console.log(members);
		},
		err => {
			console.error(err);
		}
	);
