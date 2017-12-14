export default class controller {
  constructor($log) {
    'ngInject';
    
    Object.assign(this, { $log });
    
    this.attackType; //binding
    this.baseAttack; //binding, to trigger onChanges
    this.bonuses = []; //binding
    this.selectedTotal = {}; //binding
  }

  $onChanges(changesObj) {
    this.updateSelection();
  }

  getBonus(bonus) {
    var attackMod = (bonus && bonus.attackMod)
      ? this.getAmount(bonus.attackMod) + ' attack '
      : '';

    var damage = bonus.damageDice
      ? bonus.damageDice
      : '';

    if (bonus && bonus.damageMod) {
      damage += this.getAmount(bonus.damageMod);
    }
    if (damage && damage !== '') {
      damage += ' damage';
    }

    return attackMod + damage;
  }
  
  getAmount(amount) {
    if (angular.isDefined(amount)) {
      if (amount > 0) {
        return '+'+amount;
      } else if (amount === 0) {
        return '';
      } else {
        return amount;
      }
    }
  }

  updateSelection() {
    this.selectedTotal = this.getSelectedBonuses();
  }

  getSelectedBonuses() {
    var vm = this;
    var bonusAttackMod = 0;
    var bonusDamageMod = 0;
    var bonusDamageDice = '';
    var extraAttacks = 0;

    angular.forEach(this.bonuses, function(bonus) {
      if (bonus.selected && (!bonus.type || bonus.type === vm.attackType)) {
        if (bonus.attackMod) {
          bonusAttackMod += bonus.attackMod;
        }
        if (bonus.damageMod) {
          bonusDamageMod += bonus.damageMod;
        }
        if (bonus.damageDice) {
          bonusDamageDice += ('+' + bonus.damageDice);
        }
        if (bonus.extraAttacks) {
          extraAttacks += bonus.extraAttacks;
        }
      }
    });
    return {
      attackMod: bonusAttackMod,
      damageMod: bonusDamageMod,
      damageDice: bonusDamageDice,
      extraAttacks: extraAttacks
    };
  }
}
