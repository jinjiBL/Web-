<template>
  <div>
    <!-- 添加服务商 -->
    <el-dialog
      title="添加服务商"
      width="50%"
      :visible.sync="addDialogVisible"
      @close="addDialogClosed"
    >
      <!--添加用户内容主题区域 -->
      <el-form :model="addForm" ref="addFormRef" label-width="70px">
        <el-form-item label="订单名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="父级id" prop="p_id">
          <el-input v-model="addForm.p_id"></el-input>
        </el-form-item>
        <el-form-item label="订单编号" prop="number">
          <el-input v-model="addForm.number"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addord">确 定</el-button>
      </span>
    </el-dialog>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="searchord"
            clearable
            @clear="getordList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchordname()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加订单</el-button
          >
          <el-button round class="change" @click="tohome">返回首页</el-button>
        </el-col>
      </el-row>

      <el-table :data="ordlistten" border stripe>
        <!-- <el-table-column type="index" label="#"></el-table-column> -->
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="订单名称" prop="name"></el-table-column>
        <el-table-column label="服务商编号" prop="p_id"></el-table-column>
        <el-table-column label="订单编号" prop="number"></el-table-column>
        <el-table-column label="操作" v-slot="scope">
          <template>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deluser(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="btny">
        <el-button-group>
          <el-button
            type="primary"
            icon="el-icon-arrow-left"
            @click="left"
            :disabled="dis"
            >上一页</el-button
          >
          <span class="total">总订单数:{{ total }}</span>
          <el-button type="primary" class="right" @click="right"
            >下一页<i class="el-icon-arrow-right el-icon--right"></i
          ></el-button>
        </el-button-group>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      addDialogVisible: false,
      ordlist: [],
      ordlistten: [],
      ten: [],
      s: 0,
      dis: false,
      searchord: "",
      total: "",
      addForm: {
        name: "",
        p_id: "",
        number: "",
      },
    };
  },
  created() {
    this.getordList();
  },
  methods: {
    addDialogClosed() {
      // 通过$refs获取表单，再执行resetFields()清空表单内容（重置功能）
      this.$refs.addFormRef.resetFields();
    },
    searchordname() {
      //当输入框内是空的时候则获取数据库数据给ordlistten
      if (this.searchord == "") {
        this.s = 0;

        return this.getordList();
      }
      //如果用户搜索用户则匹配并将userlist重新赋值userlist[i]
      for (var i = 0; i < this.ordlist.length; i++) {
        if (this.ordlist[i].name == this.searchord) {
          let arr = [];
          arr.push(this.ordlist[i]);
          this.ordlistten = arr;
          return;
        }
      }
      this.$message.warning("查无此人");
    },
    //获取订单列表
    getordList() {
      this.$http
        .get("http://localhost:3000/api/user/queryord")
        .then((response) => {
          console.log(response);
          this.ordlist = response.data;
          console.log(this.ordlist);
          this.total = this.ordlist.length;
          this.s = 0;
          this.getten();
        });
    },
    getten() {
      if (this.s >= 0) {
        this.dis = false;
      }
      var k = 0;
      this.ten = [];
      for (var i = 0; i < this.ordlist.length; i++) {
        this.ten.push(this.ordlist[this.s]);
        this.s++;
        k++;
        if (k >= 10) {
          this.ordlistten = this.ten;
          return;
        }
      }
    },
    gettenleft() {
      if (this.s == 10) {
        this.dis = true;
        return;
      }
      var k = 0;
      this.s = this.s - 20;
      this.ten = [];
      for (var i = 0; i < this.ordlist.length; i++) {
        this.ten.push(this.ordlist[this.s]);
        this.s++;
        k++;
        if (k >= 10) {
          this.ordlistten = this.ten;
          return;
        }
      }
    },

    left() {
      this.gettenleft();
    },
    right() {
      this.getten();
    },
    //删除
    deluser(userinfo) {
      console.log(userinfo);
      var name = userinfo.name;
      this.$http
        .post(
          "http://localhost:3000/api/user/deleteord",
          {
            name: name,
          },
          {}
        )
        .then((response) => {
          console.log(response);
          this.getordList();
        });
    },

    addord() {
      var id = "0";
      var name = this.addForm.name;
      var p_id = this.addForm.p_id;
      var number = this.addForm.number;
      this.$http
        .post(
          "http://localhost:3000/api/user/addord",
          {
            id: id,
            name: name,
            p_id: p_id,
            number: number,
          },
          {}
        )
        .then((response) => {
          console.log(response);
          this.getordList();
        });
      this.$message.success("添加订单成功！");
      this.addDialogVisible = false;
    },
    tohome() {
      this.$router.push("/home");
    },
  },
};
</script>
<style>
.btny {
  margin-top: 5px !important;
}
.right {
  margin-left: 1660px !important;
}
.total {
  position: absolute;
  top: 785px;
  left: 855px;
}
</style>
