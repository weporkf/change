<template>
  <div>
    <div class="index">
      <div class="index_wrapper">
        <p class="index__title">Send</p>
        <!-- <div class="index_left"> -->
        <div class="index_rates" v-if="store.calculateCurrencyState?.in?.id && store.calculateCurrencyState?.out?.id">
          <p class="index_rates__data" style="height: 30px">Exchange rate: {{ normalizeGetValueCurrentCourse }}</p>
          <div class="index_minmax" v-if="store.getMinMaxCurrencies.in.min">
            <p>{{ normalizeGetMinMaxCurrencies.in }}</p>
          </div>
          <div v-else><span></span></div>
        </div>
        <p class="index_currencies_amount__title">Amount:</p>
        <div class="index_currencies">
          <!-- TODO -->

          <div class="index_right">
            <div class="index_exchange--send">
              <div class="index__section">
                <label class="index_currencies_options">
                  <el-select class="index_currencies_options__item" v-model="temporaryCurencyStateIds.in.id" filterable placeholder="In" @change="(value:string) => handleChangeCurency('InputChange', value)">
                    <el-option v-for="item in store.getOptionsCurrencies" :key="item.id" :label="item.coin" :value="item.id" :disabled="item.id === temporaryCurencyStateIds.out?.id" />
                  </el-select>
                </label>

                <label class="index_currencies_amount">
                  <el-input
                    class="index_currencies_amount__element"
                    type="number"
                    :disabled="!store.getCalculateCurrencyState?.in?.id"
                    :min="store.getMinMaxCurrencies.in.min"
                    :max="store.getMinMaxCurrencies.in.max"
                    v-model="store.calculateCurrencyState.in.amount"
                    @input="handleChangeInput('InputAmount')"
                  />
                </label>
                <!-- <el-button @click="handleSwapExchangeValues" class="index_wrapper_swap-button">Swap</el-button> -->
              </div>
              <el-button @click="handleSwapExchangeValues" :disabled="!store.temporaryCurencyStateIds.out.id || !store.calculateCurrencyState.out.amount" class="index_right__swap-button">Swap</el-button>
            </div>
            <p class="index__title">Receive</p>
            <!-- <p class="index_wrapper_currencies_amount__title">Amount:</p> -->
            <div class="index_rates" v-if="store.calculateCurrencyState?.in?.id && store.calculateCurrencyState?.out?.id">
              <p class="index_rates__data" style="height: 30px">Exchange rate: {{ normalizeGetValueCurrentCourse }}</p>
              <div class="index_minmax" v-if="store.getMinMaxCurrencies.out.min">
                <p>{{ normalizeGetMinMaxCurrencies.out }}</p>
              </div>
              <div v-else><span></span></div>
            </div>
            <p class="index_currencies_amount__title">Amount:</p>
            <div class="index_exchange">
              <div class="index__section">
                <!-- TODO -->
                <label class="index_currencies_options">
                  <el-select class="index_currencies_options__item" v-model="temporaryCurencyStateIds.out.id" filterable o placeholder="Out" @change="(value:string) => handleChangeCurency('OutputChange', value)">
                    <el-option v-for="item in store.getOptionsCurrencies" :key="item.id" :label="item.coin" :value="item.id" :disabled="item.id === temporaryCurencyStateIds?.in?.id" />
                  </el-select>
                </label>

                <div class="index_amount">
                  <label class="index_currencies_amount">
                    <el-input
                      class="index_currencies_amount__element"
                      :disabled="!store.calculateCurrencyState?.out?.id"
                      type="number"
                      :min="store.getMinMaxCurrencies?.out?.min"
                      :max="store.getMinMaxCurrencies?.out?.max"
                      v-model="store.calculateCurrencyState.out.amount"
                      @input="handleChangeInput('OutputAmount')"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="index_wrapper" :state="state" @submit="submitData">
            <div class="index_left">
              <p class="index__title">User Data</p>
              <label class="index_info">
                <p class="index_info__title">Telegram:</p>
                <el-input class="index_info__input" type="text" v-model="userData.telegram" maxlength="32" minlength="5" show-word-limit /> </label
              ><label class="index_info">
                <p class="index_info__title">E-mail <span class=" ">*</span>:</p>
                <el-input class="index_info__input" type="text" v-model="userData.email" />
              </label>

              <div class="index_info" v-if="store.getCalculateCurrencyState?.out?.type === 'FIAT'">
                <label class="index_info">
                  <p class="index_info__title">first name:</p>
                  <el-input class="index_info__input" type="text" v-model="inputsValueState.first_mame" />
                </label>
                <label class="index_info">
                  <p class="index_info__title">surname:</p>
                  <el-input class="index_info__input" type="text" v-model="inputsValueState.surname" />
                </label>
                <label class="index_info">
                  <p class="index_info__title">bank:</p>
                  <el-input class="index_info__input" type="text" v-model="inputsValueState.bank" />
                </label>
              </div>
              <label class="index_info" v-else>
                <p class="index_info__title">crypto wallet:</p>
                <el-input class="index_info__input" type="text" v-model="inputsValueState.crypto_wallet" />
              </label>
            </div>
            <el-checkbox v-model="inputsValueState.accept_aml">Accept aml</el-checkbox>
          </div>
          <DialogConfirmation class="index_info__button" @handleShowModal="handleShowModal" @handleCancelRequest="handleCancelRequest" @click.once="getTransferInfo" :optionId="store.calculateCurrencyState" />
        </div>
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CaclulateCurrencyInput, CoinInAndOutInputType, CoinsEnum, CoinsTypeEnum, GetCurrenciesRequestQuery, MakeOptional, Maybe, Scalars } from "#gql/default";
import { useDebounceFn } from "@vueuse/core";
import { useAppStore } from "~/stores/app";
// import { useField } from "vee-validate";

import * as yup from "yup";
import DialogConfirmation from "./DialogConfirmation.vue";
const store = useAppStore();
const { userData, temporaryCurencyStateIds } = storeToRefs(store);
const modalStore = useModalStore();
store.useGetCurrenciesRequest();
// const schema = Yup.object().shape({
//   telegram: Yup.string().required("Telegram in required"),
//   email: Yup.string().required("Email in required").email("Invalid email"),
// });
console.log(store.getMinMaxCurrencies);

const cancelRequest = ref(true);

const handleCancelRequest = (value: boolean) => {
  store.calculateCurrencyState = {
    in: {
      coin: CoinsEnum.USD,
      amount: "0",
      id: "",
      type: CoinsTypeEnum.CRYPTO,
    },
    out: {
      coin: CoinsEnum.BTC,
      amount: "0",
      id: "",
      type: CoinsTypeEnum.CRYPTO,
    },
  };
  store.transferInfo = { reciever_fiat_url: undefined, reciever_crypto_adress: undefined, id: "", user_info: {}, logs: [] };
  return (cancelRequest.value = value);
};

const state = ref({
  telegram: undefined,
  email: undefined,
});

const showModal = ref(false);

const submitData = () => {
  console.log("Data success");
};

console.log(store.getMinMaxCurrencies);
const normalizeGetMinMaxCurrencies = computed(() => {
  return {
    in: `min: ${store.getMinMaxCurrencies.in.min} ${store.getMinMaxCurrencies.in.coin}
    max: ${store.getMinMaxCurrencies.in.max} ${store.getMinMaxCurrencies.in.coin}`,
    out: `min: ${store.getMinMaxCurrencies.out.min} ${store.getMinMaxCurrencies.out.coin}
  max: ${store.getMinMaxCurrencies.out.max} ${store.getMinMaxCurrencies.out.coin}`,
  };
});
console.log(normalizeGetMinMaxCurrencies);

const handleChangeCurency = (type: "InputChange" | "OutputChange", value: string) => {
  const useNullebleAmounts = () => {
    store.calculateCurrencyState.in.amount = null;
    store.calculateCurrencyState.out.amount = null;
  };

  // TODO прописать тип getCoinById
  const getCoinById: any = store.getOptionsCurrencies?.find((item: any) => item?.id === value);

  if (type === "InputChange") {
    store.calculateCurrencyState.in = getCoinById;
  }

  if (type === "OutputChange") {
    store.calculateCurrencyState.out = getCoinById;
  }

  useNullebleAmounts();
};

const handleShowModal = () => {
  showModal.value = !showModal.value;
};

const TemporaryCurencyStateIds = ref<{ in: Pick<CoinInAndOutInputType, "id">; out: Pick<CoinInAndOutInputType, "id"> }>({
  in: {
    id: "",
  },
  out: {
    id: "",
  },
});

const fixedCalcId = ref<string>();

const useValidateAmount = (amount?: string | null) => {
  if (!amount) return null;
  if (typeof amount === "number") return null;
  if (amount === "0") return null;
  return amount;
};

const handleChangeInput = useDebounceFn(async (type: "InputAmount" | "OutputAmount") => {
  if (!store.calculateCurrencyState?.in?.amount && !store.calculateCurrencyState?.out?.amount) return;
  const useGetCurrentExit = (type: "InputAmount" | "OutputAmount", state: any): CaclulateCurrencyInput => {
    let getAthitectorValue: Partial<CaclulateCurrencyInput>;

    if (type === "InputAmount") {
      getAthitectorValue = {
        in: {
          ...state.in,
          amount: useValidateAmount(state?.in?.amount),
        },
        out: {
          ...state.out,
          amount: null,
        },
      };
    }

    if (type === "OutputAmount") {
      getAthitectorValue = {
        in: {
          ...state.in,
          amount: null,
        },
        out: {
          ...state.out,
          amount: useValidateAmount(state?.out?.amount),
        },
      };
    }
    return getAthitectorValue! as any;
  };
  const getCalculateData = await store.useGetCalcCurr(useGetCurrentExit(type, store.calculateCurrencyState));

  const { fixedCalcId: getFixedCalcId, in: input, out: output } = getCalculateData;
  store.calculateCurrencyState = {
    in: {
      ...store.calculateCurrencyState.in,
      amount: input.amount,
    },
    out: {
      ...store.calculateCurrencyState.out,
      amount: output.amount,
    },
  };
  fixedCalcId.value = getFixedCalcId;
}, 500);

const createTransfer = async (user_input: { telegram?: any; email: any; first_name?: string; surname?: string; bank?: string; card_number?: string; crypto_wallet?: string; accept_aml?: any }): Promise<any> => {
  if (!store?.calculateCurrencyState?.in && !store?.calculateCurrencyState?.in) return;
  const getInfo = (state: any): CaclulateCurrencyInput => {
    let getAthitectorValue: CaclulateCurrencyInput;
    if (state) {
      getAthitectorValue = {
        in: {
          ...state.in,
        },
        out: {
          ...state.out,
        },
      };
    }
    return getAthitectorValue! as any;
  };
  const getData = await store.useGetCalcCurr(getInfo(store.calculateCurrencyState));
  const { fixedCalcId: getFixedCalcId, in: input, out: output } = getData;
  const transferInfo = () => {
    return {
      fixedCalcId: getFixedCalcId,
      in: input,
      out: output,
      user_input: user_input,
    };
  };
  const GetTransferInfoType = await store.useCreateTransfer(transferInfo());
  return console.log({ transfer_id: GetTransferInfoType });
};

const getTransferInfo = async () => {
  console.log(cancelRequest.value);
  await createTransfer({
    telegram: inputsValueState.value.telegram,
    email: inputsValueState.value.email,
    first_name: inputsValueState.value.first_mame,
    surname: inputsValueState.value.surname,
    bank: inputsValueState.value.bank,
    crypto_wallet: inputsValueState.value.crypto_wallet,
    accept_aml: inputsValueState.value.accept_aml,
  });
  setTimeout(() => {
    return store.getTransferInfoRequest({ transfer_id: store.transfer_id });
  }, 2000);
  const interval = setInterval(async () => {
    if (cancelRequest.value == false) {
      clearInterval(interval);
    } else {
      await createTransfer({ email: inputsValueState.value.email });
      setTimeout(() => {
        return store.getTransferInfoRequest({ transfer_id: store.transfer_id });
      }, 2000);
    }
  }, 30000);
};

const normalizeGetValueCurrentCourse = computed(() => {
  return `${store.getValueCurrentCourse?.in?.amount}  ${store.getValueCurrentCourse?.in?.coin} = 
  ${Number(store.getValueCurrentCourse?.out?.amount).toFixed(7)}
               ${store.getValueCurrentCourse?.out?.coin}`;
});

const handleSwapExchangeValues = () => {
  const { in: Input, out: Output } = store.calculateCurrencyState;

  store.calculateCurrencyState = {
    in: {
      ...Output,
    },
    out: {
      ...Input,
      amount: null,
    },
  };

  const { in: InputTmp, out: OutputTmp } = temporaryCurencyStateIds.value;
  handleChangeInput("InputAmount");
  temporaryCurencyStateIds.value = {
    in: OutputTmp,
    out: InputTmp,
  };
};

const inputsValueState = ref({
  telegram: undefined,
  username: undefined,
  email: undefined,
  first_mame: undefined,
  surname: undefined,
  //с банком какая то хуйня исправьте, я спать
  bank: undefined,
  crypto_wallet: undefined,
  accept_aml: Boolean,
});
</script>

<style scoped lang="scss">
.index {
  box-sizing: border-box;
  background: white;
  padding: 25px;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  width: 100%;
  @media screen and (min-width: 2560) {
    width: auto;
    box-sizing: border-box;
  }
  &_rates {
    width: 100%;
    display: flex;
    font-size: 18px;
    justify-content: space-between;
  }
  &__section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    @media screen and (min-width: 2560px) {
      font-size: 30px;
    }
    @media screen and (max-width: 425px) {
      flex-direction: column;
      width: 100%;
    }
  }
  @media screen and (max-width: 375px) {
    &__section {
      flex-direction: column;
    }
  }
  &__header {
    position: sticky;
    top: 0;
    z-index: 2;
    &-select.el-select__inner {
      height: 20px !important;
      width: 100px;
    }
    &__nav {
      background-color: #fff;
      height: 50px;
      width: 100%;
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
        font-family: "Times New Roman", Times, serif;
        color: black;
      }
    }
  }
  &_wrapper {
    flex-direction: column;
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 20px;

    // &__title {
    // font-size: 24px;
    // font-weight: 600;
    // margin: 30px 0px;
    // @media screen and (max-width: 2560px) {
    //   margin-bottom: 30px;
    //   @media screen and (min-width: 2560px) {
    //     font-size: 45px;
    //   }
  }
  &_left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    border-top: 1px solid gray;
    padding-top: 10px;
  }
  &_right {
    display: flex;
    flex-direction: column;
    gap: 20px;

    text-align: right;
    position: relative;

    margin-bottom: 40px;
    &__swap-button {
      // display: flex;
      // margin: 15px auto;
      position: absolute;
      bottom: 0;
      right: 50%;
      transform: translate(50%, 50%);
      @media screen and (min-width: 2560px) {
        height: 60px;
        width: 200px;
        font-size: 30px;
      }
    }
  }
  &_exchange--send {
    position: relative;
    border-bottom: 1px solid;
    border-color: rgb(180, 180, 180);
    padding-bottom: 60px;
  }
  &__title {
    text-align: start;
    font-size: 24px;
  }
  &_currencies {
    width: 100%;
    &_amount {
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: flex-end;
      gap: 10px;

      @media screen and (max-width: 425px) {
        flex-direction: column;
      }
      @media screen and (min-width: 2560px) {
        font-size: 30px;
      }
      &__title {
        text-align: end;
        width: 100%;

        @media screen and (max-width: 768px) {
          align-self: flex-start;
          font-size: 12px;
        }

        @media screen and (max-width: 425px) {
          align-self: flex-start;
          font-size: 12px;
        }
      }
      @media screen and (max-width: 375px) {
        &__title {
          display: none;
        }
      }
      &__element {
        height: 45px;
        width: 200px;
        @media screen and (min-width: 2560px) {
          height: 80px;
          width: 500px;
        }
        @media screen and (max-width: 768px) {
          height: 40px;
        }
        @media screen and (max-width: 425px) {
          height: 30px;
          width: 100%;
        }
      }
      &__element::placeholder {
        @media screen and (min-width: 2560px) {
          font-size: 25px;
        }
      }
    }
    &_options {
      width: 22%;
      height: 50px;
      @media screen and (min-width: 425px) {
        width: 100%;
      }
      @media screen and (min-width: 768px) {
        width: 50%;
      }
      @media screen and (min-width: 2560px) {
        width: 30%;
      }
      &__item {
        width: 100%;

        @media screen and (max-width: 424px) {
          width: 100%;
        }
        @media screen and (min-width: 2560px) {
          &__item::placeholder {
            font-size: 100;
          }
        }
      }
      @media screen and (max-width: 375px) {
        &__item {
          width: 100%;
        }
      }
    }
  }

  &_info {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-top: 10px;

    width: 100%;

    &__title {
      font-size: 15px;
      color: gray;
      @media screen and (min-width: 2560px) {
        width: 100%;
        font-size: 30px;
      }
      @media screen and (max-width: 768px) {
        width: 100%;
        font-size: 12px;
      }
      @media screen and (max-width: 425px) {
        width: 100%;
        font-size: 12px;
      }
    }
    &__input {
      max-width: 400px;
      @media screen and (max-width: 1024px) {
        width: 50%;
      }

      @media screen and (max-width: 768px) {
        width: 50%;
      }

      @media screen and (max-width: 575px) {
        height: 30px;
        width: 100%;
      }
      &_wraper {
        height: 50px;
      }
    }
    &__button {
      background-color: --secondary-gradient-color;
      color: white;
      width: 150px;
      height: 50px;
      border-radius: 30px;
      margin-top: 20px;
      @media screen and (max-width: 425px) {
        width: 100%;
      }
      @media screen and (min-width: 2560px) {
        width: 250px;
        height: 80px;
      }
    }
  }
}
</style>
import { CoinInAndOutInputType, CaclulateCurrencyInput } from '#gql'; import { CoinInAndOutInputType, CaclulateCurrencyInput } from '#gql';
