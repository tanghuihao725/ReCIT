<template>
  <div class="home">
    <Term class="x-term" v-show="visible" />
    <button @click="handleShow">按钮！！！！</button>

  </div>
</template>

<script>
import Term from '@/components/Term'

export default {
  name: 'Home',
  data(){
    return {
      visible: true
    }
  },
  methods:{
    handleShow(){
      this.visible = !this.visible
    }
  },
  components: {
    Term
  }
}
</script>

<style scoped>
.x-term{
  width: 50%;
  margin: 0 auto;
}
</style>
