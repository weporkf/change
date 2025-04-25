<template>
  <div class="header">
    <div class="header__nav">
      <el-image class="header__nav_img" style="width: 25px; height: 25px" src="https://th.bing.com/th/id/OIG1.Spe5YU4E51ulS38Q7zuL?w=270&h=270&c=6&r=0&o=5&pid=ImgGn" />
      <el-link class="header__nav_link">Our contacs</el-link>
      <el-link class="header__nav_link">What we Do</el-link>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 2;

  min-width: 100%;
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
  background-color: white;
  &__nav {
    padding-left: 15px;
    height: 50px;

    display: flex;
    align-items: center;
    gap: 20px;
    &_img {
      margin-right: 5px;
    }

    &_link {
      width: max-content;
      font-size: 20px;
      display: flex;
      justify-content: start;
      font-family: "Times New Roman", Times, serif;
      color: black;
    }
  }
}
</style>
