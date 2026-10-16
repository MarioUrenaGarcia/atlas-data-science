---
id: metodo-de-la-cdf-para-transformaciones
titulo: Método de la función de distribución
titulo_en: CDF method for transformations
alias:
  - método de la CDF
  - método de la función de distribución acumulada
  - técnica de la función de distribución
modulo: 1
submodulo: '1.3'
orden: 26
nivel: intermedio
prerrequisitos:
  - transformaciones-de-variables-aleatorias
relaciones:
  - tipo: contrasta
    id: metodo-del-jacobiano-para-transformaciones
etiquetas:
  - función de distribución
  - transformación no monótona
  - conjunto de subnivel
  - derivar al final
resumen: >
  Para hallar la distribución de Y = g(X) se calcula P(g(X) ≤ y) como la probabilidad de que X caiga donde g(x) ≤ y, y se deriva para obtener la densidad. Funciona aunque g no sea monótona.
formula: 'F_Y(y) = P(g(X) \le y) = \int_{\{x \,:\, g(x) \le y\}} f_X(x)\,dx, \qquad f_Y(y) = F_Y''(y)'
visualizacion:
  componente: TransformationViz
  parametros:
    modo: cdf
    distribucion: exponencial
    parametros:
      lambda: 1
    transformacion: raiz
    y: 1
referencias:
  - clave: blitzstein-hwang
    capitulo: '8.1'
  - clave: degroot
    capitulo: '3.8'
publicado: true
---

## Intuición

La manera más segura de encontrar la distribución de $Y = g(X)$ es preguntar directamente lo que la función de distribución pregunta: ¿con qué probabilidad $Y$ no supera $y$? Como $Y = g(X)$, eso es lo mismo que preguntar con qué probabilidad $X$ cae en el conjunto de valores que $g$ manda por debajo de $y$. Ese conjunto se lee en la gráfica de $g$: son los $x$ donde la curva está debajo de la altura $y$.

Una vez identificado el conjunto, su probabilidad se calcula con la distribución de $X$, y se obtiene $F_Y(y)$ para cada $y$. Si se quiere la densidad, se deriva al final. El método no necesita que $g$ sea invertible ni derivable: si $g$ dobla la recta, como $x^2$, el conjunto es un intervalo simétrico; si es escalonada, el conjunto se arma con trozos.

## Definición

:::definicion[Método de la función de distribución]
Sea $X$ una variable continua con densidad $f_X$ y $Y = g(X)$. Para cada $y$:

1. Se determina el conjunto $A_y = \{x : g(x) \le y\}$.
2. Se calcula $F_Y(y) = P(X \in A_y) = \int_{A_y} f_X(x)\,dx$.
3. Si $F_Y$ es derivable, la densidad de $Y$ es $f_Y(y) = F_Y'(y)$.
:::

Cuando $g$ es creciente, $A_y = \{x \le g^{-1}(y)\}$ y $F_Y(y) = F_X(g^{-1}(y))$. Cuando es decreciente, $A_y = \{x \ge g^{-1}(y)\}$ y $F_Y(y) = 1 - F_X(g^{-1}(y))$ para $X$ continua.

:::figura[$X$ uniforme entre $-1$ y 1 y $Y = X^2$: el conjunto con $x^2 \le 0.25$ es el intervalo de $-0.5$ a 0.5, cuya probabilidad es 0.5. En general $F_Y(y) = \sqrt{y}$.]{componente="TransformationViz"}
```yaml
modo: cdf
distribucion: uniforme
parametros:
  a: -1
  b: 1
transformacion: cuadrado
y: 0.25
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable continua con densidad $f_X$ y función de distribución $F_X$.
- $g$: transformación; $Y = g(X)$.
- $y$: umbral en el que se evalúa $F_Y$.
- $A_y = \{x : g(x) \le y\}$: valores de $X$ que $g$ manda a lo más a $y$.
- $F_Y$, $f_Y$: función de distribución y densidad de $Y$.
- $\Phi$, $\phi$: función de distribución y densidad de la normal estándar.
- $U$: variable uniforme entre 0 y 1.
:::

## Cómo usar la visualización

Arriba a la izquierda está la curva $g(x) = \sqrt{x}$ con el umbral $y$ como línea punteada horizontal; la franja marca los $x$ con $\sqrt{x} \le y$, que son los $x \le y^2$. A la derecha, esa franja se sombrea bajo la densidad exponencial de $X$, y su área es $F_Y(y)$. Abajo se dibuja la función de distribución de $Y$ conforme el umbral avanza; el encabezado escribe el cálculo con los números actuales.

Con $y = 1$, el conjunto es $x \le 1$ y $F_Y(1) = 1 - e^{-1} \approx 0.632$. En general $F_Y(y) = 1 - e^{-y^2}$, la distribución de Rayleigh.

## Ejemplo

$X$ es normal estándar y $Y = X^2$.

1. Para $y > 0$, $A_y = \{x : x^2 \le y\} = [-\sqrt{y}, \sqrt{y}]$.
2. $F_Y(y) = \Phi(\sqrt{y}) - \Phi(-\sqrt{y}) = 2\Phi(\sqrt{y}) - 1$.
3. Derivando con la regla de la cadena: $f_Y(y) = 2\phi(\sqrt{y}) \cdot \dfrac{1}{2\sqrt{y}} = \dfrac{1}{\sqrt{2\pi y}}\, e^{-y/2}$.
4. Es la densidad chi-cuadrada con 1 grado de libertad. Por ejemplo, $F_Y(1) = 2\Phi(1) - 1 \approx 0.683$.

:::figura[El ejemplo: el cuadrado de una normal estándar no pasa de 2 cuando $X$ está entre $-1.41$ y 1.41, con probabilidad cerca de 0.843.]{componente="TransformationViz"}
```yaml
modo: cdf
distribucion: normal
transformacion: cuadrado
y: 2
```
:::

## Propiedades

- **Generalidad:** funciona con cualquier $g$ medible, monótona o no, derivable o no; solo hace falta poder describir $A_y$.
- **Monótonas crecientes:** $F_Y(y) = F_X(g^{-1}(y))$, y derivando se recupera la fórmula del jacobiano.
- **Máximos y mínimos:** para $M = \max(X_1, \dots, X_n)$ independientes, $\{M \le y\}$ es la intersección de los $\{X_i \le y\}$, y $F_M(y) = F_X(y)^n$.
- **Variables discretas o mixtas:** si $g$ es constante en un intervalo con probabilidad positiva, $Y$ tiene un átomo, y el método lo detecta como un salto de $F_Y$.

:::figura[El recíproco de una uniforme: $Y = 1/U$ no pasa de 2 cuando $U \ge 0.5$, así que $F_Y(2) = 0.5$. En general $F_Y(y) = 1 - 1/y$ para $y \ge 1$: una Pareto con cola pesada.]{componente="TransformationViz"}
```yaml
modo: cdf
distribucion: uniforme
parametros:
  a: 0
  b: 1
transformacion: reciproco
y: 2
```
:::

## Errores comunes

- **No invertir la desigualdad con funciones decrecientes.** Si $g$ decrece, $g(X) \le y$ equivale a $X \ge g^{-1}(y)$, y la probabilidad es la de la cola derecha.
- **Olvidar una parte del conjunto.** Con $g$ no monótona, $A_y$ puede tener varios intervalos; en $X^2$ hay que incluir los $x$ negativos.
- **Derivar mal la composición.** Al pasar de $F_Y$ a $f_Y$ hay que aplicar la regla de la cadena: aparece la derivada de $g^{-1}$.

:::figura[Una transformación decreciente: $Y = -\ln U$ no pasa de 1 cuando $U \ge e^{-1} \approx 0.368$, es decir, en la parte derecha del intervalo. $F_Y(1) = 1 - e^{-1} \approx 0.632$.]{componente="TransformationViz"}
```yaml
modo: cdf
distribucion: uniforme
parametros:
  a: 0
  b: 1
transformacion: logaritmo-negativo
y: 1
```
:::

## Conexiones

El método aplica la definición de [[funcion-de-distribucion-acumulada]] a una de las [[transformaciones-de-variables-aleatorias]], y deriva al final con la [[regla-de-la-cadena]]. Para $g$ monótona y diferenciable da el mismo resultado que el [[metodo-del-jacobiano-para-transformaciones]], que se salta el paso de la integral. Aplicado a $Y = F_X(X)$ demuestra la [[transformada-integral-de-probabilidad]]. El ejemplo de $X^2$ es el punto de partida de la distribución chi-cuadrada.

## Formulario

:::formula[Método general]
$$
F_Y(y) = P\big(X \in \{x : g(x) \le y\}\big), \qquad f_Y(y) = F_Y'(y)
$$

- Se describe el conjunto y luego se deriva.
:::

:::formula[g creciente y g decreciente]
$$
F_Y(y) = F_X\big(g^{-1}(y)\big), \qquad F_Y(y) = 1 - F_X\big(g^{-1}(y)\big)
$$

- La segunda, para $X$ continua.
:::

:::formula[Cuadrado de una variable continua]
$$
F_{X^2}(y) = F_X(\sqrt{y}) - F_X(-\sqrt{y}), \qquad y > 0
$$

- Con $X$ normal estándar da una chi-cuadrada con 1 grado de libertad.
:::

:::formula[Máximo de independientes]
$$
F_{\max(X_1, \dots, X_n)}(y) = F_X(y)^n
$$

- Las $X_i$ independientes con la misma distribución.
:::
