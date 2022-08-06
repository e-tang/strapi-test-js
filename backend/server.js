const strapi = require('@strapi/strapi');
const path = require('path')
strapi({dir: path.resolve(__dirname, 'dist')}).start();