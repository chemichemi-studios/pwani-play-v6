import type { AIContextProvider } from "../context"

/** Sample fixture adapter. It is deliberately rejected by buildContext. */
export const sampleContextProvider: AIContextProvider = {
  authority: "sample",
  async read(_userId, scope) {
    return {
      status: "sample",
      records: [{
        id: "sample-project-1",
        type: "project",
        title: "Sample project (not connected to a user account)",
        deepLink: "",
        retrievedAt: "",
        source: "SAMPLE DATA",
        scope,
        sample: true,
      }],
    }
  },
}
