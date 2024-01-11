export type TypeMetaData =
  | 'transaction'
  | 'wallet'
  | 'event'
  | 'category'
  | 'sub-category';
export type GroupMetaData = 'transaction-create';

export type MetadataInterface = {
  type: TypeMetaData;
  group: GroupMetaData;
};
