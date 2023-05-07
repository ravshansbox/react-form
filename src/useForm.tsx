import {
  ChangeEventHandler,
  Dispatch,
  FormEventHandler,
  FormHTMLAttributes,
  ReactElement,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

export type FormContext<T> = {
  values: T;
  setValues: Dispatch<SetStateAction<T>>;
};

export type InputProps<K, V> = {
  name: K;
  value: V;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export type FieldProps<T> = {
  children: (props: InputProps<keyof T, T[keyof T]>) => ReactElement;
  name: keyof T;
};

export type UseFormOptions<T> = {
  initialValues: T;
  handleSubmit: (values: T) => void;
};
export function useForm<T extends Record<string, string>>({
  initialValues,
  handleSubmit,
}: UseFormOptions<T>) {
  const formContext = createContext({} as FormContext<T>);

  function Form({ children, ...props }: FormHTMLAttributes<HTMLFormElement>) {
    const [values, setValues] = useState(initialValues);

    const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
      event.preventDefault();
      handleSubmit(values);
    };

    return (
      <formContext.Provider value={{ values, setValues }}>
        <form onSubmit={onSubmit} {...props}>
          {children}
        </form>
      </formContext.Provider>
    );
  }

  function Field({ children, name }: FieldProps<T>) {
    const { values, setValues } = useContext<FormContext<T>>(formContext);

    const value = values[name];

    const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      setValues((values) => ({ ...values, [name]: event.target.value }));
    };

    return children({ name, value, onChange });
  }

  return { Form, Field };
}
