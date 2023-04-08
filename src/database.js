import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = []

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then((data) => (this.#database = JSON.parse(data)))
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(search) {
    if (search) {
      return this.#database.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return this.#database
  }

  selectOne(id) {
    return this.#database.find((item) => item.id === id)
  }

  insert(payload) {
    this.#database.push(payload)
    this.#persist()
  }

  delete(id) {
    const index = this.#database.findIndex((item) => item.id === id)
    this.#database.splice(index, 1)
    this.#persist()
  }

  update(id, payload) {
    const index = this.#database.findIndex((item) => item.id === id)
    this.#database[index] = { ...this.#database[index], ...payload }
    this.#persist()
  }

  completed(id) {
    const index = this.#database.findIndex((item) => item.id === id)
    this.#database[index] = {
      ...this.#database[index],
      completed_at: new Date().toISOString()
    }
    this.#persist()
  }
}
