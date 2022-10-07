const Sequelize = require('sequelize')

const sequelize = new Sequelize('tought', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('conectado ao banco de dados')
} catch (error) {
    console.log(error)
}

module.exports = sequelize