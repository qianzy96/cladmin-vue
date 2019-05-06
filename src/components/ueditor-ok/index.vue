<template>
  <div class="mod-demo-ueditor">
    <vue-ueditor-wrap v-model="ueContent" :config="myConfig" @ready="ready" @beforeInit="addCustomUI" :destroy="true"></vue-ueditor-wrap>
    <!-- 弹窗, 上传文件 -->
    <div>
      <upload v-if="uploadVisible" ref="upload" @uploadSuccess="uploadSuccess" :mimeType="mimeType" @closeHandle="uploadCloseHandle"></upload>
    </div>
  </div>
</template>

<script>
import Upload from "@/components/aliyun-oss/upload";
import VueUeditorWrap from "vue-ueditor-wrap";
export default {
  name: "UeditorOk",
  props: {
    frameHeight: Number
  },
  components: {
    Upload,
    VueUeditorWrap
  },
  data() {
    return {
      mimeType: "",
      uploadVisible: false,
      ueditor: null,
      ueContent: "",
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: this.frameHeight,
        // 初始容器宽度
        initialFrameWidth: "100%",
        serverUrl: "",
        toolbars: [
          [
            "fullscreen",
            "source",
            "undo",
            "redo",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "removeformat",
            "formatmatch",
            "autotypeset",
            "blockquote",
            "forecolor",
            "backcolor",
            "rowspacingtop",
            "rowspacingbottom",
            "lineheight",
            "fontsize",
            "indent",
            "justifyleft",
            "justifycenter",
            "justifyright",
            "justifyjustify",
            "link",
            "unlink",
            "foreword",
            "subhead",
            "quote"
          ]
        ]
      },
      dialogVisible: false
    };
  },
  mounted() {},
  methods: {
    ready(editorInstance) {
      this.ueditor = editorInstance;
    },
    addCustomUI(editorId, editorConfig) {
      // 1. 自定义图片上传按钮
      window.UE.registerUI(
        "image-upload-button" + editorId,
        (editor, uiName) => {
          // 创建一个 button
          let btn = new window.UE.ui.Button({
            // 按钮的名字
            name: uiName,
            // 提示
            title: "上传图片",
            // 需要添加的额外样式，可指定 icon 图标，图标路径参考常见问题 2
            cssRules:
              "background-image: url('/static/UEditor/themes/default/images/icons.png') !important;background-position: -726px -77px;",
            // 点击时执行的命令
            onclick: () => {
              // 这里可以不用执行命令，做你自己的操作也可
              this.mimeType = "images";
              this.uploadVisible = true;
              this.$nextTick(() => {
                this.$refs.upload.init();
              });
            }
          });
          // 当点到编辑内容上时，按钮要做的状态反射
          editor.addListener("selectionchange", () => {
            let state = editor.queryCommandState(uiName);
            if (state === -1) {
              btn.setDisabled(true);
              btn.setChecked(false);
            } else {
              btn.setDisabled(false);
              btn.setChecked(state);
            }
          });
          // 因为你是添加 button，所以需要返回这个 button
          return btn;
        },
        this.myConfig.toolbars[0].length,
        editorId
      );
      // 1. 自定义视频上传按钮
      window.UE.registerUI(
        "video-upload-button" + editorId,
        (editor, uiName) => {
          // 创建一个 button
          let btn = new window.UE.ui.Button({
            // 按钮的名字
            name: uiName,
            // 提示
            title: "上传视频",
            // 需要添加的额外样式，可指定 icon 图标，图标路径参考常见问题 2
            cssRules:
              "background-image: url('/static/UEditor/themes/default/images/icons.png') !important;background-position: -320px -20px;",
            // 点击时执行的命令
            onclick: () => {
              // 这里可以不用执行命令，做你自己的操作也可
              this.mimeType = "videos";
              this.uploadVisible = true;
              this.$nextTick(() => {
                this.$refs.upload.init();
              });
            }
          });
          // 当点到编辑内容上时，按钮要做的状态反射
          editor.addListener("selectionchange", () => {
            let state = editor.queryCommandState(uiName);
            if (state === -1) {
              btn.setDisabled(true);
              btn.setChecked(false);
            } else {
              btn.setDisabled(false);
              btn.setChecked(state);
            }
          });
          // 因为你是添加 button，所以需要返回这个 button
          return btn;
        },
        this.myConfig.toolbars[0].length + 1,
        editorId
      );
    },
    //上传成功
    uploadSuccess(info) {
      switch (this.mimeType) {
        case "images":
          this.ueditor.execCommand("insertimage", {
            src: info.url
          });
          break;
        case "videos":
          this.ueditor.execCommand("insertvideo", {
            url: info.url
          });
          break;
        default:
          break;
      }
    },
    uploadCloseHandle() {
      this.$refs.upload.clearFiles();
    }
  },
  watch: {
    ueContent(newVal, oldval) {
      this.$emit("contentHandle", newVal);
    }
  }
};
</script>

<style lang="scss">
.mod-demo-ueditor {
  position: relative;
  > .el-alert {
    margin-bottom: 10px;
  }
}
.edui-default .edui-editor-toolbarbox {
  line-height: 0;
}
</style>
