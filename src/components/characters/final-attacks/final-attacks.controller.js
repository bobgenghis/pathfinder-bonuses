export default class controller {
  constructor($log) {
    'ngInject';
    
    Object.assign(this, { $log });
    
    this.baseAttack; //binding, expected int
    this.selectedAttack; //binding, expected int
    this.selectedBigUp = {}; //binding
    
    this.optionalBonusSum = []; //binding
    this.conditionalBonusSum = []; //binding
    this.miscBonusSum = []; //binding
    
    this.baseAttackRange = [];
    this.totalBonuses = {};
  }
  
  $onChanges() {
    this.baseAttackRange = this.getBaseAttackRange();
    this.totalBonuses = this.getTotalBonuses();
  }
  
  getBaseAttackRange() {
    var attackRange = [];
  
    if (!(this.baseAttack && this.selectedAttack && this.selectedAttack.name)) {
      return attackRange;
    }

    var extraAttacks = this.optionalBonusSum.extraAttacks
    + this.conditionalBonusSum.extraAttacks;

    for (var i = 0; i < extraAttacks; i++) {
      attackRange.push(this.baseAttack);
    }
    for (var i = this.baseAttack; i > 0; i -= 5) {
      attackRange.push(i);
    }
    
    return attackRange;
  };
  
  getTotalBonuses() {
    return {
      attackMod: this.optionalBonusSum.attackMod + this.conditionalBonusSum.attackMod + this.miscBonusSum.attackMod,
      damageMod: this.optionalBonusSum.damageMod + this.conditionalBonusSum.damageMod + this.miscBonusSum.damageMod,
      damageDice: this.optionalBonusSum.damageDice + this.conditionalBonusSum.damageDice + this.miscBonusSum.damageDice,
      extraAttacks: this.optionalBonusSum.extraAttacks + this.conditionalBonusSum.extraAttacks
    };
  }
  
  getFinalAttack(baseAttack) {
    if (!(baseAttack && this.selectedAttack && this.selectedAttack.name)) {
      return '';
    }
    
    var attackBonusMod = this.totalBonuses.attackMod;
    var selectedAttack = this.selectedAttack;
    
    if (this.selectedBigUp.attackMod) {
      attackBonusMod += this.selectedBigUp.attackMod;
    }

    return selectedAttack.name + ' [[d20' + this.getAmount(baseAttack + selectedAttack.attackMod + attackBonusMod) + ']]';
  }
  
  getFinalDamage() {
    if (!(this.selectedAttack && this.selectedAttack.name)) {
      return '';
    }
    
    var selectedAttack = this.selectedAttack;
  
    var damageDice = (this.selectedBigUp.large && selectedAttack.largeDamageDice)
      ? selectedAttack.largeDamageDice
      : selectedAttack.damageDice;
    
    if (!damageDice || damageDice === '') {
    return '';
    }

    var damageBaseMod = this.selectedBigUp.large
      ? selectedAttack.largeDamageMod
      : selectedAttack.damageMod;
      
    return 'damage: [[' + damageDice + this.getAmount(damageBaseMod + this.totalBonuses.damageMod) + this.totalBonuses.damageDice + ']]';
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
