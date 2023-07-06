const fs = require('fs');
const path = require('path');

function listarArchivos(dirPath, archivos = []) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      listarArchivos(filePath, archivos);
    } else if (file.endsWith('.jsx') || file.endsWith('.css')) {
      archivos.push(filePath);
    }
  }

  return archivos;
}

function leerCodigoArchivo(archivo) {
  return fs.readFileSync(archivo, 'utf8');
}

function crearArchivoTexto(archivos, nombreArchivoSalida) {
  let contenido = '';

  for (const archivo of archivos) {
    const codigo = leerCodigoArchivo(archivo);
    contenido += `Archivo: ${archivo}\n\n${codigo}\n\n`;
  }

  fs.writeFileSync(nombreArchivoSalida, contenido);
}

// Ruta de la carpeta "src"
const carpetaSrc = 'G:/Mochila/DH CTD 1er año/Proyecto Integrador/equipo-9/cine-front/src';

// Obtener la lista de archivos .jsx y .css
const archivos = listarArchivos(carpetaSrc);

// Crear el archivo de texto
crearArchivoTexto(archivos, 'codigo_src.txt');
