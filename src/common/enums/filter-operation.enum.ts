import { Op } from 'sequelize';

export enum FilterOperationEnum {
  //! any list
  IN = 'IN',
  NOT_IN = 'NOT_IN',
  BETWEEN = 'BETWEEN',
  NOT_BETWEEN = 'NOT_BETWEEN',
  //! any
  EQ = 'EQ',
  GT = 'GT',
  GTE = 'GTE',
  LT = 'LT',
  LTE = 'LTE',
  NE = 'NE',
  //! string
  LIKE = 'LIKE',
  ILIKE = 'ILIKE',
  IREGEXP = 'IREGEXP',
  NOT_ILIKE = 'NOT_ILIKE',
  NOT_IREGEXP = 'NOT_IREGEXP',
  NOT_LIKE = 'NOT_LIKE',
  REGEXP = 'REGEXP',
  NOT_REGEXP = 'NOT_REGEXP',
  //! NULL | bool
  IS = 'IS',
  NOT = 'NOT',
}

const OperationMap = {
  BETWEEN: Op.between,
  IN: Op.in,
  NOT_IN: Op.notIn,
  NOT_BETWEEN: Op.notBetween,
  EQ: Op.eq,
  GT: Op.gt,
  GTE: Op.gte,
  LT: Op.lt,
  LTE: Op.lte,
  NE: Op.ne,
  LIKE: Op.like,
  ILIKE: Op.iLike,
  IREGEXP: Op.iRegexp,
  REGEXP: Op.regexp,
  NOT_ILIKE: Op.notILike,
  NOT_LIKE: Op.notLike,
  NOT_IREGEXP: Op.notIRegexp,
  NOT_REGEXP: Op.notRegexp,
  IS: Op.is,
  NOT: Op.not,
};

export function OperationToSequlizeOperation(
  operation: FilterOperationEnum,
): symbol {
  if (operation in OperationMap) {
    return OperationMap[operation];
  } else {
    return null;
  }
}

const MongoOperationMap = {
  IN: '$in',
  NOT_IN: '$nin',
  EQ: '$eq',
  NE: '$ne',
  GT: '$gt',
  GTE: '$gte',
  LT: '$lt',
  LTE: '$lte',
  AND: '$and',
  OR: '$or',
  REGEXP: '$regex',
  NOT_REGEXP: '$regex',
  IREGEXP: '$regex',
  NOT_IREGEXP: '$regex',
  LIKE: '$regex',
  NOT_LIKE: '$regex',
  ILIKE: '$regex',
  NOT_ILIKE: '$regex',
};

export function OperationToMongoOperation(
  operation: FilterOperationEnum,
): symbol {
  if (operation in MongoOperationMap) {
    return MongoOperationMap[operation];
  } else {
    return null;
  }
}
