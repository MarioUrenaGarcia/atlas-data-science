---
id: seleccion-de-caracteristicas-embebida
titulo: Selección de características embebida
titulo_en: Embedded feature selection
alias:
  - métodos embebidos
  - selección con lasso
  - selección por penalización L1
  - embedded methods
modulo: 12
submodulo: '12.3'
orden: 24
nivel: basico
prerrequisitos:
  - seleccion-de-caracteristicas-por-filtro
  - descenso-por-coordenadas
etiquetas:
  - selección de características
  - lasso
  - regularización
  - norma L1
resumen: >
  Los métodos embebidos seleccionan variables durante el ajuste del modelo. El lasso penaliza la suma de valores
  absolutos de los coeficientes y lleva varios exactamente a cero: las variables con coeficiente cero quedan fuera.
formula: '\min_{\boldsymbol\beta}\ \frac{1}{2n}\lVert \mathbf{y} - \mathbf{X}\boldsymbol\beta \rVert_2^2 + \lambda \lVert \boldsymbol\beta \rVert_1'
visualizacion:
  componente: FeatureSelectionViz
  parametros:
    modo: embebida
referencias:
  - clave: hastie-esl
  - clave: james-isl
publicado: true
---

## Intuición

Un filtro elige variables antes de ajustar el modelo y una envoltura ajusta muchos modelos para elegirlas. Un **método embebido** hace ambas cosas a la vez: el propio ajuste decide qué variables usar. El ejemplo más conocido es el **lasso**, una regresión lineal a la que se le cobra una multa proporcional a la suma de los valores absolutos de sus coeficientes.

Con una multa muy grande, al modelo le conviene poner todos los coeficientes en cero: no predice nada, pero no paga multa. Al bajar la multa, el primer coeficiente que "vale la pena" pagar es el de la variable más útil, y se vuelve distinto de cero; después entra la segunda, y así sucesivamente. Las variables poco útiles se quedan exactamente en cero en un rango amplio de multas, y por eso el lasso produce modelos con pocas variables. Lo especial del valor absoluto, frente a penalizar los cuadrados, es esa capacidad de llegar a cero exacto. Cuando dos variables son casi iguales, como la lluvia y su medición por satélite, el lasso tiende a quedarse con una y dejar la otra en cero.

## Definición

:::definicion[Selección embebida con lasso]
Con las variables estandarizadas y la respuesta centrada, el **lasso** estima

$$
\hat{\boldsymbol\beta}(\lambda) = \arg\min_{\boldsymbol\beta}\ \frac{1}{2n}\lVert \mathbf{y} - \mathbf{X}\boldsymbol\beta \rVert_2^2 + \lambda \lVert \boldsymbol\beta \rVert_1, \qquad \lVert \boldsymbol\beta \rVert_1 = \sum_{j=1}^{p} |\beta_j|.
$$

Las variables seleccionadas son $\{\, j : \hat{\beta}_j(\lambda) \ne 0 \,\}$. Por descenso por coordenadas, cada coeficiente se actualiza con el **umbral suave**

$$
\beta_j \leftarrow S(\rho_j, \lambda) = \operatorname{signo}(\rho_j)\,\max(|\rho_j| - \lambda,\ 0),
$$

donde $\rho_j$ es la correlación de la variable $j$ con el residuo parcial.
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{y}$: vector de respuestas centradas; $\mathbf{X}$: matriz de variables estandarizadas.
- $\boldsymbol\beta$: vector de coeficientes; $\beta_j$, el de la variable $j$.
- $n$: número de observaciones; $p$: número de variables.
- $\lVert \cdot \rVert_2$: norma euclidiana; $\lVert \cdot \rVert_1$: suma de valores absolutos.
- $\lambda$: intensidad de la penalización.
- $\hat{\boldsymbol\beta}(\lambda)$: coeficientes estimados para ese $\lambda$.
- $S(\rho, \lambda)$: umbral suave; vale $0$ si $|\rho| \le \lambda$.
- $\rho_j$: correlación de la variable $j$ con el residuo que deja el resto del modelo.
:::

## Cómo usar la visualización

Cada línea es el coeficiente de una variable a lo largo de la trayectoria del lasso. El eje horizontal recorre la penalización de mayor a menor, en escala logarítmica, y la línea punteada marca la penalización actual. Al reproducir, la penalización baja y los coeficientes salen de cero uno por uno. Las lecturas muestran cuántas variables están seleccionadas y el valor de cada coeficiente.

Experimento sugerido: detenerse cuando hay tres variables activas y comparar con las tres que eligió el filtro por correlación; observar que la lluvia por satélite tarda mucho en salir de cero.

## Ejemplo

Con una sola variable estandarizada, el lasso se reduce al umbral suave. Si la correlación de la variable con la respuesta es $\rho = 0.8$:

1. Con $\lambda = 0.3$: $\hat\beta = 0.8 - 0.3 = 0.5$. La variable entra, con un coeficiente encogido.
2. Con $\lambda = 0.8$: $\hat\beta = \max(0.8 - 0.8, 0) = 0$. La variable sale.
3. Con $\rho = -0.2$ y $\lambda = 0.3$: $|\rho| < \lambda$, así que $\hat\beta = 0$.
4. Sin penalización, $\lambda = 0$, se recupera la estimación de mínimos cuadrados, $\hat\beta = \rho$.

En el modelo de rendimiento, la penalización más pequeña que deja todos los coeficientes en cero es $\lambda_{\max} = \max_j |\mathbf{x}_j^\top \mathbf{y}|/n$, la mayor correlación con la respuesta: la de la lluvia.

:::figura[Trayectoria del lasso con otra muestra: la lluvia entra primero y la medición por satélite permanece en cero durante casi todo el recorrido.]{componente="FeatureSelectionViz"}
```yaml
modo: embebida
semilla: 123
```
:::

## Propiedades

- **Produce ceros exactos.** A diferencia de la penalización con cuadrados (ridge), que encoge pero no anula, el lasso elimina variables.
- **Encoge los coeficientes que conserva.** Los coeficientes seleccionados son menores en valor absoluto que los de mínimos cuadrados; se suele reajustar sin penalización con las variables elegidas.
- **Entre variables muy correlacionadas elige una.** La elección puede cambiar con pequeñas variaciones de los datos.

:::figura[Con esta otra muestra, la medición por satélite sale de cero muy pronto, casi junto con la lluvia: entre dos variables casi iguales, cuál conserva el lasso depende de la muestra.]{componente="FeatureSelectionViz"}
```yaml
modo: embebida
semilla: 42
```
:::

## Errores comunes

- **Aplicar el lasso sin estandarizar.** La penalización castiga igual a todos los coeficientes; si una variable se mide en miles, su coeficiente es pequeño y la multa casi no la afecta.
- **Leer el orden de entrada como importancia causal.** Entre variables correlacionadas, la que entra primero depende de detalles de la muestra.
- **Elegir lambda con el error de entrenamiento.** El error de entrenamiento siempre baja con lambda; la penalización se elige con datos de validación.

## Conexiones

Usa la norma L1 de las [[normas-vectoriales]], y su solución por [[descenso-por-coordenadas]] aplica el umbral suave de los [[metodos-proximales-y-gradiente-proximal]]. Es la alternativa embebida a la [[seleccion-de-caracteristicas-por-filtro]] y a la [[seleccion-de-caracteristicas-por-envoltura]]. Requiere variables en la misma escala, que se obtienen con la [[estandarizacion]]. La geometría de la penalización, con esquinas en los ejes, explica los ceros exactos: el mínimo de una función cuadrática restringida a un rombo suele caer en un vértice.

## Formulario

:::formula[Problema del lasso]
$$
\min_{\boldsymbol\beta}\ \frac{1}{2n}\lVert \mathbf{y} - \mathbf{X}\boldsymbol\beta \rVert_2^2 + \lambda \lVert \boldsymbol\beta \rVert_1
$$

- $\mathbf{y}$, $\mathbf{X}$: respuesta centrada y variables estandarizadas.
- $\boldsymbol\beta$: coeficientes; $n$: observaciones; $\lambda$: penalización.
:::

:::formula[Umbral suave]
$$
S(\rho, \lambda) = \operatorname{signo}(\rho)\,\max(|\rho| - \lambda,\ 0)
$$

- $\rho$: correlación con el residuo parcial.
- $\lambda$: penalización.
:::

:::formula[Penalización que anula todos los coeficientes]
$$
\lambda_{\max} = \max_j \frac{|\mathbf{x}_j^\top \mathbf{y}|}{n}
$$

- $\mathbf{x}_j$: columna estandarizada de la variable $j$.
:::
