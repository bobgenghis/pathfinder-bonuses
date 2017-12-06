export default class controller {
  constructor($log) {
    'ngInject';
    
    Object.assign(this, { $log });
	
	this.characters = [
	  {
	    name: 'Boendal',
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
          { name: 'flanking', type: 'melee', attackMod: 4, selected: true},
          { name: 'opp attack', type: 'melee', attackMod: 4, selected: false},
          { name: 'enemy is prone', type: 'melee', attackMod: 4, selected: false},
          { name: 'vs giant', attackMod: 6, damageMod: 4, selected: false},
          { name: 'vs orc', attackMod: 2, damageMod: 2, selected: false}
        ]
	  },
	  {
        name: 'Bilo',
        baseAttack: 7,

        attacks: [
          { name: 'bite', type: 'melee', attackMod: 7, damageDice: '2d6', damageMod: 14},
          { name: 'trip', type: 'melee', attackMod: 13, damageDice: '', damageMod: 0}
        ],

        bigUps: [
          { name: 'none', large: false}
        ],

        optionalBonuses: [
          { name: 'haste', attackMod: 1, selected: false},
          { name: 'power attack', type: 'melee', attackMod: -3, damageMod: 9, selected: true},
        ],

        conditionalBonuses: [
          { name: 'flanking', type: 'melee', attackMod: 4, selected: true},
          { name: 'opp attack', type: 'melee', attackMod: 4, selected: false},
          { name: 'enemy is prone', type: 'melee', attackMod: 4, selected: false},
          { name: 'vs giant', attackMod: 4, damageMod: 4, selected: false},
          { name: 'vs orc', attackMod: 2, damageMod: 2, selected: false}
        ]
	  }
	];
  }
}
