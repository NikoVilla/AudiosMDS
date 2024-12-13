# Getting Started with Create React App

Este proyecto fue creado utilizando **Create React App** y proporciona una plantilla básica para el desarrollo de aplicaciones React.

## Iniciar la aplicación en modo de desarrollo

### `npm start`

Este comando ejecuta la aplicación en modo de desarrollo.\
Abre [http://localhost:3000](http://localhost:3000) en tu navegador para visualizarla.

La página se recargará automáticamente cada vez que realices cambios.\
También se mostrarán errores de lint en la consola.

## Ejecutar pruebas

## Crear un build para producción

### `npm run build`

Este comando crea un build optimizado para producción en la carpeta `build`.\
React se empaquetará en modo de producción y se optimizará para obtener el mejor rendimiento posible.

El build estará minificado y los nombres de los archivos incluirán los hashes.\
La aplicación estará lista para ser desplegada.

## Instrucciones adicionales

### Iniciar el servidor backend

Dentro de la carpeta `app`, puedes iniciar el servidor backend utilizando uno de los siguientes comandos:

Node.js: Ejecuta node server.js para iniciar el servidor.
PM2: Ejecuta pm2 start server.js para iniciar el servidor con PM2. 

### Iniciar el servidor frontend
En la carpeta `build` creada anteriormente, puedes iniciar el servidor forntend utilizando el siguientes comandos:
serve -s . -l 3000.

