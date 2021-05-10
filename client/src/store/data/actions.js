import Axios from "axios";

export async function setFilter({ commit }, filter) {
  commit("SET_FILTER", filter);
}

// export async function loadNotes({ commit }) {
//   const response = await Axios.get("/api/notes");

//   commit("SET_NOTES", response.data);
// }

export async function loadSuppliers({ commit }) {
  const response = await Axios.get("/api/suppliers/");

  commit("SET_SUPPLIERS", response.data);
}

export async function loadCategories({ commit }) {
  const response = await Axios.get("/api/suppliers/categories/");

  commit("SET_CATEGORIES", response.data);
}
export async function loadUsers({ commit }) {
  const response = await Axios.get("/api/invoices/all/");

  commit("SET_USERS", response.data);
}

export async function loadInvoices({ commit }) {
  const response = await Axios.get("/api/invoices/");

  commit(
    "SET_INVOICES",
    response.data.sort(
      (a, b) => b.sold - a.sold || new Date(a.dueDate) - new Date(b.dueDate)
    )
  );
}

// export async function enableIsNew({ commit }) {
//   commit("ENABLE_IS_NEW");
// }

// export async function disableIsNew({ commit }) {
//   commit("DISABLE_IS_NEW");
// }
