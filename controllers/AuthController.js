const User = require('../models/User')

const bcrypt = require('bcryptjs')

module.exports = class Authcontroller {

    static login (req, res){
        res.render('auth/login')
    }

    static async loginPost(req, res){
        const {email, password} = req.body

        //find user (verificação se o usuário existe)
        const user = await User.findOne({where:{email: email}})

        if(!user){
            req.flash('message', 'Usuário não cadastrado')
            res.render('auth/login')
            return
        }

        //descriptofia da senha e comparação
        const userMathPassword = bcrypt.compareSync(password, user.password)

        if(!userMathPassword){

            req.flash('message', 'Senha incorreta')
            res.render('auth/login')
            return
        }

        req.session.userid = user.id

            req.flash('message', `Olá ${user.name}`)

            req.session.save(()=>{
                res.redirect('/')
            })

    }

    static register (req, res){
        res.render('auth/register')
    }

    static async registerPost(req, res){
        const {name, email, password, confirmpassword} = req.body

        //password match validation
        if(password != confirmpassword){
            req.flash('message', 'As senhas não conferem, tente novamente')
            res.render('auth/register')
            return
        }

        //Check user exist
        const checkUserExist = await User.findOne({where:{email:email}})
        if(checkUserExist){
            req.flash('message', 'Email já cadastrado')
            res.render('auth/register')
            return
        }

        //create Password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        //create object user
        const user = {
            name,
            email,
            password: hashedPassword
        }

        //create user database 
        try {
            const createdUser = await User.create(user)

            //initialize session
            req.session.userid = createdUser.id

            req.flash('message', 'Usuário cadastrado')

            req.session.save(()=>{
                res.redirect('/')
            })
        } catch (error) {
            console.log(error)
        }
    }

    static logout (req, res){
        req.session.destroy()
        res.redirect('/login')
    }
}