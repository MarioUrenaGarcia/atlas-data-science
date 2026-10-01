---
id: optimizacion-estocastica
titulo: Optimización estocástica
titulo_en: Stochastic optimization
alias:
  - descenso de gradiente estocástico
  - SGD
  - minilotes
modulo: 0
submodulo: '0.6'
orden: 18
nivel: intermedio
prerrequisitos:
  - tasa-de-aprendizaje
etiquetas:
  - gradiente estocástico
  - minilotes
  - aprendizaje automático
  - ruido
resumen: >
  El descenso de gradiente estocástico estima el gradiente con un lote pequeño de datos elegido al azar en
  cada paso; cada paso es barato y ruidoso, y en promedio apunta en la dirección correcta.
formula: '\boldsymbol{\theta}_{k+1} = \boldsymbol{\theta}_k - \eta_k\,\frac{1}{|B_k|}\sum_{i \in B_k} \nabla \ell_i(\boldsymbol{\theta}_k), \qquad \mathbb{E}\Big[\frac{1}{|B_k|}\sum_{i \in B_k} \nabla \ell_i\Big] = \nabla L'
visualizacion:
  componente: OptimizerRace
  parametros:
    modo: estocastico
    lote: 4
    tasa: 0.1
referencias:
  - clave: goodfellow
    capitulo: '8.3'
  - clave: hastie-esl
publicado: true
---

## Intuición

Para saber hacia dónde mejorar un modelo entrenado con un millón de ejemplos, el descenso de gradiente pide revisar el millón antes de dar un solo paso. Una encuestadora no pregunta a toda la población: pregunta a una muestra, y la estimación es buena en promedio. El descenso de gradiente estocástico aplica la misma idea: en cada paso mira solo un lote pequeño de ejemplos elegidos al azar y usa el gradiente de ese lote como estimación del gradiente completo.

Cada paso apunta en una dirección algo equivocada, pero el error se compensa en promedio: el camino zigzaguea alrededor del que seguiría el gradiente completo, mucho más rápido en tiempo de cómputo. El ruido incluso puede ayudar a escapar de regiones planas. El precio es que, con una tasa fija, el método nunca se asienta del todo: sigue temblando alrededor del mínimo, y para converger hay que reducir la tasa con el tiempo o promediar las iteraciones.

## Definición

Para una pérdida promedio $L(\boldsymbol{\theta}) = \dfrac{1}{N}\sum_{i=1}^{N} \ell_i(\boldsymbol{\theta})$ sobre $N$ datos:

:::definicion[Descenso de gradiente estocástico]
En cada paso se elige al azar un lote $B_k \subseteq \{1, \dots, N\}$ de tamaño $b$ y se actualiza
$$
\boldsymbol{\theta}_{k+1} = \boldsymbol{\theta}_k - \eta_k\,\hat{\mathbf{g}}_k, \qquad \hat{\mathbf{g}}_k = \frac{1}{b}\sum_{i \in B_k} \nabla \ell_i(\boldsymbol{\theta}_k).
$$
:::

Si los índices del lote se eligen de manera uniforme, $\mathbb{E}[\hat{\mathbf{g}}_k] = \nabla L(\boldsymbol{\theta}_k)$: el estimador es insesgado. Su varianza disminuye como $1/b$. Para la convergencia se usan tasas decrecientes con $\sum_k \eta_k = \infty$ y $\sum_k \eta_k^2 < \infty$, por ejemplo $\eta_k = \eta_0/(1 + k)$.

:::nota[Qué significa cada símbolo]
- $\boldsymbol{\theta}$: parámetros del modelo.
- $\ell_i$: pérdida en el dato $i$; $L$: pérdida promedio sobre los $N$ datos.
- $B_k$: lote de índices elegido en el paso $k$; $b = |B_k|$: tamaño del lote.
- $\hat{\mathbf{g}}_k$: gradiente estimado con el lote.
- $\eta_k$: tasa de aprendizaje en el paso $k$; $\eta_0$: tasa inicial.
- $\mathbb{E}$: esperanza sobre la elección aleatoria del lote.
:::

## Cómo usar la visualización

Se ajusta una recta $y = \beta_0 + \beta_1 t$ a 40 datos por mínimos cuadrados. A la izquierda, las curvas de nivel del error cuadrático medio en el plano de los coeficientes, con el camino del descenso estocástico en amarillo y el del gradiente completo en naranja. A la derecha, los datos y la recta del paso actual. El encabezado escribe la actualización y el error en cada paso. Los controles cambian el tamaño del lote, la tasa y la semilla, que elige otros datos y otros lotes.

Con lotes de 1 dato el camino tiembla mucho; con lotes de 20 se parece al del gradiente completo. Al subir la tasa, el temblor alrededor del mínimo se hace más grande.

## Ejemplo

Un paso de descenso estocástico con lote de un dato para ajustar $y = \beta_0 + \beta_1 t$ con pérdida $(\beta_0 + \beta_1 t - y)^2$, desde $\boldsymbol{\beta} = (0, 0)$ y con $\eta = 0.05$.

1. Se elige al azar el dato $(t, y) = (1.2, 3.5)$.
2. Residuo: $r = 0 + 0 \cdot 1.2 - 3.5 = -3.5$.
3. Gradiente del dato: $\nabla \ell = (2r,\ 2rt) = (-7,\ -8.4)$.
4. Paso: $\boldsymbol{\beta} \leftarrow (0, 0) - 0.05\,(-7, -8.4) = (0.35, 0.42)$.
5. El siguiente paso usará otro dato al azar; ninguno de los dos gradientes es el completo, pero en promedio lo son.

:::figura[Lotes de un solo dato con η = 0.05: el camino amarillo avanza en la dirección general del mínimo pero tiembla en cada paso, alrededor del camino suave del gradiente completo.]{componente="OptimizerRace"}
```yaml
modo: estocastico
lote: 1
tasa: 0.05
semilla: 3
```
:::

## Propiedades

- **Insesgado:** el gradiente del lote es, en promedio, el gradiente completo.
- **Varianza y tamaño del lote:** la varianza del estimador baja como $1/b$; un lote cuatro veces mayor reduce a la mitad la desviación del paso.
- **Costo:** un paso cuesta $b$ evaluaciones en lugar de $N$; con datos grandes se dan muchos más pasos en el mismo tiempo.
- **Tasa fija:** el método se estabiliza en una zona alrededor del mínimo cuyo tamaño crece con $\eta$ y con la varianza.
- **Variantes:** momento, AdaGrad, RMSProp y Adam modifican la dirección o la escala con promedios de gradientes pasados.

:::figura[Lotes de 20 datos: el camino estocástico casi coincide con el del gradiente completo, porque la varianza del gradiente estimado bajó veinte veces respecto a los lotes de un dato.]{componente="OptimizerRace"}
```yaml
modo: estocastico
lote: 20
tasa: 0.1
semilla: 3
```
:::

## Errores comunes

- **Esperar que la pérdida baje en cada paso.** Con lotes pequeños la pérdida completa puede subir de un paso a otro; lo que baja es la tendencia.
- **Mantener la tasa fija y esperar convergencia exacta.** Con tasa constante el método sigue fluctuando; hay que reducirla o promediar.
- **Muestrear siempre en el mismo orden.** Recorrer los datos en un orden fijo, por ejemplo ordenados por clase, introduce sesgos; se barajan en cada época.
- **Comparar lotes distintos con la misma tasa.** Al cambiar el tamaño del lote cambia el ruido, y la tasa adecuada también.

:::figura[Lotes de un dato con tasa η = 0.25: el camino no se asienta y sigue saltando alrededor del mínimo, con un error que sube y baja de un paso a otro.]{componente="OptimizerRace"}
```yaml
modo: estocastico
lote: 1
tasa: 0.25
semilla: 3
```
:::

## Conexiones

Es la versión aleatoria del [[descenso-de-gradiente]], con una [[tasa-de-aprendizaje]] que suele decrecer. El ejemplo minimiza el error de mínimos cuadrados del [[calculo-matricial]]. Su análisis usa esperanzas y varianzas de los estimadores que se estudian en probabilidad, y es el método con el que se entrenan casi todas las redes neuronales.

## Formulario

:::formula[Paso estocástico]
$$
\boldsymbol{\theta}_{k+1} = \boldsymbol{\theta}_k - \eta_k\,\frac{1}{b}\sum_{i \in B_k} \nabla \ell_i(\boldsymbol{\theta}_k)
$$

- $B_k$: lote aleatorio de tamaño $b$; $\ell_i$: pérdida del dato $i$.
:::

:::formula[Insesgadez del gradiente del lote]
$$
\mathbb{E}\Big[\frac{1}{b}\sum_{i \in B_k} \nabla \ell_i(\boldsymbol{\theta})\Big] = \nabla L(\boldsymbol{\theta})
$$

- $L = \frac{1}{N}\sum_i \ell_i$: pérdida promedio.
:::

:::formula[Condiciones de las tasas]
$$
\sum_{k} \eta_k = \infty, \qquad \sum_{k} \eta_k^2 < \infty
$$

- Por ejemplo $\eta_k = \eta_0/(1 + k)$.
:::

:::formula[Gradiente de un dato en la regresión lineal]
$$
\nabla_{\boldsymbol{\beta}} (\beta_0 + \beta_1 t - y)^2 = 2r\,(1,\ t), \qquad r = \beta_0 + \beta_1 t - y
$$

- $r$: residuo del dato $(t, y)$.
:::
