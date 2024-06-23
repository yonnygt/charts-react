// casl/ability.js
const { AbilityBuilder, Ability } = require('@casl/ability');

function defineAbilitiesFor(user) {
  const { can, cannot, rules } = new AbilityBuilder(Ability);

  if (user.role === 'admin') {
    can('manage', 'all');
  } else {
    can('read', 'User', { id: user.id });
    cannot('manage', 'User');
  }

  return new Ability(rules);
}

module.exports = { defineAbilitiesFor };
