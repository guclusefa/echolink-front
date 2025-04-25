import 'pinia';
import { PersistedStateOptions } from 'pinia-plugin-persistedstate';

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    persist?: boolean | PersistedStateOptions;
  }
}
