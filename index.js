import express from 'express'
import 'pug'
import morgan from 'morgan'
import bodyParser from 'body-parser'

const app = express()
app.set('view engine', 'pug')

// app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/client', express.static('./client'))

let toggle = true

export default config => {
  app.get('/', (req, res) => {
    const { partial } = req.query
    res.render(partial ? 'form' : 'index', { toggle })
  })

  app.post("/toggle", (req, res) => {
    const { partial } = req.query

    toggle = (req.body.toggle === 'true')

    if (partial) {
      res.render('form', { toggle })
    } else {
      res.redirect('/')
    }
  })

  return app
}
