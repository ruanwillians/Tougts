const express = require('express')
const router = express.Router()
const ToughtsController = require('../controllers/ToughtsController')

// import helpers (midleware)
const CheckAuth = require('../helpers/auth').checkAuth

router.get('/dashboard', CheckAuth, ToughtsController.dashboard)
router.get('/add', CheckAuth, ToughtsController.createTought)
router.get('/edit/:id', CheckAuth, ToughtsController.updateTought)
router.post('/edit/:id', CheckAuth, ToughtsController.updateToughtSave)
router.post('/add', CheckAuth, ToughtsController.createToughtSave)
router.post('/remove', CheckAuth, ToughtsController.removeTought)
router.get('/', ToughtsController.showToughts)

module.exports = router
