<template>
  <div>
    <div class="thumb">
      <img :src='defaultUrl?defaultUrl:"/static/img/thumb_fakeimg.png"' alt="">
    </div>
    <el-button type="info" @click="uploadHandle()">上传图片</el-button>
    <!-- 弹窗, 上传文件 -->
    <upload v-if="uploadVisible" ref="upload" @uploadSuccess="uploadSuccess" @removeFile="removeFile" :mimeType="mimeType" :limit="1" :uploadDomain="uploadDomain"></upload>
  </div>
</template>

<script>
import Upload from "@/components/upload";
export default {
  props: {
    mimeType: String,
    defaultUrl: String,
    uploadDomain: String
  },
  components: { Upload },
  data() {
    return {
      url: "",
      uploadVisible: false
    };
  },
  computed: {
    thumbUrl() {
      let url;
      switch (true) {
        case this.url != "":
          url = this.url;
          break;
        case this.defaultUrl != "" && this.url == "":
          url = this.defaultUrl;
          break;
        default:
          url = "/static/img/thumb_fakeimg.png";
          break;
      }
      return url;
    }
  },
  methods: {
    // 上传文件
    uploadHandle() {
      this.uploadVisible = true;
      this.$nextTick(() => {
        this.$refs.upload.init();
      });
    },
    //上传成功
    uploadSuccess(info) {
      this.url = info.url;
      this.$emit("uploadSuccess", info.url);
    },
    //移除上传文件
    removeFile(info) {
      this.url = "";
      this.$emit("removeThumb", info.url);
    }
  }
};
</script>

<style lang="scss">
.thumb {
  width: 260px;
  height: 145px;
  overflow: hidden;
  margin-bottom: 10px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
