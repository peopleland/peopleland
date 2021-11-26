declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.png';
declare module '*.jpeg';
declare module '*.json';

declare module '*.css' {
  const content: {[className: string]: string};
  export = content;
}
