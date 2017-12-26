export default class controller {
  constructor($log) {
    'ngInject';
    
    Object.assign(this, { $log });
    
    this.baseAttack; //binding, expected int
    this.selectedAttack; //binding, expected int
    this.selectedBigUp = {}; //binding
    
    this.optionalBonuses = []; //binding
    this.conditionalBonuses = []; //binding
    this.miscBonuses = []; //binding
    
    this.baseAttacks = [];
    this.totalBonuses = {};
  }
  
  $onChanges() {
    this.baseAttacks = this.getBaseAttacks();
    this.totalBonuses = this.getTotalBonuses();
  }
  
  getBaseAttacks() {
    var vm = this;
    var attackRange = [];
  
    if (!(this.baseAttack && this.selectedAttack && this.selectedAttack.name)) {
      return attackRange;
    }

    var extraAttacks = angular.isDefined(this.selectedAttack.extraAttacks)
      ? this.selectedAttack.extraAttacks
      : 0;

    extraAttacks += (this.optionalBonuses.extraAttacks
      + this.conditionalBonuses.extraAttacks);

    var firstAttack = this.getAttackAttributes(this.selectedAttack);

    var attackRider;
    if (this.selectedAttack.rider) {
      attackRider = vm.getAttackAttributes(this.selectedAttack.rider);
    }

    //push first attack always, plus extras
    for (var i = 0; i < (extraAttacks+1); i++) {
      attackRange.push(firstAttack);
      if (attackRider && attackRider.name) {
        attackRange.push(attackRider);
      }
    }

    if (!this.selectedAttack.isNatural) {
      for (var iterativeAttack = (this.baseAttack-5); iterativeAttack > 0; iterativeAttack -= 5) {
        attackRange.push({
          name: firstAttack.name,
          type: firstAttack.type,
          attackMod: firstAttack.attackMod - this.baseAttack + iterativeAttack,
          damageDice: firstAttack.damageDice,
          damageMod: firstAttack.damageMod
        });

        if (attackRider && attackRider.name) {
          attackRange.push({
            name: attackRider.name,
            type: attackRider.type,
            attackMod: attackRider.attackMod - this.baseAttack + iterativeAttack,
            damageDice: attackRider.damageDice,
            damageMod: attackRider.damageMod
        });
        }
      }
    }

    if (this.selectedAttack.secondaryAttacks && this.selectedAttack.secondaryAttacks.length > 0) {
      this.selectedAttack.secondaryAttacks.forEach(function(secondaryAttack){
        attackRange.push(vm.getAttackAttributes(secondaryAttack));
      });
    }

    return attackRange;
  };

  getAttackAttributes(attack) {
    var attackMod = this.baseAttack + attack.attackMod;

    var damageMod = (this.selectedBigUp.large && attack.largeDamageMod)
      ? attack.largeDamageMod
      : attack.damageMod;

    var damageDice = (this.selectedBigUp.large && attack.largeDamageDice)
      ? attack.largeDamageDice
      : attack.damageDice;

    return {
      name: attack.name,
      type: attack.type,
      attackMod: this.baseAttack + attack.attackMod,
      damageMod: damageMod,
      damageDice: damageDice
    };
  }

  getTotalBonuses() {
    return {
      attackMod: this.optionalBonuses.attackMod + this.conditionalBonuses.attackMod + this.miscBonuses.attackMod,
      damageMod: this.optionalBonuses.damageMod + this.conditionalBonuses.damageMod + this.miscBonuses.damageMod,
      damageDice: this.optionalBonuses.damageDice + this.conditionalBonuses.damageDice + this.miscBonuses.damageDice,
      extraAttacks: this.optionalBonuses.extraAttacks + this.conditionalBonuses.extraAttacks
    };
  }
  
  getFinalAttack(baseAttack) {
    var attackBonusMod = this.totalBonuses.attackMod;

    if (this.selectedBigUp && this.selectedBigUp.large && baseAttack.type && baseAttack.type === 'ranged') {
      attackBonusMod -= 2;
    }

    if (this.selectedBigUp.attackMod) {
      attackBonusMod += this.selectedBigUp.attackMod;
    }

    return baseAttack.name + ' [[d20' + this.getAmount(baseAttack.attackMod + attackBonusMod) + ']]';
  }
  
  getFinalDamage(baseAttack) {
    if (!baseAttack.damageDice || baseAttack.damageDice === '') {
      return '';
    }
      
    return 'damage: [[' + baseAttack.damageDice + this.getAmount(baseAttack.damageMod + this.totalBonuses.damageMod) + this.totalBonuses.damageDice + ']]';
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
}
