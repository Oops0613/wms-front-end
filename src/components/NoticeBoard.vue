<template>
  <div>
    <el-card class="my-box" style="margin-top: 10px">
      <div style="display: flex;align-items: center">
        <el-input
            v-model="queryParams.keyWord"
            placeholder="输入关键字"
            style="width: 200px"
            suffix-icon="el-icon-search"
            @keyup.enter.native="getList"
            size="large"
        >
        </el-input>
        <el-button size="medium" type="primary" style="margin-left: 20px" @click="getList">查询</el-button>
        <el-checkbox
            v-model="queryParams.unread"
            :true-label="0"
            :false-label="1"
            label="只看未读"
            border
            size="large"
            style="margin-left: 20px;font-weight: bold">
        </el-checkbox>
      </div>
    </el-card>
    <el-row :gutter="20" style="margin: 20px 15px;">
      <el-col :span=leftWidth>
        <el-card>
          <el-row :gutter="20">
            <el-col :span="24" v-for="(notice, index) in tableData" :key="index">
              <el-card
                  class="notice-card"
                  :body-style="{ padding: '20px',cursor:'pointer' }"
                  @click.native="handleGetNotice(notice)">
                <!-- 邮件摘要 -->
                <div class="notice-summary">
                  <!-- 第一行：标题和发送时间 -->
                  <div class="notice-title-time">
                    <span class="notice-title">{{ notice.title }}</span>
                    <div>
                      <el-tag
                          :type=readStatus[notice.isRead].type
                          style="margin-right: 20px">
                        {{ readStatus[notice.isRead].label }}
                      </el-tag>
                      <span class="notice-time">{{ notice.createTime }}</span>
                    </div>
                  </div>
                  <!-- 第二行：邮件内容的开头部分（最多30个字）-->
                  <div class="notice-content">
                    {{ notice.content.slice(0, 30) }}...
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="queryParams.pageNum"
                         :page-sizes="[2, 5, 10, 20]" :page-size="queryParams.pageSize"
                         layout="total, prev, pager, next, jumper"
                         :total="total">
          </el-pagination>
        </el-card>
      </el-col>
      <el-col :span=24-leftWidth>
        <el-card style="height: 645px;overflow-y: auto">
          <div style="display: flex;">
            <span style="flex: 1; text-align: center;font-weight: bold">
              {{ notice.title }}
            </span>
            <i class="el-icon-close"
               style="cursor: pointer;font-size: 18px"
               @click="handleClose">
            </i>
          </div>
          <div style="text-align: left">
            <span class="notice-time">发布于：{{ notice.createTime }}</span>
          </div>
          <div style="text-align: left">
            <span class="notice-time">更新于：{{ notice.updateTime }}</span>
          </div>
          <div style="margin-top: 10px;white-space: pre-line;font-family: 微软雅黑">
            {{notice.content}}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {getNotice, getNoticeDetail, listPersonalNotice} from "@/api/notice";

export default {
  name: "NoticeBoard",
  data() {
    return {
      leftWidth: 24,
      total: 0,
      notice: {},
      tableData: [
        {
          title: "邮件标题12222222",
          time: "2025-03-07 10:00",
          content: "这是邮件内容的开头部分，超出部分不会显示，只会显示30个字。继续写一些文字...",
          isRead: '0',
        },
        {
          title: "邮件标题2",
          time: "2025-03-06 14:00",
          content: "这是第二封邮件的内容，展示邮件的简要摘要。",
          isRead: '0',
        },
        {
          title: "邮件标题3",
          time: "2025-03-05 16:30",
          content: "这封邮件包含更多的内容，但是我们仅展示开头30个字符。",
          isRead: '1',
        },
        {
          title: "邮件标题3",
          time: "2025-03-05 16:30",
          content: "这封邮件包含更多的内容，但是我们仅展示开头30个字符。",
          isRead: '1',
        },
        {
          title: "邮件标题3",
          time: "2025-03-05 16:30",
          content: "这封邮件包含更多的内容，但是我们仅展示开头30个字符。",
          isRead: '1',
        },
        // 更多邮件数据...
      ],
      readStatus: [
        {type: 'danger', label: '未读'},
        {type: 'success', label: '已读'}
      ],
      queryParams: {
        pageNum: 1,
        pageSize: 5,
        keyWord: '',
        unread:''
      },
    }
  },
  methods: {
    getList() {
      listPersonalNotice(this.queryParams).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.rows;
          this.total = parseInt(res.data.total);
        } else {
          alert("获取失败");
        }
      })
    },
    handleGetNotice(notice) {
      this.leftWidth = 15;
      getNoticeDetail(notice.id).then(res => {
        this.notice = res.data;
      })
    },
    handleClose() {
      this.leftWidth = 24;
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
  },
  beforeMount() {
    this.getList()
  }
}
</script>

<style scoped>
.my-box {
  margin: 20px 25px;
}

.notice-card {
  margin-bottom: 20px;
}

.notice-summary {
  display: flex;
  flex-direction: column;
}

.notice-title-time {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-bottom: 10px;
}

.notice-title {
  font-weight: bold;
}

.notice-time {
  font-size: 12px;
  color: #999;
  font-weight: bold;
}

.notice-content {
  color: #666;
  font-size: 14px;
}
</style>
