<template>
  <div>
    <el-button class="index_info__buttons" plain @click="centerDialogVisible = true" :disabled="store.userData.email?.trim() === ''"> Exchange </el-button>

    <el-dialog class="dialog" style="border-radius: 10px; width: min-content" align-center v-model="centerDialogVisible">
      <template #header="{ close, titleId, titleClass }"> </template>
      <div class="main">
        <div class="main-currency">
          <div class="main-currency__send">
            <p class="main-currency__send__info">Receiving</p>
            <p class="main-currency__send-name">{{ optionId.in.coin }}</p>
            <img class="main-currency__send-img" src="https://th.bing.com/th/id/OIP.S1PvIRzd4SK-D5KjQBb0fAHaEo?rs=1&pid=ImgDetMain" alt="" />
          </div>
          <div class="main-currency__amount">
            <div class="main-currency__amount__current">
              <p class="main-currency__amount-text">{{ optionId.in.amount }} {{ optionId.in.coin }}</p>
              <div class="">
                <el-icon :size="20"> <ElIconRight /> </el-icon>
                <p class="main-currency__amount-name">to</p>
              </div>
              <p class="main-currency__amount-text">{{ optionId.out.amount }} {{ optionId.out.coin }}</p>
            </div>
          </div>
          <div class="main-currency__take">
            <p class="main-currency__take__info">Sending</p>
            <p class="main-currency__take-name">{{ optionId.out.coin }}</p>
            <img class="main-currency__take-img" src="https://th.bing.com/th/id/OIP.S1PvIRzd4SK-D5KjQBb0fAHaEo?rs=1&pid=ImgDetMain" alt="" />
          </div>
        </div>
        <div class="main-currency__info" v-if="realLoading">
          <div class="main-currency__info__refs" v-if="!store.loading && store.transferInfo?.reciever_crypto_adress">
            <qrcode-vue :size="300" :value="store.transferInfo.reciever_crypto_adress" class="main-currency__info__refs__qrcode"></qrcode-vue>
            <p>Адрес кошелька для отправки: {{ store.transferInfo.reciever_crypto_adress }}</p>
          </div>
          <div class="main-currency__info__refs" v-else-if="!store.loading && store.transferInfo?.reciever_fiat_url">
            <a target="_blank" :href="store.transferInfo?.reciever_fiat_url">Ссылка на обмен: {{ store.transferInfo?.reciever_fiat_url }}</a>
          </div>
          <div class="main-currency__info__logs">
            <p>Статус заявки: {{ store.transferInfo?.logs?.[0]?.log }} {{ store.transferInfo?.logs?.[0]?.log ? "в" : "" }} {{ store.transferInfo?.logs?.[0]?.created_at }}</p>
            <p>ID трансфера: {{ store.transferInfo?.logs?.[0]?.transfer_id }}</p>
            <div v-for="(value, item, index) in modalStore.getUserData" :key="index">
              <div v-if="value !== null && value !== false">{{ item }}: {{ value }}</div>
            </div>
            <p>Отправляю: {{ modalStore.getSendInfo.amount }} {{ modalStore.getSendInfo.currency }}</p>
            <p>Получаю: {{ modalStore.getReciveInfo.amount }} {{ modalStore.getReciveInfo.currency }}</p>
          </div>
        </div>
        <div class="loader" v-else />
      </div>
      <el-button class="main-currency__close-button" plain type="primary" @click="centerDialogVisible = false"><NuxtLink to="/PaymentInfo" style="text-decoration: none; color: lightblue">Confirm</NuxtLink></el-button>
      <br />
      <el-button class="main-currency__close-button" plain type="danger" @click="handleCancelRequest(false)">Cancel</el-button>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import QrcodeVue from "qrcode.vue";
import { useAppStore } from "~/stores/app";
import { useModalStore } from "~/stores/modalStore";
const centerDialogVisible = ref(false);

const store = useAppStore();
const modalStore = useModalStore();

interface Props {
  optionId: any;
}
const emit = defineEmits(["handleCancelRequest"]);

const showModal = ref(false);

const handleChangeDialog = () => {
  showModal.value = !showModal.value;
};

const handleCancelRequest = (value: boolean) => {
  centerDialogVisible.value = false;
  emit("handleCancelRequest", value);
};

const realLoading = computed(() => {
  if (store.transferInfo.reciever_crypto_adress !== undefined || store.transferInfo.reciever_fiat_url !== undefined) {
    return true;
  } else {
    return false;
  }
});

// const emit = defineEmits(["getInfo"]);

// const getInfo = () => {
//   emit("getInfo");
// };

const props = defineProps<Props>();

const beforeClose = (event: any) => {
  console.log(event);
  // What a gamble... 50% chance to cancel closing

  event.cancel();
};
</script>

<style scoped lang="scss">
/* HTML: <div class="loader"></div> */
.loader {
  width: 60px;
  aspect-ratio: 1;
  --g: conic-gradient(from -90deg at 10px 10px, black 90deg, #0000 0);
  background: var(--g), var(--g), var(--g);
  background-size: 50% 50%;
  animation: l16 1s infinite;
  transform: translateX(-50%);
  margin-left: 50%;
  margin-bottom: 30px;
}
@keyframes l16 {
  0% {
    background-position: 0 0, 10px 10px, 20px 20px;
  }
  50% {
    background-position: 0 20px, 10px 10px, 20px 0;
  }
  100% {
    background-position: 20px 20px, 10px 10px, 0 0;
  }
}
.el-overlay-dialog {
  display: none;
}

.dialog {
  // @media screen and (max-width: 750px) {
  //   width: 400px !important;
  //   margin: 0;
  // }
  // @media screen and (max-width: 425px) {
  //   width: 400px;
  //   margin: 0;
  // }
}
.main {
  display: flex;
  flex-direction: column;
  width: 100%;

  justify-content: center;
  @media screen and (max-width: 750px) {
    width: 400px;
  }
  @media screen and (min-width: 1960px) {
    width: 600px;
  }
  @media screen and (min-width: 2560px) {
    width: 1200px;
  }
  &-currency {
    width: 100%;
    display: flex;
    gap: 20px;
    justify-content: space-around;

    &__amount {
      display: flex;
      align-items: center;
      font-size: 20px;
      @media screen and (max-width: 750px) {
        font-size: 13px;
      }
      @media screen and (min-width: 2560px) {
        font-size: 30px;
      }
    }
    &__amount__current {
      display: flex;
      gap: 10px;
    }
    &__amount-img {
      display: flex;
      justify-content: center;
      width: 100px;
      height: 100px;
    }

    &__send {
      font-size: 20px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 90px;
      @media screen and (max-width: 750px) {
        font-size: 13px;
      }
      @media screen and (min-width: 2560px) {
        font-size: 30px;
      }
      &-name {
        margin: 0;
        margin-bottom: 10px;
      }
      &-img {
        object-fit: cover;
        border-radius: 50px;
        width: 70px;
        height: 70px;
        @media screen and (min-width: 2560px) {
          width: 150px;
          height: 150px;
        }
      }
    }
    &__take {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 20px;
      text-align: center;
      width: 90px;
      @media screen and (max-width: 750px) {
        font-size: 13px;
      }
      @media screen and (min-width: 2560px) {
        font-size: 30px;
      }
      &-img {
        object-fit: cover;
        border-radius: 50%;
        width: 70px;
        height: 70px;
        @media screen and (min-width: 2560px) {
          width: 150px;
          height: 150px;
        }
      }
      &-name {
        margin: 0;
        margin-bottom: 10px;
      }
    }
    &__close-button {
      margin-top: 15px;
      display: flex;
      align-self: center;
      height: 45px;
      width: 120px;
      border-radius: 10px;
      margin: 0 auto;
      @media screen and (min-width: 2560px) {
        height: 70px;
        width: 200px;
      }
    }
    &__info {
      margin: 10px;
      &__refs {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 15px;
        &__qrcode {
          width: 500px;
          aspect-ratio: 1;
          margin-bottom: 10px;
        }
      }
    }
  }
}
.index_info__buttons {
  background-color: teal;
  color: white;
  border-radius: 10px;
  width: 150px;
  height: 50px;
  @media screen and (min-width: 2560px) {
    width: 250px;
    height: 80px;
  }
}
</style>
