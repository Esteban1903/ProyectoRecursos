const btnGenerar = document.getElementById('btnGenerar');
const formDatos = document.getElementById('formDatos');
const tareasContainer = document.getElementById('tareasContainer');
const recursosContainer = document.getElementById('recursosContainer');
const matrizContainer = document.getElementById('matrizContainer');
const actividadContainer = document.getElementById('actividadContainer');
const resultado = document.getElementById('resultado');

btnGenerar.addEventListener('click', () => {
  const numTareas = parseInt(document.getElementById('numTareas').value);
  const numRecursos = parseInt(document.getElementById('numRecursos').value);

  if (isNaN(numTareas) || numTareas < 1 || isNaN(numRecursos) || numRecursos < 1) {
    alert('Por favor ingresa números válidos para tareas y recursos.');
    return;
  }

  formDatos.classList.remove('hidden');
  resultado.innerHTML = '';

  let htmlTareas = '<h4>Tareas</h4>';
  for(let i=0; i<numTareas; i++) {
    htmlTareas += `
      <label>Tarea ${i+1}:</label>
      <input type="text" id="tarea${i}" value="Tarea ${i+1}" required />
      <br/>
    `;
  }
  tareasContainer.innerHTML = htmlTareas;

  let htmlRecursos = '<h4>Recursos</h4>';
  for(let j=0; j<numRecursos; j++) {
    htmlRecursos += `
      <label>Recurso ${j+1}:</label>
      <input type="text" id="recurso${j}" value="Recurso ${j+1}" required />
      <label>Disponibilidad:</label>
      <input type="number" id="disp${j}" min="0" value="100" required />
      <br/>
    `;
  }
  recursosContainer.innerHTML = htmlRecursos;

  let htmlMatriz = '<table><thead><tr><th>Tarea \\ Recurso</th>';
  for(let j=0; j<numRecursos; j++) {
    htmlMatriz += `<th><input type="text" id="recName${j}" value="Recurso ${j+1}" style="width:90px;"></th>`;
  }
  htmlMatriz += '</tr></thead><tbody>';

  for(let i=0; i<numTareas; i++) {
    htmlMatriz += `<tr><td><input type="text" id="tareaName${i}" value="Tarea ${i+1}" style="width:120px;"></td>`;
    for(let j=0; j<numRecursos; j++) {
      htmlMatriz += `<td><input type="number" id="req${i}${j}" min="0" value="0" style="width:60px;"></td>`;
    }
    htmlMatriz += '</tr>';
  }
  htmlMatriz += '</tbody></table>';
  matrizContainer.innerHTML = htmlMatriz;

  let htmlActividad = '<table><thead><tr><th>Tarea</th><th>Cantidad</th></tr></thead><tbody>';
  for(let i=0; i<numTareas; i++) {
    htmlActividad += `<tr><td><input type="text" id="actName${i}" value="Tarea ${i+1}" style="width:120px;"></td><td><input type="number" id="act${i}" min="0" value="1" style="width:60px;"></td></tr>`;
  }
  htmlActividad += '</tbody></table>';
  actividadContainer.innerHTML = htmlActividad;

  for(let j=0; j<numRecursos; j++) {
    document.getElementById(`recurso${j}`).addEventListener('input', e => {
      document.getElementById(`recName${j}`).value = e.target.value;
    });
    document.getElementById(`recName${j}`).addEventListener('input', e => {
      document.getElementById(`recurso${j}`).value = e.target.value;
    });
  }
  for(let i=0; i<numTareas; i++) {
    document.getElementById(`tarea${i}`).addEventListener('input', e => {
      const val = e.target.value;
      document.getElementById(`tareaName${i}`).value = val;
      document.getElementById(`actName${i}`).value = val;
    });
    document.getElementById(`tareaName${i}`).addEventListener('input', e => {
      const val = e.target.value;
      document.getElementById(`tarea${i}`).value = val;
      document.getElementById(`actName${i}`).value = val;
    });
    document.getElementById(`actName${i}`).addEventListener('input', e => {
      const val = e.target.value;
      document.getElementById(`tarea${i}`).value = val;
      document.getElementById(`tareaName${i}`).value = val;
    });
  }
});

document.getElementById('btnCalcular').addEventListener('click', () => {
  const numTareas = parseInt(document.getElementById('numTareas').value);
  const numRecursos = parseInt(document.getElementById('numRecursos').value);

  let x = [];
  for(let i=0; i<numTareas; i++) {
    x[i] = Number(document.getElementById(`act${i}`).value);
  }

  let d = [];
  for(let j=0; j<numRecursos; j++) {
    d[j] = Number(document.getElementById(`disp${j}`).value);
  }

  let R = [];
  for(let i=0; i<numTareas; i++) {
    R[i] = [];
    for(let j=0; j<numRecursos; j++) {
      R[i][j] = Number(document.getElementById(`req${i}${j}`).value);
    }
  }

  let r = [];
  for(let j=0; j<numRecursos; j++) {
    let suma = 0;
    for(let i=0; i<numTareas; i++) {
      suma += R[i][j] * x[i];
    }
    r[j] = suma;
  }

  let resultadoTexto = "";
  let factible = true;

  resultadoTexto += "<h3>Recursos requeridos vs disponibles</h3><ul>";
  for(let j=0; j<numRecursos; j++) {
    resultadoTexto += `<li>${document.getElementById('recurso'+j).value}: Requeridos = ${r[j]}, Disponibles = ${d[j]}</li>`;
    if (r[j] > d[j]) factible = false;
  }
  resultadoTexto += "</ul>";

  if(factible) {
    resultadoTexto += "<p style='color:green; font-weight:bold;'>✅ El proyecto ES factible con los recursos disponibles.</p>";
  } else {
    resultadoTexto += "<p style='color:red; font-weight:bold;'>❌ El proyecto NO es factible con los recursos disponibles.</p>";
    resultadoTexto += "<p>Recursos excedidos:</p><ul>";
    for(let j=0; j<numRecursos; j++) {
      if (r[j] > d[j]) {
        resultadoTexto += `<li>${document.getElementById('recurso'+j).value}: hace falta ${r[j] - d[j]} unidades</li>`;
      }
    }
    resultadoTexto += "</ul>";
  }

  resultado.innerHTML = resultadoTexto;
});
