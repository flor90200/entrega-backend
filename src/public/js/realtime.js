const socket = io();

const table = document.getElementById("tablareal");

document.getElementById("boton-create").addEventListener("click", () => {
  const body = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
  };
  fetch("/api/products", {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      "Content-type": "application/json"
    },
    
  })
    .then((result) => result.json())
    .then((result) => {
      if (result.status === "error") throw new Error(result.error);
    })
    .then(() => fetch("/api/products"))
    .then((result) => result.json())
    .then((result) => {
     
      if (result.status === "error") throw new Error(result.error);
      socket.emit("productList", result.payload);
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
      document.getElementById("price").value = "";
      document.getElementById("code").value = "";
      document.getElementById("stock").value = "";
      document.getElementById("category").value = "";
    })
    .catch((err) => 
    alert(`Error:(/n${err})`));
    
});

socket.on("updatedProducts", data => {
  table.innerHTML = 
  `
    <tr>
            <td><strong></strong></td>
            <td><strong>producto</strong> </td>
            <td><strong>Descripcion</strong> </td>
            <td><strong> precio</strong></td>
            <td><strong> code</strong></td>
            <td><strong> stock</strong></td>
            <td><strong> categori</strong></td>
    </tr>
    `;

  for (product of data) {
    let tr = document.createElement('tr');
    tr.innerHTML =
    ` 
    <td><button class="deleteProduct" onclick="deleteProduct('${product._id}')">Eliminar</button></td>
        <td>${product.title}</td>
        <td>${product.description}</td>
        <td>${product.price}</td>
        <td>${product.code}</td>
        <td>${product.stock}</td>
        <td>${product.category}</td>
        `;
    table.getElementsByTagName("tbody")[0].appendChild(tr);
  }
});

 