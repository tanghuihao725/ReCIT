<template>
  <div id="app">
    <div id="nav">
      <h1 class="title">致病基因检测系统</h1>
      <router-link to="/">致病基因检测</router-link> |
      <router-link to="/about">历史记录查询</router-link>
    </div>
    <router-view/>
  </div>
</template>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
  position: relative;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #03f;
}

*{
  margin: 0;
  padding: 0;
}
html{
  /* background: url(assets/jiyin-bg.jpeg); */
}
</style>

<style lang="less" scoped>
.title{
  margin: 10px 0 30px 0;
}
</style>
