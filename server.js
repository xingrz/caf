'use strict'

const PORT = process.env.PORT || process.env.LEANCLOUD_APP_PORT || 3000
const ENV = process.env.NODE_ENV || 'development'

const APP_ID      = process.env.LEANCLOUD_APP_ID
const APP_KEY     = process.env.LEANCLOUD_APP_KEY
const MASTER_KEY  = process.env.LEANCLOUD_APP_MASTER_KEY

const AV = require('leanengine')

const _ = require('lodash')
const Promise = require('bluebird')

const moment = require('moment')

const express = require('express')
const pug = require('pug')

const rp = require('request-promise').defaults({
  json: true
})

AV.initialize(APP_ID, APP_KEY, MASTER_KEY)
AV.Cloud.useMasterKey()

const Releases = AV.Object.extend('Releases')

function latest() {
  const tz = new Date().getTimezoneOffset()

  return rp
    .get('https://wiki.codeaurora.org/xwiki/rest/wikis/xwiki/spaces/QAEP/pages/release')
    .then(Promise.resolve)
    .then(json => ({
      modifiedAt: new Date(json.modified),
      releases: _.chain(json.content)
        .split('\n')
        .transform((result, line) => {
          const fields = line.split('|')
          if (fields.length == 6) {
            result.push({
              date: moment(new Date(fields[1])).subtract(tz, 'minutes').toDate(),
              tag: fields[2].trim(),
              chipset: fields[3].trim(),
              version: fields[5].trim().split('.').map(Number).join('.')
            })
          }
        })
        .drop(1)
        .value()
    }))
}

function existed() {
  return new AV.Query(Releases)
    .descending('modifiedAt')
    .first()
}

AV.Cloud.define('sync', (request, response) => {
  console.log('start syncing...')
  Promise
    .props({
      latest: latest(),
      existed: existed()
    })
    .then(result => {
      if (result.existed &&
          Number(result.existed.get('modifiedAt')) == Number(result.latest.modifiedAt)) {
        console.log('nothing to sync, latest: %s', result.latest.modifiedAt)
        return null
      } else {
        return new Releases(result.latest).save()
      }
    })
    .then(releases => {
      if (releases) {
        console.log('saved latest %s', releases.get('modifiedAt'))
        response.success('updated')
      } else {
        response.success('synced')
      }
    })
    .catch(e => {
      console.error(e)
      response.error(e)
    })
})

const app = express()

app.enable('trust proxy')

app.set('views', './views')
app.set('view engine', 'pug')

app.use(AV.Cloud)

app.get('/latest', (req, res, error) => {
  if (ENV == 'development') {
    res.set('Access-Control-Allow-Origin', 'http://localhost:8080')
  } else {
    res.set('Access-Control-Allow-Origin', 'http://caf.xingrz.me')
  }

  existed()
    .then(releases => {
      if (!releases) {
        return res.status(404).end()
      }

      const etag = `"${releases.id}"`
      const lastModified = releases.get('modifiedAt')

      const match = req.get('If-None-Match')
      if (match === etag) {
        return res.status(304).end()
      }

      const since = Date.parse(req.get('If-Modified-Since'))
      if (!isNaN(since) && Number(lastModified) <= since) {
        return res.status(304).end()
      }

      res.set('ETag', etag)
      res.set('Last-Modified', lastModified.toGMTString())
      res.json(releases.get('releases'))
    })
})

app.listen(PORT, () => {
  console.log(`server running ${ENV} on ${PORT}`)
})
