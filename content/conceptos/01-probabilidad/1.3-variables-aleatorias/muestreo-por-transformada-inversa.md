---
id: muestreo-por-transformada-inversa
titulo: Muestreo por transformada inversa
titulo_en: Inverse transform sampling
alias:
  - método de la transformada inversa
  - método de inversión
  - simulación por la función cuantil
modulo: 1
submodulo: '1.3'
orden: 29
nivel: intermedio
prerrequisitos:
  - transformada-integral-de-probabilidad
relaciones:
  - tipo: relacionado
    id: estimacion-de-probabilidades-por-simulacion-monte-carlo
  - tipo: relacionado
    id: funcion-cuantil
etiquetas:
  - simulación
  - números aleatorios
  - función cuantil
  - generación de variables
resumen: >
  Para generar valores de una distribución F basta generar U uniforme entre 0 y 1 y evaluar en U la función cuantil de F. Así se convierten números uniformes en valores de cualquier distribución.
formula: 'U \sim \mathrm{U}(0, 1) \quad \Rightarrow \quad X = F^{-1}(U) \sim F'
visualizacion:
  componente: TransformationViz
  parametros:
    modo: transformada-inversa
    distribucion: gamma
    parametros:
      alpha: 2
      beta: 1
referencias:
  - clave: ross-probabilidad
    capitulo: '10.2'
  - clave: wasserman
publicado: true
---

## Intuición

Las computadoras generan con facilidad números que parecen uniformes entre 0 y 1. Pero una simulación de colas necesita tiempos exponenciales, un modelo de riesgo necesita pérdidas de Pareto y un juego necesita tiradas de dados. ¿Cómo convertir uniformes en cualquier otra distribución?

La respuesta es leer la función de distribución al revés. Un número uniforme $u$ se interpreta como un percentil: "quiero el valor que deja la fracción $u$ de la probabilidad a su izquierda". Ese valor es el cuantil $F^{-1}(u)$. Como los percentiles de una variable están repartidos uniformemente, tomar percentiles al azar y convertirlos en valores reproduce la distribución exacta. Donde $F$ sube rápido (mucha probabilidad), un rango amplio de $u$ cae en un rango estrecho de $x$, y salen muchos valores ahí.

## Definición

:::definicion[Muestreo por transformada inversa]
Sea $F$ una función de distribución y $F^{-1}(u) = \inf\{x : F(x) \ge u\}$ su función cuantil. Si $U$ es uniforme en $(0, 1)$, entonces
$$
X = F^{-1}(U)
$$
tiene función de distribución $F$. Para generar $n$ valores independientes de $F$ se generan $U_1, \dots, U_n$ uniformes independientes y se calcula $X_i = F^{-1}(U_i)$.
:::

La prueba usa la equivalencia $F^{-1}(u) \le x \iff u \le F(x)$: $P(F^{-1}(U) \le x) = P(U \le F(x)) = F(x)$. Funciona para distribuciones continuas, discretas y mixtas.

:::figura[Con la exponencial de media 1: cada número uniforme del eje vertical avanza hasta la curva y baja al eje horizontal. Los valores de $X$ obtenidos se acumulan con la forma de la densidad exponencial.]{componente="TransformationViz"}
```yaml
modo: transformada-inversa
distribucion: exponencial
parametros:
  lambda: 1
```
:::

:::nota[Qué significa cada símbolo]
- $F$: función de distribución que se quiere simular.
- $F^{-1}$: función cuantil.
- $U$, $U_1, \dots, U_n$: variables uniformes en $(0, 1)$ independientes.
- $X$, $X_i$: valores generados con distribución $F$.
- $\lambda$: tasa de la exponencial.
- $x_m$, $\alpha$: mínimo e índice de cola de la Pareto.
- $\ln$: logaritmo natural.
:::

## Cómo usar la visualización

Arriba está la función de distribución de una gamma con forma 2. La animación genera números uniformes $u$; cada uno avanza horizontalmente desde el eje vertical hasta la curva y baja al eje horizontal, donde queda $x = F^{-1}(u)$. El encabezado muestra el último par. Abajo a la izquierda se acumula el histograma de los valores de $X$, que se acerca a la densidad gamma punteada; a la derecha, el de los uniformes, que se acerca a una línea plana.

Al principio la animación va lenta para seguir cada recorrido; después se acelera para juntar miles de valores.

## Ejemplo

Se quieren simular tiempos de atención exponenciales con media 2 minutos: $F(x) = 1 - e^{-x/2}$.

1. Se despeja $u = 1 - e^{-x/2}$: $x = -2\ln(1 - u)$, así que $F^{-1}(u) = -2\ln(1 - u)$.
2. Con $u = 0.7$: $x = -2 \ln 0.3 \approx 2.41$ minutos.
3. Con $u = 0.1$: $x = -2 \ln 0.9 \approx 0.21$ minutos.
4. Como $1 - U$ también es uniforme, se puede usar $X = -2\ln U$, que ahorra una resta.

:::figura[El ejemplo de los tiempos de atención: los uniformes se convierten en tiempos con la fórmula $-2\ln(1 - u)$, y el histograma reproduce la exponencial con media 2.]{componente="TransformationViz"}
```yaml
modo: transformada-inversa
distribucion: exponencial
parametros:
  lambda: 0.5
muestras: 2000
```
:::

## Propiedades

- **Exactitud:** si $F^{-1}$ se calcula exactamente, los valores tienen exactamente la distribución $F$; no hay aproximación.
- **Fórmulas cerradas:** exponencial $-\ln(1 - u)/\lambda$; Pareto $x_m (1 - u)^{-1/\alpha}$; Weibull $\lambda(-\ln(1 - u))^{1/k}$; Cauchy $\tan(\pi(u - 1/2))$.
- **Caso discreto:** $F^{-1}(u)$ es el menor valor $k$ con $F(k) \ge u$; en la práctica se recorren las probabilidades acumuladas hasta superar $u$.
- **Monotonía:** $F^{-1}$ es creciente, así que uniformes ordenados dan valores ordenados; esto permite simular estadísticos de orden y usar números comunes al comparar escenarios.

:::figura[La transformada inversa con un dado: el uniforme 0.6 sube hasta la escalera de la función de distribución y la primera cara que la alcanza es 4. Cada cara ocupa un tramo de longitud 1/6 del eje vertical.]{componente="RandomVariableLab"}
```yaml
modo: acumulada
experimento: dado
variable: valor
x: 4
p: 0.6
```
:::

## Errores comunes

- **Usar $F$ en lugar de $F^{-1}$.** $F(U)$ no tiene distribución $F$; el método requiere la función cuantil.
- **Ignorar el costo de invertir.** Para la normal no hay fórmula cerrada de $F^{-1}$; se usan aproximaciones numéricas o métodos específicos como el de Box y Muller.
- **Reutilizar el mismo uniforme para dos variables** que deben ser independientes: ambas quedan perfectamente dependientes, porque las dos son funciones crecientes del mismo número.

:::figura[La normal estándar no tiene cuantil en fórmula cerrada, pero con una aproximación numérica el método funciona igual: los uniformes se convierten en una campana.]{componente="TransformationViz"}
```yaml
modo: transformada-inversa
distribucion: normal
```
:::

## Conexiones

El método es la [[transformada-integral-de-probabilidad]] leída al revés y depende por completo de la [[funcion-cuantil]]. Es la forma estándar de alimentar la [[estimacion-de-probabilidades-por-simulacion-monte-carlo]] con valores de cualquier distribución, y aparece en [[aguja-de-buffon]] y en cualquier simulación donde se necesiten variables no uniformes. Para la [[distribucion-geometrica]] y otras discretas, la búsqueda en las probabilidades acumuladas es el caso discreto del mismo procedimiento.

## Formulario

:::formula[Método]
$$
U \sim \mathrm{U}(0, 1) \quad \Rightarrow \quad F^{-1}(U) \sim F
$$

- $F^{-1}(u) = \inf\{x : F(x) \ge u\}$.
:::

:::formula[Prueba]
$$
P\big(F^{-1}(U) \le x\big) = P\big(U \le F(x)\big) = F(x)
$$

- Usa $F^{-1}(u) \le x \iff u \le F(x)$.
:::

:::formula[Exponencial]
$$
X = -\frac{\ln(1 - U)}{\lambda}
$$

- Equivalente a $-\ln U / \lambda$.
:::

:::formula[Pareto]
$$
X = x_m\,(1 - U)^{-1/\alpha}
$$

- $x_m$: mínimo; $\alpha$: índice de cola.
:::
