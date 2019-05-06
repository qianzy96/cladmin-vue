<template>
  <div class="mod-demo-ueditor">
    <el-alert title="提示：" type="warning" :closable="false">
      <div slot-scope="description">
        <p class="el-alert__description">1. 此Demo只提供UEditor官方使用文档，入门部署和体验功能。具体使用请参考：http://fex.baidu.com/ueditor/</p>
        <p class="el-alert__description">2. 浏览器控制台报错“请求后台配置项http错误，上传功能将不能正常使用！”，此错需要后台提供上传接口方法（赋值给serverUrl属性）</p>
      </div>
    </el-alert>
    <vue-ueditor-wrap v-model="ueContent" :config="myConfig" @ready="ready" @beforeInit="addCustomUI"></vue-ueditor-wrap>
    <!-- 弹窗, 上传文件 -->
    <div>
      <upload v-if="uploadVisible" ref="upload" @uploadSuccess="uploadSuccess" @closeHandle="uploadCloseHandle" :mimeType="'images'"></upload>
    </div>
  </div>

</template>

<script>
import Upload from "@/components/aliyun-oss/upload";
import VueUeditorWrap from "vue-ueditor-wrap";
export default {
  components: {
    Upload,
    VueUeditorWrap
  },
  data() {
    return {
      uploadVisible: false,
      ueditor: null,
      ueContent: "",
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 600,
        // 初始容器宽度
        initialFrameWidth: "100%",
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
      // 1. 自定义按钮
      window.UE.registerUI("test-button" + editorId, (editor, uiName) => {
        // 注册按钮执行时的 command 命令，使用命令默认就会带有回退操作
        editor.registerCommand(uiName, {
          execCommand: () => {
            editor.execCommand(
              "inserthtml",
              `<span style="color: #${editorId.substr(
                -3
              )};">这是一段由自定义按钮添加的文字，你点击的编辑器ID是${editorId}</span>`
            );
          }
        });
        // 创建一个 button
        let btn = new window.UE.ui.Button({
          // 按钮的名字
          name: uiName,
          // 提示
          title: "鼠标悬停时的提示文字",
          // 需要添加的额外样式，可指定 icon 图标，图标路径参考常见问题 2
          cssRules:
            "background-image: url('/static/UEditor/themes/default/images/icons.png') !important;background-position: -726px -77px;",
          // 点击时执行的命令
          onclick: () => {
            // 这里可以不用执行命令，做你自己的操作也可
            //editor.execCommand(uiName);
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
      });
    },
    //上传成功
    uploadSuccess(info) {
      this.ueditor.execCommand("insertimage", {
        src: info.url
      });
    },
    uploadCloseHandle() {
      this.$refs.upload.clearFiles();
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
</style>
