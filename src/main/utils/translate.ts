const y18n = require('y18n')

const __ = y18n({
  locale: process.env.LC_ALL || process.env.LC_MESSAGES || process.env.LANG || process.env.LANGUAGE,
  updateFiles: false,
}).__

export { __ }
