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
//Elemento para buscador de nota
const busquedaInput = document.getElementById("busqueda");

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
  <tr>
    <td class="border-0 py-0">
      <div class="nota">
        <div class="card-body py-2">
          <a href="" onclick="verNota('${nota.id}')" class="text-decoration-none text-white"
            data-bs-toggle="modal" data-bs-target="#modalVerNotas">
            <blockquote class="blockquote mb-0">
              <p><b>${nota.titulo}</b></p>
              <footer class="fecha-tipo">
                ${fecha.toDateString()} - ${nota.tipo}
              </footer>
              <footer class="fecha-tipo">
                
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
  <div class="modal-content">
  <div class="modal-header">
  <div class="d-flex flex-column justify-content-around"> 
      <h4 class="modal-title" id="exampleModalLabel">${
        notaSeleccionada.titulo
      }</h4>
      <p>
       ${fecha.toDateString()}-${notaSeleccionada.tipo}
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
   }')" data-bs-toggle="modal" data-bs-target="#modalEditarNotas" class="btn btn-secondary">Editar</button>
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

function buscarNotas() {
  const filter = busquedaInput.value.toUpperCase();
  const tbody = document.getElementById("listadoNotas");
  const tr = tbody.getElementsByTagName("tr");
  for (let i = 0; i < tr.length; i++) {
    const nota = tr[i].getElementsByTagName("td")[0];
    if (nota.innerHTML.toUpperCase().indexOf(filter) > -1) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
}
//ANULAR ENTER EN FORMULARIO
function anular(e) {
  tecla = document.all ? e.keyCode : e.which;
  return tecla != 13;
}

function agregarTipo(){
  const newType = document.getElementById("nuevoTipo")
  let x = document.getElementById("tipo");
  let option = document.createElement("option");
  option.text = newType.value;
  x.add(option,x[4]);
}

function agregarTipoEditado() {
  const newType = document.getElementById("nuevoTipoEditado")
  let x = document.getElementById("tipoEditado");
  let option = document.createElement("option");
  option.text = newType.value;
  x.add(option,x[4]);
}

//adjuntar imagen en nota
// function adjuntarImagen() {
//   var archivo = document.getElementById("file").files[0];
//   var reader = new FileReader();
//   if (file) {
//     reader.readAsDataURL(archivo);
//     reader.onloadend = function () {
//       document.getElementById("img").src = reader.result;
//     };
//   }
// }

//ACORDION PARA SELECCIONAR CLASE
// var acc = document.getElementsByClassName("accordion");
// var i;

// for (i = 0; i < acc.length; i++) {
//     acc[i].addEventListener("click", function() {
//         /* Toggle between adding and removing the "active" class,
//         to highlight the button that controls the panel */
//         this.classList.toggle("active");

//         /* Toggle between hiding and showing the active panel */
//         var panel = this.nextElementSibling;
//         if (panel.style.display === "block") {
//             panel.style.display = "none";
//         } else {
//             panel.style.display = "block";
//         }
//     });
// }

// var options = document.getElementsByClassName("option");

// for(var o = 0; o < options.length; o++) {
//   options[o].addEventListener('click', function(e) {
//   	this.parentElement.previousElementSibling.innerHTML = this.dataset.value;

//     /* alert(e.target.dataset.value);  */
//   })
// } 
//agregarTIPO

mostrarNotas();
