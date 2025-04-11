<template>
  <div>
    <div style="margin-bottom: 5px">
      <el-input v-model="queryParams.roleName" placeholder="输入角色名" style="width: 150px"
                suffix-icon="el-icon-search"
                @keyup.enter.native="getRoleList">
      </el-input>
      <el-button size="small" type="primary" style="margin-left: 5px" @click="getRoleList">查询</el-button>
      <!--    <el-button size="small" type="success" @click="resetParam">重置</el-button>-->
      <el-button size="small" type="success" @click="add">新增</el-button>

    </div>
    <el-table :data="tableData" :header-cell-style="{ backgroundColor: 'rgba(184,176,176,0.3)' }" border>
      <el-table-column prop="id" label="ID" width="50">
      </el-table-column>
      <el-table-column prop="roleName" label="角色名" width="120">
      </el-table-column>
      <el-table-column prop="roleKey" label="权限标识符" width="120">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="150">
      </el-table-column>
      <el-table-column prop="updateTime" label="修改时间" width="150">
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="200">
      </el-table-column>
      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <el-button v-show="scope.row.id!=='1'" size="small" icon="el-icon-edit" type="text" @click="edit(scope.row)">编辑</el-button>
          <el-popconfirm title="确定删除吗？" @confirm="handleDelete(scope.row.id)" style="margin-left: 5px">
            <el-button v-show="scope.row.id!=='1'" slot="reference" size="small" icon="el-icon-delete" type="text">删除</el-button>
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
    <el-dialog title="提示" :visible.sync="open" width="30%" center>
      <el-form ref="form" status-icon :rules="rules" :model="form" label-width="120px">
        <el-form-item label="角色名" style="width: 80%" prop="roleName">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="权限标识符" style="width: 80%" label-width="120px" prop="roleKey">
          <span slot="label">
            <el-tooltip
                content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)"
                placement="top"
            >
              <i class="el-icon-question"/>
            </el-tooltip>
            权限标识符
          </span>
          <el-input v-model="form.roleKey"/>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-checkbox
              v-model="menuExpand"
              @change="handleCheckedTreeExpand($event)"
          >展开/折叠
          </el-checkbox>
          <el-checkbox
              v-model="menuNodeAll"
              @change="handleCheckedTreeNodeAll($event)"
          >全选/全不选
          </el-checkbox>
          <el-tree
              ref="menu"
              class="tree-border"
              :data="menuOptions"
              show-checkbox
              node-key="id"
              :check-strictly="false"
              empty-text="加载中，请稍候"
              :props="defaultProps"
              :default-checked-keys="checkedKeys"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
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
import {listRole, addRole, updateRole, getRole, delRole} from "@/api/role"
import {roleMenuTreeSelect} from "@/api/menu"
import {treeSelect} from "@/api/menu"

export default {
  name: "Role",
  data() {
    return {
      total: 0,
      open: false,
      menuExpand: false,
      menuOptions: [],
      checkedKeys: [],
      menuNodeAll: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: '',
      },
      tableData: [],
      form: {
        roleName: '',
        roleKey: '',
        roleSort: 0,
        menuIds: [],
        remark: ''
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 表单校验
      rules: {
        roleName: [
          {required: true, message: '角色名称不能为空', trigger: 'blur'}
        ],
        roleKey: [
          {required: true, message: '权限字符不能为空', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    getRoleList() {
      listRole(this.queryParams).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.rows;
          this.total = parseInt(res.data.total);
        } else {
          alert("获取失败");
        }
      })
    },
    /** 查询菜单树结构 */
    getMenuTreeSelect() {
      treeSelect().then((res) => {
        console.log("菜单树", res)
        this.menuOptions = res.data;
        //将第一个节点设置默认选中状态
        this.checkedKeys.push(this.menuOptions[0].id)
      })
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.menu.getCheckedKeys()
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeSelect(id) {
      return roleMenuTreeSelect(id).then(res => {
        this.menuOptions = res.data.menus
        return res.data
      })
    },
    add() {
      this.open = true;
      this.$nextTick(() => {
        this.resetForm();
      })
      this.getMenuTreeSelect()
    },
    edit(row) {
      this.form.id = row.id;
      this.open = true;
      //通过roleId获取对应的菜单树
      const roleMenu = this.getRoleMenuTreeSelect(row.id)//roleMenu是一个函数

      getRole(row.id).then(res => {
        this.form = res.data
        this.open = true
        this.$nextTick(() => {
          roleMenu.then(res => {
            console.log("________", res)
            const checkedKeys = res.checkedKeys
            checkedKeys.forEach((v) => {
              this.$nextTick(() => {
                this.$refs.menu.setChecked(v, true, false)
              })
            })
          })
        })
      })
    },
    handleAdd() {
      this.form.menuIds = this.getMenuAllCheckedKeys()
      addRole(this.form).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "新增角色成功",
            type: "success"
          })
          this.open = false;
          this.getRoleList();
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          })
        }
      })
    },
    handleEdit() {
      this.form.menuIds = this.getMenuAllCheckedKeys()
      updateRole(this.form).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "修改角色成功",
            type: "success"
          })
          this.open = false;
          this.getRoleList();
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          })
        }
      })
    },
    handleDelete(id) {
      delRole(id).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "删除角色成功",
            type: "success"
          })
          this.getRoleList();
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
      this.getRoleList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryParams.pageNum = val;
      this.getRoleList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value) {
      const treeList = this.menuOptions
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value) {
      this.$refs.menu.setCheckedNodes(value ? this.menuOptions : [])
    },
    resetForm() {
      this.form = {
        id: '',
        roleName: '',
        roleKey: '',
        roleSort: 0,
        menuIds: [],
        remark: ''
      }
      //this.$refs.form.resetFields();
    }
  },
  beforeMount() {
    this.getRoleList()
  }
}
</script>

<style scoped>

</style>
