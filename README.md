# ie9-uploader-vue
基于vue的ie9上传组件

这是我在工作中遇到的element ui中的uploader组件在ie9下无法使用的解决方案，用表单加iframe的方式来模拟ajax文件上传。

## 使用方法
`<custom-uploader v-if="item.type === 'upload'" needName @change="handleItemChange" :originList="value[item.prop]" :valueKey="item.prop"/>`
