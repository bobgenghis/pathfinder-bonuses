export default class controller {
  constructor($log) {
    'ngInject';
    
    Object.assign(this, { $log });

    var vm = this;

    var boendal = {
      name: 'Boendal',
      baseAttack: 14,
      attacks: [
        { name: 'greatsword', type: 'melee', attackMod: 8, damageDice: '3d6', damageMod: 12, damageRoll: 10.5, largeDamageDice: '4d6', largeDamageRoll: 14, largeDamageMod: 14, crit: 17},
        { name: 'longspear', type: 'melee', attackMod: 7, damageDice: '2d6', damageMod: 11, damageRoll: 7, largeDamageDice: '3d6', largeDamageRoll: 10.5, largeDamageMod: 13},
        { name: 'longbow', type: 'ranged', attackMod: 3, damageDice: '1d8', damageMod: 8, largeDamageMod: 9, damageRoll: 4.5}
      ],
      bigUps: [
        { name: 'none', large: false},
        { name: 'enlarge', large: true}
      ],
      optionalBonuses: [
        { name: 'haste', attackMod: 1, extraAttacks: 1, selected: false},
        //note melee rage bonus includes enh bonus from furious greatsword
        { name: 'rage', attackMod: 4, damageMod: 5, type: 'melee', selected: false},
        { name: 'rage', attackMod: 2, damageMod: 2, type: 'ranged', selected: false},
        { name: 'bane', attackMod: 2, damageMod: 2, damageDice: '2d6', damageRoll: 7, selected: false},
        //{ name: 'impact', damageDice: '2d6', damageRoll: 7, selected: false},
        { name: 'power attack', type: 'melee',
          get attackMod() {
            return vm.getPowerAttackMod(boendal.baseAttack);
          },
          get damageMod() {
            return -3*(this.attackMod);
          },
          selected: true
        },
        /*{ name: 'deadly aim', type: 'ranged',
          get attackMod() {
            return vm.getPowerAttackMod(boendal.baseAttack);
          },
          get damageMod() {
            return -2*(this.attackMod);
          },
          selected: false
        },*/
        { name: 'alcoholic morale', attackMod: 2, selected: false}
      ],
      conditionalBonuses: [
        { name: 'flanking', type: 'melee', attackMod: 4, selected: true},
        { name: 'opp attack (circumstance)', type: 'melee', attackMod: 4, selected: false},
        { name: 'vs large/huge', attackMod: 1, damageMod: 1, selected: true},
        { name: 'vs gargantuan/colossal', attackMod: 2, damageMod: 2, selected: false},
        { name: 'vs giant', attackMod: 6, damageMod: 4, selected: false},
        { name: 'vs dragon', attackMod: 2, damageMod: 2, selected: false}
      ]
    };

    var bilo = {
      name: 'Bilo',
      baseAttack: 9,
      attacks: [
        { name: 'bite', type: 'melee', attackMod: 8, damageDice: '2d6', damageMod: 15, damageRoll: 7, largeDamageDice: '3d6', largeDamageMod: 15,
          isNatural: true, crit: 19,
		  rider: { name: 'trip', type: 'melee', attackMod: 22, damageDice: '', damageMod: 0, perAttack: true}
        }
      ],
      bigUps: [
        { name: 'none', large: false}
      ],
      optionalBonuses: [
        { name: 'haste', attackMod: 1, extraAttacks: 1, selected: false},
        { name: 'power attack', type: 'melee',
          get attackMod() {
            return vm.getPowerAttackMod(bilo.baseAttack);
          },
          get damageMod() {
           return -3*(this.attackMod);
          },
          selected: false
        },
      ],
      conditionalBonuses: [
        { name: 'flanking', type: 'melee', attackMod: 4, selected: true},
        { name: 'opp attack', type: 'melee', attackMod: 4, selected: false},
        { name: 'vs giant', attackMod: 4, damageMod: 4, selected: false},
        { name: 'vs dragon', attackMod: 2, damageMod: 2, selected: false},
        { name: 'tripped w/in 1 round', attackMod: 2, damageMod: 2, selected: false}
      ]
    };

    var mahmud = {
      name: 'Mahmud',
      baseAttack: 8,

      attacks: [
        { name: 'scimitar', type: 'melee', attackMod: 6, damageDice: '1d6', damageMod: 6, damageRoll: 3.5, crit: 15},
        { name: 'scimitar-2h', type: 'melee', attackMod: 6, damageDice: '1d6', damageMod: 8, damageRoll: 3.5, crit: 15},
        { name: 'claw (sahuagin)', type: 'melee', attackMod: 6, damageDice: '1d4', damageMod: 6, damageRoll: 2.5,
          get extraAttacks() {
            return mahmud.optionalBonuses.some(x => x.selected && x.name === 'spell combat')
              ? 2
              : 3;
          },
          isNatural: true
        },
        { name: 'scimitar (sahuagin)', type: 'melee', attackMod: 7, damageDice: '1d6', damageMod: 7, damageRoll: 3.5, crit: 15,
          get secondaryAttacks() {
            return mahmud.optionalBonuses.some(x => x.selected && x.name === 'spell combat')
              ? [ { name: 'claw (sahuagin)', type: 'melee', attackMod: 1, damageDice: '1d4', damageMod: 3, damageRoll: 2.5, isNatural: true},
                  { name: 'claw (sahuagin)', type: 'melee', attackMod: 1, damageDice: '1d4', damageMod: 3, damageRoll: 2.5, isNatural: true}
                ]
              : [ { name: 'claw (sahuagin)', type: 'melee', attackMod: 1, damageDice: '1d4', damageMod: 3, damageRoll: 2.5, isNatural: true},
                  { name: 'claw (sahuagin)', type: 'melee', attackMod: 1, damageDice: '1d4', damageMod: 3, damageRoll: 2.5, isNatural: true},
                  { name: 'claw (sahuagin)', type: 'melee', attackMod: 1, damageDice: '1d4', damageMod: 3, damageRoll: 2.5, isNatural: true}
                ]
          }
        },
        { name: 'slam (calikang)', type: 'melee', attackMod: 6, damageDice: '1d6', damageMod: 7, damageRoll: 3.5,
          get extraAttacks() {
            return mahmud.optionalBonuses.some(x => x.selected && x.name === 'spell combat')
              ? 4
              : 5;
          },
          isNatural: true
        },
        { name: 'scimitar (calikang)', type: 'melee', attackMod: 7, damageDice: '1d8', damageMod: 8, damageRoll: 4.5, crit: 15,
          get secondaryAttacks() {
            return mahmud.optionalBonuses.some(x => x.selected && x.name === 'spell combat')
              ? [ { name: 'slam (calikang)', type: 'melee', attackMod: 1, damageDice: '1d6', damageMod: 3, damageRoll: 3.5, isNatural: true},
                  { name: 'slam (calikang)', type: 'melee', attackMod: 1, damageDice: '1d6', damageMod: 3, damageRoll: 3.5, isNatural: true},
                  { name: 'slam (calikang)', type: 'melee', attackMod: 1, damageDice: '1d6', damageMod: 3, damageRoll: 3.5, isNatural: true},
                  { name: 'slam (calikang)', type: 'melee', attackMod: 1, damageDice: '1d6', damageMod: 3, damageRoll: 3.5, isNatural: true}
                ]
              : [ { name: 'slam (calikang)', type: 'melee', attackMod: 1, damageDice: '1d6', damageMod: 3, damageRoll: 3.5, isNatural: true},
                  { name: 'slam (calikang)', type: 'melee', attackMod: 1, damageDice: '1d6', damageMod: 3, damageRoll: 3.5, isNatural: true},
                  { name: 'slam (calikang)', type: 'melee', attackMod: 1, damageDice: '1d6', damageMod: 3, damageRoll: 3.5, isNatural: true},
                  { name: 'slam (calikang)', type: 'melee', attackMod: 1, damageDice: '1d6', damageMod: 3, damageRoll: 3.5, isNatural: true},
                  { name: 'slam (calikang)', type: 'melee', attackMod: 1, damageDice: '1d6', damageMod: 3, damageRoll: 3.5, isNatural: true}
                ]
          }
        },
      ],
      bigUps: [
        { name: 'none', large: false}
      ],
      optionalBonuses: [
        { name: 'haste', attackMod: 1, extraAttacks: 1, selected: false},
        { name: 'frostbite', damageDice: '1d6+10', damageRoll: 13.5, selected: false},
//        { name: 'power attack', attackMod: -3, damageMod: 6, selected: false},
        { name: 'spell combat', attackMod: -2, selected: true},
        { name: '+spell strike', extraAttacks: 1, selected: true},
        { name: 'arcane accuracy', attackMod: 5, selected: false},
        { name: 'concealment', attackMod: 2, damageMod: 2, selected: false}
      ],
      conditionalBonuses: [
        { name: 'flanking', type: 'melee', attackMod: 2, selected: false},
        { name: '+outflank', type: 'melee', attackMod: 2, selected: false},
        { name: 'vs gnolls (competence)', attackMod: 2, damageMod: 2, selected: false}
      ]
    };

    this.characters = [boendal, bilo, mahmud];
  }

  getPowerAttackMod(baseAttack) {
    return -1*(1 + Math.floor(baseAttack / 4));
  }
}
