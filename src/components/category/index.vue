<template>

  <div>
    <div style="padding-bottom: 5px; border-bottom: rgba(169,169,169,0.3) 1px solid">
      <el-input v-model="queryParams.name" placeholder="输入分类名" style="width: 150px" suffix-icon="el-icon-search"
                @keyup.enter.native="getList">
      </el-input>
      <el-button size="small" type="primary" style="margin-left: 5px" @click="getList">查询</el-button>
      <!--    <el-button size="small" type="success" @click="resetParam">重置</el-button>-->
      <el-button size="small" type="success" @click="add">新增</el-button>
    </div>
    <el-table
        stripe
        size="medium"
        v-if="refreshTable"
        v-loading="loading"
        :data="categoryList"
        row-key="id"
        :default-expand-all="isExpandAll"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
<!--      <el-table-column prop="id" label="ID" width="100"/>-->
      <el-table-column prop="name" label="分类名称" :show-overflow-tooltip="true" width="300"/>
      <el-table-column prop="description" label="描述" width="300" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div style="display: flex; align-items: center; justify-content: center;">
            <el-button
                v-show="scope.row.parentId==='-1'"
                size="small"
                type="text"
                icon="el-icon-plus"
                @click="add(scope.row)"
            >新增
            </el-button>
            <el-button
                size="small"
                type="text"
                icon="el-icon-edit"
                @click="edit(scope.row)"
            >修改
            </el-button>
            <el-popconfirm title="确定删除吗？" @confirm="handleDelete(scope.row)" style="margin-left: 5px">
              <el-button slot="reference" size="small" type="text" icon="el-icon-delete">删除</el-button>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="left" prop="createTime" width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="left" prop="updateTime" width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="title" :visible.sync="open" width="30%" center>
      <el-form ref="form" status-icon :model="form" :rules="rules" label-width="100px">
        <el-form-item style="width: 80%" v-if="form.parentName">
          <strong>上级分类：{{ form.parentName }}</strong>
        </el-form-item>
        <el-form-item label="上级分类" style="width: 80%" prop="parentId" v-if="form.parentId!='-1'&&!adding">
        <el-select v-model="form.parentId" clearable placeholder="请选择角色">
          <el-option
              v-for="item in topCategoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
        <el-form-item style="width: 80%" label="分类名称" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item style="width: 80%" label="描述" prop="description">
          <el-input
              v-model="form.description"
              type="textarea"
              placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open=false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listCategory, addCategory, updateCategory, delCategory, getCategory} from "@/api/category"

export default {
  name: "Category",
  data() {
    return {
      //在新增中
      adding:false,
      // 重新渲染表格状态
      refreshTable: true,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 一级分类表
      topCategoryList:[],
      // 分类表格树数据
      categoryList: [],
      // 分类树选项
      categoryOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部折叠
      isExpandAll: false,
      // 查询参数
      queryParams: {
        name: '',
      },
      form: {
        id: '',
        parentId: '',
        name: '',
        description: '',
        //父分类的名
        parentName: '',
      },
      // 表单校验
      rules: {
        name: [
          {required: true, message: '分类名称不能为空', trigger: 'blur'}
        ],
        parentId: [
          {required: true, message: "请选择上级分类", trigger: 'change'},
        ]
      }
    }
  },
  methods: {
    /** 查询分类列表 */
    getList() {
      this.loading = true
      listCategory(this.queryParams).then(res => {
        this.categoryList = this.handleTree(res.data, 'id')
        this.loading = false
      })
    },
    add(row) {
      this.adding=true;
      this.resetForm();
      if (row != null && row.id) {
        this.form.parentId = row.id
        this.form.parentName = row.name;
      } else {
        this.form.parentId = -1
        this.form.parentName = ''
      }
      this.open = true
      this.title = '添加分类'
    },
    edit(row) {
      this.adding=false;
      //this.handleGet(row)
      listCategory({parentId:-1}).then(res=>{
        this.topCategoryList=res.data
      })
      getCategory(row.id).then(res => {
        this.form = res.data;
        this.open = true;
        this.title = '修改分类'
      })
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id) {
            this.handleEdit();
          } else {
            this.handleAdd();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleAdd() {
      addCategory(this.form).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "新增分类成功",
            type: "success"
          })
          this.open = false;
          this.getList();
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          })
        }
      })
    },
    handleEdit() {
      updateCategory(this.form).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "修改分类成功",
            type: "success"
          })
          this.open = false;
          this.getList();
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          })
        }
      })
    },
    handleDelete(row) {
      delCategory(row.id).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "删除分类成功",
            type: "success"
          })
          this.getList();
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          })
        }
      })
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
     resetForm() {
      this.form = {
        id: '',
        parentId: '',
        name: '',
        description: '',
        //父分类的名
        parentName: '',
      }
      //用下面这个会导致form.id没清除
      //this.$refs.form.resetFields();
    }
  },
  created() {
    this.getList();
  }
}
</script>

<style scoped>

</style>
