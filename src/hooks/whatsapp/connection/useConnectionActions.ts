
import { useConnectionActions } from './actions';
import type { ConnectionStateSetters } from './actions/types';

// This file now just re-exports the hook from the actions folder
// to maintain backward compatibility with existing imports
export { useConnectionActions };
export type { ConnectionStateSetters };
