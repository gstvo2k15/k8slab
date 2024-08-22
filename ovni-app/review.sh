#!/bin/bash

# Verificar si hay pods corriendo con la etiqueta app=ovni
pods=$(kubectl get pods -l app=ovni -o jsonpath="{.items[*].metadata.name}")

if [ -z "$pods" ]; then
  echo "No se encontraron pods con la etiqueta app=ovni"
  exit 1
fi

# Ver los logs y consumos de recursos para cada pod
for pod in $pods; do
  echo "Logs del pod: $pod"
  kubectl logs $pod --tail=25
  echo "Consumo de recursos del pod: $pod"
  kubectl top pod $pod || echo "Metrics API not available"
  echo "--------------------------------------------"
done

