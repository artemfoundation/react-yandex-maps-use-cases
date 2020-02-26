/*
 * HomeConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const CHANGE_RESULT_ROUTES_DATA =
  'boilerplate/YMapsWithRoutes/CHANGE_RESULT_ROUTES_DATA';
export const REMOVE_RESULT_ROUTES_DATA =
  'boilerplate/YMapsWithRoutes/REMOVE_RESULT_ROUTES_DATA';
export const CHANGE_REQUEST_POINTS =
  'boilerplate/YMapsWithRoutes/CHANGE_REQUEST_POINTS';
export const CHANGE_REQUEST_ROUTING_MODES =
  'boilerplate/YMapsWithRoutes/CHANGE_REQUEST_ROUTING_MODES';
export const CLEAR_ALL = 'boilerplate/YMapsWithRoutes/CLEAR_ALL';
