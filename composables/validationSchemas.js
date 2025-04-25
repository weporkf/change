import { useField } from 'vee-validate'
import * as yup from 'yup'

export const telegramSchemaYup = () => {
  return useField('telegram', yup.string().required('Telegram required').min(5).max(32))
}
export const emailSchemaYup = () => {
  return useField('email', yup.string().required('Email required').email('Invalid email'))
}
