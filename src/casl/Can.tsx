// casl/Can.tsx
import { createContext, useContext } from 'react';
import { AppAbility } from './ability';
import { Can as CaslCan } from '@casl/react';

export const AbilityContext = createContext<AppAbility>(undefined!);

export const Can = CaslCan;

export const useAbility = () => useContext(AbilityContext);
