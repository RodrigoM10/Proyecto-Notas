//Elementos para agregar una nota
const tituloNota = document.getElementById("titulo");
const textoNota = document.getElementById("texto");
const tipoNota = document.getElementById("tipo");

//Elemento del tbody de la tabla
const listadoNotas = document.getElementById("listadoNotas");
//Elemento del modal ver nota
const contenidoNota = document.getElementById("contenidoNota");
//Elemento del modal de edicion de nota
const tituloEditadoInput = document.getElementById("tituloEditado");
const textoEditadoInput = document.getElementById("textoEditado");
const tipoEditadoInput = document.getElementById("tipoEditado");

const notaJson = localStorage.getItem("notas");
let notas = JSON.parse(notaJson) || [];
console.log("🚀 ~ file: notas.js ~ line 10 ~ notas", notas);

function guardarNotas() {
  const notasJson = JSON.stringify(notas);
  localStorage.setItem("notas", notasJson);
}

function ID() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

function agregarNota(event) {
  event.preventDefault();
  const titulo = tituloNota.value;
  const texto = textoNota.value;
  const tipo = tipoNota.value;

  const nuevaNota = {
    titulo: titulo,
    texto: texto,
    tipo: tipo,
    registro: Date.now(),
    id: ID(),
  };

  notas.push(nuevaNota);
  guardarNotas();
  event.target.reset();
  mostrarNotas();
}

function mostrarNotas() {
  function armarFilasDeNotas(nota) {
    const fecha = new Date(nota.registro);
    const tr = `
     <td class="border-0 pb-3">
     <div class="nota">
       <div class="card-body">
       <a href="" onclick="verNota('${
         nota.id
       }')" class="text-decoration-none text-white" data-bs-toggle="modal" data-bs-target="#modalVerNotas">
       <blockquote class="blockquote mb-0">
             <p><b>${nota.titulo}</b></p>
             <footer class="blockquote-footer">${fecha.toLocaleString()}-${
      nota.tipo
    }
             </footer>
           </blockquote>
         </a>
       </div>
     </div>
   </td>
 </tr> 
         `;
    return tr;
  }
  const listado = notas.map(armarFilasDeNotas);
  listadoNotas.innerHTML = listado.join("");
}

function verNota(id) {
  const notaSeleccionada = notas.find(function (nota) {
    return nota.id === id;
  });
  const fecha = new Date(notaSeleccionada.registro);
  const contenido = `
  <div class="modal-content" >
  <div class="modal-header">
  <div class="d-flex flex-column justify-content-around"> 
      <h4 class="modal-title" id="exampleModalLabel">${
     notaSeleccionada.titulo
      }</h4>
      <p>
       ${fecha.toLocaleString()}-${notaSeleccionada.tipo}
      </p>
   </div>
   <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
 </div>
 <div class="modal-body">
   ${notaSeleccionada.texto}
 </div>
 <div class="modal-footer">
   <button data-bs-dismiss="modal" onclick="cargarModalEditar('${
     notaSeleccionada.id
   }')" data-bs-toggle="modal" data-bs-target="#modalEditarNotas" class="btn btn-primary">Editar</button>
   <button onclick="eliminarNota('${
     notaSeleccionada.id
   }')" data-bs-dismiss="modal"  class="btn btn-dark">Eliminar</button>
 </div>
</div>
  `;
  contenidoNota.innerHTML = contenido;
}

function eliminarNota(id) {
  function notasFilter(nota) {
    return nota.id !== id;
  }
  const notasFiltradas = notas.filter(notasFilter);
  notas = notasFiltradas;
  mostrarNotas();
  guardarNotas();
}

let notaEditadaId = "";
function cargarModalEditar(id) {
  const notaSeleccionada = notas.find(function (nota) {
    return nota.id === id;
  });
  tituloEditadoInput.value = notaSeleccionada.titulo;
  textoEditadoInput.value = notaSeleccionada.texto;
  tipoEditadoInput.value = notaSeleccionada.tipo;
  notaEditadaId = id;
}

function editarNota(event) {
  event.preventDefault();
  const notaEditada = {
    titulo: tituloEditado.value,
    texto: textoEditado.value,
    tipo: tipoEditado.value,
  };

  function notasActualizadasMap(nota) {
    if (nota.id === notaEditadaId) {
      //Actualizar la Nota
      return { ...nota, ...notaEditada };
    } else {
      return nota;
    }
  }
  const notasActualizadas = notas.map(notasActualizadasMap);
  notas = notasActualizadas;
  mostrarNotas();
  guardarNotas();
}

mostrarNotas();
