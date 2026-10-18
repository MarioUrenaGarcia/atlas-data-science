---
id: estimador-y-estimacion
titulo: Estimador y estimación
titulo_en: Estimator and estimate
alias:
  - estimador puntual
  - estimación puntual
modulo: 6
submodulo: '6.2'
orden: 1
nivel: intermedio
prerrequisitos:
  - distribucion-muestral
etiquetas:
  - inferencia
  - estimación puntual
  - estadísticos
  - parámetros
resumen: >
  Un estimador es una regla que asigna a cada muestra posible un valor para un parámetro desconocido; es
  una variable aleatoria. La estimación es el número que produce esa regla con la muestra observada.
formula: '\hat{\theta} = t(X_1, \dots, X_n)\ \text{(estimador)},\qquad \hat{\theta}_{\text{obs}} = t(x_1, \dots, x_n)\ \text{(estimación)}'
visualizacion:
  componente: EstimatorLab
  parametros:
    modo: comparar
    problema: maximo-uniforme
    n: 8
    theta: 10
referencias:
  - clave: casella-berger
    capitulo: '7'
  - clave: wasserman
    capitulo: '6'
publicado: true
---

## Intuición

Un generador de números aleatorios produce valores uniformes entre 0 y un máximo desconocido $\theta$, y solo se conocen los 8 valores que ha producido. ¿Cuánto vale $\theta$? Hay varias recetas razonables. Una es tomar el número más grande observado; otra, el doble del promedio, porque el promedio de una distribución uniforme está a la mitad del intervalo; otra, el máximo agrandado un poco, para compensar que casi nunca sale justo el extremo.

Cada receta es un **estimador**: una regla que se aplica a cualquier muestra. Antes de tomar los datos, el resultado de la regla es incierto y tiene una distribución; por eso un estimador es una variable aleatoria. Cuando se aplica a la muestra que realmente se tomó, produce un número concreto, la **estimación**. Comparar estimadores es comparar recetas por cómo se comportan sobre todas las muestras posibles, no por lo que dieron con una sola muestra.

## Definición

:::definicion[Estimador y estimación]
Sea $X_1, \dots, X_n$ una muestra de una población cuya distribución depende de un parámetro desconocido $\theta$. Un **estimador** de $\theta$ es un estadístico
$$
\hat{\theta} = t(X_1, \dots, X_n),
$$
es decir, una función de la muestra que no depende de $\theta$. Al evaluarlo en los datos observados $x_1, \dots, x_n$ se obtiene la **estimación** $t(x_1, \dots, x_n)$, un número.
:::

La calidad de un estimador se juzga por su distribución muestral: dónde se centra (sesgo), cuánto se dispersa (varianza), cuánto se aleja en promedio del valor verdadero (error cuadrático medio) y cómo se comporta al crecer $n$ (consistencia).

:::nota[Qué significa cada símbolo]
- $X_1, \dots, X_n$: muestra aleatoria; $x_1, \dots, x_n$: valores observados; $n$: tamaño.
- $\theta$: parámetro desconocido.
- $t$: la regla de cálculo; $\hat{\theta}$: el estimador, una variable aleatoria.
:::

## Cómo usar la visualización

Tres estimadores del máximo $\theta = 10$ de una uniforme se aplican a las mismas muestras de tamaño 8: dos veces la media, el máximo y el máximo corregido. Cada fila acumula sus estimaciones; la línea vertical negra es el valor verdadero y la línea de color, el promedio de cada estimador. El panel compara su sesgo, su varianza y su error cuadrático medio, simulados y exactos.

Experimentos sugeridos:

1. Observar que el máximo nunca supera 10: siempre se queda corto.
2. Comparar la anchura de las filas: dos veces la media es la más dispersa.
3. Aumentar $n$ a 40: los tres se concentran, pero el máximo corregido sigue siendo el de menor error.

## Ejemplo

Los ocho valores observados son 2.1, 7.4, 5.0, 9.2, 3.3, 6.8, 8.1 y 4.5.

1. Media: $\bar{x} = 46.4/8 = 5.8$, de modo que $2\bar{x} = 11.6$.
2. Máximo: $x_{(8)} = 9.2$.
3. Máximo corregido: $\frac{9}{8} \cdot 9.2 = 10.35$.
4. Las tres son estimaciones del mismo $\theta$ con la misma muestra. Cuál está más cerca del verdadero no se sabe con una muestra; se sabe cuál suele estarlo, y eso lo dice la distribución de cada estimador.

:::figura[Las tres recetas con muestras pequeñas de tamaño 4: la diferencia entre ellas es más visible.]{componente="EstimatorLab"}
```yaml
modo: comparar
problema: maximo-uniforme
n: 4
theta: 10
```
:::

## Propiedades

- **Un estimador es aleatorio, una estimación es fija.** Las propiedades (sesgo, varianza) son del estimador.
- **Hay muchos estimadores para un mismo parámetro;** los métodos de momentos y de máxima verosimilitud son recetas generales para construirlos.
- **No depende del parámetro:** una expresión como $\bar{X} - \mu$ no es un estimador, porque requiere conocer $\mu$.

:::figura[Estimadores de la media de una normal: media, mediana, media recortada, el primer dato y una media contraída hacia cero.]{componente="EstimatorLab"}
```yaml
modo: comparar
problema: media-normal
n: 10
theta: 2
```
:::

## Errores comunes

- **Juzgar un estimador por una sola estimación.** Que una regla haya acertado con una muestra no dice nada de su calidad.
- **Confundir el estimador con el parámetro.** $\bar{x} = 5.8$ no es la media de la población; es una estimación de ella.
- **Usar parámetros desconocidos dentro de la regla.** Si la fórmula necesita $\theta$, no se puede calcular.

:::figura[El primer dato como estimador de la media: es insesgado, pero su dispersión es tan grande como la de la población.]{componente="EstimatorLab"}
```yaml
modo: comparar
problema: media-normal
estimadores: [media, primero]
n: 10
theta: 2
```
:::

## Conexiones

Un estimador es un [[parametro-y-estadistico|estadístico]] con una [[distribucion-muestral]]. Sus propiedades son el [[sesgo-de-un-estimador]], la [[varianza-de-un-estimador]], el [[error-cuadratico-medio]] y la [[consistencia]]; la [[eficiencia-relativa]] compara dos estimadores.

## Formulario

:::formula[Estimador]
$$
\hat{\theta} = t(X_1, \dots, X_n)
$$

- $t$: función de la muestra que no depende de $\theta$.
:::

:::formula[Estimadores del máximo de una uniforme]
$$
2\bar{X},\qquad X_{(n)},\qquad \frac{n+1}{n}X_{(n)}
$$

- $\bar{X}$: media muestral; $X_{(n)}$: máximo de la muestra; $n$: tamaño.
:::
