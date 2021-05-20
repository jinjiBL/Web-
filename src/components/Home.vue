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
      <el-form
        :model="addForm"
        ref="addFormRef"
        :rules="addFormRules"
        label-width="70px"
      >
        <el-form-item label="服务商" prop="username">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="编号" prop="class">
          <el-input v-model="addForm.class"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加客服 -->
    <el-dialog
      title="添加客服"
      width="50%"
      :visible.sync="addDialogVisible1"
      @close="addDialogClosed1"
    >
      <!--添加用户内容主题区域 -->
      <el-form
        :model="addForm"
        ref="addFormRef1"
        :rules="addFormRules"
        label-width="70px"
      >
        <el-form-item label="客服" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="上级" prop="class">
          <el-input v-model="addForm.class"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="addUser1">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="searchuser"
            clearable
            @clear="getuserList"
          >
            <!-- queryInfo.pagenum = 1; 设置页面为1重新搜索页面 -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchusername()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加服务商</el-button
          >
          <el-button type="primary" @click="addDialogVisible1 = true"
            >添加客服</el-button
          >
          <el-button round class="change1" @click="toord">订单详情</el-button>
          <el-button round class="change" @click="todetails"
            >订单统计</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="userlistten" border stripe>
        <!-- <el-table-column type="index" label="#"></el-table-column> -->
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="名字" prop="name"></el-table-column>
        <el-table-column label="类型" prop="class"></el-table-column>
        <el-table-column label="上级" prop="C_id"></el-table-column>
        <el-table-column label="订单数" prop="o_num"></el-table-column>
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
        <el-button
          type="primary"
          icon="el-icon-arrow-left"
          @click="left"
          :disabled="dis"
          >上一页</el-button
        >
        <span class="total">总客服与服务商数:{{ total }}</span>
        <el-button type="primary" class="right" @click="right"
          >下一页<i class="el-icon-arrow-right el-icon--right"></i
        ></el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    var checkclass = (rule, value, cb) => {
      const regnum = /^[A-Z]+$/;
      if (regnum.test(value)) {
        //合法
        return cb();
      }
      cb(new Error("请输入大写字母编号"));
    };
    return {
      addDialogVisible: false,
      addDialogVisible1: false,
      userlist: [],
      orderslist: [],
      ordlist: [],
      searchuser: "",
      dis: false,
      userlistten: [],
      ten: [],
      s: 0,
      total: "",
      addForm: {
        name: "",
        class: "",
        phone: "",
        o_num: "",
      },
      addFormRules: {
        class: [
          { required: true, message: "请输入编号", trigger: "blur" },
          { validator: checkclass, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getuserList();
    this.getordList();
  },
  methods: {
    searchusername() {
      //当输入框内是空的时候则获取数据库数据给userlist
      if (this.searchuser == "") {
        return this.getuserList();
      }
      //如果用户搜索用户则匹配并将userlist重新赋值userlist[i]
      for (var i = 0; i < this.userlist.length; i++) {
        if (this.userlist[i].name == this.searchuser) {
          let arr = [];
          arr.push(this.userlist[i]);
          return (this.userlistten = arr);
        }
      }
      this.$message.warning("查无此人");
    },
    addDialogClosed() {
      // 通过$refs获取表单，再执行resetFields()清空表单内容（重置功能）
      this.$refs.addFormRef.resetFields();
    },
    addDialogClosed1() {
      // 通过$refs获取表单，再执行resetFields()清空表单内容（重置功能）
      this.$refs.addFormRef1.resetFields();
    },
    //获取服务商客服列表
    getuserList() {
      this.$http
        .get("http://localhost:3000/api/user/query")
        .then((response) => {
          console.log(response);
          this.userlist = response.data;
          this.total = this.userlist.length;
          // console.log(this.userlist);
          this.s = 0;
          this.getten();
        });
    },
    getordList() {
      this.$http
        .get("http://localhost:3000/api/user/queryord")
        .then((response) => {
          console.log(response);
          this.ordlist = response.data;
          // console.log(this.ordlist);
          this.total = this.userlist.length;
          this.getdd();
          this.getten();
        });
    },
    //获取ordersList
    getordersList() {
      this.$http
        .get("http://localhost:3000/api/user/queryorders")
        .then((response) => {
          console.log(response);
          this.orderslist = response.data;
          console.log(this.orderslist);
        });
    },
    addUser() {
      this.getuserList();
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) {
          // 验证不通过
          this.$message.error("添加用户失败！");
          return;
        } else {
          for (var i = 0; i < this.userlist.length; i++) {
            if (this.addForm.class == this.userlist[i].S_id) {
              return this.$message.warning("该编号已存在！");
            } else if (this.addForm.name == this.userlist[i].name) {
              return this.$message.warning("该服务商已存在！");
            } else if (this.addForm.name == "" || this.addForm.class == "") {
              return this.$message.warning("请输入完整的信息！");
            }
          }
          // let num1 = 0;
          // for (var i = 0; i < this.ordlist.length; i++) {
          //   if (this.ordlist[i].p_id == this.addForm.id) num++;
          // }
          var id = "0";
          var name = this.addForm.name;
          var sclass = "服务商" + this.addForm.class;
          var o_num = "0";
          var S_id = this.addForm.class;
          var C_id = "0";
          this.$http
            .post(
              "http://localhost:3000/api/user/addService",
              {
                id: id,
                name: name,
                class: sclass,
                o_num: o_num,
                S_id: S_id,
                C_id: C_id,
              },
              {}
            )
            .then((response) => {
              console.log(response);
              this.getuserList();
            });

          var sclass = "服务商" + this.addForm.class;
          var num = "0";
          var o_num = "0";
          var I_num = "0";
          this.$http
            .post(
              "http://localhost:3000/api/user/addOrders",
              {
                id: id,
                name: name,
                num: num,
                o_num: o_num,
                I_num: I_num,
                S_id: S_id,
              },
              {}
            )
            .then((response) => {
              console.log(response);
              this.getuserList();
            });
          this.$message.success("添加服务商成功！");
          this.addDialogVisible = false;
          this.$router.go(0);
        }
      });
    },
    addUser1() {
      this.$refs.addFormRef1.validate((valid) => {
        if (!valid) {
          // 验证不通过
          this.$message.error("添加用户失败！");
          return;
        }
        for (var i = 0; i < this.userlist.length; i++) {
          if (this.addForm.name == "" || this.addForm.class == "") {
            return this.$message.warning("请输入完整的信息！");
          } else if (this.addForm.class == this.userlist[i].S_id) {
            for (var j = 0; j < this.userlist.length; j++) {
              if (this.addForm.name == this.userlist[j].name) {
                return this.$message.warning("该客服已存在！");
              }
            }
            // let num1 = 0;
            // for (var i = 0; i < this.ordlist.length; i++) {
            //   if (this.ordlist[i].p_id == this.addForm.id) num++;
            // }
            var id = "0";
            var name = this.addForm.name;
            var sclass = "客服" + this.addForm.class;
            var o_num = "0";
            var S_id = this.addForm.class;
            var C_id = "0";
            this.$http
              .post(
                "http://localhost:3000/api/user/addService",
                {
                  id: id,
                  name: name,
                  class: sclass,
                  o_num: o_num,
                  S_id: C_id,
                  C_id: S_id,
                },
                {}
              )
              .then((response) => {
                console.log(response);
                this.getuserList();
              });

            this.$message.success("添加客服成功！");
            this.addDialogVisible1 = false;
            this.$router.go(0);
            return;
          }
        }
        return this.$message.warning("该上级不存在！");
      });
    },
    getdd() {
      for (var j = 0; j < this.userlist.length; j++) {
        var n = 0;
        var o = "";
        for (var i = 0; i < this.ordlist.length; i++) {
          if (this.ordlist[i].p_id == this.userlist[j].id) {
            n++;
            o = this.ordlist[j];
          }
        }
        var o_num = n;
        var id = o.id;
        this.$http
          .post(
            "http://localhost:3000/api/user/reviseServer",
            {
              o_num: o_num,
              id: id,
            },
            {}
          )
          .then((response) => {
            console.log(response);
            this.getuserList();
          });
      }
    },
    //删除
    deluser(userinfo) {
      console.log(userinfo);
      var name = userinfo.name;
      this.$http
        .post(
          "http://localhost:3000/api/user/deleteServer",
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
    todetails() {
      this.$router.push("/details");
    },
    toord() {
      this.$router.push("/ord");
    },
    left() {
      this.gettenleft();
    },
    right() {
      this.getten();
    },
    getten() {
      if (this.s >= 0) {
        this.dis = false;
      }
      var k = 0;
      this.ten = [];
      for (var i = 0; i < this.userlist.length; i++) {
        this.ten.push(this.userlist[this.s]);
        this.s++;
        k++;
        if (k >= 10) {
          this.userlistten = this.ten;
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
      for (var i = 0; i < this.userlist.length; i++) {
        this.ten.push(this.userlist[this.s]);
        this.s++;
        k++;
        if (k >= 10) {
          this.userlistten = this.ten;
          return;
        }
      }
    },
  },
};
</script>
<style>
.change {
  position: absolute;
  top: 0px;
  right: 0px;
}
.change1 {
  position: absolute;
  top: 0px;
  right: 150px;
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