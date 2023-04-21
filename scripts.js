/* 
  ----------------------------------------
  Se sua máquina não estiver rodando a API na porta 5050, atualize aqui:
  ----------------------------------------
*/

const baseUrl = "http://localhost:5050";

/* 
  ----------------------------------------
  Função para adicionar a câmera à lista e chamar a função postCamera.
  ----------------------------------------
*/

const addCamera = async () => {
  // Transforma em JSON o valor da option de categoria
  const category = JSON.parse(document.getElementById("category").value);

  // Cria objeto pra nova câmera
  const camera = {
    name: document.getElementById("name").value,
    brand: document.getElementById("brand").value,
    category_id: category.id,
    category_name: category.name,
    category_icon: category.icon,
    description: document.getElementById("description").value,
    value: document.getElementById("value").value,
  };

  // Cria caixa para câmera recém criada
  const { id } = await postCamera(camera);
  createCameraBox(camera, id);

  // Zera formulário
  document.getElementById("name").value = "";
  document.getElementById("brand").value = "";
  document.getElementById("category").value = "";
  document.getElementById("description").value = "";
  document.getElementById("value").value = "";
};

const createAndAppendElement = (kind, inner, target) => {
  const element = document.createElement(kind);
  element.innerHTML = inner;
  target.appendChild(element);
};

/* 
  ----------------------------------------
  Função para colocar as categorias no select de opções.
  ----------------------------------------
*/

const categoryDropDown = document.getElementById("category");

const createCategoryOption = (category) => {
  const option = document.createElement("option");
  option.text = "[" + category.name + "]";
  option.value = `{ "id": ${category.id}, "name": "${category.name}", "icon": "${category.icon}" }`;
  categoryDropDown.appendChild(option);
};

/* 
  ----------------------------------------
  Função para criar a caixa da lista de câmeras.
  ----------------------------------------
*/

const camerasList = document.getElementById("cameras--list");

const createCameraBox = (camera, id) => {
  // Cria caixa
  const cameraBox = document.createElement("div");
  cameraBox.classList = "camera__box";
  cameraBox.id = id;

  // Cria imagem
  const cameraIcon = document.createElement("img");
  cameraIcon.src = "images/" + camera.category_icon;
  cameraBox.appendChild(cameraIcon);

  // Cria título
  createAndAppendElement("h3", camera.name + " / " + camera.brand, cameraBox);
  // Cria categoria
  createAndAppendElement("span", "[" + camera.category_name + "]", cameraBox);
  // Cria valor
  createAndAppendElement("span", "R$ " + camera.value, cameraBox);

  // Cria Botão
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "deletar";
  deleteButton.setAttribute("onClick", "deleteButton(" + id + ")");
  cameraBox.appendChild(deleteButton);

  camerasList.prepend(cameraBox);
};

/* 
  ----------------------------------------
  Função para obter câmeras da API e criar caixas para cada uma.
  ----------------------------------------
*/

const camerasFromAPI = async () => {
  let url = baseUrl + "/cameras";
  fetch(url, { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
      data.cameras.forEach((camera) => createCameraBox(camera, camera.id));
    })
    .catch((error) => console.log(error));
};

camerasFromAPI();

/* 
  ----------------------------------------
  Função para obter categorias da API e criar opções no select para cada uma.
  ----------------------------------------
*/

const categoriesFromAPI = async () => {
  let url = baseUrl + "/categories";
  fetch(url, { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
      data.categories.forEach((category) => createCategoryOption(category));
    });
};

categoriesFromAPI();

/* 
  ----------------------------------------
  Função para adicionar câmera à base de dados
  ----------------------------------------
*/

const postCamera = async (camera) => {
  const formData = new FormData();
  formData.append("name", camera.name);
  formData.append("brand", camera.brand);
  formData.append("category_id", camera.category_id);
  formData.append("description", camera.description);
  formData.append("value", camera.value);

  let url = baseUrl + "/camera";
  try {
    const response = await fetch(url, { method: "POST", body: formData });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const deleteButton = (id) => {
  let url = baseUrl + "/camera?id=" + id;
  fetch(url, {
    method: "delete",
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });

  const div = document.getElementById(id);
  div.remove();
};
