import { InputHTMLAttributes, ReactElement, useContext } from 'react';
import { FormContext } from './FormContext';

type FormMeta = {
  setFieldError: (name: string, error: string) => void;
  setFieldTouched: (name: string) => void;
  setFieldValue: (name: string, value: any) => void;
};
type FieldMeta = {
  name: string;
  touched: boolean;
  error?: string;
};
type RenderParams<T> = {
  form: FormMeta;
  meta: FieldMeta;
  value: T;
  onChange: InputHTMLAttributes<HTMLInputElement>['onChange'];
  onBlur: InputHTMLAttributes<HTMLInputElement>['onBlur'];
};
type FieldProps<T> = {
  name: string;
  children: (params: RenderParams<T>) => ReactElement;
};
export function Field<T = any>({ name, children }: FieldProps<T>) {
  const {
    values,
    toucheds,
    errors,
    setFieldError,
    setFieldTouched,
    setFieldValue,
    validateForm,
  } = useContext(FormContext);

  return children({
    form: { setFieldError, setFieldTouched, setFieldValue },
    meta: { name, touched: toucheds[name], error: errors[name] },
    value: values[name],
    onChange: (event) => {
      setFieldValue(name, event.target.value);
    },
    onBlur: () => {
      setFieldTouched(name);
      validateForm();
    },
  });
}
