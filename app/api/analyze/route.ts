// app/api/analyze/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const src = String(text || "").toLowerCase();

    // Very simple heuristics (until LLM is connected)
    const hasParties = /plaintiff|defendant|petitioner|respondent/.test(src);
    const hasJurisdiction = /jurisdiction|subject matter|personal jurisdiction|venue/.test(src);
    const hasClaims = /count\s+\d+|cause of action|claim for relief|breach|negligence|fraud/.test(src);
    const hasPrayer = /wherefore|prayer|relief requested|demand for judgment/.test(src);
    const hasSign = /signature|signed|bar number|attorney for/.test(src);
    const hasCites = /\b\d+\s+[a-z]+\.\s*\d+|\bv\.\b|\bstat\./.test(src); // crude

    const strengths: string[] = [];
    const issues: string[] = [];
    const missing: string[] = [];
    const suggestions: string[] = [];

    if (hasParties) strengths.push("Parties referenced.");
    else missing.push("Name/role of parties is unclear or missing.");

    if (hasJurisdiction) strengths.push("Jurisdiction or venue mentioned.");
    else missing.push("Add a jurisdiction/venue paragraph with basis and statute/rule.");

    if (hasClaims) strengths.push("Claims/causes of action appear present.");
    else missing.push("Add enumerated counts with elements pled and facts supporting each element.");

    if (hasPrayer) strengths.push("Prayer/wherefore clause present.");
    else missing.push("Add a prayer/wherefore clause specifying the relief requested.");

    if (hasSign) strengths.push("Signature/attorney block appears present.");
    else missing.push("Add signature block with attorney name, bar number, address, email.");

    if (!hasCites) issues.push("Few or no citations detected; add controlling authority near the assertions.");

    suggestions.push(
      "Attach key exhibits with proper labeling (Exhibit A, B…).",
      "Use headings for each count and subheadings for elements.",
      "Verify local rules on font, margins, caption, and page limits."
    );

    return NextResponse.json({ strengths, issues, missing, suggestions });
  } catch (e: any) {
    return new NextResponse(e?.message || "Invalid request", { status: 400 });
  }
}
