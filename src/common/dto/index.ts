type ObjectAny = {
  [key: string]: any;
};

export interface DTO<T extends ObjectAny, Entity extends ObjectAny> {
  response: (entity: Entity) => T;
}
