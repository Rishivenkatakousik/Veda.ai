import { describe, expect, it } from "vitest";
import { extractJSON } from "../../src/lib/json-utils";

describe("extractJSON", () => {
  it("returns clean JSON when input is already valid JSON", () => {
    const json = '{"header": {"schoolName": "Test"}}';
    expect(extractJSON(json)).toBe(json);
  });

  it("strips markdown code fences with json tag", () => {
    const raw = '```json\n{"key": "value"}\n```';
    expect(extractJSON(raw)).toBe('{"key": "value"}');
  });

  it("strips markdown code fences without language tag", () => {
    const raw = '```\n{"key": "value"}\n```';
    expect(extractJSON(raw)).toBe('{"key": "value"}');
  });

  it("extracts JSON from surrounding text", () => {
    const raw = 'Here is the result:\n{"key": "value"}\nDone!';
    expect(extractJSON(raw)).toBe('{"key": "value"}');
  });

  it("handles nested braces correctly", () => {
    const json = '{"outer": {"inner": {"deep": true}}}';
    const raw = `Some text\n${json}\nMore text`;
    const extracted = extractJSON(raw);
    expect(JSON.parse(extracted)).toEqual({
      outer: { inner: { deep: true } }
    });
  });

  it("returns trimmed input when no braces found", () => {
    const raw = "  no json here  ";
    expect(extractJSON(raw)).toBe("no json here");
  });

  it("handles multi-line JSON inside fences", () => {
    const raw = '```json\n{\n  "sections": [\n    {"title": "A"}\n  ]\n}\n```';
    const extracted = extractJSON(raw);
    expect(JSON.parse(extracted)).toEqual({
      sections: [{ title: "A" }]
    });
  });

  it("prefers fenced JSON over bare JSON", () => {
    const raw =
      'prefix {"wrong": true} ```json\n{"correct": true}\n``` suffix';
    const extracted = extractJSON(raw);
    expect(JSON.parse(extracted)).toEqual({ correct: true });
  });
});
