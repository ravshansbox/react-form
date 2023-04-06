import { useState, type ReactElement } from 'react';
import { FormContext } from './FormContext';
import { type FormContextValue } from './types';

type FormProps<K extends string, T extends Record<K, any>> = {
  initialValues: T;
  onSubmit: (values: T) => void;
  validate?: (values: T) => Partial<Record<K, string>>;
  children: (formContextValue: FormContextValue<K, T>) => ReactElement;
};
export function Form<K extends string, T extends Record<K, any>>({
  initialValues,
  onSubmit,
  validate,
  children,
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

  const validateForm = () => {
    if (typeof validate === 'function') {
      setErrors(validate(values));
    }
  };
  const formContextValue: FormContextValue<K, T> = {
    values,
    toucheds,
    errors,
    isValid,
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
        {children(formContextValue)}
      </form>
    </FormContext.Provider>
  );
}
