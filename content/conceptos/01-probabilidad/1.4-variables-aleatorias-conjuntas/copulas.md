---
id: copulas
titulo: Cópulas
titulo_en: Copulas
alias:
  - cópula
  - función cópula
  - estructura de dependencia
modulo: 1
submodulo: '1.4'
orden: 16
nivel: avanzado
prerrequisitos:
  - distribucion-conjunta
  - transformada-integral-de-probabilidad
relaciones:
  - tipo: relacionado
    id: teorema-de-sklar
  - tipo: relacionado
    id: tau-de-kendall
etiquetas:
  - dependencia
  - marginales uniformes
  - tau de Kendall
  - familias de cópulas
resumen: >
  Una cópula es una distribución conjunta sobre el cuadrado unitario cuyas marginales son
  uniformes. Describe la dependencia entre variables sin importar sus distribuciones individuales.
formula: 'C(u, v) = P(U \le u,\ V \le v), \qquad U, V \sim \mathrm{U}(0, 1)'
visualizacion:
  componente: CopulaViz
  parametros:
    modo: copula
    familia: gaussiana
    familias: [independiente, gaussiana, clayton, gumbel, frank]
    tau: 0.5
referencias:
  - clave: coles
  - clave: murphy
publicado: true
---

## Intuición

La distribución conjunta de dos variables mezcla dos cosas: cómo es cada variable por separado y cómo se relacionan. Si se transforma cada variable en su posición relativa, su percentil, las distribuciones individuales desaparecen: cada percentil es uniforme entre 0 y 1. Lo que queda es la relación pura, y su distribución conjunta es una **cópula**.

Por ejemplo, las pérdidas de dos ramos de una aseguradora pueden tener distribuciones muy distintas, una con cola pesada y otra casi normal. La cópula responde una pregunta independiente de eso: cuando un ramo tiene una pérdida en su percentil 99, ¿qué tan probable es que el otro también esté en su percentil alto? Hay familias de cópulas con dependencia simétrica, con dependencia concentrada en los valores bajos y con dependencia concentrada en los altos.

## Definición

:::definicion[Cópula]
Una **cópula** bidimensional es la función de distribución conjunta $C : [0, 1]^2 \to [0, 1]$ de un par $(U, V)$ con marginales uniformes en $(0, 1)$:
$$
C(u, v) = P(U \le u,\ V \le v).
$$
Equivalentemente, $C$ es no decreciente en cada coordenada, $C(u, 0) = C(0, v) = 0$, y $C(u, 1) = u$, $C(1, v) = v$.
:::

Si $X$ y $Y$ son continuas con distribuciones $F$ y $G$, la cópula de $(X, Y)$ es la distribución conjunta de $(F(X), G(Y))$, que por la transformada integral de probabilidad tiene marginales uniformes.

:::figura[La cópula de independencia, $C(u, v) = uv$: los puntos llenan el cuadrado de manera pareja y el cuadrante $U \le 1/2,\ V \le 1/2$ recibe la cuarta parte de ellos.]{componente="CopulaViz"}
```yaml
modo: copula
familia: independiente
```
:::

:::nota[Qué significa cada símbolo]
- $U$, $V$: variables uniformes entre 0 y 1, los percentiles de $X$ y $Y$.
- $C(u, v)$: cópula, probabilidad de que $U \le u$ y $V \le v$.
- $F$, $G$: funciones de distribución de $X$ y $Y$.
- $\theta$: parámetro de una familia de cópulas; $\rho$: parámetro de la gaussiana.
- $\tau$: tau de Kendall, una correlación de rangos.
- $\min(u, v)$, $\max(u + v - 1, 0)$: cotas de Fréchet y Hoeffding.
:::

## Cómo usar la visualización

La animación simula pares $(U, V)$ de la cópula elegida. Los histogramas de los bordes se mantienen planos, porque cada coordenada es uniforme; toda la dependencia está en la forma de la nube. El encabezado estima $C(1/2, 1/2)$, la fracción de puntos en el cuadrante sombreado, y la compara con 0.25, el valor de independencia.

El selector cambia la familia y la deslizadera la fuerza de la dependencia, medida con la tau de Kendall para que todas las familias sean comparables. Con la misma tau, la gaussiana es simétrica, Clayton concentra los puntos en la esquina de abajo a la izquierda y Gumbel en la de arriba a la derecha.

## Ejemplo

La cópula de Clayton con parámetro $\theta = 2$ (tau de Kendall 0.5) es
$$
C(u, v) = \big(u^{-2} + v^{-2} - 1\big)^{-1/2}.
$$

1. $C(0.5, 0.5) = (4 + 4 - 1)^{-1/2} = 7^{-1/2} \approx 0.378$.
2. Con independencia sería $0.5 \cdot 0.5 = 0.25$, y con dependencia perfecta, $\min(0.5, 0.5) = 0.5$.
3. $P(V \le 0.5 \mid U \le 0.5) = 0.378 / 0.5 \approx 0.756$: si una variable está por debajo de su mediana, la otra lo está con probabilidad cercana a 3/4.

:::figura[La cópula de Clayton con tau 0.5: la nube se estrecha en la esquina inferior izquierda y la fracción de puntos en el cuadrante se acerca a 0.378.]{componente="CopulaViz"}
```yaml
modo: copula
familia: clayton
tau: 0.5
```
:::

## Propiedades

- **Cotas de Fréchet y Hoeffding:** $\max(u + v - 1,\ 0) \le C(u, v) \le \min(u, v)$; la cota superior corresponde a dependencia creciente perfecta y la inferior a decreciente perfecta.
- **Invariancia:** si $g$ y $h$ son crecientes, $(g(X), h(Y))$ tiene la misma cópula que $(X, Y)$.
- **Medidas de rangos:** la tau de Kendall y la correlación de Spearman dependen solo de la cópula, no de las marginales.
- **Independencia:** $X$ y $Y$ continuas son independientes si y solo si su cópula es $C(u, v) = uv$.
- **Familias:** la gaussiana y la de Frank son simétricas sin dependencia de colas; Clayton tiene dependencia en la cola inferior y Gumbel en la superior.

:::figura[La cópula de Frank con tau 0.7: la nube se ciñe a la diagonal de manera simétrica, sin amontonarse en ninguna de las dos esquinas.]{componente="CopulaViz"}
```yaml
modo: copula
familia: frank
tau: 0.7
```
:::

## Errores comunes

- **Reducir la dependencia a un número.** Dos cópulas con la misma tau de Kendall pueden comportarse de manera muy distinta en los extremos.
- **Confundir la cópula con la distribución conjunta.** La cópula no incluye las marginales; para recuperar la conjunta hay que combinarla con ellas.
- **Usar la cópula gaussiana por costumbre para riesgos extremos.** No tiene dependencia de colas: subestima la probabilidad de que dos pérdidas extremas ocurran juntas.

:::figura[La cópula de Gumbel con la misma tau 0.5 que la de Clayton: ahora los puntos se amontonan arriba a la derecha, aunque la fracción en el cuadrante inferior es parecida.]{componente="CopulaViz"}
```yaml
modo: copula
familia: gumbel
tau: 0.5
```
:::

## Conexiones

Una cópula es la [[distribucion-conjunta]] de los percentiles obtenidos con la [[transformada-integral-de-probabilidad]]. El [[teorema-de-sklar]] garantiza que toda distribución conjunta se descompone en marginales y cópula, y la [[dependencia-de-colas]] mide su comportamiento en las esquinas. La [[tau-de-kendall]] y la [[correlacion-de-spearman]] son medidas de dependencia que solo dependen de la cópula, a diferencia de la [[correlacion-de-pearson]].

## Formulario

:::formula[Cópula]
$$
C(u, v) = P(U \le u,\ V \le v), \qquad U, V \sim \mathrm{U}(0, 1)
$$

- Distribución conjunta con marginales uniformes.
:::

:::formula[Cotas de Fréchet y Hoeffding]
$$
\max(u + v - 1,\ 0) \le C(u, v) \le \min(u, v)
$$

- Dependencia decreciente y creciente perfectas.
:::

:::formula[Cópula de Clayton]
$$
C_\theta(u, v) = \big(u^{-\theta} + v^{-\theta} - 1\big)^{-1/\theta}, \qquad \tau = \frac{\theta}{\theta + 2}
$$

- $\theta > 0$: fuerza de la dependencia.
:::

:::formula[Independencia]
$$
C(u, v) = uv
$$

- Cópula de dos variables independientes.
:::
