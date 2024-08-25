## Paso 1: Crear el Namespace (si no lo has hecho ya)

Primero, crea un namespace para los recursos de monitoreo. Esto es opcional, pero ayuda a organizar tus recursos.

`kubectl create namespace monitoring`

## Paso 2: Aplicar los ConfigMaps y Deployments

### 1. Aplicar la Configuración de Prometheus

Aplica el ConfigMap para Prometheus:<br>
`kubectl apply -f prometheus/dev/prometheus-config.yaml -n monitoring`

Aplica el Deployment para Prometheus:<br>
`kubectl apply -f prometheus/prometheus-deployment.yaml -n monitoring`

### 2. Aplicar la Configuración de Grafana

Aplica el ConfigMap para los Dashboards de Grafana:<br>
`kubectl apply -f grafana/dev/01-service.yaml -n monitoring`

Aplica el Deployment para Grafana:<br>
`kubectl apply -f grafana/grafana-deployment.yaml -n monitoring`

## Paso 3: Verificar el Despliegue

Después de aplicar los archivos, verifica que los pods estén corriendo correctamente y que los servicios estén expuestos.

Verificar los Pods:<br>
`kubectl get pods -n monitoring`

Deberías ver algo similar a esto si los pods están corriendo correctamente:

```
NAME READY STATUS RESTARTS AGE
prometheus-xxxxxxxxxx-xxxxx 1/1 Running 0 1m
grafana-xxxxxxxxxx-xxxxx 1/1 Running 0 1m
```

Verificar los Servicios:<br>
`kubectl get services -n monitoring`

Esto mostrará los servicios expuestos por Prometheus y Grafana:

```
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
prometheus   ClusterIP   10.96.231.129    <none>        9090/TCP   1m
grafana      ClusterIP   10.96.123.456    <none>        3000/TCP   1m
```

## Paso 4: Acceder a Prometheus y Grafana

Acceder a Prometheus:
Puedes acceder a la interfaz web de Prometheus. Si estás en un entorno local (como Minikube), puedes hacer un port-forward:

`kubectl port-forward -n monitoring svc/prometheus 9090:9090`

Luego, abre tu navegador web y ve a http://localhost:9090.

Acceder a Grafana:<br>
Similar a Prometheus, puedes acceder a Grafana usando port-forward:

`kubectl port-forward -n monitoring svc/grafana 3000:3000`

Luego, abre tu navegador web y ve a http://localhost:3000.

Nota: Las credenciales por defecto de Grafana son admin/admin. Se te pedirá que cambies la contraseña al primer inicio de sesión.

## Instalación de Ingress para cluster de k8s

```
kubectl get pods -n ingress-nginx
curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace
```

`kubectl get pods -n ingress-nginx`

```
NAME                                        READY   STATUS    RESTARTS   AGE
ingress-nginx-controller-74d59b4b45-788fk   1/1     Running   0          43s

```

## Instalación de Stern para revisar logs

```
wget https://github.com/stern/stern/releases/download/v1.30.0/stern_1.30.0_linux_amd64.tar.gz
tar -xzf stern_1.30.0_linux_amd64.tar.gz
mv stern /usr/bin/
stern --version
```

`kubectl get pods -o wide`

```
NAME                                  READY   STATUS             RESTARTS      AGE   IP               NODE        NOMINATED NODE   READINESS GATES
kubernetes-bootcamp-c8455c5bb-48b65   0/1     ImagePullBackOff   0             45m   172.16.32.161    k8snode02   <none>           <none>
kubernetes-bootcamp-c8455c5bb-cvqq7   0/1     ImagePullBackOff   0             45m   172.16.154.43    k8snode03   <none>           <none>
kubernetes-bootcamp-c8455c5bb-dl7km   0/1     ImagePullBackOff   0             45m   172.16.249.113   k8snode01   <none>           <none>
kubernetes-bootcamp-c8455c5bb-scg2s   0/1     ImagePullBackOff   0             45m   172.16.32.160    k8snode02   <none>           <none>
nginx-deployment-66597ff946-g65zv     1/1     Running            2 (61m ago)   45h   172.16.154.41    k8snode03   <none>           <none>
nginx-deployment-66597ff946-mff9v     1/1     Running            2 (61m ago)   45h   172.16.32.156    k8snode02   <none>           <none>
nginx-deployment-66597ff946-q2hq4     1/1     Running            2 (61m ago)   45h   172.16.249.109   k8snode01   <none>           <none>
ovni-deployment-6ff67dcff6-2kf26      1/1     Running            1 (61m ago)   21h   172.16.32.157    k8snode02   <none>           <none>
ovni-deployment-6ff67dcff6-cd6sr      1/1     Running            1 (61m ago)   21h   172.16.249.111   k8snode01   <none>           <none>
ovni-deployment-6ff67dcff6-tqd54      1/1     Running            1 (61m ago)   21h   172.16.154.38    k8snode03   <none>           <none>
```

`stern ovni`

```
ovni-deployment-6ff67dcff6-tqd54 ovni-app /docker-entrypoint.sh: Sourcing /docker-entrypoint.d/15-local-resolvers.envsh
ovni-deployment-6ff67dcff6-cd6sr ovni-app /docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
ovni-deployment-6ff67dcff6-2kf26 ovni-app /docker-entrypoint.sh: Launching /docker-entrypoint.d/30-tune-worker-processes.sh

```

## Instalación de Kustomize para generar manifiestos rápidamente

https://www.densify.com/kubernetes-tools/kustomize/

## Uso de kompose para convertir docker-compose.yml a despliegue de k8s

```
kompose convert --volumes emptyDir --file docker-compose.yml
cat <<EOF> nginx-service.yaml
apiVersion: v1
kind: Service
metadata:
  annotations:
    kompose.cmd: kompose convert --volumes emptyDir --file docker-compose.yml
    kompose.version: 1.34.0 (cbf2835db)
  labels:
    io.kompose.service: nginx
  name: nginx
spec:
  type: NodePort  # Cambiar a NodePort
  ports:
    - name: "80"
      port: 80
      targetPort: 80
      nodePort: 31080  # Puedes especificar un puerto o dejar que Kubernetes asigne uno
  selector:
    io.kompose.service: nginx
EOF
```

`kubectl apply -f nginx-service.yaml`

`k8s pods -o wide`

```
NAME                                  READY   STATUS             RESTARTS      AGE     IP               NODE        NOMINATED NODE   READINESS GATES
app1-56f88d677d-8lqdt                 0/1     ImagePullBackOff   0             6m44s   172.16.154.44    k8snode03   <none>           <none>
app2-7c4cbf996f-xf9h4                 0/1     ImagePullBackOff   0             6m43s   172.16.32.165    k8snode02   <none>           <none>
```

```
cd app/
docker build -t gstvo2k15/app1:latest .
docker build -t gstvo2k15/app2:latest .
docker push gstvo2k15/app1:latest
docker push gstvo2k15/app2:latest
```

```
vim app1-deployment.yaml
          image: gstvo2k15/app1:latest

vim app2-deployment.yaml
          image: gstvo2k15/app2:latest

kubectl apply -f app1-deployment.yaml
kubectl apply -f app2-deployment.yaml

kubectl scale deployment app1 --replicas=0
kubectl scale deployment app1 --replicas=2

kubectl scale deployment app2 --replicas=0
kubectl scale deployment app2 --replicas=2

```

`kubectl get pods -o wide`

```
NAME                                  READY   STATUS              RESTARTS        AGE   IP               NODE        NOMINATED NODE   READINESS GATES
app1-56f88d677d-8lqdt                 0/1     ImagePullBackOff    0               16m   172.16.154.44    k8snode03   <none>           <none>
app1-6c5fc79bbd-72vrl                 0/1     ContainerCreating   0               31s   <none>           k8snode02   <none>           <none>
app2-5fd445dd45-qwv62                 0/1     ContainerCreating   0               30s   <none>           k8snode03   <none>           <none>
app2-7c4cbf996f-xf9h4                 0/1     ImagePullBackOff    0               16m   172.16.32.165    k8snode02   <none>           <none>
```

```
cd testapp/nginx
vim nginx.conf
        server app1-service:5001;
        server app2-service:5002;

docker build -t gstvo2k15/nginx:latest .
docker push gstvo2k15/nginx:latest

vim ../nginx-deployment.yaml
kubectl apply -f nginx-deployment.yaml
kubectl scale deployment nginx --replicas=0
kubectl scale deployment nginx --replicas=2
```

`kubectl get pods -l app=nginx`

```
NAME                                READY   STATUS    RESTARTS       AGE
nginx-deployment-66597ff946-g65zv   1/1     Running   2 (103m ago)   46h
nginx-deployment-66597ff946-mff9v   1/1     Running   2 (104m ago)   46h
nginx-deployment-66597ff946-q2hq4   1/1     Running   2 (104m ago)   46h
```
