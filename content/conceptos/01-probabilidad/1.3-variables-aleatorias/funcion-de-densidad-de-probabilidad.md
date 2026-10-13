---
id: funcion-de-densidad-de-probabilidad
titulo: Función de densidad de probabilidad
titulo_en: Probability density function
alias:
  - densidad
  - fdp
  - pdf
modulo: 1
submodulo: '1.3'
orden: 4
nivel: basico
prerrequisitos:
  - variables-discretas-vs-continuas
  - integral-definida-como-area
relaciones:
  - tipo: contrasta
    id: funcion-de-masa-de-probabilidad
  - tipo: relacionado
    id: teorema-fundamental-del-calculo
etiquetas:
  - distribución continua
  - área bajo la curva
  - probabilidad por unidad de longitud
  - normalización
resumen: >
  La densidad de una variable continua es una función no negativa cuya área entre dos puntos es la
  probabilidad de caer en ese intervalo. Su altura no es una probabilidad sino una probabilidad por
  unidad de longitud, y puede ser mayor que 1.
formula: 'P(a \le X \le b) = \int_a^b f_X(x)\,dx, \qquad \int_{-\infty}^{\infty} f_X(x)\,dx = 1'
visualizacion:
  componente: DistributionExplorer
  parametros:
    distribucion: normal
    valores:
      mu: 0
      sigma: 1
    desde: -1
    hasta: 1
referencias:
  - clave: blitzstein-hwang
    capitulo: '5.1'
  - clave: ross-probabilidad
    capitulo: '5.1'
publicado: true
---

## Intuición

En una variable continua cada punto tiene probabilidad 0, así que no se puede hacer una tabla de valores y probabilidades. Lo que sí se puede decir es en qué zonas la probabilidad está más concentrada. La **densidad** cumple ese papel, igual que la densidad de población dice dónde vive más gente sin que ningún punto exacto del mapa tenga habitantes.

La probabilidad de un intervalo es el **área** bajo la densidad sobre ese intervalo. Si la densidad es alta en una zona, intervalos pequeños de esa zona ya acumulan mucha probabilidad. Para una franja muy angosta de ancho $\Delta x$ alrededor de $x$,
$$
P(x \le X \le x + \Delta x) \approx f(x)\,\Delta x,
$$
de modo que $f(x)$ es probabilidad por unidad de longitud. Por eso puede valer 3 o 50: lo único que debe valer 1 es el área total.

## Definición

:::definicion[Función de densidad de probabilidad]
Una variable aleatoria $X$ es continua con **densidad** $f_X$ si $f_X(x) \ge 0$ para todo $x$ y, para todos $a \le b$,
$$
P(a \le X \le b) = \int_a^b f_X(x)\,dx.
$$
En particular,
$$
\int_{-\infty}^{\infty} f_X(x)\,dx = 1.
$$
:::

Toda función no negativa con área total 1 es la densidad de alguna variable aleatoria. La densidad no es única: cambiarla en puntos aislados no altera ninguna integral, y por eso se elige la versión más regular.

:::figura[El área a la izquierda de $x$ bajo la densidad normal estándar es la altura de la función de distribución en $x$; al mover $x$ se ve que una curva es la acumulación de la otra.]{componente="RandomVariableLab"}
```yaml
modo: acumulada
distribucion: normal
x: 1
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria continua.
- $f_X(x)$: densidad de $X$ en $x$; se escribe $f(x)$ si no hay ambigüedad.
- $a$, $b$: extremos de un intervalo.
- $\Delta x$: ancho de una franja angosta.
- $F_X(x) = P(X \le x)$: función de distribución.
- $F_X'(x)$: derivada de la función de distribución.
:::

## Cómo usar la visualización

La gráfica muestra la densidad normal estándar con el intervalo de $-1$ a $1$ sombreado; su área, cerca de 0.683, aparece en el panel. Los controles cambian la media y la desviación estándar: al reducir la desviación la curva se vuelve más alta y angosta, porque el área total debe seguir siendo 1.

Los extremos del intervalo sombreado se ajustan desde el panel. La vista acumulada cambia la densidad por la función de distribución, donde la misma probabilidad se lee como una diferencia de alturas.

## Ejemplo

La proporción $X$ de un tanque que se llena en un día tiene densidad $f(x) = 2x$ para $0 \le x \le 1$ y 0 fuera de ese intervalo.

1. Es una densidad: $f \ge 0$ y $\int_0^1 2x\,dx = [x^2]_0^1 = 1$.
2. Probabilidad de llenar a lo más la mitad: $P(X \le 0.5) = \int_0^{0.5} 2x\,dx = 0.25$.
3. Probabilidad de llenar más de la mitad: $1 - 0.25 = 0.75$.
4. Cerca de $x = 0.9$, una franja de ancho 0.01 tiene probabilidad aproximada $f(0.9) \cdot 0.01 = 0.018$; cerca de $x = 0.1$, solo $0.002$.

La densidad crece con $x$: los llenados altos son más probables. Su altura máxima es 2, mayor que 1, sin contradicción alguna.

:::figura[La densidad del ejemplo es una beta con parámetros 2 y 1: una recta que sube de 0 a 2. El área sombreada, de 0 a 0.5, vale 0.25.]{componente="DistributionExplorer"}
```yaml
distribucion: beta
valores:
  a: 2
  b: 1
fijos: [a, b]
desde: 0
hasta: 0.5
```
:::

## Propiedades

- **Relación con la función de distribución:** $F_X(x) = \int_{-\infty}^{x} f_X(t)\,dt$, y donde $f_X$ es continua, $F_X'(x) = f_X(x)$ por el teorema fundamental del cálculo.
- **Cambio de escala:** si $Y = cX$ con $c > 0$, entonces $f_Y(y) = f_X(y / c) / c$; al estirar los valores, la densidad baja en la misma proporción.
- **Altura sin cota:** una densidad puede tomar valores arbitrariamente grandes, e incluso no estar acotada, siempre que el área total sea 1.
- **Moda:** el punto donde la densidad es máxima es la zona de valores más concentrada, aunque ningún valor tenga probabilidad positiva.

:::figura[Una densidad sin cota: la beta con parámetros 1/2 y 1/2 tiende a infinito cerca de 0 y de 1, pero el área total sigue siendo 1.]{componente="DistributionExplorer"}
```yaml
distribucion: beta
valores:
  a: 0.5
  b: 0.5
fijos: [a, b]
desde: 0.4
hasta: 0.6
```
:::

:::figura[Estirar los valores baja la densidad: la normal con desviación estándar 2 es la mitad de alta que la estándar, que aparece como referencia.]{componente="DistributionExplorer"}
```yaml
distribucion: normal
valores:
  mu: 0
  sigma: 2
desde: -2
hasta: 2
referencia:
  distribucion: normal
  valores:
    mu: 0
    sigma: 1
  etiqueta: Normal estándar
```
:::

## Errores comunes

- **Leer la altura como probabilidad.** $f(0.9) = 1.8$ no es una probabilidad; la probabilidad está en las áreas.
- **Pensar que una densidad no puede pasar de 1.** La uniforme en un intervalo de longitud 0.1 tiene altura 10.
- **Olvidar el soporte.** Una fórmula como $2x$ solo es densidad si se aclara que vale 0 fuera de $[0, 1]$; sin esa restricción su área sería infinita.

:::figura[Una densidad de altura 10: la uniforme entre 0 y 0.1 concentra toda la probabilidad en un intervalo corto, y por eso su altura es 10.]{componente="DistributionExplorer"}
```yaml
distribucion: uniforme
valores:
  a: 0
  b: 0.1
fijos: [a, b]
desde: 0.02
hasta: 0.05
```
:::

## Conexiones

La densidad describe una [[variable-aleatoria]] continua del mismo modo que la [[funcion-de-masa-de-probabilidad]] describe una discreta (ver [[variables-discretas-vs-continuas]]). Integrándola se obtiene la [[funcion-de-distribucion-acumulada]], y derivando esta se recupera la densidad, por el [[teorema-fundamental-del-calculo]]. Las probabilidades son áreas en el sentido de la [[integral-definida-como-area]]. La [[esperanza-matematica]] de una variable continua es $\int x f(x)\,dx$, y el [[metodo-del-jacobiano-para-transformaciones]] dice cómo cambia la densidad al transformar la variable.

## Formulario

:::formula[Definición]
$$
P(a \le X \le b) = \int_a^b f_X(x)\,dx, \qquad f_X \ge 0, \qquad \int_{-\infty}^{\infty} f_X(x)\,dx = 1
$$

- Las probabilidades son áreas bajo la densidad.
:::

:::formula[Relación con la función de distribución]
$$
F_X(x) = \int_{-\infty}^{x} f_X(t)\,dt, \qquad f_X(x) = F_X'(x)
$$

- La derivada vale donde $f_X$ es continua.
:::

:::formula[Franja angosta]
$$
P(x \le X \le x + \Delta x) \approx f_X(x)\,\Delta x
$$

- $f_X(x)$ es probabilidad por unidad de longitud.
:::
