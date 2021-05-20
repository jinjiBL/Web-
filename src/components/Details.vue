<template>
  <div>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="searchorders"
            clearable
            @clear="getordersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchordersname()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" round @click="sx" class="sx"
            >刷新</el-button
          >
          <el-button round class="change" @click="tohome">返回主页</el-button>
        </el-col>
      </el-row>

      <el-table :data="orderslist" border stripe>
        <!-- <el-table-column type="index" label="#"></el-table-column> -->
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="名字" prop="name"></el-table-column>
        <el-table-column label="直接客服数量" prop="num"></el-table-column>
        <el-table-column label="直接订单数量" prop="o_num"></el-table-column>
        <el-table-column label="间接订单数量" prop="I_num"></el-table-column>
      </el-table>
      <!-- 分页 -->
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchorders: "",
      orderslist: [],
      userlist: [],
    };
  },
  created() {
    this.getuserList();
  },
  // beforeMount() {
  //   this.updataorders();
  // },
  methods: {
    searchordersname() {
      //当输入框内是空的时候则获取数据库数据给orderslist
      if (this.searchorders == "") {
        return this.getordersList();
      }
      //如果用户搜索用户则匹配并将userlist重新赋值userlist[i]
      for (var i = 0; i < this.orderslist.length; i++) {
        if (this.orderslist[i].name == this.searchorders) {
          let arr = [];
          arr.push(this.orderslist[i]);
          return (this.orderslist = arr);
        }
      }
      this.$message.warning("查无此人");
    },
    getuserList() {
      this.$http
        .get("http://localhost:3000/api/user/query")
        .then((response) => {
          console.log(response);
          this.userlist = response.data;
          this.total = this.userlist.length;
          console.log(this.userlist);
          this.getordersList();
        });
    },
    getordersList() {
      this.$http
        .get("http://localhost:3000/api/user/queryorders")
        .then((response) => {
          console.log(response);
          this.orderslist = response.data;
          console.log(this.orderslist);
          this.updataorders();
        });
    },
    updataorders() {
      for (var j = 0; j < this.orderslist.length; j++) {
        var n = 0;
        var o_n = 0;
        var I_n = 0;
        var S_id = this.orderslist[j].S_id;
        for (var i = 0; i < this.userlist.length; i++) {
          if (this.userlist[i].S_id == this.orderslist[j].S_id) {
            o_n = this.userlist[i].o_num;
          } else if (this.userlist[i].C_id == this.orderslist[j].S_id) {
            n++;
            I_n += this.userlist[i].o_num;
          }
        }
        this.$http
          .post(
            "http://localhost:3000/api/user/reviseOrders",
            {
              num: n,
              o_num: o_n,
              I_num: I_n,
              S_id: S_id,
            },
            {}
          )
          .then((response) => {
            console.log(response);
          });
      }
    },
    tohome() {
      this.$router.push("/home");
    },
    sx() {
      this.$router.go(0);
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
.sx {
  position: absolute;

  right: 200px;
}
</style>