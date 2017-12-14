import controller from './bonus-list.controller';
import template from './bonus-list.html';

export default {
  bindings: {
    baseAttack: '<',
    bonuses: '<',
    attackType: '<',
    selectedTotal: '='
  },
  controller,
  name: 'bonusList',
  template,
};
