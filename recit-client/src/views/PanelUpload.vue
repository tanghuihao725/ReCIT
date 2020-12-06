<template>
  <div class="upload-container">
    <el-form :model="formInline" class="form">
      <el-form-item label="实例名称">
        <el-input
          v-model="formInline.title"
          placeholder="请输入实例名称"
        ></el-input>
      </el-form-item>

      <el-form-item label="基因表达数据">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-change="file1Change"
          :on-remove="() => file1 = ''"
          :file-list="fileList1"
        >
         <el-select
          placeholder="历史文件上传"
          v-model="value1"
          size="small"
          @change="file1Change"
          label="基因表达数据"
          style="width:150px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
          <el-button size="small" type="primary"
            >输入文件上传<i class="el-icon-upload el-icon--right"></i
          ></el-button>
          <span slot="tip" class="el-upload__tip" style="margin: 0 20px">
            请上传疾病的基因表达式文件
          </span>
        </el-upload>
      </el-form-item>

      <el-form-item label="对应基因名称">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-change="file2Change"
          :file-list="fileList2"
        >
         <el-select
          placeholder="历史文件上传"
          v-model="value2"
          size="small"
          @change="file2Change"
          label="基因表达数据"
          style="width:150px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

          <el-button size="small" type="warning"
            >命名文件上传<i class="el-icon-upload el-icon--right"></i
          ></el-button>
          <span slot="tip" class="el-upload__tip" style="margin: 0 20px">
            请上传与基因对应的名称文件
          </span>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button
          type="success"
          style="width: 50%"
          @click="runTest"
          :disabled="!file1"
          >运行检测</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import axios from "axios";
import config from "../../../config";

export default {
  data() {
    return {
      fileList1: [],
      fileList2: [],
      file1: "",
      file2: "",
      formInline: {
        title: "",
      },
      value1: "",
      value2: "",
    };
  },
  props:['options'],
  computed: {
    serverUrl: () => `http://${config["dev-url"]}:${config["server-port"]}/api`,
  },
  mounted() {
  },
  methods: {
    runTest() {
      this.$emit("run", {
        name: this.formInline.title,
        file1: this.file1,
        file2: this.file2,
      });
    },
    file1Change(file) {
      console.log(file);
      this.fileList1 = file.name ? [file] : [{ name: file }];
      this.file1 = file.name ? file.name : file;
    },
    file2Change(file) {
      console.log(file);
      this.fileList2 = file.name ? [file] : [{ name: file }];
      this.file2 = file.name ? file.name : file;
    },
    fileRemove(id) {
      id === 1 ? (this.fileList1 = []) : (this.fileList2 = []);
      id === 1 ? (this.file1 = "") : (this.file2 = "");
    },
  },
};
</script>


<style lang="less" scoped>
.upload-container {
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .form {
    width: 600px;
    text-align: left;
  }
}
</style>