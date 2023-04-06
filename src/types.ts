export type SetFieldValue<K extends string, T extends Record<K, any>> = (
  name: K,
  value: T[K]
) => void;
export type SetFieldTouched<K extends string> = (name: K) => void;
export type SetFieldError<K extends string> = (name: K, error: string) => void;
export type FormContextValue<K extends string, T extends Record<K, any>> = {
  values: T;
  toucheds: Record<K, boolean>;
  errors: Partial<Record<K, string>>;
  isTouched: boolean;
  isValid: boolean;
  setFieldValue: SetFieldValue<K, T>;
  setFieldTouched: SetFieldTouched<K>;
  setFieldError: SetFieldError<K>;
  validateForm: () => void;
};
