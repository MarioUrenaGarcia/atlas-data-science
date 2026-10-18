---
id: sesgo-de-un-estimador
titulo: Sesgo de un estimador
titulo_en: Bias of an estimator
alias:
  - sesgo
  - estimador insesgado
modulo: 6
submodulo: '6.2'
orden: 2
nivel: intermedio
prerrequisitos:
  - estimador-y-estimacion
etiquetas:
  - inferencia
  - sesgo
  - insesgadez
  - estimación puntual
resumen: >
  El sesgo de un estimador es la diferencia entre su valor esperado y el parámetro: mide si la regla, en
  promedio sobre muchas muestras, apunta por encima o por debajo del valor verdadero.
formula: '\operatorname{sesgo}(\hat{\theta}) = \mathbb{E}_\theta[\hat{\theta}] - \theta'
visualizacion:
  componente: EstimatorLab
  parametros:
    modo: comparar
    problema: varianza-normal
    estimadores: [s2, mle]
    n: 5
    theta: 4
referencias:
  - clave: casella-berger
    capitulo: '7'
  - clave: wasserman
    capitulo: '6'
publicado: true
---

## Intuición

Una báscula de farmacia marca siempre 200 g de más. Cada pesada tiene además un pequeño error aleatorio, pero el promedio de muchas pesadas no se acerca al peso real: se acerca al peso real más 200 g. Ese error sistemático es el **sesgo**. No se reduce repitiendo la medición, a diferencia del error aleatorio.

Con los estimadores pasa lo mismo. Si al calcular la varianza de una muestra se divide la suma de cuadrados entre $n$, el resultado sale en promedio más chico que la varianza verdadera, porque los datos se miden respecto a su propia media, que siempre está más cerca de ellos que la media verdadera. Dividir entre $n - 1$ corrige exactamente ese defecto y produce un estimador **insesgado**: en promedio, sobre todas las muestras posibles, da el valor correcto.

## Definición

:::definicion[Sesgo]
El **sesgo** de un estimador $\hat{\theta}$ del parámetro $\theta$ es
$$
\operatorname{sesgo}(\hat{\theta}) = \mathbb{E}_\theta[\hat{\theta}] - \theta,
$$
donde la esperanza se calcula con la distribución de la muestra cuando el parámetro vale $\theta$. El estimador es **insesgado** si su sesgo es cero para todo valor de $\theta$, y **asintóticamente insesgado** si el sesgo tiende a cero al crecer $n$.
:::

:::nota[Qué significa cada símbolo]
- $\hat{\theta}$: estimador; $\theta$: valor verdadero del parámetro.
- $\mathbb{E}_\theta[\hat{\theta}]$: valor esperado del estimador cuando el parámetro vale $\theta$.
- $n$: tamaño de la muestra.
:::

## Cómo usar la visualización

Dos estimadores de la varianza $\sigma^2 = 4$ de una población normal se aplican a las mismas muestras de tamaño 5: con divisor $n - 1$ y con divisor $n$. La línea de color de cada fila marca el promedio de sus estimaciones; la línea negra, el valor verdadero. El panel muestra el sesgo simulado y el exacto.

Experimentos sugeridos:

1. Dejar acumular muestras: el promedio del divisor $n$ se estaciona cerca de 3.2, no de 4.
2. Subir $n$ a 50: el sesgo del divisor $n$ baja a $-0.08$, casi nada.
3. Comparar las varianzas: el divisor $n$ es menos disperso que el $n - 1$, aunque esté sesgado.

## Ejemplo

Población normal con $\sigma^2 = 4$ y muestras de tamaño $n = 5$.

1. Para $S^2 = \frac{1}{n - 1}\sum (X_i - \bar{X})^2$: $\mathbb{E}[S^2] = 4$, sesgo 0.
2. Para $\hat{\sigma}^2 = \frac{1}{n}\sum (X_i - \bar{X})^2 = \frac{n - 1}{n}S^2$: $\mathbb{E}[\hat{\sigma}^2] = \frac{4}{5} \cdot 4 = 3.2$.
3. Sesgo: $3.2 - 4 = -0.8$, es decir, $-\sigma^2/n$.
4. Con $n = 50$ el sesgo es $-4/50 = -0.08$: el estimador es asintóticamente insesgado.

:::figura[Las mismas dos fórmulas con muestras de tamaño 50: el sesgo del divisor n casi desaparece.]{componente="EstimatorLab"}
```yaml
modo: comparar
problema: varianza-normal
estimadores: [s2, mle]
n: 50
theta: 4
```
:::

## Propiedades

- **El sesgo es una propiedad del promedio, no de cada estimación:** un estimador insesgado puede fallar mucho en una muestra concreta.
- **La insesgadez no se conserva al transformar:** $S^2$ es insesgado para $\sigma^2$, pero $S$ subestima $\sigma$.
- **El máximo de una uniforme subestima su extremo:** $\mathbb{E}[X_{(n)}] = \frac{n}{n + 1}\theta$, y multiplicar por $\frac{n+1}{n}$ lo corrige.

:::figura[Sesgo como desplazamiento: en las cuatro dianas, el sesgo aleja el centro de los disparos del blanco, independientemente de cuán agrupados estén.]{componente="EstimatorLab"}
```yaml
modo: diana
cuatro: true
```
:::

## Errores comunes

- **Creer que insesgado significa preciso.** El primer dato de una muestra es insesgado para la media, pero muy impreciso.
- **Preferir siempre el insesgado.** Un estimador con un poco de sesgo y mucha menos varianza puede tener menor error cuadrático medio.
- **Confundir el sesgo del estimador con el sesgo de la muestra.** Una muestra mal tomada (por ejemplo, solo voluntarios) sesga cualquier estimador; eso no se corrige con la fórmula.

:::figura[El máximo como estimador del extremo de una uniforme: todas sus estimaciones quedan por debajo del valor verdadero.]{componente="EstimatorLab"}
```yaml
modo: comparar
problema: maximo-uniforme
estimadores: [maximo, maximo-corregido]
n: 6
theta: 10
```
:::

## Conexiones

El sesgo es una de las dos piezas del [[error-cuadratico-medio]], junto con la [[varianza-de-un-estimador]], como muestra la [[descomposicion-del-ecm-en-sesgo-y-varianza]]. La [[correccion-de-bessel]] es el ejemplo clásico de corrección de sesgo, y la [[varianza-muestral]] es el estimador insesgado resultante.

## Formulario

:::formula[Sesgo]
$$
\operatorname{sesgo}(\hat{\theta}) = \mathbb{E}_\theta[\hat{\theta}] - \theta
$$

- $\hat{\theta}$: estimador; $\theta$: parámetro; $\mathbb{E}_\theta$: esperanza bajo $\theta$.
:::

:::formula[Sesgo del divisor n]
$$
\mathbb{E}\Big[\frac{1}{n}\sum_{i=1}^{n} (X_i - \bar{X})^2\Big] = \frac{n - 1}{n}\sigma^2,\qquad \operatorname{sesgo} = -\frac{\sigma^2}{n}
$$

- $\sigma^2$: varianza de la población; $n$: tamaño de muestra.
:::

:::formula[Sesgo del máximo de una uniforme]
$$
\mathbb{E}[X_{(n)}] = \frac{n}{n + 1}\theta,\qquad \operatorname{sesgo} = -\frac{\theta}{n + 1}
$$

- $X_{(n)}$: máximo de la muestra; $\theta$: extremo superior de la uniforme.
:::
