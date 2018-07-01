<template>
  <div class="menus">
    <el-menu class="el-menu-vertical-demo" :collapse-transition="false" :collapse="collapse" :router="true">
        <el-menu-item index="/home">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="1">
            <template slot="title">
                <i class="el-icon-location"></i>
                <span slot="title">导航一</span>
            </template>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
         
            <el-menu-item index="1-3">选项3</el-menu-item>
            <el-menu-item index="1-4">选项4</el-menu-item>
        </el-submenu>
        <el-menu-item index="/page1">
            <i class="el-icon-menu"></i>
            <span slot="title">page1</span>
        </el-menu-item>
        <el-menu-item index="/page2">
            <i class="el-icon-document"></i>
            <span slot="title">page2</span>
        </el-menu-item>
        <el-menu-item index="/login">
            <i class="el-icon-setting"></i>
            <span slot="title">登录</span>
        </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'menus',
  props: {
    collapse: Boolean
  },
  data(){
      return {
          
      }
  },
  components: {
   
  }
}
</script>