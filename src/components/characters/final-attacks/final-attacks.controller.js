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
    var attackRange = [];
  
    if (!(this.baseAttack && this.selectedAttack && this.selectedAttack.name)) {
      return attackRange;
    }

    var damageDice = (this.selectedBigUp.large && this.selectedAttack.largeDamageDice)
      ? this.selectedAttack.largeDamageDice
      : this.selectedAttack.damageDice;

    var damageBaseMod = this.selectedBigUp.large
      ? this.selectedAttack.largeDamageMod
      : this.selectedAttack.damageMod;

    var extraAttacks = angular.isDefined(this.selectedAttack.extraAttacks)
      ? this.selectedAttack.extraAttacks
      : 0;

    extraAttacks += (this.optionalBonuses.extraAttacks
      + this.conditionalBonuses.extraAttacks);

    var firstAttack = {
      name: this.selectedAttack.name,
      type: this.selectedAttack.type,
      attackMod: this.baseAttack + this.selectedAttack.attackMod,
      damageDice: damageDice,
      damageMod: damageBaseMod
    };

    //push first attack always, plus extras
    for (var i = 0; i < (extraAttacks+1); i++) {
      attackRange.push(firstAttack);
    }

    if (!this.selectedAttack.isNatural) {
      for (var iterativeAttack = (this.baseAttack-5); iterativeAttack > 0; iterativeAttack -= 5) {
        attackRange.push({
          name: this.selectedAttack.name,
          type: this.selectedAttack.type,
          attackMod: iterativeAttack + this.selectedAttack.attackMod,
          damageDice: damageDice,
          damageMod: damageBaseMod
        });
      }
    }

    if (this.selectedAttack.secondaryAttack && this.selectedAttack.secondaryAttack.name) {
      var secondaryDamageDice = (this.selectedBigUp.large && this.selectedAttack.largeDamageDice)
        ? this.selectedAttack.secondaryAttack.largeDamageDice
        : this.selectedAttack.secondaryAttack.damageDice;

      var secondaryDamageBaseMod = this.selectedBigUp.large
        ? this.selectedAttack.secondaryAttack.largeDamageMod
        : this.selectedAttack.secondaryAttack.damageMod;

      attackRange.push({
        name: this.selectedAttack.secondaryAttack.name,
        type: this.selectedAttack.secondaryAttack.type,
        attackMod: this.selectedAttack.secondaryAttack.attackMod,
        damageDice: secondaryDamageDice,
        damageMod: secondaryDamageBaseMod
      });
    }

    return attackRange;
  };

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
