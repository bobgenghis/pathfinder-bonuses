export default class controller {
  constructor($log) {
    'ngInject';
    
    Object.assign(this, { $log });
    
    this.selectedAttackType; //binding
    this.bonuses = []; //binding
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
}
