import controller from './bonus-list.controller';
import template from './bonus-list.html';

export default {
  bindings: {
    bonuses: '<',
    selectedAttackType: '<',
    selectedTotal: '='
  },
  controller,
  name: 'bonusList',
  template,
};
