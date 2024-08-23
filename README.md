# Basic nginx web with react backend

## 1.0 Crear servicio nginx en k8s

`kubectl create secret generic my-secret --from-literal=password=myP@ssw0rd` <br>
secret/my-secret created

[root@k8snode01 ~]#
`kubectl get secret my-secret`

```
NAME        TYPE     DATA   AGE
my-secret   Opaque   1      97s
```

## Obtener el valor decodificado del secreto:

`kubectl get secret my-secret -o jsonpath="{.data.password}" | base64 --decode`
myP@ssw0rd[

## Ejemplo de cómo usar el secreto en un pod:

```
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
  - name: my-container
    image: nginx
    env:
    - name: SECRET_PASSWORD
      valueFrom:
        secretKeyRef:
          name: my-secret
          key: password
```

```
cat <<EOF> nginx-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
    nodePort: 30007
  type: NodePort
EOF
```

`kubectl apply -f nginx-service.yaml`<br>
service/nginx-service created

`kubectl get svc nginx-service`

```
NAME            TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
nginx-service   NodePort   10.102.45.106   <none>        80:30007/TCP   34s
```

```
cat <<EOF> nginx-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
        env:
        - name: SECRET_PASSWORD
          valueFrom:
            secretKeyRef:
              name: my-secret
              key: password
EOF
```

`kubectl apply -f nginx-deployment.yaml`<br>
deployment.apps/nginx-deployment created

`kubectl get pods -l app=nginx`

```
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-66597ff946-g65zv   1/1     Running   0          78s
nginx-deployment-66597ff946-mff9v   1/1     Running   0          78s
nginx-deployment-66597ff946-q2hq4   1/1     Running   0          78s
```

`http://192.168.1.33:30007`

### 1.1 Crear la Aplicación React

En tu entorno de desarrollo local:

`npx create-react-app ovni-app`

cd ovni-app

### 1.2 Personalizar la Aplicación React

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

### 1.3 Construir la Aplicación

Construye la aplicación para que esté lista para producción:

`npm run build`
Esto generará una carpeta build que contiene la aplicación lista para ser servida.

## 2. Integrar la Aplicación React en NGINX

Para servir la aplicación React con NGINX, necesitamos empaquetarla en una imagen de Docker.

### 2.1 Crear un Dockerfile

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

### 2.2 Construir y Publicar la Imagen Docker

Ahora, construye la imagen Docker:

`docker build -t ovni-app .`

Si tienes un registro de contenedores (Docker Hub, AWS ECR, etc.), puedes publicar la imagen allí. Por ejemplo:

`docker tag ovni-app gstvo2k15/ovni-app`

`docker push gstvo2k15/ovni-app`

## 3. Desplegar en Kubernetes

### 3.1 Crear un Deployment y Servicio en Kubernetes

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
        image: gstvo2k15/ovni-app:latest
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
```

### 3.2 Aplicar los Manifiestos en Kubernetes

Aplica los manifiestos a tu clúster de Kubernetes:

```
kubectl apply -f ovni-deployment.yaml
kubectl apply -f ovni-service.yaml
```

### 3.3 Acceder a la Aplicación

Ahora, puedes acceder a tu aplicación OVNI desde cualquier navegador utilizando la IP de uno de tus nodos y el puerto 30007:

`http://<node-ip>:30007`

### 3.4 Actualizaciones

```
docker build -t gstvo2k15/ovni-app:websound .
docker push gstvo2k15/ovni-app:websound
kubectl set image deployment/ovni-deployment ovni-app=gstvo2k15/ovni-app:web3b
kubectl rollout status deployment/ovni-deployment
```
