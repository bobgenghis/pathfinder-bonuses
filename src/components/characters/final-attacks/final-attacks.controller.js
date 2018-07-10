export default class controller {
  constructor($log) {
    'ngInject';
    
    Object.assign(this, { $log });
    
    this.baseAttack; //binding, expected int
    this.selectedAttack; //binding, expected int
    this.selectedBigUp = {}; //binding
    this.seperateAttack; //binding
    
    this.optionalBonuses = []; //binding
    this.conditionalBonuses = []; //binding
    this.miscBonuses = []; //binding
    
    this.finalAttacks = [];
    this.finalAverages = [];

    this.targetAc = 32;
  }

  $onInit() {
	 this.targetAc = (this.baseAttack + 20);
  }
  
  $onChanges() {
    this.finalAttacks = this.getFinalAttacks();
    this.finalAverages = this.getFinalAverages();
    this.finalAverage = this.finalAverages.reduce((sum, average) => sum + average.averageTotal, 0);
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

    var hasSeperateAttacks = this.hasSeperateAttacks();

    //push first attack always, plus extras
	attackRange.push(firstAttack);
	if (!hasSeperateAttacks) {
	  for (var i = 0; i < (extraAttacks); i++) {
        attackRange.push(firstAttack);
        if (attackRider && attackRider.name) {
          attackRange.push(attackRider);
        }
      }
	} else if (attackRange.length > 0) {
		attackRange[0].attackMod += this.seperateAttack.attackMod;
	}

    if (!this.selectedAttack.isNatural && !hasSeperateAttacks) {
      for (var iterativeAttack = (this.baseAttack-5); iterativeAttack > 0; iterativeAttack -= 5) {
        var newAttack = angular.copy(firstAttack);
        newAttack.attackMod += (iterativeAttack - this.baseAttack);
        attackRange.push(newAttack);

        if (attackRider && attackRider.name) {
          var newRider = angular.copy(attackRider);
          newRider.attackMod += (iterativeAttack - this.baseAttack);
          attackRange.push(newRider);
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

  hasSeperateAttacks() {
	if (!this.seperateAttack) {
	  return false;
	}

	return this.seperateAttack.name !== 'none';
  };

  getAttackAttributes(attack) {
    var attackMod = this.baseAttack + attack.attackMod;

    var damageMod = (this.selectedBigUp.large && attack.largeDamageMod)
      ? attack.largeDamageMod
      : attack.damageMod;

    var damageDice = (this.selectedBigUp.large && attack.largeDamageDice)
      ? attack.largeDamageDice
      : attack.damageDice;

    var damageRoll = (this.selectedBigUp.large && attack.largeDamageDice)
      ? attack.largeDamageRoll
      : attack.damageRoll;

    return {
      name: attack.name,
      type: attack.type,
      attackMod: this.baseAttack + attack.attackMod,
      damageMod: damageMod,
      damageDice: damageDice,
      damageRoll: damageRoll,
      crit: attack.crit
    };
  }

  getFinalAttacks() {
    var finalAttacks = [];
    var baseAttacks = this.getBaseAttacks();

    var totalBonuses = {
      attackMod: this.optionalBonuses.attackMod + this.conditionalBonuses.attackMod + this.miscBonuses.attackMod,
      damageMod: this.optionalBonuses.damageMod + this.conditionalBonuses.damageMod + this.miscBonuses.damageMod,
      damageDice: this.optionalBonuses.damageDice + this.conditionalBonuses.damageDice + this.miscBonuses.damageDice,
      bonusRoll: this.optionalBonuses.damageRoll + this.conditionalBonuses.damageRoll,
      extraAttacks: this.optionalBonuses.extraAttacks + this.conditionalBonuses.extraAttacks
    };

    for (var attackIndex in baseAttacks) {
      var baseAttack = baseAttacks[attackIndex];
      var attackBonusMod = totalBonuses.attackMod;

      if (this.selectedBigUp && this.selectedBigUp.large && baseAttack.type && baseAttack.type === 'ranged') {
        attackBonusMod -= 2;
      }

      if (this.selectedBigUp.attackMod) {
        attackBonusMod += this.selectedBigUp.attackMod;
      }

      var name = baseAttack.name;
      if (this.hasSeperateAttacks()) {
        name = name + ' (' + this.seperateAttack.name + ')';
      }

      finalAttacks.push({
        name: name,
        attackMod: baseAttack.attackMod + attackBonusMod,
        damageDice: baseAttack.damageDice,
        damageMod: baseAttack.damageMod + totalBonuses.damageMod,
        damageRoll: baseAttack.damageRoll,
        bonusDamage: totalBonuses.damageDice,
        bonusRoll: totalBonuses.bonusRoll,
        crit: baseAttack.crit
      });

    }

    return finalAttacks;
  }

  getFinalAttack(finalAttack) {
    var critMod = finalAttack.crit
        ? ('cs>'+finalAttack.crit)
        : '';
    return finalAttack.name + ' [[d20' + critMod + this.getAmount(finalAttack.attackMod) + ']]';
  }

  getFinalDamage(finalAttack) {
    if (!finalAttack.damageDice || finalAttack.damageDice === '') {
      return '';
    }

    var bonusDamage = (finalAttack.bonusDamage && finalAttack.bonusDamage !== '')
        ? ('+' + finalAttack.bonusDamage)
        : '';

    return 'damage: [[' + finalAttack.damageDice + this.getAmount(finalAttack.damageMod) + bonusDamage + ']]';
  }

  getFinalAverages() {
    var finalAverages = [];
    for (var finalAttackIndex in this.finalAttacks) {
      var finalAttack = this.finalAttacks[finalAttackIndex];
      if (!finalAttack.damageRoll || finalAttack.damageRoll == 0) {
        continue;
      }

      var averageHit = this.getFinalAverageHit(finalAttack);
      var averageDamage = finalAttack.damageRoll+finalAttack.damageMod;
      var bonusDamage = finalAttack.bonusRoll;
      var critMod = finalAttack.crit && finalAttack.crit < 20
        ? finalAttack.crit
        : 20;
      var crit = Math.min(1-((critMod-1) / 20), averageHit);

      finalAverages.push({
        averageHit: averageHit,
        averageDamage: averageDamage,
        bonusDamage: bonusDamage,
        crit: crit,
        averageTotal: averageHit*(bonusDamage+averageDamage*(1+crit))
      });
    }

    return finalAverages;
  }
  
  getFinalAverageHit(finalAttack) {
    if (!finalAttack.damageDice || finalAttack.damageDice === '') {
      return null;
    }

    var hitPercent = 1-((this.targetAc-finalAttack.attackMod-1)/20);
    if (hitPercent > .95) {
      return .95;
    } else if (hitPercent < .05) {
      return .05;
    } else {
      return hitPercent;
    }
  }
  
  updateTargetAc() {
    this.finalAverages = this.getFinalAverages();
    this.finalAverage = this.finalAverages.reduce((sum, average) => sum + average.averageTotal, 0);
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
