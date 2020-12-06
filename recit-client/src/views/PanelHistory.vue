<template>
  <div class="history-container">
    <div class="table">
      <el-table :data="rawData" border style="width: 100%; overflow: auto">
        <el-table-column prop="time" label="时间" align="center">
          <template slot-scope="scope">
            {{ dateString(scope.row.time) }}
          </template>
        </el-table-column>

        <el-table-column prop="name" label="名称" align="center">
        </el-table-column>

        <el-table-column
          prop="file1"
          label="基因文件名"
          align="center"
        ></el-table-column>

        <el-table-column
          label="命名文件名"
          align="center"
        >
         <template slot-scope="scope">
              <span v-if="scope.row.file2">{{scope.row.file2}}</span>
              <span class="deem" v-else>未上传文件</span>
          </template>
        </el-table-column>
        <el-table-column prop="result" label="结果" align="center">
          <template slot-scope="scope">
              <span v-if="scope.row.result">{{scope.row.result.slice(0,30) + '...'}}</span>
              <span class="deem" v-else>未完成检验</span>
          </template>
        </el-table-column>

        <el-table-column prop="time" label="操作" align="center">
            <template slot-scope="scope">
            <el-button v-if="scope.row.result" @click="lookUp(scope.row.time)" type="success">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
  </div>
</template>

<script>
import config from "../../../config";
import axios from "axios";

export default {
  data() {
    return {
      rawData: [],
    };
  },
  computed: {
    serverUrl: () => `http://${config["dev-url"]}:${config["server-port"]}/api`,
  },
  mounted() {
    this.refresh();
  },
  methods: {
    refresh() {
      axios.get(this.serverUrl + "/history").then(({ data }) => {
        this.rawData = data?.list;
      });
    },
    dateString(newDate) {
      const date =
        typeof newDate === Date ? newDate : new Date(parseInt(newDate, 10));
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    },
    lookUp(time){
        this.$emit('detail', time)
    }
  },
};
</script>

<style lang="less" scoped>
.table {
  height: 500px;
  overflow-y: auto;
}
</style>