import fs from "node:fs";
import path from "node:path";

const args = new Set(process.argv.slice(2));
const allowDuplicateEn = args.has("--allow-duplicate-en");
const outputJson = args.has("--json");

const weaponsPath = path.resolve("src/lib/constants/weapons.ts");
const i18nPath = path.resolve("src/lib/i18n/index.ts");

const readUtf8 = (filePath) => fs.readFileSync(filePath, "utf8");

const lineAt = (text, index) => {
  return text.slice(0, index).split("\n").length;
};

const extractBlock = (source, startMarker, endMarker, label) => {
  const start = source.indexOf(startMarker);
  if (start === -1) {
    throw new Error(`${label}: start marker not found`);
  }

  const blockStart = start + startMarker.length;
  const end = source.indexOf(endMarker, blockStart);
  if (end === -1) {
    throw new Error(`${label}: end marker not found`);
  }

  return {
    text: source.slice(blockStart, end),
    offset: blockStart,
  };
};

const findDuplicates = (values) => {
  const bucket = new Map();
  for (const value of values) {
    if (!bucket.has(value)) {
      bucket.set(value, 0);
    }
    bucket.set(value, bucket.get(value) + 1);
  }

  return [...bucket.entries()].filter(([, count]) => count > 1).sort((a, b) => b[1] - a[1]);
};

const weaponsSource = readUtf8(weaponsPath);
const i18nSource = readUtf8(i18nPath);

const weaponsBlock = extractBlock(
  weaponsSource,
  "export const WEAPONS: Weapon[] = [",
  "];",
  "WEAPONS",
);

const weaponNamePattern = /name:\s*"([^"]+)"/g;
const weapons = [];
for (const match of weaponsBlock.text.matchAll(weaponNamePattern)) {
  weapons.push({
    name: match[1],
    line: lineAt(weaponsSource, weaponsBlock.offset + match.index),
  });
}

const i18nBlock = extractBlock(
  i18nSource,
  "const weaponI18nMap = new Map<string, { ja: string; en: string }>([",
  "]);",
  "weaponI18nMap",
);

const i18nEntryPattern =
  /\[\s*"([^"]+)"\s*,\s*\{\s*ja:\s*"([^"]+)"\s*,\s*en:\s*"([^"]+)"\s*\}\s*,?\s*\]/gs;
const i18nEntries = [];
for (const match of i18nBlock.text.matchAll(i18nEntryPattern)) {
  i18nEntries.push({
    key: match[1],
    ja: match[2],
    en: match[3],
    line: lineAt(i18nSource, i18nBlock.offset + match.index),
  });
}

const weaponNames = weapons.map((item) => item.name);
const weaponSet = new Set(weaponNames);

const duplicateWeaponNames = findDuplicates(weaponNames);
const duplicateI18nKeys = findDuplicates(i18nEntries.map((item) => item.key));
const duplicateEnNames = findDuplicates(i18nEntries.map((item) => item.en));

const jaKeyMismatches = i18nEntries.filter((entry) => entry.key !== entry.ja);

const i18nKeySet = new Set(i18nEntries.map((item) => item.key));
const missingI18nEntries = weapons.filter((item) => !i18nKeySet.has(item.name));
const orphanI18nEntries = i18nEntries.filter((item) => !weaponSet.has(item.key));

const suspiciousEnglishEntries = i18nEntries.filter((entry) => {
  const en = entry.en.trim();
  if (!en) return true;
  if (en === entry.ja) return true;
  if (/(TODO|TBD|\?\?\?)/i.test(en)) return true;
  return false;
});

const errors = [];
const warnings = [];

if (duplicateWeaponNames.length > 0) {
  errors.push({
    type: "duplicateWeaponNames",
    detail: duplicateWeaponNames,
  });
}

if (duplicateI18nKeys.length > 0) {
  errors.push({
    type: "duplicateI18nKeys",
    detail: duplicateI18nKeys,
  });
}

if (missingI18nEntries.length > 0) {
  errors.push({
    type: "missingI18nEntries",
    detail: missingI18nEntries,
  });
}

if (orphanI18nEntries.length > 0) {
  errors.push({
    type: "orphanI18nEntries",
    detail: orphanI18nEntries,
  });
}

if (jaKeyMismatches.length > 0) {
  errors.push({
    type: "jaKeyMismatches",
    detail: jaKeyMismatches,
  });
}

if (!allowDuplicateEn && duplicateEnNames.length > 0) {
  errors.push({
    type: "duplicateEnNames",
    detail: duplicateEnNames,
  });
}

if (allowDuplicateEn && duplicateEnNames.length > 0) {
  warnings.push({
    type: "duplicateEnNames",
    detail: duplicateEnNames,
  });
}

if (suspiciousEnglishEntries.length > 0) {
  warnings.push({
    type: "suspiciousEnglishEntries",
    detail: suspiciousEnglishEntries,
  });
}

const summary = {
  weaponsCount: weapons.length,
  i18nCount: i18nEntries.length,
  errorsCount: errors.length,
  warningsCount: warnings.length,
  options: {
    allowDuplicateEn,
  },
};

if (outputJson) {
  console.log(
    JSON.stringify(
      {
        summary,
        errors,
        warnings,
      },
      null,
      2,
    ),
  );
  process.exit(errors.length > 0 ? 1 : 0);
}

console.log("Weapon maintenance check");
console.log(`- WEAPONS: ${summary.weaponsCount}, weaponI18nMap: ${summary.i18nCount}`);
console.log(`- Errors: ${summary.errorsCount}, Warnings: ${summary.warningsCount}`);

if (errors.length > 0) {
  console.log("\n[Errors]");
}

for (const issue of errors) {
  if (issue.type === "duplicateWeaponNames") {
    console.log("- duplicate weapon names in WEAPONS:");
    for (const [name, count] of issue.detail) {
      console.log(`  - ${name} (${count})`);
    }
  }

  if (issue.type === "duplicateI18nKeys") {
    console.log("- duplicate JA keys in weaponI18nMap:");
    for (const [name, count] of issue.detail) {
      console.log(`  - ${name} (${count})`);
    }
  }

  if (issue.type === "missingI18nEntries") {
    console.log("- missing i18n entries for WEAPONS:");
    for (const item of issue.detail) {
      console.log(`  - ${item.name} (weapons.ts:${item.line})`);
    }

    console.log("  Suggested entries to paste into weaponI18nMap:");
    for (const item of issue.detail) {
      console.log(`  ["${item.name}", { ja: "${item.name}", en: "TODO_EN_WEAPON_NAME" }],`);
    }
  }

  if (issue.type === "orphanI18nEntries") {
    console.log("- i18n entries not found in WEAPONS:");
    for (const item of issue.detail) {
      console.log(`  - ${item.key} (i18n/index.ts:${item.line})`);
    }
  }

  if (issue.type === "jaKeyMismatches") {
    console.log("- i18n JA key and ja-field mismatch:");
    for (const item of issue.detail) {
      console.log(`  - key=${item.key}, ja=${item.ja} (i18n/index.ts:${item.line})`);
    }
  }

  if (issue.type === "duplicateEnNames") {
    console.log("- duplicate EN names in weaponI18nMap:");
    for (const [enName, count] of issue.detail) {
      const mapped = i18nEntries
        .filter((entry) => entry.en === enName)
        .map((entry) => entry.key)
        .join(", ");
      console.log(`  - ${enName} (${count}) => ${mapped}`);
    }
  }
}

if (warnings.length > 0) {
  console.log("\n[Warnings]");
}

for (const issue of warnings) {
  if (issue.type === "duplicateEnNames") {
    console.log("- duplicate EN names found (allowed by option):");
    for (const [enName, count] of issue.detail) {
      const mapped = i18nEntries
        .filter((entry) => entry.en === enName)
        .map((entry) => entry.key)
        .join(", ");
      console.log(`  - ${enName} (${count}) => ${mapped}`);
    }
  }

  if (issue.type === "suspiciousEnglishEntries") {
    console.log("- suspicious EN names (empty/same as JA/TODO-like):");
    for (const item of issue.detail) {
      console.log(`  - ${item.key}: "${item.en}" (i18n/index.ts:${item.line})`);
    }
  }
}

if (errors.length === 0) {
  console.log("\nOK: weapon data and i18n mappings are consistent.");
}

process.exit(errors.length > 0 ? 1 : 0);
