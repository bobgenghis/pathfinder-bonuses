import controller from './bonuses-list.controller';
import template from './bonuses-list.html';

export default {
  bindings: {
    name: '<',
    baseAttack: '<',
    attacks: '<',
    bigUps: '<',
    optionalBonuses: '<',
    conditionalBonuses: '<'
  },
  controller,
  name: 'bonusesList',
  template,
};
