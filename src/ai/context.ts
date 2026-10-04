export type AIContextKind =
  | "conversation"
  | "project"
  | "organization"
  | "production"
  | "workspace"
  | "selected-files"
  | "authorized-workspace"

export type AIContextScope = {
  kind: AIContextKind
  id?: string
}

export type AIContextRecord = {
  id: string
  type: string
  title: string
  deepLink: string
  retrievedAt: string
  source: string
  scope: AIContextScope
  sample?: true
}

export type ContextAuthority = "authoritative" | "sample"
export type ContextProviderResult =
  | { status: "authorized"; records: AIContextRecord[] }
  | { status: "denied" | "unavailable" | "sample"; records: AIContextRecord[] }

export interface AIContextProvider {
  readonly authority: ContextAuthority
  read(userId: string, scope: AIContextScope): Promise<ContextProviderResult>
}

export type BuiltContext =
  | { status: "ready"; scope: AIContextScope; records: AIContextRecord[] }
  | {
      status: "blocked"
      scope: AIContextScope
      reason: "identity-unavailable" | "authorization-unverified" | "access-denied" | "scope-mismatch" | "source-unavailable"
      records: []
    }

const empty = (scope: AIContextScope, reason: Extract<BuiltContext, { status: "blocked" }>['reason']): BuiltContext => ({
  status: "blocked",
  scope,
  reason,
  records: [],
})

/** The only supported boundary for retrieving ecosystem records for Pwani AI. */
export async function buildContext(
  provider: AIContextProvider | undefined,
  userId: string | undefined,
  scope: AIContextScope,
): Promise<BuiltContext> {
  if (!userId) return empty(scope, "identity-unavailable")
  if (!provider || provider.authority !== "authoritative") return empty(scope, "authorization-unverified")

  let result: ContextProviderResult
  try {
    result = await provider.read(userId, scope)
  } catch {
    return empty(scope, "source-unavailable")
  }

  if (result.status === "denied") return empty(scope, "access-denied")
  if (result.status !== "authorized") return empty(scope, "authorization-unverified")
  if (result.records.some(record => record.scope.kind !== scope.kind || record.scope.id !== scope.id)) {
    return empty(scope, "scope-mismatch")
  }

  return { status: "ready", scope, records: result.records }
}
