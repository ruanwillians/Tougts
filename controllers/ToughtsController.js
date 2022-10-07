const { raw } = require('express')
const Tought = require('../models/Tougth')
const User = require('../models/User')
const {Op, where} = require('sequelize')

module.exports = class ToughtsController{

    static async showToughts(req,res){

        let search = ''

        if(req.query.search){
            search = req.query.search
        }

        let order = 'DESC'

        if(req.query.order === 'old'){
            order = 'ASC'
        } else {
            order = 'DESC'
        }

        const tought = await Tought.findAll({
            include: User,
            where:{
                title:{[Op.like]: `%${search}%`},
            },
            order:[['createdAt', order]]
        })

        const toughts = tought.map((result)=> result.get({plain: true}))

        res.render('toughts/home', {toughts, search})
    }

    static async dashboard(req, res){
        const userId = req.session.userid

        const user = await User.findOne({
            where:{
                id:userId
            },
        include: Tought,
        plain: true
        })

        if(!user){
            res.redirect('/login')
        }

        const toughts = user.Tougths.map((result)=> result.dataValues)

        let empty = false

        if(toughts.length === 0){
            empty = true
        }

        res.render('toughts/dashboard', {toughts, empty})
    }

    static createTought(req, res){
        res.render('toughts/add')
    }

    static async createToughtSave(req, res){
        const tought = {
            title: req.body.title,
            UserId: req.session.userid
        }

        try {
            await Tought.create(tought)  
            req.flash('message', 'Pensamento criado com sucesso') 
            req.session.save(()=>{
            res.redirect('/toughts/dashboard',)      
            })
        } catch (error) {
            console.log(error)
        }
    }

    static async removeTought(req, res){
        const id = req.body.id
        const UserId = req.session.userid

        try {
          await Tought.destroy({where:{id:id, UserId:UserId}})  
          req.flash('message', 'Pensamento excluído com sucesso') 
          req.session.save(()=>{
          res.redirect('/toughts/dashboard')
          })
        } catch (error) {
            console.log(error)
        }
    }

    static async updateTought(req, res){
        const id = req.params.id
        
        const tought = await Tought.findOne({where:{id:id}, raw: true})
        
        res.render('toughts/edit', {tought})

    }

    static async updateToughtSave(req, res){
        const id = req.body.id

        const tought = {
            title: req.body.title
        }

        try {
            await Tought.update(tought, {where:{id:id}}) 
            req.flash('message', 'Pensamento editado com sucesso') 
            req.session.save(()=>{
            res.redirect('/toughts/dashboard')
            })
          } catch (error) {
              console.log(error)
          }
    }
}

