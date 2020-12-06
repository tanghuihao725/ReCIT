<template>
  <div class="home">
    <el-tabs
      tab-position="left"
      style="height: 510px"
      class="main-tab"
      v-model="tabIndex"
    >
      <el-tab-pane label="文件上传" name="1" class="success-tab">
        <PanelUpload @run="fileDone" :options="options" />
      </el-tab-pane>
      <el-tab-pane label="运行窗口" name="2" :disabled="!fileUpload">
       
        <Term ref="term" :socketURI="`ws://${config['dev-url']}:9999`" />
         <el-progress
          :text-inside="true"
          :stroke-width="24"
          :percentage="progressPerc"
          :color="progressColor"
          style="margin: 30px"
        ></el-progress>
      </el-tab-pane>
      <el-tab-pane label="结果查询" name="3">
        <PanelResult ref="panelResult"/>
      </el-tab-pane>
      <el-tab-pane label="" name="null" disabled></el-tab-pane>
      <el-tab-pane label="历史结果" name="5">
        <PanelHistory @detail="handleDetail"/>
      </el-tab-pane>
    </el-tabs>
    
  </div>
</template>

<script>
import axios from "axios";

import Term from "@/components/Term";
import PanelUpload from "./PanelUpload";
import PanelResult from "./PanelResult";
import PanelHistory from "./PanelHistory"
import config from "../../../config";

export default {
  name: "Home",
  data() {
    return {
      fileUpload: false,
      tabIndex: "1",
      config,
      runtime: "",
      progressPerc: 0,
      options: [],
    };
  },
  computed: {
    serverUrl: () => `http://${config["dev-url"]}:${config["server-port"]}/api`,
    progressColor() {
      if (this.progressPerc < 30) {
          return '#909399';
        } else if (this.progressPerc < 70) {
          return '#e6a23c';
        } else {
          return '#67c23a';
        }
    },
  },
  mounted(){
     axios.get(this.serverUrl + "/history-upload").then(({ data }) => {
        const { list } = data;
        this.options = list.map((filename) => ({
          label: filename,
          value: filename,
        }));
      });
  },
  methods: {
    fileDone(fileData) {
      this.fileData = fileData;
      this.fileUpload = true;
      this.tabIndex = "2";
      // 创建服务器runtime数据 创建完成后创建websocket连接
      axios.post(`${this.serverUrl}/init`, fileData).then((res) => {
        if (!res.data?.success) return; // 成功再执行下面的语句
        // 初始化终端
        this.$refs.term.init(fileData);
        // 获取运行时状态
        const timer = setInterval(() => {
          axios.get(this.serverUrl + "/runtime").then(({ data }) => {
            const { end, process, progress } = data;
            this.progressPerc = progress || 0
            if (end) {
              this.$refs.panelResult.refresh()
              clearInterval(timer)
              setTimeout(() => {
                this.tabIndex = "3"
              }, 3000)
            }
          });
        }, 1000);
      });
    },
    handleDetail(id){
      this.tabIndex = "3"
      this.$refs.panelResult.refresh(id)
    }
  },
  components: {
    Term,
    PanelUpload,
    PanelResult,
    PanelHistory,
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