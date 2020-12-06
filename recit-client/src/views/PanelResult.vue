<template>
  <div class="container">
    <div class="title">
      <span class="deem"> {{ dateString(time) }}</span>
      共检测出
      <span class="em">{{ tableData.length }}</span>
      个基因
    </div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%; overflow: auto">
        <el-table-column prop="id" label="序号" width="180" align="center">
        </el-table-column>
        <el-table-column
          prop="index"
          label="对应位置索引"
          width="360"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="name1" label="name1"> </el-table-column>
        <el-table-column prop="name2" label="name2"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../../config";

export default {
  data() {
    return {
      rawData: [],
      time: 0,
    };
  },
  computed: {
    serverUrl: () => `http://${config["dev-url"]}:${config["server-port"]}/api`,
    tableData() {
      return this.rawData.map((item, index) => {
        const { name = ",", ...others } = item;
        const arr = name && name.split(",");
        const name2 = arr.pop();
        const name1 = arr.join("");
        return {
          ...others,
          name1,
          name2,
          id: index + 1,
        };
      });
    },
  },
  mounted() {
      this.refresh()
  },
  methods: {
    dateString(newDate) {
      const date =
        typeof newDate === Date ? newDate : new Date(parseInt(newDate, 10));
      return `检测时间: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    },
    refresh(id) {
      axios.get(this.serverUrl + "/result" +(id ? `?id=${id}` : '')).then(({ data }) => {
        if(data && data.data) this.rawData = data.data;
        this.time = data?.time;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  .title {
    margin: 15px 0;
    
  }

  .table {
    height: 500px;
    overflow-y: auto;
  }
}
</style>