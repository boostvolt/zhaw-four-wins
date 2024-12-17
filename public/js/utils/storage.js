const storageOps = {
  local: {
    save: (state, stateSeq) =>
      localStorage.setItem("connect4game", JSON.stringify({ state, stateSeq })),
    load: () => JSON.parse(localStorage.getItem("connect4game") || "{}"),
  },
  server: {
    save: async (state, stateSeq) => {
      const response = await fetch("/api/data/game?api-key=c4game", {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ state, stateSeq }),
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error("Server save failed");
    },
    load: async () => {
      const response = await fetch("/api/data/game?api-key=c4game", {  //where is the api-key c4game defined?
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error("Server load failed");
      return response.json();
    },
  },
};

export const handleStorageOp = async (op, type, state, stateSeq) => {
  try {
    if (op === "save") {
      await storageOps[type][op](state, stateSeq);
      return null;
    } else {
      return await storageOps[type][op]();
    }
  } catch (e) {
    console.error(`Failed to ${op} game from ${type}:`, e);
    return null;
  }
};
