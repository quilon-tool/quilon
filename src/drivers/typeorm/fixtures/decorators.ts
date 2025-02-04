/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable unused-imports/no-unused-vars */
export function Entity() {
  return function (_constructor: Function) {};
}

export function PrimaryGeneratedColumn(): PropertyDecorator {
  return (_target: object, _propertyKey: string | symbol): void => {};
}

export function Column() {
  return function (_target: object, _propertyKey: string) {};
}

export function OneToMany(_typeFunc: () => any, _inverseSide: (object: any) => any) {
  return function (_target: object, _propertyKey: string) {};
}

export function ManyToOne(_typeFunc: () => any, _inverseSide: (object: any) => any) {
  return function (_target: object, _propertyKey: string) {};
}
