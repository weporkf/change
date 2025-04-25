import { CaclulateCurrencyInput, CoinInAndOutInputType, CoinsEnum, CoinsTypeEnum, CreateTransferInput, GetCurrenciesRequestQuery, GetTransferInfoType } from "#gql/default";
import { defineStore } from "pinia";
import { useAppStore } from "~/stores/app";
interface AppState {
  send: {
    currency?: string;
    amount?: number;
  };
  receive: {
    currency?: string;
    amount?: number;
  };
  userData: {
    telegram?: any;
    email: any;
    first_name?: string;
    surname?: string;
    bank?: string;
    card_number?: string;
    crypto_wallet?: string;
    accept_aml?: any;
  };
  transfer_id: string;
  transferInfo: {
    reciever_fiat_url?: any;
    reciever_crypto_adress?: any;
    id?: any;
    logs?: any;
    user_info?: any;
  };
  loading: boolean;
}

export const useModalStore = defineStore({
  id: "modal-store",
  state: (): AppState => {
    return {
      send: { amount: undefined, currency: undefined },
      receive: { amount: undefined, currency: undefined },
      userData: { telegram: "", email: undefined, first_name: "", surname: "", bank: "", card_number: "", crypto_wallet: "", accept_aml: null },
      transfer_id: "",
      transferInfo: { reciever_fiat_url: "", reciever_crypto_adress: "", id: "", user_info: {}, logs: [] },
      loading: false,
    };
  },
  getters: {
    getSendInfo(state) {
      const store = useAppStore();
      return (state.send = {
        amount: Number(store.calculateCurrencyState?.in?.amount),
        currency: store.calculateCurrencyState.in.coin,
      });
    },
    getReciveInfo(state) {
      const store = useAppStore();
      return (state.receive = {
        amount: Number(store.calculateCurrencyState?.out?.amount),
        currency: store.calculateCurrencyState.out.coin,
      });
    },
    getUserData(state) {
      const store = useAppStore();
      return (state.userData = store.transferInfo.user_info);
    },
  },
  actions: {},
});
