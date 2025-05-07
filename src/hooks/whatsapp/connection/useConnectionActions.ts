
import { ConnectionStateSetters, useConnectionActions } from './actions';

// This file now just re-exports the hook from the actions folder
// to maintain backward compatibility with existing imports
export { useConnectionActions, ConnectionStateSetters };
