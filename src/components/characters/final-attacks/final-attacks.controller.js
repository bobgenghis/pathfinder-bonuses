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

    var extraAttacks = this.optionalBonuses.extraAttacks
    + this.conditionalBonuses.extraAttacks;

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
      attackMod: this.optionalBonuses.attackMod + this.conditionalBonuses.attackMod + this.miscBonuses.attackMod,
      damageMod: this.optionalBonuses.damageMod + this.conditionalBonuses.damageMod + this.miscBonuses.damageMod,
      damageDice: this.optionalBonuses.damageDice + this.conditionalBonuses.damageDice + this.miscBonuses.damageDice,
      extraAttacks: this.optionalBonuses.extraAttacks + this.conditionalBonuses.extraAttacks
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
