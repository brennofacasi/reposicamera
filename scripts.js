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

const cameraForm = document.getElementById("camera-form");

const addCamera = async (event) => {
  // Previne envio padrão do form
  event.preventDefault();

  // Coloca dados no FormData
  const formData = new FormData(event.target);

  // Coloca dados no banco de dados
  postCamera(formData).then((cameraData) => {
    createCameraBox(cameraData, "all-cameras");
    cameraForm.reset();
  });
};

cameraForm.addEventListener("submit", addCamera);

/* 
  ----------------------------------------
  Função para colocar as categorias no select de opções.
  ----------------------------------------
*/

const categoryDropDown = document.getElementById("category_id");

const createCategoryOption = (category) => {
  const option = document.createElement("option");
  option.text = "[" + category.name + "]";
  option.value = category.id;
  categoryDropDown.appendChild(option);
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
      data.cameras.forEach((camera) => createCameraBox(camera, "all-cameras"));
    })
    .catch((error) => console.log(error));
};

camerasFromAPI();

/* 
  ----------------------------------------
  Função para obter categorias da API.
  ----------------------------------------
*/

const categoriesFromAPI = async () => {
  let url = baseUrl + "/categories";
  try {
    const response = await fetch(url, { method: "get" });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

categoriesFromAPI().then((data) => {
  data.categories.forEach((category) => {
    createCategoryOption(category);
  });
});

/* 
  ----------------------------------------
  Função para adicionar câmera à base de dados
  ----------------------------------------
*/

const postCamera = async (formData) => {
  try {
    let url = baseUrl + "/camera";
    const response = await fetch(url, { method: "POST", body: formData });
    const data = await response.json();

    if (response.ok) {
      alert("Câmera adicionada!");
      return data;
    }

    throw Error(data.message);
  } catch (error) {
    alert(error);
  }
};

/* 
  ----------------------------------------
  Função para deletar câmera da base de dados
  ----------------------------------------
*/

const deleteCamera = async (id) => {
  try {
    let url = baseUrl + "/camera?id=" + id;
    if (confirm("Você tem certeza que quer apagar a câmera?")) {
      const response = await fetch(url, { method: "DELETE" });
      await response.json();

      const div = document.getElementById(id);
      div.remove();
    }
  } catch (error) {
    console.log(error);
  }
};

/* 
  ----------------------------------------
  Função para buscar câmera na base de dados
  ----------------------------------------
*/

const getCamera = async (cameraName) => {
  try {
    let url = baseUrl + "/camera?name=" + cameraName;
    const response = await fetch(url, { method: "GET" });
    const data = await response.json();

    if (response.ok) {
      return data;
    }

    throw Error(data.message);
  } catch (error) {
    alert(error);
  }
};

/* 
  ----------------------------------------
  Função para criar a caixa da lista de câmeras.
  ----------------------------------------
*/

const createCameraBox = (camera, listId) => {
  const camerasList = document.getElementById(listId);
  // Cria caixa
  const cameraBox = document.createElement("div");
  cameraBox.classList = "camera__box";
  cameraBox.id = camera.id;

  // Cria título
  const title = document.createElement("h3");
  title.innerHTML = camera.brand + " / " + camera.name;

  // Cria valor
  const value = document.createElement("span");
  value.innerHTML = "R$ " + camera.value;

  // Cria Botão
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "deletar";
  deleteButton.setAttribute("onClick", "deleteCamera(" + camera.id + ")");

  // Cria imagem e categoria
  const cameraIcon = document.createElement("img");
  const categoryName = document.createElement("span");

  // Compara ID com lista de categoria e renderiza a imagem certa, e coloca os elementos HTML criados
  categoriesFromAPI().then((data) => {
    data.categories.forEach((category) => {
      if (category.id == camera.category_id) {
        categoryName.innerHTML = "[" + category.name + "]";
        cameraIcon.src = "images/" + category.icon;
        cameraIcon.alt = "Ícone da categoria " + category.name;

        cameraBox.append(cameraIcon, title, categoryName, value, deleteButton);
      }
    });
  });

  camerasList.prepend(cameraBox);
};

/* 
  ----------------------------------------
  Função para buscar câmera pelo nome
  ----------------------------------------
*/

const searchForm = document.getElementById("search-form");

const searchCamera = async (event) => {
  // Previne envio padrão do form
  event.preventDefault();

  const searchedCameras = document.getElementById("search-cameras");
  if (searchedCameras.hasChildNodes()) {
    searchedCameras.firstChild.remove();
  }

  // Coleta nome da câmera
  const cameraName = document.getElementById("search-name").value;

  // Busca câmera e coloca na lista
  getCamera(cameraName).then((cameraData) => {
    createCameraBox(cameraData, "search-cameras");
    searchForm.reset();
  });
};

searchForm.addEventListener("submit", searchCamera);
