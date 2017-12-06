export default class controller {
  constructor($log) {
    'ngInject';
    
    Object.assign(this, { $log });
    
    this.name; //binding
    this.baseAttack; // binding
    this.attacks = []; //binding
    this.bigUps = []; //binding
    this.optionalBonuses = []; //binding
    this.conditionalBonuses = []; //binding

    this.selectedAttack = {};
    this.selectedBigUp = {};

    this.miscBonus = { attackMod: 0, damageMod: 0,  damageDice: ''};
  }
  
  $onInit() {
	if (this.attacks && this.attacks.length > 0) {
	  this.selectedAttack = this.attacks[0];
	}
	
	if (this.bigUps && this.bigUps.length > 0) {
	  this.selectedBigUp = this.bigUps[0];
	}
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
    return this.selectedBigUp && this.selectedBigUp.name === 'soul stone';
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
    
    var attackBonusMod = this.miscBonus.attackMod;
    var selectedAttack = this.selectedAttack;
    
    if (this.selectedBigUp.attackMod) {
      attackBonusMod += this.selectedBigUp.attackMod;
    }

    attackBonusMod += this.getBonusAttackMod(this.optionalBonuses, selectedAttack);
    attackBonusMod += this.getBonusAttackMod(this.conditionalBonuses, selectedAttack);

    return selectedAttack.name + ' [[d20' + this.getAmount(baseAttack + selectedAttack.attackMod + attackBonusMod) + ']]';
  }
  
  getFinalDamage() {
    if (!(this.selectedAttack && this.selectedAttack.name)) {
      return '';
    }
    
    var damageBonusMod = this.miscBonus.damageMod;
    var selectedAttack = this.selectedAttack;
	
    var damageDice = this.selectedBigUp.large
      ? selectedAttack.largeDamageDice
      : selectedAttack.damageDice;
	  
    if (!damageDice || damageDice === '') {
	  return '';
    }

    damageBonusMod += this.getBonusDamageMod(this.optionalBonuses, selectedAttack);
    damageBonusMod += this.getBonusDamageMod(this.conditionalBonuses, selectedAttack);

    var miscDamageDice = this.miscBonus.damageDice && this.miscBonus.damageDice.length > 0
      ? ('+' + this.miscBonus.damageDice)
      : '';
  
    var damageBaseMod = this.selectedBigUp.large
      ? selectedAttack.largeDamageMod
      : selectedAttack.damageMod;
      
    return 'damage: [[' + damageDice + miscDamageDice + this.getAmount(damageBaseMod + damageBonusMod) + ']]';
  }

  getBonusAttackMod(bonuses, selectedAttack) {
    var bonusAttackMod = 0;
    angular.forEach(bonuses, function(bonus, index) {
      if (bonus.selected && bonus.attackMod && (!bonus.type || bonus.type === selectedAttack.type)) {
        bonusAttackMod += bonus.attackMod;
      }
    });
    return bonusAttackMod;
  }

  getBonusDamageMod(bonuses, selectedAttack) {
    var bonusDamageMod = 0;
    angular.forEach(bonuses, function(bonus, index) {
      if (bonus.selected && bonus.damageMod && (!bonus.type || bonus.type === selectedAttack.type)) {
        bonusDamageMod += bonus.damageMod;
      }
    });
    return bonusDamageMod;
  }
}
