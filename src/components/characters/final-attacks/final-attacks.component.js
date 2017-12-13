import controller from './final-attacks.controller';
import template from './final-attacks.html';

export default {
  bindings: {
    baseAttack: '<',
    selectedAttack: '<',
    selectedBigUp: '<',
    optionalBonusSum: '<',
    conditionalBonusSum: '<',
    miscBonusSum: '<'
  },
  controller,
  name: 'finalAttacks',
  template,
};
