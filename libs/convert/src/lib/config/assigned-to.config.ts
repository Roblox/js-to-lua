import { LVal } from '@babel/types';
import { ConfigBase } from '@js-to-lua/handler-utils';

export interface AssignedToConfig {
  assignedTo?: LVal;
}

export const assignedToConfig =
  (assignedTo: AssignedToConfig['assignedTo']) =>
  <C extends ConfigBase>(config: C): C & AssignedToConfig => ({
    ...config,
    ...(assignedTo ? { assignedTo } : {}),
  });

export const removeAssignedToConfig = <C extends AssignedToConfig>(
  config: C
): Omit<C, 'assignedTo'> => {
  const newConfig = { ...config };
  delete newConfig.assignedTo;
  return newConfig;
};
