import fs from "fs";
import path from "path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { env } from "../../src/config/env";
import { buildMaterialContext } from "../../src/services/material-context.service";

const uploadDir = path.resolve(env.UPLOAD_DIR);
const txtName = `mat-ctx-${Date.now()}.txt`;

describe("buildMaterialContext", () => {
  beforeAll(() => {
    fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, txtName), "Orbital mechanics overview", "utf8");
  });

  afterAll(() => {
    try {
      fs.unlinkSync(path.join(uploadDir, txtName));
    } catch {
      /* ignore */
    }
  });

  it("includes text file content", async () => {
    const ctx = await buildMaterialContext([txtName]);
    expect(ctx).toContain("Orbital mechanics");
    expect(ctx).toContain(txtName);
  });

  it("returns empty string when no files", async () => {
    expect(await buildMaterialContext([])).toBe("");
  });
});
