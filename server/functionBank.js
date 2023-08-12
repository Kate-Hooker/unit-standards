import fs from 'node:fs/promises'
import * as Path from 'node:path'
const filepath = Path.resolve('./server/data/data.json')

export async function getAllUFOData() {
  const contents = await fs.readFile(filepath, 'utf-8')
  return JSON.parse(contents)
}

export async function getSightingById(id) {
  const sightingData = await getAllUFOData()
  const sightingDetails = sightingData.ufoSightings.find((ufo) => ufo.id === id)
  if (!sightingDetails) {
    const error = new Error('ID not found')
    error.code = 404
    throw error
  }

  return sightingDetails
}

export async function editSighting(sighting) {
  const sightingData = await getAllUFOData()
  const updatedSighting = sightingData.ufoSightings.find(
    (ufo) => ufo.id === sighting.id
  )
  if (!updatedSighting) {
    const error = new Error('ID not found')
    error.code = 404
    throw error
  }
}
