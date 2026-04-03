// Local type declaration stubs for packages without bundled @types

// axios: package is declared in package.json but not installed in node_modules
// These files are unused dead code but TypeScript still type-checks them
declare module "axios" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const axios: any;
  export default axios;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type AxiosInstance = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type InternalAxiosRequestConfig = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type AxiosResponse = any;
}
