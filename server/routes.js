import { Router } from 'express'
import * as functionBank from './functionBank.js'
import fs from 'node:fs/promises'
import * as Path from 'node:path'
import multer from 'multer'
const upload = multer({ dest: './images' })

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
    } = req.body
    const ufoData = await functionBank.getAllUFOData()

    if (!ufoData.ufoSightings) {
      const error = new Error('ufoSightings not found')
      error.code = 404
      throw error
    }

    const updatedSighting = ufoData.ufoSightings.find((ufo) => ufo.id === id)

    if (updatedSighting) {
      updatedSighting.dateOfSighting = dateOfSighting
      updatedSighting.nameOfPersonReporting = nameOfPersonReporting
      updatedSighting.location = location
      updatedSighting.briefDescription = briefDescription
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

router.get('/ufos/new', async (req, res) => {
  res.render('report-sightings')
})

router.post('/ufos/new', upload.single('image'), async (req, res) => {
  try {
    const ufoData = await functionBank.getAllUFOData()

    const newSighting = {
      id: ufoData.ufoSightings.length + 1,
      dateOfSighting: req.body.dateOfSighting,
      nameOfPersonReporting: req.body.nameOfPersonReporting,
      location: req.body.location,
      briefDescription: req.body.briefDescription,
      image: req.file.filename,
    }
    ufoData.ufoSightings.push(newSighting)

    const newUfoReport = JSON.stringify(ufoData, null, 2)
    console.log('Writing new data to file...')
    await fs.writeFile(Path.resolve('./server/data/data.json'), newUfoReport)
    console.log('Data successfully written to file.')

    res.redirect('/')
  } catch (err) {
    if (err.code === 404) {
      res.sendStatus(404)
      return
    }
    next(err)
  }
})
