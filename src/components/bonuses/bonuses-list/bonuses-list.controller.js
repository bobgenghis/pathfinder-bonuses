export default class controller {
  constructor($log) {
    'ngInject';
    
    Object.assign(this, { $log });
    
    this.baseAttack = 10;
    
    this.attacks = [
      { name: 'greatsword', type: 'melee', attackMod: 9, damageDice: '3d6', damageMod: 12, largeDamageDice: '4d6', largeDamageMod: 14},
      { name: 'longbow', type: 'ranged', attackMod: 4, damageDice: '1d8', damageMod: 8, largeDamageDice: '2d6', largeDamageMod: 9}
    ];
    
    this.selectedAttack = this.attacks[0];
    
    this.bigUps = [
      { name: 'none', large: false},
      { name: 'soul stone', large: true},
      { name: 'drinking horn', attackMod: 2, large: true}
    ];
    
    this.selectedBigUp = this.bigUps[0];
    
    this.optionalBonuses = [
	  { name: 'haste', attackMod: 1, selected: false},
      { name: 'power attack', type: 'melee', attackMod: -3, damageMod: 9, selected: true},
      { name: 'deadly aim', type: 'ranged', attackMod: -3, damageMod: 6, selected: false},
      { name: 'rapid shot', type: 'ranged', attackMod: -2, selected: false},
    ];

    this.conditionalBonuses = [
      { condition: 'flanking', type: 'melee', attackMod: 4, selected: true},
      { condition: 'opp attack', type: 'melee', attackMod: 4, selected: false},
	  { condition: 'vs giant', attackMod: 6, damageMod: 4, selected: false},
	  { condition: 'vs orc', attackMod: 2, damageMod: 2, selected: false}
    ];
    
    this.miscBonus = { attackMod: 0, damageMod: 0,  damageDice: ''};
  }

  getBaseAttackRange() {
    var step = 5;
      var input = [];
    
    var baseAttack = this.isSoulStone()
      ? (this.baseAttack + 1)
      : this.baseAttack;
    
    if (this.selectedAttack && this.selectedAttack.type) {
      if (this.isRapidShot()) {
        input.push(baseAttack);
      }
	  if (this.isHaste()) {
        input.push(baseAttack);
      }
      for (var i = baseAttack; i > 0; i -= 5) {
        input.push(i);
      }
    }
    
    return input;
  };
  
  isSoulStone() {
    return this.selectedBigUp.name === 'soul stone';
  }
  
  isRapidShot() {
    return this.selectedAttack && this.selectedAttack.type === 'ranged' && this.optionalBonuses.some(function (b) {
      return b.name === 'rapid shot' && b.selected === true;
    });
  }
  
  isHaste() {
    return this.optionalBonuses.some(function (b) {
      return b.name === 'haste' && b.selected === true;
    });
  }
  
  getAttack(attack) {
	var baseAttack = this.isSoulStone()
      ? (this.baseAttack + 1)
      : this.baseAttack;
    return this.getAmount(baseAttack + attack.attackMod) + ' / ' + attack.damageDice + this.getAmount(attack.damageMod);
  }
  
  getBonus(bonus) {
    var attackMod = (bonus && bonus.attackMod)
      ? this.getAmount(bonus.attackMod) + ' attack '
      : '';
    
    var damageMod = (bonus && bonus.damageMod)
      ? this.getAmount(bonus.damageMod) + ' damage '
      : '';
    
    return attackMod + damageMod;
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
  
  getFinalAttack(baseAttack) {
    if (!(baseAttack && this.selectedAttack && this.selectedAttack.name)) {
      return '';
    }
    
    var attackMod = this.miscBonus.attackMod;
    var selectedAttack = this.selectedAttack;
    
    if (this.selectedBigUp.attackMod) {
      attackMod += this.selectedBigUp.attackMod;
    }
    
    angular.forEach(this.optionalBonuses, function(option, index) {
      if (option.selected) {
        if (option.attackMod && (!option.type || option.type === selectedAttack.type)) {
          attackMod += option.attackMod;
        }
      }
    });
    
    angular.forEach(this.conditionalBonuses, function(bonus, index) {
      if (bonus.selected) {
        if (bonus.attackMod && (!bonus.type || bonus.type === selectedAttack.type)) {
          attackMod += bonus.attackMod;
        }
      }
    });

    return selectedAttack.name + ' [[d20' + this.getAmount(baseAttack + selectedAttack.attackMod + attackMod) + ']]';
  }
  
  getFinalDamage() {
    if (!(this.selectedAttack && this.selectedAttack.name)) {
      return '';
    }
    
    var damageMod = this.miscBonus.damageMod;
    var selectedAttack = this.selectedAttack;
    
    angular.forEach(this.optionalBonuses, function(option, index) {
      if (option.selected) {
        if (option.damageMod && (!option.type || option.type === selectedAttack.type)) {
          damageMod += option.damageMod;
        }
      }
    });
    
    angular.forEach(this.conditionalBonuses, function(bonus, index) {
      if (bonus.selected) {
        if (bonus.damageMod && (!bonus.type || bonus.type === selectedAttack.type)) {
          damageMod += bonus.damageMod;
        }
      }
    });
      
    var damageDice = this.selectedBigUp.large
      ? selectedAttack.largeDamageDice
      : selectedAttack.damageDice;
      
    var miscDamageDice = this.miscBonus.damageDice && this.miscBonus.damageDice.length > 0
      ? ('+' + this.miscBonus.damageDice)
      : '';
  
    var damageBaseMod = this.selectedBigUp.large
      ? selectedAttack.largeDamageMod
      : selectedAttack.damageMod;
      
    return 'damage: [[' + damageDice + miscDamageDice + this.getAmount(damageBaseMod + damageMod) + ']]';
  }
}
