import { execSync } from "child_process";
import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  // 最新5件のコミット情報を取得
  const gitLog = execSync(
    'git log -5 --pretty=format:"%H|%h|%s|%an|%ae|%ad|%cr" --date=iso',
    { encoding: "utf-8" },
  );

  const commits = gitLog.split("\n").map((line) => {
    const [hash, shortHash, message, author, email, date, relativeDate] =
      line.split("|");
    return {
      hash,
      shortHash,
      message,
      author,
      email,
      date,
      relativeDate,
      url: `https://github.com/kotarou1192/kishitu-gensen/commit/${hash}`,
    };
  });

  const changelog = {
    generated: new Date().toISOString(),
    commits,
  };

  // public/changelog.json に保存
  const outputPath = `${__dirname}/../public/changelog.json`;
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(changelog, null, 2));

  console.log("✅ Changelog generated successfully!");
  console.log(`   Found ${commits.length} commits`);
} catch (error) {
  console.error("❌ Failed to generate changelog:", error.message);
  // ビルドは失敗させない（gitがない環境でもビルドできるように）
  const emptyChangelog = {
    generated: new Date().toISOString(),
    commits: [],
  };
  const outputPath = `${__dirname}/../public/changelog.json`;
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(emptyChangelog, null, 2));
  console.log("⚠️  Created empty changelog.json");
}
