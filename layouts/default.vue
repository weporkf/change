<template>
  <div class="layout">
    <Header />
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  margin: 0 400px;
  @media screen and (max-width: 1440px) {
    margin: 0 190px;
  }
  @media screen and (max-width: 1024px) {
    margin: 0 200px;
  }
  @media screen and (max-width: 1024px) {
    margin: 0 100px;
  }
  @media screen and (max-width: 425px) {
    margin: 0 20px;
  }
  justify-content: center;
}
</style>
