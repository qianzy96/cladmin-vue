<template>
  <el-dialog title="上传文件" :close-on-click-modal="false" @close="closeHandle" :visible.sync="visible">
    <el-upload ref="upload" drag :action="url" :before-upload="beforeUploadHandle" multiple :headers="headers" :http-request="uploadToOss" :on-remove="removeHandle" :accept="accept" :limit="limit" style="text-align: center;">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">{{uploadTip}}</div>
    </el-upload>
  </el-dialog>
</template>

<script>
import { getUUID } from "@/utils";
export default {
  props: {
    mimeType: String,
    limit: Number
  },
  data() {
    return {
      visible: false,
      url: "",
      accept: "",
      headers: {
        Authorization: `Bearer ${this.$cookie.get("token")}`
      },
      num: 0,
      successNum: 0,
      AllowMimeType: [],
      uploadTip: ""
    };
  },
  methods: {
    init(id) {
      this.visible = true;
      let mimeType = [];
      switch (this.mimeType) {
        case "images":
          this.accept = "image/*";
          mimeType = ["jpeg", "jpg", "png", "gif"];
          this.uploadTip = `请上传 ${mimeType.join(",")} 格式文件`;
          mimeType.forEach((value, index) => {
            this.AllowMimeType.push(`image/${value}`);
          });
          break;
        case "videos":
          this.accept = "video/*";
          mimeType = ["mp4", "mov", "mpg", "avi"];
          this.uploadTip = `请上传 ${mimeType.join(",")} 格式文件`;
          mimeType.forEach((value, index) => {
            this.AllowMimeType.push(`video/${value}`);
          });
          break;
        case "audios":
          this.accept = "audio/*";
          mimeType = ["mp4", "mp3"];
          this.uploadTip = `请上传 ${mimeType.join(",")} 格式文件`;
          mimeType.forEach((value, index) => {
            this.AllowMimeType.push(`audio/${value}`);
          });
          break;
        default:
      }
    },
    // 上传之前
    beforeUploadHandle(file) {
      let fileTypeAllow = this.AllowMimeType.find(v => {
        return v === file.type;
      });
      if (!fileTypeAllow) {
        this.$message.error(this.uploadTip);
        return false;
      }
      this.num++;
    },
    uploadToOss(e) {
      let pro = new Promise((resolve, rej) => {
        let res = JSON.parse(this.$cookie.get("aliyunOSSSign"));
        let now = Date.parse(new Date()) / 1000;
        if (res && res.expire - 3 > now) {
          resolve(res);
        } else {
          let oAjax = new XMLHttpRequest();
          oAjax.open(
            "GET",
            this.$http.createUrl("/oss/generatesignature"),
            false
          ); //false表示同步请求
          oAjax.onreadystatechange = () => {
            if (oAjax.readyState == 4 && oAjax.status == 200) {
              this.$cookie.set("aliyunOSSSign", oAjax.responseText);
              let data = JSON.parse(oAjax.responseText);
              resolve(data);
            } else {
              reject(new Error("fail"));
            }
          };
          oAjax.send();
        }
      });
      pro.then(OSSSign => {
        let ossData = new FormData();
        ossData.append(
          "key",
          `${OSSSign.dir}${getUUID()}.${e.file.name.split(".").pop()}`
        );
        ossData.append("policy", OSSSign.policy);
        ossData.append("OSSAccessKeyId", OSSSign.accessid);
        ossData.append("signature", OSSSign.signature);
        ossData.append("file", e.file, e.file.name);
        this.$http
          .postUploadFileToOSS(OSSSign.host, ossData, progress => {
            e.onProgress({ percent: progress });
          })
          .then(({ data }) => {
            e.file.url = `${OSSSign.host}/${ossData.get("key")}`;
            e.file.mimeType = this.mimeType;
            let info = {
              mimeType: this.mimeType,
              url: `${OSSSign.host}/${ossData.get("key")}`
            };
            this.$emit("uploadSuccess", info);
          });
      });
    },
    removeHandle(file) {
      let info = {
        mimeType: file.raw.mimeType,
        url: file.raw.url
      };
      this.$emit("removeFile", info);
    },
    clearFiles() {
      this.$refs.upload.clearFiles();
    },
    // 弹窗关闭时
    closeHandle() {
      this.$emit("closeHandle");
    }
  }
};
</script>
