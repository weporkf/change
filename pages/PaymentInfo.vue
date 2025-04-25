<template>
  <div>
    <div class="wrapper">
      <p class="wrapper__text">tg: {{ store.userData.telegram }}</p>
      <p class="wrapper__text">email: {{ store.userData.email }}</p>
      <p class="wrapper__text">ID трансфера: {{ modalStore.transferInfo?.logs?.[0]?.transfer_id }}</p>
      <p class="wrapper__text">Адрес кошелька для отправки: {{ modalStore.transferInfo.reciever_crypto_adress }}</p>
      <p class="wrapper__text">Отправляю: {{ modalStore.getSendInfo.amount }} {{ modalStore.getSendInfo.currency }}</p>
      <p class="wrapper__text">Получаю: {{ modalStore.getReciveInfo.amount }} {{ modalStore.getReciveInfo.currency }}</p>
      <p class="wrapper__text">Статус заявки: {{ modalStore.transferInfo?.logs?.[0]?.log }} {{ modalStore.transferInfo?.logs?.[0]?.log ? "в" : "" }} {{ store.transferInfo?.logs?.[0]?.created_at }}</p>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from "~/stores/app";

import QrcodeVue from "qrcode.vue";
import { useModalStore } from "~/stores/modalStore";
const centerDialogVisible = ref(false);

const store = useAppStore();
const modalStore = useModalStore();
</script>

<style lang="scss" scoped>
* {
  font-family: "Inter-Regular", -apple-system, BlinkMacSystemFont, "Segoe UI", Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", Roboto, Lato, Montserrat, Nunito, "Source Sans Pro", "PT Sans", Rubik, "Work Sans", Raleway, Quicksand,
    sans-serif;
}
.wrapper {
  height: 100svh;
  background: #fff;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
  gap: 20px;
  &__text {
    font-size: 20px;
  }
}
</style>
