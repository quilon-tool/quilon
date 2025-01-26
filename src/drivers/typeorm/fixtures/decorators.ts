export function Entity() {
  return function (constructor: Function) {};
}

export function PrimaryGeneratedColumn(): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol): void => {};
}

export function Column() {
  return function (target: Object, propertyKey: string) {};
}

export function OneToMany(typeFunc: () => any, inverseSide: (object: any) => any) {
  return function (target: Object, propertyKey: string) {};
}

export function ManyToOne(typeFunc: () => any, inverseSide: (object: any) => any) {
  return function (target: Object, propertyKey: string) {};
}
