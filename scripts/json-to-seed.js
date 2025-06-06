#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function parseChallengeRating(challengeString) {
  if (!challengeString) return { cr: 0, xp: 0 };
  
  const parts = challengeString.split(' ');
  const crPart = parts[0];
  const xpPart = challengeString.match(/\(([^)]+)\)/)?.[1] || '';
  const xpClean = xpPart.replace(/[^0-9]/g, '');
  
  let cr;
  switch (crPart) {
    case '1/8': cr = 0.125; break;
    case '1/4': cr = 0.25; break;
    case '1/2': cr = 0.5; break;
    default: cr = parseFloat(crPart) || 0;
  }
  
  const xp = xpClean ? parseInt(xpClean) : 0;
  return { cr, xp };
}

function extractArmorClass(acString) {
  if (!acString) return null;
  const match = acString.match(/^(\d+)/);
  return match ? parseInt(match[1]) : null;
}

function extractHitPoints(hpString) {
  if (!hpString) return { hp: null, dice: null };
  
  const hpMatch = hpString.match(/^(\d+)/);
  const diceMatch = hpString.match(/\(([^)]+)\)/);
  
  return {
    hp: hpMatch ? parseInt(hpMatch[1]) : null,
    dice: diceMatch ? diceMatch[1] : null
  };
}

function parseSavingThrows(savingThrowString) {
  if (!savingThrowString) return null;
  
  const throws = {};
  const parts = savingThrowString.split(',');
  
  for (const part of parts) {
    const trimmed = part.trim();
    const match = trimmed.match(/(\w{3})\s*([\+\-]\d+)/i);
    if (match) {
      const ability = match[1].toLowerCase();
      const bonus = match[2];
      throws[ability] = bonus;
    }
  }
  
  return Object.keys(throws).length > 0 ? throws : null;
}

function escapeSQL(str) {
  if (!str) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
}

function arrayToSQL(arr) {
  if (!arr || arr.length === 0) return 'ARRAY[]::TEXT[]';
  const escapedItems = arr.map(item => `'${item.replace(/'/g, "''")}'`);
  return `ARRAY[${escapedItems.join(', ')}]`;
}

function jsonToSQL(obj) {
  if (!obj) return "'{}'";
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'`;
}

function monsterToSQL(monster, isLast = false) {
  const { cr, xp } = parseChallengeRating(monster.challenge);
  const { hp, dice } = extractHitPoints(monster.hit_points);
  const ac = extractArmorClass(monster.armor_class);
  const savingThrows = parseSavingThrows(monster.saving_throws);
  
  // Handle damage arrays
  const damageResistances = monster.damage_resistances ? 
    monster.damage_resistances.split(', ') : [];
  const damageImmunities = monster.damage_immunities ? 
    monster.damage_immunities.split(', ') : [];
  const conditionImmunities = monster.condition_immunities ? 
    monster.condition_immunities.split(', ') : [];
  const damageVulnerabilities = monster.damage_vulnerabilities ? 
    monster.damage_vulnerabilities.split(', ') : [];

  const sql = `-- ${monster.name} (CR ${monster.challenge})
(
    ${escapeSQL(monster.name)},
    ${escapeSQL(monster.size)},
    ${escapeSQL(monster.type)},
    ${escapeSQL(monster.alignment)},
    ${ac || 'NULL'},
    ${hp || 'NULL'},
    ${escapeSQL(dice)},
    ${jsonToSQL(monster.speed ? { raw: monster.speed } : {})},
    ${jsonToSQL(monster.stats || {})},
    ${jsonToSQL(monster.skills ? { raw: monster.skills } : {})},
    ${arrayToSQL(damageResistances)},
    ${arrayToSQL(damageImmunities)},
    ${arrayToSQL(conditionImmunities)},
    ${arrayToSQL(damageVulnerabilities)},
    ${escapeSQL(monster.senses)},
    ${cr},
    ${xp},
    ${jsonToSQL(monster.actions || [])},
    ${jsonToSQL(monster.abilities || [])},
    ${jsonToSQL(savingThrows)},
    'SRD 5.1',
    FALSE
)${isLast ? ';' : ','}`

  return sql;
}

function convertJSONToSeed() {
  try {
    console.log('Converting JSON monsters to SQL seed format...');
    
    const jsonPath = path.join(process.cwd(), 'data', 'Monsters-SRD5.1-CCBY4.0License-TT.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    if (!jsonData.monsters || !Array.isArray(jsonData.monsters)) {
      throw new Error('Invalid JSON structure: expected monsters array');
    }
    
    console.log(`Found ${jsonData.monsters.length} monsters to convert`);
    
    // Generate SQL header
    let sql = `-- SRD 5.1 Monsters Seed Data
-- Generated from JSON on ${new Date().toISOString()}
-- Clear existing monster data (since seeds run every time)
DELETE FROM monsters WHERE source = 'SRD 5.1' AND is_homebrew = FALSE;

-- Insert all SRD monsters
INSERT INTO monsters (
    name,
    size,
    type,
    alignment,
    armor_class,
    hit_points,
    hit_dice,
    speed,
    ability_scores,
    skills,
    damage_resistances,
    damage_immunities,
    condition_immunities,
    damage_vulnerabilities,
    senses,
    challenge_rating,
    xp,
    actions,
    special_abilities,
    saving_throws,
    source,
    is_homebrew
) VALUES 
`;

    // Convert each monster
    const monsterSQLs = jsonData.monsters.map((monster, index) => 
      monsterToSQL(monster, index === jsonData.monsters.length - 1)
    );
    
    sql += monsterSQLs.join('\n');
    
    // Write to seed file
    const outputPath = path.join(process.cwd(), 'supabase', 'seeds', '02_monsters.sql');
    fs.writeFileSync(outputPath, sql);
    
    console.log(`✅ Successfully converted ${jsonData.monsters.length} monsters to ${outputPath}`);
    console.log('You can now run: supabase db reset');
    
  } catch (error) {
    console.error('❌ Error converting JSON to seed:', error);
    process.exit(1);
  }
}

// Run the script
if (fileURLToPath(import.meta.url) === process.argv[1]) {
  convertJSONToSeed();
}

export { convertJSONToSeed }; 