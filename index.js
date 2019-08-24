const uploader = require('./index.vue')

uploader.install = function (Vue) {
  Vue.component('ie9-uploader', uploader)
}

module.exports = uploader
}
