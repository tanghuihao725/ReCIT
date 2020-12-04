<template>
  <div class="home">
    <el-tabs
      tab-position="left"
      style="height: 510px"
      class="main-tab"
      v-model="tabIndex"
    >
      <el-tab-pane label="文件上传" name="1" class="success-tab">
        <PanelUpload @run="fileDone" />
      </el-tab-pane>
      <el-tab-pane label="运行窗口" name="2" :disabled="!fileUpload">
        <Term ref="term" :socketURI="`ws://${config['dev-url']}:9999`" />
      </el-tab-pane>
      <el-tab-pane label="结果查询" name="3" :disabled="!fileUpload"
        >角色管理</el-tab-pane
      >
      <el-tab-pane label="结果验证" name="4" :disabled="!fileUpload"
        >定时任务补偿</el-tab-pane
      >
    </el-tabs>
  </div>
</template>

<script>
import axios from "axios";

import Term from "@/components/Term";
import PanelUpload from "./PanelUpload";
import config from "../../../config";

export default {
  name: "Home",
  data() {
    return {
      fileUpload: false,
      tabIndex: "1",
      config,
    };
  },
  methods: {
    fileDone(fileData) {
      this.fileUpload = true;
      this.tabIndex = "2";
      // 创建服务器runtime数据 创建完成后创建websocket连接
      axios
        .post(
          `http://${config["dev-url"]}:${config["server-port"]}/api/init`,
          fileData
        )
        .then((res) => this.$refs.term.init(fileData));
    },
  },
  components: {
    Term,
    PanelUpload,
  },
};
</script>

<style lang="less" scoped>
.main-tab {
  width: 80%;
  margin: 0 auto;
  height: 1000px;
  // border: 1px solid red;
  .success-tab {
    color: green;
  }
}
</style>