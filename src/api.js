export async function fetchShopping() {
  return fetch("/api/shopping").then((response) => {
    return response.json();
  });
}

export async function saveNewGroceryList(data) {
  return fetch("/api/shopping", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    return response.json();
  });
}

export async function editGroceryList(data) {
  return fetch(`/api/shopping/${data.id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    return response.json();
  });
}

export async function deleteGroceryList(id) {
  return fetch(`/api/shopping/${id}`, {
    method: "DELETE",
  });
}
