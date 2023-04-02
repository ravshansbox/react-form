import { ReactElement, useState } from 'react';
import { FormContext } from './FormContext';

type FormMeta<K extends string> = {
  toucheds: Record<K, boolean>;
  errors: Partial<Record<K, string>>;
};
type SetFieldValue<K extends string, T extends Record<K, any>> = (
  name: K,
  value: T[K]
) => void;
type SetFieldTouched<K extends string> = (name: K) => void;
type SetFieldError<K extends string> = (name: K, error: string) => void;
type FormContextValue<K extends string, T extends Record<K, any>> = {
  values: T;
  meta: FormMeta<K>;
  isTouched: boolean;
  setFieldValue: SetFieldValue<K, T>;
  setFieldTouched: SetFieldTouched<K>;
  setFieldError: SetFieldError<K>;
  validateForm: () => void;
};
type FormProps<K extends string, T extends Record<K, any>> = {
  initialValues: T;
  onSubmit: (values: T) => void;
  validate?: (values: T) => Partial<Record<K, string>>;
  render: (formContextValue: FormContextValue<K, T>) => ReactElement;
};
export function Form<K extends string, T extends Record<K, any>>({
  initialValues,
  onSubmit,
  validate,
  render,
}: FormProps<K, T>) {
  const [values, setValues] = useState(initialValues);
  const [toucheds, setToucheds] = useState({} as Record<K, boolean>);
  const [errors, setErrors] = useState(
    typeof validate === 'function'
      ? validate(values)
      : ({} as Partial<Record<K, string>>)
  );

  const isTouched = Object.keys(toucheds).filter(Boolean).length === 0;
  const isValid = Object.keys(errors).filter(Boolean).length === 0;
  const meta = { toucheds, errors, isValid };

  const validateForm = () => {
    if (typeof validate === 'function') {
      setErrors(validate(values));
    }
  };
  const formContextValue: FormContextValue<K, T> = {
    values,
    meta,
    isTouched,
    validateForm,
    setFieldValue: (name, value) => {
      setValues({ ...values, [name]: value });
    },
    setFieldTouched: (name) => {
      setToucheds({ ...toucheds, [name]: true });
    },
    setFieldError: (name, error) => {
      setErrors({ ...errors, [name]: error });
    },
  };

  return (
    <FormContext.Provider value={formContextValue}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const toucheds = Object.keys(values).reduce((agg, key) => {
            agg[key] = true;
            return agg;
          }, {} as Record<K, boolean>);
          setToucheds(toucheds);
          validateForm();
          if (isValid) {
            onSubmit(values);
          }
        }}
      >
        {render(formContextValue)}
      </form>
    </FormContext.Provider>
  );
}
