import { CaclulateCurrencyInput, CoinInAndOutInputType, CoinsEnum, CoinsTypeEnum, CreateTransferInput, GetCurrenciesRequestQuery, GetTransferInfoType } from '#gql/default'
import { defineStore } from 'pinia'
interface AppState {
  send: {
    currency?: string
    amount?: number
  }
  receive: {
    currency?: string
    amount?: number
  }
  userData: {
    telegram?: string
    email?: string
  }
  getCurrency: {
    getCurrenciesRequest?: any
    // getCurrenciesRequest?: ref<GetCurrenciesRequestQuery["getCurrencies"]["currencies"]>;
  }
  calculateCurrencyState: CaclulateCurrencyInput
  temporaryCurencyStateIds: { in: Pick<CoinInAndOutInputType, 'id'>; out: Pick<CoinInAndOutInputType, 'id'> }
  transfer_id: any
  transferInfo: {
    reciever_fiat_url?: any
    reciever_crypto_adress?: any
    id?: any
    logs?: any
    user_info?: any
  }
  loading: boolean
}

export const useAppStore = defineStore({
  id: 'app-store',
  state: (): AppState => {
    return {
      send: { amount: undefined, currency: undefined },
      receive: { amount: undefined, currency: undefined },
      userData: { telegram: '', email: '' },
      getCurrency: { getCurrenciesRequest: null },
      calculateCurrencyState: {
        in: {
          coin: CoinsEnum.USD,
          amount: '0',
          id: '',
          type: CoinsTypeEnum.CRYPTO,
        },
        out: {
          coin: CoinsEnum.BTC,
          amount: '0',
          id: '',
          type: CoinsTypeEnum.CRYPTO,
        },
      },
      temporaryCurencyStateIds: {
        in: {
          id: '',
        },
        out: {
          id: '',
        },
      },
      transfer_id: '',
      transferInfo: { reciever_fiat_url: undefined, reciever_crypto_adress: undefined, id: '', user_info: {}, logs: [] },
      loading: false,
    }
  },
  getters: {
    getCurrenciesRequest(state: AppState) {
      return state.getCurrency.getCurrenciesRequest
    },
    getCalculateCurrencyState(state: AppState) {
      return state.calculateCurrencyState
    },
    getOptionsCurrencies(state: AppState) {
      return state.getCurrency?.getCurrenciesRequest?.map((value: any) => {
        return {
          coin: value?.constant?.symbol,
          amount: 0,
          id: value.id,
          type: value?.constant?.type,
        }
      })
    },
    getValueCurrentCourse(state: AppState): { in: Pick<CoinInAndOutInputType, 'coin' | 'amount'>; out: Pick<CoinInAndOutInputType, 'coin' | 'amount'> } {
      const getOutCurrency = state.getCurrency?.getCurrenciesRequest.find((val: any) => val?.id === state.calculateCurrencyState.in?.id)?.quotes

      return {
        in: {
          coin: state.calculateCurrencyState?.in?.coin,
          amount: getOutCurrency?.[state.calculateCurrencyState?.in?.coin],
        },
        out: {
          coin: state.calculateCurrencyState?.out?.coin,
          amount: getOutCurrency?.[state.calculateCurrencyState.out?.coin],
        },
      }
    },
    getMinMaxCurrencies(state: AppState) {
      const exchngeInMinMax = state.getCurrency?.getCurrenciesRequest?.find((value: any) => value.id === state.calculateCurrencyState?.in?.id)?.constant
      const exchngeOutMinMax = state.getCurrency?.getCurrenciesRequest?.find((value: any) => value.id === state.calculateCurrencyState?.out?.id)?.constant

      return {
        in: {
          coin: exchngeInMinMax?.symbol,
          min: exchngeInMinMax?.exchange_min,
          max: exchngeInMinMax?.exchange_max,
        },
        out: {
          coin: exchngeOutMinMax?.symbol,
          min: exchngeOutMinMax?.exchange_min,
          max: exchngeOutMinMax?.exchange_max,
        },
      }
    },
  },
  actions: {
    async useGetCurrenciesRequest(): Promise<GetCurrenciesRequestQuery['getCurrencies']['currencies']> {
      const { data } = await useAsyncGql({
        operation: 'getCurrenciesRequest',
        options: {
          transform: (data) => data?.getCurrencies?.currencies ?? [],
        },
      })
      return (this.getCurrency.getCurrenciesRequest = data?.value)
    },
    async useGetCalcCurr(variables: CaclulateCurrencyInput) {
      const { data, pending } = await useAsyncGql({
        operation: 'useCalculateCurrency',
        variables: {
          calculateCurrencyInput: variables,
        },
        options: {
          transform: (data) => data?.calculateCurrency,
        },
      })
      console.log(data.value)
      return data.value
    },
    async useCreateTransfer(varibles: CreateTransferInput) {
      const { data, pending } = await useAsyncGql({
        operation: 'useCreateTransfer',
        variables: {
          createTransferInput: varibles,
        },
        options: {
          transform: (data) => data?.createTransfer,
        },
      })
      console.log(data.value)
      return (this.transfer_id = data.value.transfer?.id)
    },
    async getTransferInfoRequest(variables: GetTransferInfoType) {
      this.loading = true
      const { data } = await useAsyncGql({
        operation: 'getTransferInfoRequest',
        variables: {
          getTransferInfoType: variables,
        },
        options: {
          transform: (data) => data?.getTransferInfo,
        },
      })
      this.loading = false
      console.log(data.value)
      return (this.transferInfo = data.value)
    },
  },
})
