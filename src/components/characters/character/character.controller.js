export default class controller {
  constructor($log) {
    'ngInject';
    
    Object.assign(this, { $log });
    
    this.name; //binding
    this.baseAttack; // binding, note can change based on selections
    this.attacks = []; //binding
    this.bigUps = []; //binding
	this.seperateAttacks = []; //binding
    this.optionalBonuses = []; //binding
    this.conditionalBonuses = []; //binding

    this.initialBaseAttack; //since the baseAttack can change based on powers. setup in init.

    this.selectedAttack = {};
	this.seperateAttack = {};
    this.selectedBigUp = {};
    this.optionalTotal = {};
    this.conditionalTotal = {};

    this.miscTotal = {
      attackMod: 0,
      damageMod: 0,
      damageDice: ''
    };

    this.miscBonus = {
      attackMod: 0,
      damageMod: 0,
      damageDice: ''
    };
  }
  
  $onInit() {
    this.initialBaseAttack = this.baseAttack;
    if (this.attacks && this.attacks.length > 0) {
      this.selectedAttack = this.attacks[0];
    }

    if (this.bigUps && this.bigUps.length > 0) {
      this.selectedBigUp = this.bigUps[0];
    }

    if (this.seperateAttacks && this.seperateAttacks.length > 0) {
      this.seperateAttack = this.seperateAttacks[0];
    }
  }

  updateBab() {
    if (this.isSoulStone() ) {
      this.baseAttack = this.initialBaseAttack + 1;
    } else {
      this.baseAttack = this.initialBaseAttack;
    }
  }

  updateMisc() {
    //need to copy to trigger onChange for final
    this.miscTotal = angular.copy(this.miscBonus);
  }

  isSoulStone() {
    return this.selectedBigUp && this.selectedBigUp.name === 'soul stone';
  }

  getAttackDesc(attack) {
    var damageDice = (this.selectedBigUp.large && attack.largeDamageDice)
      ? attack.largeDamageDice
      : attack.damageDice;

    var damageMod = (this.selectedBigUp.large && attack.largeDamageMod)
      ? attack.largeDamageMod
      : attack.damageMod;

    var extraDamage = attack.extraDamage
      ? '+' + attack.extraDamage
      : '';

    var attackDesc = this.getAmount(this.baseAttack + attack.attackMod);
    if (damageDice && damageDice !== '') {
      attackDesc += (' / ' + damageDice + this.getAmount(damageMod) + extraDamage);
    }

    return attackDesc;
  }

  getSeperateAttackDesc(attack) {
    return this.getAmount(attack.attackMod);
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
