export type AIActionRisk = "low" | "medium" | "high"

export type AIActionProposal = {
  id: string
  type: string
  target: { id: string; label: string; deepLink?: string }
  changes: string[]
  potentialEffects: string[]
  requiredPermissions: string[]
  sourceContext: string
  aiReason: string
  riskLevel: AIActionRisk
}

export type ActionAuthorization = {
  readonly authority: "authoritative" | "sample"
  verify(proposal: AIActionProposal): Promise<"authorized" | "denied" | "unavailable">
}

export type ActionReceipt = {
  id: string
  action: string
  target: string
  completedAt: string
  context: string
  reference?: string
  recovery?: string
}

export type ActionAuditEntry = {
  id: string
  actor: "user"
  assistant: "pwani-ai"
  action: string
  target: string
  time: string
  context: string
  confirmed: true
  result: "completed" | "failed"
  reference?: string
}

export type ActionServices = {
  authorization?: ActionAuthorization
  execute?: (proposal: AIActionProposal) => Promise<{ reference?: string; recovery?: string }>
  audit?: (entry: ActionAuditEntry) => Promise<void>
  now?: () => Date
  createId?: () => string
}

export type ActionResult =
  | { status: "confirmation-required" }
  | { status: "blocked"; reason: "authorization-unverified" | "access-denied" | "service-unavailable" }
  | { status: "failed"; message: string; auditRecorded: boolean }
  | { status: "completed"; receipt: ActionReceipt; auditRecorded: boolean }

/** Executes only after confirmation, authoritative authorization, and service wiring. */
export async function executeAIAction(
  proposal: AIActionProposal,
  confirmed: boolean,
  services: ActionServices,
): Promise<ActionResult> {
  if (!confirmed) return { status: "confirmation-required" }
  if (!services.authorization || services.authorization.authority !== "authoritative") {
    return { status: "blocked", reason: "authorization-unverified" }
  }
  if (!services.execute || !services.audit) return { status: "blocked", reason: "service-unavailable" }

  let authorization: "authorized" | "denied" | "unavailable"
  try {
    authorization = await services.authorization.verify(proposal)
  } catch {
    authorization = "unavailable"
  }
  if (authorization === "denied") return { status: "blocked", reason: "access-denied" }
  if (authorization !== "authorized") return { status: "blocked", reason: "authorization-unverified" }

  const id = services.createId?.() ?? `ai-action-${Date.now()}`
  const now = services.now?.() ?? new Date()
  try {
    const result = await services.execute(proposal)
    const receipt: ActionReceipt = {
      id,
      action: proposal.type,
      target: proposal.target.label,
      completedAt: now.toISOString(),
      context: proposal.sourceContext,
      reference: result.reference,
      recovery: result.recovery,
    }
    await services.audit({
      id,
      actor: "user",
      assistant: "pwani-ai",
      action: proposal.type,
      target: proposal.target.label,
      time: receipt.completedAt,
      context: proposal.sourceContext,
      confirmed: true,
      result: "completed",
      reference: result.reference,
    })
    return { status: "completed", receipt, auditRecorded: true }
  } catch {
    let auditRecorded = false
    try {
      await services.audit({
        id,
        actor: "user",
        assistant: "pwani-ai",
        action: proposal.type,
        target: proposal.target.label,
        time: now.toISOString(),
        context: proposal.sourceContext,
        confirmed: true,
        result: "failed",
      })
      auditRecorded = true
    } catch {
      auditRecorded = false
    }
    return {
      status: "failed",
      message: "The action did not complete. No success receipt was created. Check the originating module before retrying.",
      auditRecorded,
    }
  }
}
