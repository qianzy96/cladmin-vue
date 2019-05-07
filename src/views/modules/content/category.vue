<template>
  <div class="mod-category">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button v-if="isAuth('sys:category:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border style="width: 100%;">
      <el-table-column prop="categoryId" header-align="center" align="center" width="80" label="ID">
      </el-table-column>
      <table-tree-column prop="name" header-align="center" treeKey="categoryId" width="150" label="名称">
      </table-tree-column>
      <el-table-column header-align="center" align="center" label="图标">
        <template slot-scope="scope">
          <icon-svg :name="scope.row.icon || ''"></icon-svg>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" header-align="center" align="center" label="排序号">
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:category:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.categoryId)">修改</el-button>
          <el-button v-if="isAuth('sys:category:delete')" type="text" size="small" @click="deleteHandle(scope.row.categoryId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>
<script>
import TableTreeColumn from "@/components/table-tree-column";
import AddOrUpdate from "./category-add-or-update";
import { treeDataTranslate } from "@/utils";
export default {
  data() {
    return {
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false
    };
  },
  components: {
    TableTreeColumn,
    AddOrUpdate
  },
  activated() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.dataListLoading = true;
      this.$http.getCategoryList().then(({ data }) => {
        this.dataList = treeDataTranslate(data.data, "categoryId");
        this.dataListLoading = false;
      });
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    deleteHandle(id) {
      this.$confirm(`确定对[id=${id}]进行[删除]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.deleteCategory({ id: id }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                }
              });
            } else {
              this.$message.error(data.message);
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>