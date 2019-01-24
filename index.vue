<template>
  <div class="uploader-container">
    <div>
      <form id="iform" method="POST" :action="uploadUrl" enctype="multipart/form-data" target="upload">
        <input name="file" type="file"/>
        <input v-show="false" name="token" type="text" :value="token"/>
        <button type="submit">{{ btnText }}</button>
      </form>
      <iframe id="upload" name="upload" width="1px" height="1px"></iframe>
    </div>
    <div v-if="displayUploaded">
      <h3 class="list-name">已上传列表：</h3>
      <p v-if="!uploadList || uploadList.length <= 0" class="empty">暂无文件</p>
      <div v-if="uploadList && uploadList.length > 0" v-for="(link, index) in originList" :key="index">
        <i class="el-icon-delete delete-file" @click="handleDeleteFile(index)"/>
        <a class="link" :href="`${link}`">
          {{ link }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Uploader',
  props: {
    limit: {
      type: Number,
      default: 300
    },
    uploadUrl: {
      type: String,
      default: ''
    },
    originList: {
      type: Array,
      default: () => {
        return []
      }
    },
    valueKey: {
      type: String,
      default: ''
    },
    displayUploaded: {
      type: Boolean,
      default: true
    },
    btnText: {
      type: String,
      default: '上传文件'
    }
  },
  data () {
    return {
      fileList: [],
      uploadList: [],
      file: {},
      token: localStorage.getItem('token')
    }
  },
  watch: {
    originList (originList, oldValue) {
      if (this.originList && this.originList.length > 0) {
        this.uploadList = this.originList
      }
    }
  },
  methods: {
    handleDeleteFile (idx) {
      if (idx > -1) {
        const uploadList = [ ...this.uploadList ]
        uploadList.splice(idx, 1)
        this.uploadList = uploadList
        this.$emit('change', uploadList, this.valueKey)
      }
    },
    parseIframeResponse () {
      const elm = document.getElementById('upload').contentWindow.document.getElementsByTagName('pre')[0]
      const response = elm ? elm.innerHTML : null
      if (!response) {
        return false
      }

      try {
        const jsonStr = JSON.parse(response)
        const obj = JSON.parse(jsonStr)
        if (obj.data && obj.ok) {
          const uploadList = [
            ...this.uploadList,
            obj.data
          ]
          this.$emit('change', uploadList, this.valueKey)
          this.uploadList = uploadList
        }

        if (obj.ok) {
          this.$message({
            type: 'success',
            message: `上传成功${obj.message ? `：${obj.message}` : ''}`
          })
        } else {
          this.$message.error(obj.message)
        }
      } catch (err) {
        this.$message.error('不接受的文件格式或网络出错，请重试。')
        console.log(err)
      }
    }
  },
  mounted () {
    if (this.originList && this.originList.length > 0) {
      this.uploadList = this.originList
    }

    document.getElementById('#upload').addEventListener('load', () => {
      this.parseIframeResponse()
    })
  }
}
</script>

<style scoped>
  .uploader-container {
    width: 100%;
  }

  .list-name {
    margin: 0;
    line-height: 26px;
    color: gray;
  }

  .empty {
    font-size: 12px;
    color: #DCDFE6;
  }

  .link {
    display: block;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    display: inline;
    text-decoration-line: none;
  }

  #iform {
    position: relative;
  }

  #upload {
    position: absolute;
    left: -2px;
    top: -2px;
  }

  .delete-file {
    display: inline-block;
    margin-right: 12px;
    text-decoration: none;
    color: red;
    cursor: pointer;
  }
</style>
