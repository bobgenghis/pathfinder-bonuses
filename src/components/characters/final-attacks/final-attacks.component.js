import controller from './final-attacks.controller';
import template from './final-attacks.html';

export default {
  bindings: {
    baseAttack: '<',
    selectedAttack: '<',
    selectedBigUp: '<',
    optionalBonuses: '<',
    conditionalBonuses: '<',
    miscBonuses: '<',
  },
  controller,
  name: 'finalAttacks',
  template,
};
