import controller from './final-attacks.controller';
import template from './final-attacks.html';

export default {
  bindings: {
    baseAttack: '<',
    selectedAttack: '<',
    selectedBigUp: '<',
    seperateAttack: '<',
    optionalBonuses: '<',
    conditionalBonuses: '<',
    miscBonuses: '<',
  },
  controller,
  name: 'finalAttacks',
  template,
};
