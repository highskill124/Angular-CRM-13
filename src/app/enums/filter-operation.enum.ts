export enum FILTER_OPERATION {
  CONTAINS = 'substringof',
  STARTS_WITH = 'startswith',
  ENDS_WITH = 'endswith',
  EQUALS = 'eq',
  DOES_NOT_EQUAL = 'ne',
  DOES_NOT_CONTAIN = 'not substringof',
  GREATER_THAN = 'gt',
  LESS_THAN = 'lt',
  LESS_THAN_EQUAL = 'le',
  GREATER_THAN_EQUAL = 'ge'
}
