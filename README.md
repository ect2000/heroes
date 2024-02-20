# DOCKER
En el contenedor de docker no funciona el filtro por nombre ni la validación de ids repetidos. Probar la app en local para ver todo el funcionamiento.


## Para probar la app con el mock server (he usado json-server@0.17.4 ya que las versiones más recientes no permitían hacer búsquedas '_like'):
 - Ejecutar en una terminal dentro de la carpeta heroes-app 'json-server --watch db.json' (por defecto servidor levantado en http://localhost:3000)
 - Ejecutar la app con 'ng serve'

