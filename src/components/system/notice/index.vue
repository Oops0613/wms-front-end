<template>
  <div>
    <div style="margin-bottom: 5px">
      <el-input v-model="queryParams.keyWord" placeholder="输入关键字" style="width: 150px"
                suffix-icon="el-icon-search"
                @keyup.enter.native="getList">
      </el-input>
      <el-button size="small" type="primary" style="margin-left: 5px" @click="getList">查询</el-button>
      <!--    <el-button size="small" type="success" @click="resetParam">重置</el-button>-->
      <el-button size="small" type="success" @click="add">新增</el-button>

    </div>
    <el-table :data="tableData" :header-cell-style="{ backgroundColor: 'rgba(184,176,176,0.3)' }" border>
      <el-table-column prop="id" label="ID" width="50">
      </el-table-column>
      <el-table-column prop="title" label="标题" width="200">
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="content" label="正文" width="200">
      </el-table-column>
      <el-table-column prop="receiver" label="接收方角色" width="200">
        <template slot-scope="scope">
          <!-- 遍历 tags 数组，生成多个标签 -->
          <el-tag
              v-for="(tag, index) in scope.row.roleList"
              :key="index"
              :type="'success'"
              style="margin-right: 5px;"
          >
            {{ roleMap[tag] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="150">
      </el-table-column>
      <el-table-column prop="updateTime" label="修改时间" width="150">
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="200">
      </el-table-column>
      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <el-button v-show="scope.row.id!=='1'" size="small" icon="el-icon-edit" type="text" @click="edit(scope.row)">
            编辑
          </el-button>
          <el-popconfirm title="确定删除吗？" @confirm="handleDelete(scope.row.id)" style="margin-left: 5px">
            <el-button v-show="scope.row.id!=='1'" slot="reference" size="small" icon="el-icon-delete" type="text">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="queryParams.pageNum"
                   :page-sizes="[2, 5, 10, 20]" :page-size="queryParams.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
    <el-dialog title="提示" :visible.sync="open" width="40%" center>
      <el-form ref="form" status-icon :rules="rules" :model="form" label-width="120px">
        <div v-show="adding">
        <el-form-item label="收件人" style="width: 80%" prop="roleList">
          <el-select v-model="form.roleList" style="width: 100%" multiple placeholder="请选择收件人">
            <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        </div>
        <el-form-item label="标题" style="width: 80%" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="正文" prop="content" style="width: 80%">
          <el-input
              v-model="form.content"
              type="textarea"
              placeholder="请输入正文"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark" style="width: 80%">
          <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {addNotice, delNotice, getNotice, listNotice, updateNotice} from "@/api/notice";
import {listAllRole} from "@/api/role";

export default {
  name: "Notice",
  data() {
    return {
      total: 0,
      open: false,
      adding:true,
      roleList: [],
      roleMap:{},
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        keyWord: '',
      },
      tableData: [],
      form: {
        title: '',
        content: '',
        roleList: [],
        remark: ''
      },
      // 表单校验
      rules: {
        roleList: [
          {required: true, message: '收件人不能为空', trigger: 'change'}
        ],
        title: [
          {required: true, message: '标题不能为空', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '正文不能为空', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    getList() {
      //加载已有的角色列表
      listAllRole().then(res => {
        this.roleList = res.data;
        this.roleMap={};
        for(let role of this.roleList){
          this.roleMap[role.id]=role.roleName;
        }
      })
      listNotice(this.queryParams).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.rows;
          this.total = parseInt(res.data.total);
        } else {
          alert("获取失败");
        }
      })
    },
    add() {
      this.open = true;
      this.adding=true;
      this.rules.roleList[0].required=true;
      this.$nextTick(() => {
        this.resetForm();
      })
    },
    edit(row) {
      this.handleGet(row.id);
      this.form.id = row.id;
      this.open = true;
      this.adding=false;
      this.rules.roleList[0].required=false;
    },
    handleGet(id) {
      getNotice(id).then(res => {
        this.form = res.data;
      })
    },
    handleAdd() {
      addNotice(this.form).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "新增公告成功",
            type: "success"
          })
          this.open = false;
          this.getList();
        } else {
          this.$message({
            message: "新增公告失败",
            type: "error"
          })
        }
      })
    },
    handleEdit() {
      updateNotice(this.form).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "修改公告成功",
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
    handleDelete(id) {
      delNotice(id).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "删除公告成功",
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
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryParams.pageNum = val;
      this.getList();
    },
    resetForm() {
      this.form = {
        id: '',
        title: '',
        content: '',
        roleList: [],
        remark: ''
      }
      //this.$refs.form.resetFields();
    }
  },
  beforeMount() {
    this.getList()
  }
}
</script>

<style scoped>

</style>
