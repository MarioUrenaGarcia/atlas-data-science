---
id: transformaciones-de-variables-aleatorias
titulo: Transformaciones de variables aleatorias
titulo_en: Transformations of random variables
alias:
  - función de una variable aleatoria
  - distribución de g(X)
  - cambio de variable
modulo: 1
submodulo: '1.3'
orden: 25
nivel: intermedio
prerrequisitos:
  - funcion-de-distribucion-acumulada
  - ley-del-estadistico-inconsciente
relaciones:
  - tipo: relacionado
    id: metodo-de-la-cdf-para-transformaciones
  - tipo: relacionado
    id: metodo-del-jacobiano-para-transformaciones
etiquetas:
  - transformación
  - distribución de una función
  - cambio de unidades
  - funciones monótonas
resumen: >
  Si X es una variable aleatoria y g una función, Y = g(X) es otra variable aleatoria. Su distribución se obtiene trasladando la probabilidad de X: sumando masas en el caso discreto, o con la CDF o el jacobiano.
formula: 'P(Y \in B) = P(g(X) \in B) = P\big(X \in g^{-1}(B)\big)'
visualizacion:
  componente: TransformationViz
  parametros:
    modo: cdf
    distribucion: normal
    transformacion: cuadrado
    y: 1
referencias:
  - clave: blitzstein-hwang
    capitulo: '8.1'
  - clave: ross-probabilidad
    capitulo: '5.7'
publicado: true
---

## Intuición

Muchas variables de interés son funciones de otras. Un cambio de unidades convierte grados Celsius en Fahrenheit; el área de un círculo es $\pi R^2$ si el radio $R$ es aleatorio; la energía cinética depende del cuadrado de la velocidad; el rendimiento logarítmico de una acción es el logaritmo de un cociente de precios. En todos los casos se conoce la distribución de $X$ y se quiere la de $Y = g(X)$.

La idea es siempre la misma: $Y$ cae en un conjunto $B$ exactamente cuando $X$ cae en el conjunto de valores que $g$ manda a $B$. La probabilidad no se crea ni se destruye, solo se traslada. Si $g$ junta varios valores en uno, sus probabilidades se suman; si $g$ estira una región, la misma probabilidad se reparte en más espacio y la densidad baja; si la comprime, la densidad sube.

## Definición

:::definicion[Distribución de una transformación]
Sea $X$ una variable aleatoria y $g$ una función. La variable $Y = g(X)$ tiene distribución
$$
P(Y \in B) = P\big(X \in g^{-1}(B)\big), \qquad g^{-1}(B) = \{x : g(x) \in B\}.
$$
Si $X$ es discreta, $p_Y(y) = \sum_{x \,:\, g(x) = y} p_X(x)$. Si $X$ es continua, la función de distribución de $Y$ es
$$
F_Y(y) = P(g(X) \le y) = P\big(X \in \{x : g(x) \le y\}\big).
$$
:::

En el caso continuo hay dos métodos: calcular $F_Y$ con la fórmula anterior y derivar (método de la función de distribución), o usar directamente la fórmula del cambio de variable cuando $g$ es diferenciable e invertible por tramos (método del jacobiano).

:::figura[Una transformación discreta que junta valores: la distancia de la cara de un dado al centro 3.5 manda las caras 3 y 4 al 0.5, las caras 2 y 5 al 1.5 y las caras 1 y 6 al 2.5, cada valor con probabilidad 1/3.]{componente="RandomVariableLab"}
```yaml
modo: lotus
experimento: dado
variable: valor
funcion: abs-centro
c: 3.5
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable original, con distribución conocida.
- $g$: función que transforma los valores.
- $Y = g(X)$: variable transformada.
- $B$: conjunto de valores de $Y$.
- $g^{-1}(B)$: preimagen, los $x$ que $g$ manda a $B$.
- $p_X$, $p_Y$: funciones de masa; $F_Y$: función de distribución de $Y$.
- $f_X$, $f_Y$: densidades.
- $U$: variable uniforme entre 0 y 1.
:::

## Cómo usar la visualización

Arriba a la izquierda está la parábola $g(x) = x^2$ con un umbral $y$ punteado; las franjas marcan los $x$ con $g(x) \le y$, que forman el intervalo entre $-\sqrt{y}$ y $\sqrt{y}$. A la derecha, esas mismas $x$ se sombrean bajo la densidad normal de $X$: el área sombreada es $F_Y(y)$. Abajo se traza la función de distribución de $Y = X^2$ conforme el umbral avanza.

La deslizadera mueve el umbral. Con $y = 1$, el área entre $-1$ y 1 es cerca de 0.683: la probabilidad de que el cuadrado de una normal estándar no pase de 1.

## Ejemplo

Sea $U$ uniforme entre 0 y 1 y $Y = -\ln U$.

1. $g(u) = -\ln u$ es decreciente y manda $(0, 1)$ a $(0, \infty)$.
2. Para $y > 0$: $F_Y(y) = P(-\ln U \le y) = P(U \ge e^{-y}) = 1 - e^{-y}$.
3. Derivando, $f_Y(y) = e^{-y}$: $Y$ es exponencial con media 1.
4. La transformación estira el intervalo cercano a 0 (donde $\ln u$ cambia muy rápido), y por eso la densidad de $Y$ baja hacia la derecha.

:::figura[El ejemplo: una franja angosta de la uniforme se lleva a una franja de $Y = -\ln U$ con la misma probabilidad. El histograma simulado de $Y$ sigue la densidad exponencial.]{componente="TransformationViz"}
```yaml
modo: jacobiano
distribucion: uniforme
parametros:
  a: 0
  b: 1
transformacion: logaritmo-negativo
```
:::

## Propiedades

- **Transformaciones afines:** si $Y = aX + b$ con $a \ne 0$, $F_Y(y) = F_X((y - b)/a)$ para $a > 0$ y $f_Y(y) = f_X((y - b)/a) / |a|$. La forma no cambia, solo la posición y la escala.
- **Monótonas:** si $g$ es creciente, $F_Y(y) = F_X(g^{-1}(y))$ y los cuantiles se transforman igual: $Q_Y(p) = g(Q_X(p))$.
- **No inyectivas:** si varios $x$ van al mismo $y$, se suman sus contribuciones; por ejemplo, $X^2$ junta $x$ y $-x$.
- **Esperanza sin distribución:** para $\mathbb{E}[g(X)]$ no hace falta la distribución de $Y$; basta la ley del estadístico inconsciente.

:::figura[Una transformación afín de la normal estándar: $Y = 2X + 1$ es normal con media 1 y desviación estándar 2. La franja de $X$ se estira al doble y su densidad baja a la mitad.]{componente="TransformationViz"}
```yaml
modo: jacobiano
distribucion: normal
transformacion: lineal
a: 2
b: 1
```
:::

## Errores comunes

- **Sustituir sin el factor de escala.** $f_Y(y) = f_X(g^{-1}(y))$ es falso en general; falta el factor $|dx/dy|$ que compensa el estiramiento.
- **Olvidar ramas.** Para $Y = X^2$ con $X$ simétrica hay que sumar la contribución de $\sqrt{y}$ y la de $-\sqrt{y}$.
- **Calcular $g(\mathbb{E}[X])$ creyendo obtener $\mathbb{E}[Y]$.** Solo coinciden para $g$ lineal.

:::figura[El cuadrado de una uniforme: $Y = U^2$ comprime los valores cercanos a 0, y su densidad $1/(2\sqrt{y})$ crece sin límite cerca de 0, aunque la de $U$ es plana.]{componente="TransformationViz"}
```yaml
modo: jacobiano
distribucion: uniforme
parametros:
  a: 0
  b: 1
transformacion: cuadrado
```
:::

## Conexiones

La distribución de $g(X)$ se obtiene a partir de la [[funcion-de-distribucion-acumulada]] con el [[metodo-de-la-cdf-para-transformaciones]], o con la densidad y el [[metodo-del-jacobiano-para-transformaciones]], que usa la [[regla-de-la-cadena]]. Si solo se necesita la media, basta la [[ley-del-estadistico-inconsciente]]. Dos transformaciones especiales unen cualquier distribución con la uniforme: la [[transformada-integral-de-probabilidad]] y el [[muestreo-por-transformada-inversa]]. El [[teorema-del-mapeo-continuo]] dice que las transformaciones continuas preservan la convergencia.

## Formulario

:::formula[Regla general]
$$
P(g(X) \in B) = P\big(X \in g^{-1}(B)\big)
$$

- La probabilidad se traslada sin cambiar.
:::

:::formula[Caso discreto]
$$
p_Y(y) = \sum_{x \,:\, g(x) = y} p_X(x)
$$

- Se suman las masas que van al mismo valor.
:::

:::formula[Función de distribución]
$$
F_Y(y) = P\big(X \in \{x : g(x) \le y\}\big)
$$

- Base del método de la función de distribución.
:::

:::formula[Transformación afín]
$$
f_{aX+b}(y) = \frac{1}{|a|}\, f_X\!\left(\frac{y - b}{a}\right)
$$

- $a \ne 0$.
:::
