import fs from 'node:fs/promises'
import * as Path from 'node:path'
const filepath = Path.resolve('./server/data/data.json')

export async function getAllUFOData() {
  const contents = await fs.readFile(filepath, 'utf-8')
  return JSON.parse(contents)
}

export async function getSightingById(id) {
  const sightingData = await getAllUFOData()
  const sightingDetails = sightingData.ufoSightings.find((ufo) => ufo.id === id) // Very elegant.
  if (!sightingDetails) {
    const error = new Error('ID not found')
    error.code = 404
    throw error
  }

  return sightingDetails
}

export async function editSighting(sighting) {
  const sightingData = await getAllUFOData()
  const index = sightingData.ufoSightings.findIndex(
    (ufo) => ufo.id === sighting.id
  )

  if (index === -1 || index >= sightingData.ufoSightings.length) {
    const error = new Error('Invalid ID')
    error.code = 404
    throw error
  }

  sightingData.ufoSightings[index] = {
    ...sightingData.ufoSightings[index],
    ...sighting,
  } // Also very nice! Excellent use of spread and square bracket notation.

  await fs.writeFile(filepath, JSON.stringify(sightingData, null, 2), 'utf-8')
}
