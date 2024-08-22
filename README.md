### Basic nginx web with react backend

1.1 Crear la Aplicación React

En tu entorno de desarrollo local:

`npx create-react-app ovni-app`

cd ovni-app

1.2 Personalizar la Aplicación React
Vamos a modificar el archivo src/App.js para darle una apariencia de temática ovni:

```
import React from 'react';
import './App.css';
import ufoImage from './ufo.png'; // Puedes agregar una imagen de OVNI a la carpeta src

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={ufoImage} className="App-logo" alt="ufo" />
        <h1>Welcome to the UFO Experience</h1>
        <p>
          Explore the mysteries of the universe with our amazing app!
        </p>
      </header>
    </div>
  );
}

export default App;
```

También, agrega un estilo básico en src/App.css:

```
.App {
  text-align: center;
  background-color: #000; /* Fondo negro */
  color: #0f0; /* Texto verde, estilo alienígena */
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.App-logo {
  height: 40vmin;
  pointer-events: none;
}

.App-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: calc(10px + 2vmin);
  background-color: #222;
  padding: 20px;
  border-radius: 10px;
}
```

1.3 Construir la Aplicación
Construye la aplicación para que esté lista para producción:

`npm run build`
Esto generará una carpeta build que contiene la aplicación lista para ser servida.

2. Integrar la Aplicación React en NGINX
   Para servir la aplicación React con NGINX, necesitamos empaquetarla en una imagen de Docker.

2.1 Crear un Dockerfile
En el directorio de tu proyecto, crea un archivo Dockerfile:

Dockerfile

```
# Establece la imagen base de NGINX
FROM nginx:latest

# Copia los archivos de la build de React al directorio que NGINX sirve
COPY ./build /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Inicia NGINX
CMD ["nginx", "-g", "daemon off;"]
```

2.2 Construir y Publicar la Imagen Docker

Ahora, construye la imagen Docker:

docker build -t ovni-app .
Si tienes un registro de contenedores (Docker Hub, AWS ECR, etc.), puedes publicar la imagen allí. Por ejemplo:

bash
Copiar código
docker tag ovni-app <your-dockerhub-username>/ovni-app
docker push <your-dockerhub-username>/ovni-app 3. Desplegar en Kubernetes
3.1 Crear un Deployment y Servicio en Kubernetes
Ahora que tienes la imagen Docker publicada, vamos a desplegarla en tu clúster de Kubernetes.

`ovni-deployment.yaml`

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ovni-deployment
  labels:
    app: ovni
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ovni
  template:
    metadata:
      labels:
        app: ovni
    spec:
      containers:
      - name: ovni-app
        image: <your-dockerhub-username>/ovni-app:latest
        ports:
        - containerPort: 80
```

`ovni-service.yaml`:

```
apiVersion: v1
kind: Service
metadata:
  name: ovni-service
spec:
  selector:
    app: ovni
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
    nodePort: 30007
  type: NodePort
3.2 Aplicar los Manifiestos en Kubernetes
Aplica los manifiestos a tu clúster de Kubernetes:

bash
Copiar código
kubectl apply -f ovni-deployment.yaml
kubectl apply -f ovni-service.yaml
3.3 Acceder a la Aplicación
Ahora, puedes acceder a tu aplicación OVNI desde cualquier navegador utilizando la IP de uno de tus nodos y el puerto 30007:

arduino
Copiar código
http://<node-ip>:30007
Esto debería mostrar la aplicación React con la temática de OVNI.
```
