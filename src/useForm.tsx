import {
  ChangeEventHandler,
  Context,
  Dispatch,
  FocusEventHandler,
  FormEventHandler,
  FormHTMLAttributes,
  ReactElement,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

const formContext = createContext({});

type Toucheds<T> = Partial<Record<keyof T, boolean>>;

type Errors<T> = Partial<Record<keyof T, string>>;

type FormContext<T> = {
  toucheds: Toucheds<T>;
  errors: Errors<T>;
  values: T;
  setToucheds: Dispatch<SetStateAction<Toucheds<T>>>;
  setErrors: Dispatch<SetStateAction<Errors<T>>>;
  setValues: Dispatch<SetStateAction<T>>;
};

type InputProps<K, V> = {
  name: K;
  touched: boolean;
  error: string;
  value: V;
  onBlur: FocusEventHandler<HTMLInputElement>;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

type FieldProps<T> = {
  children: (props: InputProps<keyof T, T[keyof T]>) => ReactElement;
  name: keyof T;
};

type UseFormOptions<T> = {
  handleSubmit: (values: T) => void;
  initialValues: T;
  validate: (values: T) => Errors<T>;
};
export function useForm<T extends Record<string, string>>({
  handleSubmit,
  initialValues,
  validate,
}: UseFormOptions<T>) {
  function Form({ children, ...props }: FormHTMLAttributes<HTMLFormElement>) {
    const [toucheds, setToucheds] = useState<Toucheds<T>>({});
    const [errors, setErrors] = useState<Errors<T>>({});
    const [values, setValues] = useState(initialValues);

    const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
      event.preventDefault();
      handleSubmit(values);
    };

    return (
      <formContext.Provider
        value={{ toucheds, errors, values, setToucheds, setErrors, setValues }}
      >
        <form onSubmit={onSubmit} {...props}>
          {children}
        </form>
      </formContext.Provider>
    );
  }

  function Field({ children, name }: FieldProps<T>) {
    const { toucheds, errors, values, setToucheds, setErrors, setValues } =
      useContext(formContext as Context<FormContext<T>>);

    const touched = toucheds[name] ?? false;
    const error = errors[name] ?? '';
    const value = values[name];

    const onBlur: FocusEventHandler<HTMLInputElement> = () => {
      setToucheds((values) => ({ ...values, [name]: true }));
      setErrors(validate(values));
    };

    const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      const { checked, type, value } = event.target;
      setValues((values) => ({
        ...values,
        [name]: type === 'checkbox' ? checked : value,
      }));
    };

    return children({ name, touched, error, value, onBlur, onChange });
  }

  return { Field, Form, formContext };
}
