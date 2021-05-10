export function getSuppliers(state) {
  return state.suppliers;
}

export function getCategories(state) {
  return state.categories;
}

export function getInvoices(state) {
  return state.invoices;
}

export function getPayments(state) {
  const payments = [];
  state.invoices.forEach(invoice => {
    invoice.payments.forEach(payment => {
      payments.push({ ...payment, invoice });
    });
  });
  return payments;
}

export function getFilter(state) {
  return state.filter;
}
export function getUsers(state) {
  return state.users;
}
