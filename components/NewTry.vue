<template>
  <div class="mb-4">
    <el-button plain>Plain</el-button>
    <a></a><el-button color="red" class="button" plain>Primary</el-button>
    <el-button type="success" plain>Success</el-button>
    <el-button type="info" plain>Info</el-button>
    <el-button type="warning" plain>Warning</el-button>
    <el-button type="danger" plain>Danger</el-button>
    <div class="testing">
      <button class="testing__button">qq</button>
    </div>
  </div>
</template>
<style lang="scss">
.testing {
  &__button {
    color: pink;
  }
  padding: 20px;
}

.button {
  color: black;
}
</style>
