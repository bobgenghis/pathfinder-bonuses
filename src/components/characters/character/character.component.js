import controller from './character.controller';
import template from './character.html';

export default {
  bindings: {
    name: '<',
    baseAttack: '=',
    attacks: '<',
    bigUps: '<',
    seperateAttacks: '<',
    seperateAttack: '<',
    optionalBonuses: '<',
    conditionalBonuses: '<'
  },
  controller,
  name: 'character',
  template,
};
