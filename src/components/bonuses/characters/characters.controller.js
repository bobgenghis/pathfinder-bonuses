export default class controller {
  constructor($log) {
    'ngInject';
    
    Object.assign(this, { $log });
	
	this.boendal = {
	  baseAttack: 10,
    
      attacks: [
        { name: 'greatsword', type: 'melee', attackMod: 9, damageDice: '3d6', damageMod: 12, largeDamageDice: '4d6', largeDamageMod: 14},
        { name: 'longbow', type: 'ranged', attackMod: 4, damageDice: '1d8', damageMod: 8, largeDamageDice: '2d6', largeDamageMod: 9}
      ],

      bigUps: [
        { name: 'none', large: false},
        { name: 'soul stone', large: true},
        { name: 'drinking horn', attackMod: 2, large: true}
      ],

      optionalBonuses: [
	    { name: 'haste', attackMod: 1, selected: false},
        { name: 'power attack', type: 'melee', attackMod: -3, damageMod: 9, selected: true},
        { name: 'deadly aim', type: 'ranged', attackMod: -3, damageMod: 6, selected: false},
        { name: 'rapid shot', type: 'ranged', attackMod: -2, selected: false},
      ],

      conditionalBonuses: [
        { condition: 'flanking', type: 'melee', attackMod: 4, selected: true},
        { condition: 'opp attack', type: 'melee', attackMod: 4, selected: false},
	    { condition: 'vs giant', attackMod: 6, damageMod: 4, selected: false},
	    { condition: 'vs orc', attackMod: 2, damageMod: 2, selected: false}
      ]
	};
  }
}
