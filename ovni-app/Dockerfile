FROM nginx:latest

# Copiar la build de React al directorio que NGINX sirve
COPY ./build /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar NGINX
CMD ["nginx", "-g", "daemon off;"]

