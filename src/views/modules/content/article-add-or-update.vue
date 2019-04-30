<template>
  <div>
    <el-form ref="dataForm" :model="dataForm" :rules="rules" class="mod-article" label-position="top" :style="siteContentViewHeight">
      <el-container style="height:100%">
        <el-container>
          <el-main>
            <el-row>
              <el-col :span="24">
                <el-form-item style="margin-bottom: 40px;" prop="title">
                  <MDinput v-model="dataForm.title" :maxlength="16" name="name" required>
                    文章标题
                  </MDinput>
                </el-form-item>
              </el-col>
            </el-row>
          </el-main>
          <el-footer>
            <el-form-item>
              <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
              <el-button @click="cancelFormSubmit()">取消</el-button>
            </el-form-item>
          </el-footer>
        </el-container>
        <el-aside width="400px" class="aside">
          <div class="postInfo-container">
            <el-form-item label="所在分类" prop="parentName">
              <el-popover ref="menuListPopover" placement="bottom-start" trigger="click">
                <el-tree :data="menuList" :props="menuListTreeProps" node-key="categoryId" ref="menuListTree" @current-change="menuListTreeCurrentChangeHandle" :default-expand-all="true" :highlight-current="true" :expand-on-click-node="false">
                </el-tree>
              </el-popover>
              <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择分类" class="menu-list__input"></el-input>
            </el-form-item>
            <el-form-item label="封面图片" prop="thumb" class="is-required">
              <div class="thumb">
                <img :src='dataForm.thumb[0]?dataForm.thumb[0]:"/static/img/thumb_fakeimg.png"' alt="">
              </div>
              <el-button type="info" @click="uploadHandle()">上传图片</el-button>
            </el-form-item>
            <el-form-item label="发布时间" prop="createTime">
              <el-date-picker type="date" placeholder="选择日期" v-model="dataForm.createTime" class="createTime"></el-date-picker>
            </el-form-item>
          </div>
        </el-aside>
      </el-container>
    </el-form>
    <!-- 弹窗, 上传文件 -->
    <upload v-if="uploadThumbVisible" ref="uploadThumb" @uploadSuccess="uploadThumbSuccess" @removeFile="removeThumbFile" :mimeType="'images'" :limit="1"></upload>
  </div>
</template>

<script>
import MDinput from "@/components/md-input";
import { treeDataTranslate } from "@/utils";
import Upload from "../oss/oss-upload";
export default {
  data() {
    const validateThumb = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error("请上传一张封面图片"));
      } else {
        callback();
      }
    };
    return {
      dataForm: {
        title: "",
        parentId: 0,
        parentName: "",
        thumb: [],
        createTime: ""
      },
      menuList: [],
      menuListTreeProps: {
        label: "name",
        children: "children"
      },
      uploadThumbVisible: false,
      rules: {
        title: [{ required: true, message: "请输入文章标题" }],
        parentName: [
          { required: true, message: "所在分类不能为空", trigger: "change" }
        ],
        thumb: [{ validator: validateThumb }]
      }
    };
  },
  components: { MDinput, Upload },
  activated() {
    this.getCategoryData();
  },
  computed: {
    documentClientHeight: {
      get() {
        return this.$store.state.common.documentClientHeight;
      }
    },
    siteContentViewHeight() {
      var height = this.documentClientHeight - 50 - 30 - 2 - 80;
      return { height: height + "px" };
    }
  },
  methods: {
    getCategoryData() {
      this.$http.getCategoryList().then(({ data }) => {
        if (data.code == 0 && data.data) {
          this.menuList = treeDataTranslate(data.data, "categoryId");
        }
      });
    },
    // 菜单树选中
    menuListTreeCurrentChangeHandle(data, node) {
      this.dataForm.parentId = data.categoryId;
      this.dataForm.parentName = data.name;
    },
    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode() {
      this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId);
      this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() ||
        {})["name"];
    },
    // 上传文件
    uploadHandle() {
      this.uploadThumbVisible = true;
      this.$nextTick(() => {
        this.$refs.uploadThumb.init();
      });
    },
    //上传成功
    uploadThumbSuccess(info) {
      this.dataForm.thumb = [];
      this.dataForm.thumb.push(info.url);
    },
    //移除上传文件
    removeThumbFile(info) {
      this.dataForm.thumb = [];
    },
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          console.log("todo submit");
        }
      });
    }
  }
};
</script>

<style lang="scss">
.mod-article {
  .aside {
    background-color: #f2f6fc;
    .postInfo-container {
      padding: 20px;
      .thumb {
        width: 360px;
        height: 205px;
        overflow: hidden;
        margin-bottom: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .createTime {
        width: 100%;
      }
    }
  }
}
</style>