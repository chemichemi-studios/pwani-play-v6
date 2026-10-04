import assert from "node:assert/strict"
import test from "node:test"
import { executeAIAction } from "../src/ai/actions.ts"
import { sampleContextProvider } from "../src/ai/adapters/sample-context.ts"
import { buildContext } from "../src/ai/context.ts"

const scope = { kind: "project", id: "project-a" }
const proposal = {
  id: "proposal-1",
  type: "create-draft",
  target: { id: "project-a", label: "Sample project" },
  changes: ["Add a draft checklist"],
  potentialEffects: ["Creates a draft in the project"],
  requiredPermissions: ["project.write"],
  sourceContext: "Project",
  aiReason: "The user requested a checklist",
  riskLevel: "low",
}

function makeServices(overrides = {}) {
  let executions = 0
  const audits = []
  return {
    get executions() { return executions },
    audits,
    authorization: {
      authority: "authoritative",
      async verify() { return "authorized" },
    },
    async execute() {
      executions += 1
      return { reference: "module-record-1", recovery: "Open the originating module" }
    },
    async audit(entry) { audits.push(entry) },
    createId: () => "receipt-1",
    now: () => new Date("2026-10-01T10:00:00.000Z"),
    ...overrides,
  }
}

test("context builder fails closed for sample, missing, denied, thrown, and mismatched sources", async () => {
  assert.deepEqual((await buildContext(sampleContextProvider, "user-1", scope)).records, [])
  assert.deepEqual((await buildContext(undefined, "user-1", scope)).records, [])
  assert.deepEqual((await buildContext({ authority: "authoritative", async read() { return { status: "denied", records: [] } } }, "user-1", scope)).records, [])
  assert.deepEqual((await buildContext({ authority: "authoritative", async read() { throw new Error("offline") } }, "user-1", scope)).records, [])
  assert.deepEqual((await buildContext({ authority: "authoritative", async read() { return { status: "authorized", records: [{ id: "b", type: "project", title: "B", deepLink: "/projects/b", retrievedAt: "2026-10-01", source: "test", scope: { kind: "project", id: "project-b" } }] } } }, "user-1", scope)).records, [])
  assert.equal((await buildContext({ authority: "authoritative", async read() { return { status: "authorized", records: [] } } }, undefined, scope)).status, "blocked")
})

test("unconfirmed actions do not authorize, mutate, or audit", async () => {
  const services = makeServices()
  const result = await executeAIAction(proposal, false, services)
  assert.equal(result.status, "confirmation-required")
  assert.equal(services.executions, 0)
  assert.equal(services.audits.length, 0)
})

test("sample or unavailable authorization never invokes a module service", async () => {
  const sampleServices = makeServices({ authorization: { authority: "sample", async verify() { return "authorized" } } })
  assert.equal((await executeAIAction(proposal, true, sampleServices)).status, "blocked")
  assert.equal(sampleServices.executions, 0)

  const deniedServices = makeServices({ authorization: { authority: "authoritative", async verify() { return "denied" } } })
  assert.equal((await executeAIAction(proposal, true, deniedServices)).status, "blocked")
  assert.equal(deniedServices.executions, 0)
})

test("confirmed actions execute through the injected module and record receipt plus audit", async () => {
  const services = makeServices()
  const result = await executeAIAction(proposal, true, services)
  assert.equal(result.status, "completed")
  assert.equal(result.receipt.reference, "module-record-1")
  assert.equal(result.auditRecorded, true)
  assert.equal(services.executions, 1)
  assert.equal(services.audits.length, 1)
  assert.equal(services.audits[0].confirmed, true)
})

test("failed module actions return a specific recovery message and never create a success receipt", async () => {
  const services = makeServices({ async execute() { throw new Error("module unavailable") } })
  const result = await executeAIAction(proposal, true, services)
  assert.equal(result.status, "failed")
  assert.match(result.message, /did not complete/)
  assert.equal(services.audits[0].result, "failed")
})
