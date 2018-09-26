<template>
   <div class="content">
    <div class="loginbox">
      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账户" prop="account">
          <el-input type="text" v-model="ruleForm2.account" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="checkPass">
          <el-input type="text" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
          <el-button type="button" @click="getclass">班级</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { setStore, getStore } from "../store/store.js";
import qs from "qs";
import { Base64 } from "js-base64";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账户"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      ruleForm2: {
        account: "",
        checkPass: ""
      },
      rules2: {
        account: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  created() {
    this.find();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.passweb();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    passweb() {
      let acc = this.ruleForm2.account;
      let pass = this.ruleForm2.checkPass;
      let data = {
        username: acc,
        password: pass
      };
      this.$api.post("/login", data, "h1", res => {
        if (res.status == 200) {
          console.log(res);
          let str = res.data.data;
          for (const key in str) {
            let token = str[key].split(".")[1];
            token = Base64.decode(token);
            let userID = JSON.parse(token).orgId;
            //this.save(userID,str) //执行token的存储
            let setdata = {
              ueername: this.ruleForm2.account,
              password: this.ruleForm2.checkPass,
              str: str
            };
            setStore(userID, setdata);
          }
        }
      });
    },
    //获取当前班级列表
    getclass() {
      let data = {
        clazzId: 519
      };
      this.$api.get("/clazzuser/clazzManagerAllotList", data, "h2", res => {
        if (res.status == 200) {
          console.log(res.data);
        }
      });
    },
    //查询当前的账户信息，如果存在用户名和密码则直接登录
    find() {
      if (localStorage.length > 0) {
        let str = getStore();
        console.log(str);
        this.ruleForm2.account = str.ueername;
        this.ruleForm2.checkPass = str.password;
      } else {
        console.log("当前没有账户登录");
      }
    }
  }
};
</script>
