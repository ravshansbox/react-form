import { createContext } from 'react';
import { type FormContextValue } from './types';

export const FormContext = createContext<
  FormContextValue<string, Record<string, any>>
>(null as FormContextValue<string, Record<string, any>>);
