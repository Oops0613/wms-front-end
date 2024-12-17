<template>
  <div>
    <div style="margin-bottom: 5px">
      <el-input v-model="queryParams.name" placeholder="输入货物名" style="width: 150px"
                suffix-icon="el-icon-search"
                @keyup.enter.native="getList">
      </el-input>
      <el-cascader
          v-model="queryParams.categoryId"
          style="width: 200px;margin-left: 10px"
          clearable
          ref="categoryTree2"
          :options="categoryTree2"
          :props="{value:'id', label: 'name', children: 'children'}"
          @change="handleSearchChange">
      </el-cascader>
      <el-button size="small" type="primary" style="margin-left: 5px" @click="getList">查询</el-button>
      <el-button size="small" type="success" @click="resetParam">重置</el-button>
      <el-button size="small" type="success" @click="add">新增</el-button>

    </div>
    <el-table :data="tableData" :header-cell-style="{ backgroundColor: 'rgba(184,176,176,0.3)' }" border>
      <el-table-column prop="id" label="ID" width="50">
      </el-table-column>
      <el-table-column prop="name" label="货物名" width="200">
      </el-table-column>
      <el-table-column prop="categoryName" label="所属分类" width="120">
      </el-table-column>
      <el-table-column prop="amount" label="库存总数" width="100">
      </el-table-column>
      <el-table-column prop="volumePerUnit" label="单位容积" width="100">
      </el-table-column>
      <el-table-column prop="lowThreshold" label="低库存阈值" width="100">
      </el-table-column>
      <el-table-column prop="highThreshold" label="高库存阈值" width="100">
      </el-table-column>
      <el-table-column prop="hasExpirationTime" label="是否有过期时间" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.hasExpirationTime === '0' ? 'success' : 'danger'" disable-transitions>
            {{ scope.row.hasExpirationTime === '0' ? '无' : '有' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="200">
      </el-table-column>
      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-edit" type="text" @click="edit(scope.row)">编辑</el-button>
          <el-popconfirm title="确定删除吗？" @confirm="handleDelete(scope.row.id)" style="margin-left: 5px">
            <el-button slot="reference" size="small" icon="el-icon-delete" type="text">删除</el-button>
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
      <el-form ref="form" status-icon :rules="rules" :model="form" label-width="120px" center>
        <el-form-item label="货物名" style="width: 80%" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" style="width: 80%" prop="categoryId">
          <el-cascader
              ref="categoryTree"
              :options="categoryTree"
              :props="{value:'id', label: 'name', children: 'children'}"
              @change="handleFormChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="计量单位" style="width: 80%" prop="unit">
          <el-input v-model="form.unit"></el-input>
        </el-form-item>
        <el-form-item label="单位容积" style="width: 80%" prop="volumePerUnit">
          <span slot="label">
            <el-tooltip
                content="每单位货物需要多少仓储空间，容积单位：升"
                placement="top"
            >
              <i class="el-icon-question"/>
            </el-tooltip>
            单位容积
          </span>
          <el-input v-model="form.volumePerUnit"></el-input>
        </el-form-item>
        <el-form-item label="低库存阈值" style="width: 80%" prop="lowThreshold">
          <span slot="label">
            <el-tooltip
                content="库存数量低于该值需要及时补货"
                placement="top"
            >
              <i class="el-icon-question"/>
            </el-tooltip>
            低库存阈值
          </span>
          <el-input v-model="form.lowThreshold"></el-input>
        </el-form-item>
        <el-form-item label="高库存阈值" style="width: 80%" prop="highThreshold">
          <span slot="label">
            <el-tooltip
                content="库存数量应控制在该值之下"
                placement="top"
            >
              <i class="el-icon-question"/>
            </el-tooltip>
            高库存阈值
          </span>
          <el-input v-model="form.highThreshold"></el-input>
        </el-form-item>
        <el-form-item label="过期时间">
          <el-radio-group v-model="form.hasExpirationTime">
            <el-radio label="0">无</el-radio>
            <el-radio label="1">有</el-radio>
          </el-radio-group>
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
import {listGoods,getGoods,addGoods,updateGoods,delGoods} from "@/api/goods";
import {listCategory} from "@/api/category";

export default {
  name: "Goods",
  data() {
    const checkThreshold = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入高库存阈值'));
      } else if (value <= this.form.lowThreshold) {
        callback(new Error('应高于低库存阈值'));
      } else {
        callback();
      }
    };
    return {
      tableData: [],
      categoryList:[],
      categoryTree:[],
      categoryTree2:[],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        categoryId: ''
      },
      total: 0,
      open: false,
      form: {
        id: '',
        //货物名
        name: '',
        //所属分类ID
        categoryId: '',
        //计量单位
        unit: '',
        //每单位所占容积
        volumePerUnit: '',
        //低库存阈值
        lowThreshold:'',
        //高库存阈值
        highThreshold:'',
        //是否有保质期
        hasExpirationTime: '0',
        remark:'',
      },
      rules: {
        name: [
          {required: true, message: "请输入货物名", trigger: 'blur'},
        ],
        categoryId: [
          {required: true, message: "请选择分类", trigger: 'change'},
        ],
        unit: [
          {required: true, message: "请输入计量单位", trigger: 'blur'},
          {max: 5, message: "不超过5个字符", trigger: 'blur'},
        ],
        volumePerUnit: [
          {required: true, message: "请输入每单位所占容积", trigger: 'blur'},
          {pattern: /^(?!0(\.0+)?$)\d+(\.\d+)?$/, message: "请输入正数", trigger: 'blur'}
        ],
        lowThreshold: [
          {required: true, message: "请输入低库存阈值", trigger: 'blur'},
          {pattern: /^[1-9]\d*$/, message: "请输入正整数", trigger: 'blur'}
        ],
        highThreshold: [
          {required: true, message: "请输入高库存阈值", trigger: 'blur'},
          {pattern: /^[1-9]\d*$/, message: "请输入正整数", trigger: 'blur'},
          {validator: checkThreshold, trigger: 'blur'},
        ],
      },
    }
  },
  methods: {
    handleGet(id) {
      getGoods(id).then(res => {
        this.form = res.data;
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
    edit(row) {
      this.adding = false;
      this.handleGet(row.id);
      this.form.id = row.id;
      this.open = true;
    },
    handleEdit() {
      updateGoods(this.form).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "修改货物成功",
            type: "success"
          })
          this.open = false;
          this.getList();
        } else {
          this.$message({
            message: "修改货物失败",
            type: "error"
          })
        }
      })
    },
    handleDelete(id) {
      delGoods(id).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "删除货物成功",
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
    add() {
      this.open = true;
      this.$nextTick(() => {
        this.resetForm();
      })
    },
    handleAdd() {
      addGoods(this.form).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "新增货物成功",
            type: "success"
          })
          this.open = false;
          this.getList();
        } else {
          this.$message({
            message: "新增货物失败",
            type: "error"
          })
        }
      })
    },

    getList() {
      //加载已有的分类列表
      listCategory().then(res => {
        this.categoryList=res.data
        this.categoryTree = this.handleTree(res.data, 'id')
        this.categoryTree2 = this.handleTree(res.data, 'id')
        console.log("分类树，",this.categoryList)
      })
      listGoods(this.queryParams).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.tableData = res.data.rows;
          //给列表每行添加分类名
          this.tableData.forEach(row => {
            row.categoryName = this.getCategoryNameById(row.categoryId)
          })
          this.total = parseInt(res.data.total);
        } else {
          alert("获取失败");
        }
      })

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
    resetParam() {
      this.queryParams.name = '';
      this.queryParams.categoryId = '';
    },
    resetForm() {
      this.form = {
        id: '',
        name: '',
        categoryId: '',
        unit: '',
        volumePerUnit: '',
        lowThreshold:'',
        highThreshold:'',
        hasExpirationTime: '0',
        remark:'',
      }
      //this.$refs.form.resetFields();
    },
    getCategoryNameById(id) {
      for (let c of this.categoryList) {
        if (c.id === id) {
          return c.name;
        }
      }
      return "";
    },
    handleSearchChange(){
      let cid=this.queryParams.categoryId
      if(cid&&cid.length===0){
        //搜索框清空时，进行初始化操作并清除选中值
        this.$refs["categoryTree2"].$refs.panel.checkedValue = []; // 清空选中值
        this.$refs["categoryTree2"].$refs.panel.clearCheckedNodes(); // 清空级联选择器选中状态
        this.$refs["categoryTree2"].$refs.panel.activePath = []; // 清除高亮
        this.$refs["categoryTree2"].$refs.panel.syncActivePath(); // 初始化（只展示一级节点）
      }
      else {
        //选中分类时，给查询参数对应项赋值
        let nodesInfo = this.$refs["categoryTree2"].getCheckedNodes()[0];
        console.log("选中",nodesInfo)
        this.queryParams.categoryId=nodesInfo.value;
      }

    },
    handleFormChange(){
      //选中分类时，给表单对应项赋值
      let nodesInfo = this.$refs["categoryTree"].getCheckedNodes()[0];
      this.form.categoryId=nodesInfo.value;
    }
  },
  beforeMount() {
    this.getList()
  },
}
</script>

<style scoped>

</style>
