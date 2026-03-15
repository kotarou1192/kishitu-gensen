import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

const getArgValue = (name) => {
  const inline = args.find((arg) => arg.startsWith(`${name}=`));
  if (inline) {
    return inline.slice(name.length + 1);
  }

  const index = args.indexOf(name);
  if (index === -1) return null;
  return args[index + 1] ?? null;
};

const hasFlag = (name) => args.includes(name);

const ja = getArgValue("--ja");
const en = getArgValue("--en");
const rarityRaw = getArgValue("--rarity");
const category = getArgValue("--category");
const base = getArgValue("--base");
const additional = getArgValue("--additional");
const skill = getArgValue("--skill");
const dryRun = hasFlag("--dry-run");

const usage =
  "Usage: node scripts/add-weapon-i18n.js --ja <JA_NAME> --en <EN_NAME> --rarity <3|4|5|6> --category <CATEGORY> --base <BASE> --additional <ADDITIONAL> --skill <SKILL> [--dry-run]";

if (!ja || !en || !rarityRaw || !category || !base || !additional || !skill) {
  console.error(usage);
  process.exit(1);
}

const rarity = Number(rarityRaw);
const ALLOWED_RARITIES = new Set([3, 4, 5, 6]);
const ALLOWED_CATEGORIES = new Set([
  "アーツユニット",
  "拳銃",
  "大剣",
  "長柄武器",
  "片手剣",
]);
const ALLOWED_BASE = new Set([
  "敏捷UP",
  "筋力UP",
  "意志UP",
  "知性UP",
  "メイン能力UP",
]);
const ALLOWED_ADDITIONAL = new Set([
  "攻撃力UP",
  "HPアップ",
  "物理ダメージUP",
  "灼熱ダメージUP",
  "電磁ダメージUP",
  "寒冷ダメージUP",
  "自然ダメージUP",
  "会心率UP",
  "アーツ強度UP",
  "必殺技効率UP",
  "アーツダメージUP",
  "回復効率UP",
]);
const ALLOWED_SKILL = new Set([
  "強攻",
  "圧制",
  "追襲",
  "破砕",
  "巧技",
  "噴発",
  "流回",
  "効率",
  "昂揚",
  "付術",
  "治癒",
  "切骨",
  "残虐",
  "夜幕",
]);

if (!ALLOWED_RARITIES.has(rarity)) {
  console.error(`Invalid --rarity: ${rarityRaw}. Allowed: 3, 4, 5, 6`);
  process.exit(1);
}

if (!ALLOWED_CATEGORIES.has(category)) {
  console.error(`Invalid --category: ${category}`);
  process.exit(1);
}

if (!ALLOWED_BASE.has(base)) {
  console.error(`Invalid --base: ${base}`);
  process.exit(1);
}

if (!ALLOWED_ADDITIONAL.has(additional)) {
  console.error(`Invalid --additional: ${additional}`);
  process.exit(1);
}

if (!ALLOWED_SKILL.has(skill)) {
  console.error(`Invalid --skill: ${skill}`);
  process.exit(1);
}

const weaponsPath = path.resolve("src/lib/constants/weapons.ts");
const i18nPath = path.resolve("src/lib/i18n/index.ts");
const weaponsSource = fs.readFileSync(weaponsPath, "utf8");
const source = fs.readFileSync(i18nPath, "utf8");

const weaponsStartMarker = "export const WEAPONS: Weapon[] = [";
const weaponsStart = weaponsSource.indexOf(weaponsStartMarker);
if (weaponsStart === -1) {
  console.error("WEAPONS start marker not found");
  process.exit(1);
}

const weaponsBlockStart = weaponsStart + weaponsStartMarker.length;
const weaponsEnd = weaponsSource.indexOf("];", weaponsBlockStart);
if (weaponsEnd === -1) {
  console.error("WEAPONS end marker not found");
  process.exit(1);
}

const weaponsBlock = weaponsSource.slice(weaponsBlockStart, weaponsEnd);

const mapStartMarker =
  "const weaponI18nMap = new Map<string, { ja: string; en: string }>([";
const mapStart = source.indexOf(mapStartMarker);
if (mapStart === -1) {
  console.error("weaponI18nMap start marker not found");
  process.exit(1);
}

const blockStart = mapStart + mapStartMarker.length;
const mapEnd = source.indexOf("]);", blockStart);
if (mapEnd === -1) {
  console.error("weaponI18nMap end marker not found");
  process.exit(1);
}

const block = source.slice(blockStart, mapEnd);

const escapeRegExp = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const buildWeaponEntry = () => {
  return [
    "  {",
    `    rarity: ${rarity},`,
    `    name: ${JSON.stringify(ja)},`,
    `    category: ${JSON.stringify(category)},`,
    `    base: ${JSON.stringify(base)},`,
    `    additional: ${JSON.stringify(additional)},`,
    `    skill: ${JSON.stringify(skill)},`,
    "  },",
  ].join("\n");
};

const parseWeaponEntry = (entryText) => {
  const rarityMatch = entryText.match(/rarity:\s*(\d+)/);
  const nameMatch = entryText.match(/name:\s*"([^"]+)"/);
  const categoryMatch = entryText.match(/category:\s*"([^"]+)"/);
  const baseMatch = entryText.match(/base:\s*"([^"]+)"/);
  const additionalMatch = entryText.match(/additional:\s*"([^"]+)"/);
  const skillMatch = entryText.match(/skill:\s*"([^"]+)"/);

  if (
    !rarityMatch ||
    !nameMatch ||
    !categoryMatch ||
    !baseMatch ||
    !additionalMatch ||
    !skillMatch
  ) {
    return null;
  }

  return {
    rarity: Number(rarityMatch[1]),
    name: nameMatch[1],
    category: categoryMatch[1],
    base: baseMatch[1],
    additional: additionalMatch[1],
    skill: skillMatch[1],
  };
};

const appendEntry = (blockText, entryText) => {
  const insertion = `\n${entryText}`;
  if (blockText.endsWith("\n")) {
    return `${blockText.slice(0, -1)}${insertion}\n`;
  }
  return `${blockText}${insertion}\n`;
};

const jaLiteral = JSON.stringify(ja);
const enLiteral = JSON.stringify(en);
const canonicalEntry = `[${jaLiteral}, { ja: ${jaLiteral}, en: ${enLiteral} }]`;
const escapedJaLiteral = escapeRegExp(jaLiteral);

const weaponEntryPattern = /\{\n[\s\S]*?\n  \},/g;
const weaponNameLinePattern = new RegExp(
  `\\n\\s*name:\\s*${escapedJaLiteral},\\n`,
);

let weaponAction = "added";
let weaponMatched = false;
let nextWeaponsBlock = weaponsBlock.replace(weaponEntryPattern, (entry) => {
  if (weaponMatched) return entry;
  if (!weaponNameLinePattern.test(entry)) return entry;
  weaponMatched = true;

  const current = parseWeaponEntry(entry);
  if (
    current &&
    current.rarity === rarity &&
    current.name === ja &&
    current.category === category &&
    current.base === base &&
    current.additional === additional &&
    current.skill === skill
  ) {
    weaponAction = "unchanged";
    return entry;
  }

  weaponAction = "updated";
  return buildWeaponEntry();
});

if (!weaponMatched) {
  nextWeaponsBlock = appendEntry(nextWeaponsBlock, buildWeaponEntry());
}

let nextBlock = block;
let i18nAction = "added";
const i18nEntryPattern =
  /\[\s*"([^"]+)"\s*,\s*\{\s*ja:\s*"([^"]+)"\s*,\s*en:\s*"([^"]+)"\s*\}\s*,?\s*\]/gs;
let i18nMatched = false;

nextBlock = block.replace(
  i18nEntryPattern,
  (entry, key, currentJa, currentEn) => {
    if (i18nMatched) return entry;
    if (key !== ja) return entry;

    i18nMatched = true;
    if (currentJa === ja && currentEn === en) {
      i18nAction = "unchanged";
      return entry;
    }

    i18nAction = "updated";
    return canonicalEntry;
  },
);

if (!i18nMatched) {
  nextBlock = appendEntry(nextBlock, `  ${canonicalEntry},`);
}

const nextWeaponsSource = `${weaponsSource.slice(0, weaponsBlockStart)}${nextWeaponsBlock}${weaponsSource.slice(weaponsEnd)}`;
const nextI18nSource = `${source.slice(0, blockStart)}${nextBlock}${source.slice(mapEnd)}`;

if (nextWeaponsSource === weaponsSource && nextI18nSource === source) {
  console.log("No changes needed (same mapping already exists).");
  process.exit(0);
}

if (dryRun) {
  console.log(
    `[dry-run] weapon ${weaponAction}, i18n ${i18nAction}: ${ja} -> ${en}`,
  );
  process.exit(0);
}

fs.writeFileSync(weaponsPath, nextWeaponsSource, "utf8");
fs.writeFileSync(i18nPath, nextI18nSource, "utf8");

console.log(`weapon ${weaponAction}, i18n ${i18nAction}: ${ja} -> ${en}`);
