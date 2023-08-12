import { Router } from 'express'
import * as functionBank from './functionBank.js'

const router = Router()

export default router

router.get('/ufos', async (req, res, next) => {
  try {
    const ufoData = await functionBank.getAllUFOData()
    res.render('homepage', { ufoData: ufoData.ufoSightings })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const ufoDetails = await functionBank.getSightingById(id)
    res.render('details', ufoDetails)
  } catch (err) {
    if (err.code === 404) {
      res.sendStatus(404)
      return
    }

    next(err)
  }
})

router.get('/edit/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const ufoDetails = await functionBank.getSightingById(id)
    res.render('edit', ufoDetails)
  } catch (err) {
    next(err)
  }
})

router.post('/edit/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const {
      dateOfSighting,
      nameOfPersonReporting,
      location,
      briefDescription,
      image,
    } = req.body
    const updatedSighting = {
      dateOfSighting,
      nameOfPersonReporting,
      location,
      briefDescription,
      image,
    }
    await functionBank.editSighting(updatedSighting)
    res.redirect('/' + id)
  } catch (err) {
    if (err.code === 404) {
      res.sendStatus(404)
      return
    }

    next(err)
  }
})
