const y18n = require('y18n')

const getEnvLocale = () => {
  const { env } = process
  return env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE
}

const y18nConfig = { locale: getEnvLocale(), updateFiles: false }

const __ = y18n(y18nConfig).__

export { __ }
