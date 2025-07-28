import {
  AbilityBuilder,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';

export type Actions = 'create' | 'read' | 'update' | 'delete';
export type Subjects =
  | 'dashboard'
  | 'manage-accounts'
  | 'permissions'
  | 'roles'
  | 'employees'
  | 'departments'
  | 'positions'
  | 'warehouses'
  | 'warehouses-transfers'
  | 'products'
  | 'category-products'
  | 'attendances'
  | 'salary'
  | 'projects'
  | 'tasks'
  | 'partners'
  | 'warehouse-transactions'
  | 'orders'
  | 'customers';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export const defineAbilityFor = (permissions: string[]): AppAbility => {
  const { can, build } = new AbilityBuilder<MongoAbility<[Actions, Subjects]>>(
    createMongoAbility,
  );

  permissions.forEach((perm) => {
    const [subject, action] = perm.split('.');
    if (action && subject) {
      can(action as Actions, subject as Subjects);
    }
  });

  return build({
    detectSubjectType: (object: any) => object.type,
  });
};
