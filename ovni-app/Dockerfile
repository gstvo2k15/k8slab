# Establece la imagen base de NGINX
FROM nginx:latest

# Copia los archivos de la build de React al directorio que NGINX sirve
COPY ./build /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Inicia NGINX
CMD ["nginx", "-g", "daemon off;"]

