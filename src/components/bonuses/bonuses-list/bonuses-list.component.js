import controller from './bonuses-list.controller';
import template from './bonuses-list.html';

export default {
  bindings: {
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
