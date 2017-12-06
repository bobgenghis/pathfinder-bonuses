export default class controller {
  constructor($log) {
    'ngInject';
    
    Object.assign(this, { $log });
    
    this.selectedAttackType; //binding
    this.bonuses = []; //binding
  }
  
  $onInit() {
	this.$log.info(this.selectedAttackType);
	this.$log.info(this.bonuses);
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
}
