export enum ConstraintType {
    EQUALS = "Equals",
    GREATER_THAN = "Greater Than",
    LESS_THAN = "Less Than",
    GREATER_THAN_OR_EQUALS = "Greater Than or Equals",
    LESS_THAN_OR_EQUALS = "Less Than or Equals",
    NOT_EQUALS = "Not Equals",
    CONTAINS = "Contains",
    STARTS_WITH = "Starts With",
    ENDS_WITH = "Ends With",
    LIST_INCLUDES = "List Includes"
}

export const stringConstraintTypes = [ConstraintType.EQUALS, ConstraintType.NOT_EQUALS, ConstraintType.CONTAINS, ConstraintType.STARTS_WITH, ConstraintType.ENDS_WITH];
export const stringListConstraintTypes = [ConstraintType.EQUALS, ConstraintType.NOT_EQUALS, ConstraintType.CONTAINS, ConstraintType.STARTS_WITH, ConstraintType.ENDS_WITH, ConstraintType.LIST_INCLUDES];
export const numberConstraintTypes = [ConstraintType.EQUALS , ConstraintType.NOT_EQUALS , ConstraintType.GREATER_THAN , ConstraintType.LESS_THAN , ConstraintType.GREATER_THAN_OR_EQUALS , ConstraintType.LESS_THAN_OR_EQUALS];

export type StringConstraintType = typeof stringConstraintTypes[number];
export type NumberConstraintType = typeof numberConstraintTypes[number];
export type StringListConstraintType = typeof stringListConstraintTypes[number];