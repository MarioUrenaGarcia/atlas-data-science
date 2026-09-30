---
id: proceso-de-gram-schmidt
titulo: Proceso de Gram-Schmidt
titulo_en: Gram-Schmidt process
alias:
  - ortogonalización de Gram-Schmidt
  - ortonormalización
modulo: 0
submodulo: '0.3'
orden: 25
nivel: basico
prerrequisitos:
  - proyeccion-ortogonal
etiquetas:
  - ortonormalización
  - proyección
  - base ortonormal
  - algoritmo
resumen: >
  El proceso de Gram-Schmidt convierte vectores independientes en una base ortonormal del mismo espacio:
  a cada vector le quita sus proyecciones sobre los anteriores y normaliza lo que queda.
formula: '\mathbf{w}_k = \mathbf{v}_k - \sum_{i<k} (\mathbf{v}_k \cdot \mathbf{q}_i)\,\mathbf{q}_i, \qquad \mathbf{q}_k = \frac{\mathbf{w}_k}{\lVert \mathbf{w}_k \rVert}'
visualizacion:
  componente: VectorPlane
  parametros:
    modo: gram-schmidt
    v1: [2, 1]
    v2: [1, 3]
referencias:
  - clave: strang
publicado: true
---

## Intuición

Dos varas clavadas en el piso, inclinadas una hacia la otra, definen un plano, pero no sirven como ejes cómodos porque no forman ángulo recto. Para enderezarlas se deja la primera como está y a la segunda se le quita la parte que apunta en la dirección de la primera: lo que sobra es perpendicular. Si además se ajustan ambas a longitud 1, se obtienen dos ejes ortonormales que describen el mismo plano.

El proceso de Gram-Schmidt repite esa idea vector por vector. El primero solo se normaliza. Al segundo se le resta su sombra sobre el primero y se normaliza. Al tercero se le restan sus sombras sobre los dos anteriores, y así sucesivamente. En cada paso el espacio generado no cambia: solo se reemplazan los vectores por otros más fáciles de usar, perpendiculares entre sí y de longitud 1.

## Definición

:::definicion[Proceso de Gram-Schmidt]
Dados vectores linealmente independientes $\mathbf{v}_1, \dots, \mathbf{v}_k$, se definen para $j = 1, \dots, k$
$$
\mathbf{w}_j = \mathbf{v}_j - \sum_{i=1}^{j-1} (\mathbf{v}_j \cdot \mathbf{q}_i)\,\mathbf{q}_i, \qquad \mathbf{q}_j = \frac{\mathbf{w}_j}{\lVert \mathbf{w}_j \rVert}.
$$
Entonces $\{\mathbf{q}_1, \dots, \mathbf{q}_k\}$ es ortonormal y $\operatorname{gen}\{\mathbf{q}_1, \dots, \mathbf{q}_j\} = \operatorname{gen}\{\mathbf{v}_1, \dots, \mathbf{v}_j\}$ para cada $j$.
:::

Si los vectores fueran dependientes, algún $\mathbf{w}_j$ saldría cero y no podría normalizarse; el proceso detecta así la dependencia.

:::nota[Qué significa cada símbolo]
- $\mathbf{v}_j$: vectores originales, independientes.
- $\mathbf{w}_j$: lo que queda de $\mathbf{v}_j$ después de quitarle sus proyecciones sobre los anteriores.
- $\mathbf{q}_j$: vector ortonormal número $j$.
- $\mathbf{v}_j \cdot \mathbf{q}_i$: componente de $\mathbf{v}_j$ en la dirección $\mathbf{q}_i$.
- $\lVert \mathbf{w}_j \rVert$: longitud de $\mathbf{w}_j$.
- $k$: número de vectores.
:::

## Cómo usar la visualización

Las puntas de $\mathbf{v}_1$ y $\mathbf{v}_2$ se arrastran. La reproducción avanza por los pasos: normalizar $\mathbf{v}_1$ para obtener $\mathbf{q}_1$, calcular la sombra de $\mathbf{v}_2$ sobre $\mathbf{q}_1$, restarla para obtener $\mathbf{w}_2$ y normalizar $\mathbf{w}_2$ para obtener $\mathbf{q}_2$. El panel muestra cada vector y comprueba que $\mathbf{q}_1 \cdot \mathbf{q}_2 = 0$.

Con $\mathbf{v}_2$ casi paralelo a $\mathbf{v}_1$, el vector $\mathbf{w}_2$ queda muy corto: el paso de normalización amplifica mucho cualquier error. Con $\mathbf{v}_2$ ya perpendicular a $\mathbf{v}_1$, la sombra es nula y $\mathbf{w}_2 = \mathbf{v}_2$.

## Ejemplo

Dos sensores de un robot miden direcciones $\mathbf{v}_1 = (3, 4)$ y $\mathbf{v}_2 = (1, 2)$. Se busca una base ortonormal del plano que empiece en la dirección del primer sensor.

1. $\lVert \mathbf{v}_1 \rVert = 5$, así que $\mathbf{q}_1 = (0.6, 0.8)$.
2. Sombra de $\mathbf{v}_2$ sobre $\mathbf{q}_1$: $\mathbf{v}_2 \cdot \mathbf{q}_1 = 0.6 + 1.6 = 2.2$.
3. $\mathbf{w}_2 = (1, 2) - 2.2(0.6, 0.8) = (1 - 1.32, 2 - 1.76) = (-0.32, 0.24)$.
4. $\lVert \mathbf{w}_2 \rVert = \sqrt{0.1024 + 0.0576} = 0.4$, así que $\mathbf{q}_2 = (-0.8, 0.6)$.
5. Comprobación: $\mathbf{q}_1 \cdot \mathbf{q}_2 = -0.48 + 0.48 = 0$ y ambos tienen longitud 1.

:::figura[Las direcciones de los sensores del ejemplo. Al quitar a (1, 2) su sombra sobre (0.6, 0.8) queda (-0.32, 0.24), que normalizado es (-0.8, 0.6).]{componente="VectorPlane"}
```yaml
modo: gram-schmidt
v1: [3, 4]
v2: [1, 2]
```
:::

:::figura[El paso central del ejemplo visto como proyección: la sombra de (1, 2) sobre la recta de (3, 4) es lo que se resta, y el residuo es perpendicular.]{componente="VectorPlane"}
```yaml
modo: proyeccion
a: [3, 4]
b: [1, 2]
```
:::

## Propiedades

- **Mismo espacio en cada paso:** los primeros $j$ vectores $\mathbf{q}$ generan lo mismo que los primeros $j$ vectores $\mathbf{v}$.
- **Depende del orden:** cambiar el orden de los $\mathbf{v}_j$ da otra base ortonormal.
- **Factorización QR:** si $\mathbf{v}_j$ son las columnas de $A$, entonces $A = QR$ con $r_{ij} = \mathbf{v}_j \cdot \mathbf{q}_i$ y $r_{jj} = \lVert \mathbf{w}_j \rVert$.
- **Detección de dependencia:** $\mathbf{w}_j = \mathbf{0}$ exactamente cuando $\mathbf{v}_j$ está en el espacio generado por los anteriores.
- **Versión modificada:** restar las proyecciones una por una sobre el vector ya corregido (Gram-Schmidt modificado) es más estable en punto flotante.
- **Funciones:** con un producto interno entre funciones, el mismo proceso produce polinomios ortogonales, como los de Legendre.

:::demostracion
Ortogonalidad por inducción: si $\mathbf{q}_1, \dots, \mathbf{q}_{j-1}$ son ortonormales, para $l < j$, $\mathbf{w}_j \cdot \mathbf{q}_l = \mathbf{v}_j \cdot \mathbf{q}_l - \sum_{i<j} (\mathbf{v}_j \cdot \mathbf{q}_i)(\mathbf{q}_i \cdot \mathbf{q}_l) = \mathbf{v}_j \cdot \mathbf{q}_l - \mathbf{v}_j \cdot \mathbf{q}_l = 0$.
:::

## Errores comunes

- **Proyectar sobre los $\mathbf{v}_i$ originales.** Hay que proyectar sobre los $\mathbf{q}_i$ ya ortonormales; con los originales el resultado no es perpendicular.
- **Olvidar normalizar.** Sin dividir entre la longitud se obtiene una base ortogonal, no ortonormal, y la fórmula de proyección $(\mathbf{v} \cdot \mathbf{q})\mathbf{q}$ deja de valer.
- **Aplicarlo a vectores dependientes sin revisar.** Un $\mathbf{w}_j$ casi cero indica dependencia, y dividir entre él produce basura numérica.
- **Creer que la base ortonormal es única.** Depende del orden y hay infinitas bases ortonormales de un mismo espacio.

## Conexiones

Cada paso es una [[proyeccion-ortogonal]] y el resultado es una base de [[ortogonalidad-y-ortonormalidad|vectores ortonormales]]. Organizado en matrices, el proceso produce la [[descomposicion-qr]]. En estadística, ortogonalizar las variables explicativas una tras otra permite interpretar la regresión múltiple como una sucesión de regresiones simples.

## Formulario

:::formula[Paso de ortogonalización]
$$
\mathbf{w}_j = \mathbf{v}_j - \sum_{i=1}^{j-1} (\mathbf{v}_j \cdot \mathbf{q}_i)\,\mathbf{q}_i
$$

- $\mathbf{v}_j$: vector original.
- $\mathbf{q}_i$: vectores ortonormales ya construidos.
- $\mathbf{w}_j$: residuo perpendicular a todos ellos.
:::

:::formula[Normalización]
$$
\mathbf{q}_j = \frac{\mathbf{w}_j}{\lVert \mathbf{w}_j \rVert}
$$

- $\lVert \mathbf{w}_j \rVert$: longitud del residuo, distinta de cero si los vectores son independientes.
:::

:::formula[Coeficientes de R]
$$
r_{ij} = \mathbf{v}_j \cdot \mathbf{q}_i \ (i < j), \qquad r_{jj} = \lVert \mathbf{w}_j \rVert
$$

- $r_{ij}$: entradas de la matriz triangular $R$ en $A = QR$.
:::
