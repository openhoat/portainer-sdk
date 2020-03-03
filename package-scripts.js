const { join, relative } = require('path')
const { concurrent, series } = require('nps-utils')
const { jestOpts } = require('./helper')
const { name, version } = require('./package.json')

const baseDir = relative(process.cwd(), __dirname) || '.'

const scripts = {
  beautify: {
    default: {
      description: 'List files to be beautified',
      script: 'prettier -l "src/**/*.{js,ts}"',
    },
    fix: {
      description: 'Beautify source files',
      script: 'prettier --write "src/**/*.{js,ts}"',
    },
  },
  build: {
    default: {
      description: 'Transpile ts sources',
      script: 'tsc',
    },
    watch: {
      description: 'Transpile ts sources in watch mode',
      script: 'tsc -w',
    },
    main: {
      default: {
        description: 'Transpile main ts sources',
        script: `tsc -b ${join(baseDir, 'src')}/main/tsconfig.json`,
      },
      watch: {
        description: 'Transpile main ts sources in watch mode',
        script: `tsc -w -b ${join(baseDir, 'src')}/main/tsconfig.json`,
      },
    },
  },
  clean: {
    coverage: {
      description: 'Clean all coverage files',
      script: `rimraf '${join(baseDir, 'doc')}/coverage'`,
    },
    default: {
      description: 'Clean generated files',
      script: concurrent.nps('clean.dist', 'clean.package', 'clean.public', 'clean.coverage'),
    },
    dist: {
      description: 'Clean all dist generated files',
      script: `rimraf '${join(baseDir, 'dist')}/**'`,
    },
    package: {
      description: 'Clean package files',
      script: `rimraf '${baseDir}/*.tgz' '${join(baseDir, 'package')}/**'`,
    },
    public: {
      description: 'Clean public folder',
      script: `rimraf '${join(baseDir, 'public')}/**'`,
    },
  },
  cover: {
    default: {
      description: 'Run tests coverage',
      script: `jest ${jestOpts('all')} --coverage`,
    },
    e2e: {
      default: {
        description: 'Run e2e tests coverage',
        script: `jest ${jestOpts('e2e')} --coverage -c src/test/e2e/jest.config.js`,
      },
      open: {
        description: 'Open tests e2e coverage report',
        script: `open-cli ${join(baseDir, 'dist')}/coverage/e2e/index.html`,
      },
    },
    integration: {
      default: {
        description: 'Run integration tests coverage',
        script: `jest ${jestOpts('integration')} --coverage -c src/test/integration/jest.config.js`,
      },
      open: {
        description: 'Open tests integration coverage report',
        script: `open-cli ${join(baseDir, 'dist')}/coverage/integration/index.html`,
      },
      watch: {
        description: 'Run integration tests coverage watch',
        script: [
          'jest',
          '--coverage',
          '--watchAll',
          jestOpts('integration'),
          '-c src/test/integration/jest.config.js',
        ].join(' '),
      },
    },
    open: {
      description: 'Open tests coverage report',
      script: `open-cli ${join(baseDir, 'dist')}/coverage/index.html`,
    },
    unit: {
      default: {
        description: 'Run unit tests coverage',
        script: `jest ${jestOpts('unit')} --coverage -c src/test/unit/jest.config.js`,
      },
      open: {
        description: 'Open tests unit coverage report',
        script: `open-cli ${join(baseDir, 'dist')}/coverage/unit/index.html`,
      },
      watch: {
        description: 'Run tests coverage watch',
        script: [
          'jest',
          '--coverage',
          '--watchAll',
          jestOpts('unit'),
          '-c src/test/unit/jest.config.js',
        ].join(' '),
      },
    },
  },
  deps: {
    default: {
      description: 'check dependencies',
      script: 'nps deps.usage',
    },
    update: {
      description: 'update outdated dependencies',
      script: 'ncu -u',
    },
    usage: {
      description: 'check dependencies usage',
      script: `depcheck --ignore-bin-package=true --ignores="${[
        '@types/*',
        'jest-extended',
        'main',
      ].join(',')}" ${baseDir}`,
    },
    version: {
      description: 'check dependencies versions',
      script: 'npm outdated -l',
    },
  },
  lint: {
    default: {
      description: 'Lint TypeScript sources',
      script: `tslint -p ${baseDir}`,
    },
  },
  pack: {
    assets: {
      description: 'Copy project assets',
      script: [
        'copy',
        'package.json',
        'package-lock.json',
        'README.md',
        '.npmignore',
        '"dist/main/**"',
        '"bin/**"',
        `${join(baseDir, 'dist')}/package/`,
      ].join(' '),
    },
    create: {
      description: 'Create project tarball',
      script: `cd ${join(baseDir, 'dist')}/package && npm pack`,
    },
    default: {
      description: 'Build project package',
      script: series.nps('build', 'pack.assets', 'pack.create'),
    },
    extract: {
      description: 'Extract package tarball',
      script: [
        'tar',
        'zxf',
        `${join(baseDir, 'dist')}/package/${name}-${version}.tgz`,
        `-C ${join(baseDir, 'dist')}/`,
        '--unlink-first',
        '--recursive-unlink',
      ].join(' '),
    },
  },
  publish: {
    default: {
      description: 'Create and publish project package to NPM registry',
      script: series.nps('build', 'pack.assets', 'publish.npm'),
    },
    npm: {
      description: 'Publish project package to NPM registry',
      script: `cd ${join(baseDir, 'dist')}/package && npm publish`,
    },
  },
  test: {
    default: {
      description: 'Run tests',
      script: `jest ${jestOpts('all')}`,
    },
    e2e: {
      default: {
        description: 'Run e2e tests',
        script: `jest ${jestOpts('e2e')} -c src/test/e2e/jest.config.js`,
      },
    },
    integration: {
      default: {
        description: 'Run integration tests',
        script: `jest ${jestOpts('integration')} -c src/test/integration/jest.config.js`,
      },
      update: {
        description: 'Run integration tests updating snapshots',
        script: `jest ${jestOpts('integration')} -u -c src/test/integration/jest.config.js`,
      },
      watch: {
        description: 'Run integration tests watch',
        script: `jest ${jestOpts('integration')} --watchAll -c src/test/integration/jest.config.js`,
      },
    },
    unit: {
      default: {
        description: 'Run unit tests',
        script: `jest ${jestOpts('unit')} -c src/test/unit/jest.config.js`,
      },
      update: {
        description: 'Run unit tests updating snapshots',
        script: `jest ${jestOpts('unit')} -u -c src/test/unit/jest.config.js`,
      },
      watch: {
        description: 'Run unit tests watch',
        script: `jest ${jestOpts('unit')} --watchAll -c src/test/unit/jest.config.js`,
      },
    },
    update: {
      description: 'Run tests updating snapshots',
      script: `jest ${jestOpts('all')} -u`,
    },
    watch: {
      description: 'Run tests watch',
      script: `jest ${jestOpts('all')} --watchAll`,
    },
  },
  validate: {
    default: {
      description: 'validate project',
      script: series.nps('clean', 'build', 'lint', 'cover'),
    },
    unit: {
      description: 'validate project commit',
      script: series.nps('clean', 'build', 'lint', 'cover.unit'),
    },
  },
}

module.exports = { scripts }
