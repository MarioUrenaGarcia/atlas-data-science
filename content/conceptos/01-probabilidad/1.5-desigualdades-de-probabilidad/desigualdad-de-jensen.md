---
id: desigualdad-de-jensen
titulo: Desigualdad de Jensen
titulo_en: Jensen's inequality
alias:
  - cota de Jensen
  - brecha de Jensen
modulo: 1
submodulo: '1.5'
orden: 4
nivel: intermedio
prerrequisitos:
  - ley-del-estadistico-inconsciente
  - funciones-convexas-y-concavas
relaciones:
  - tipo: relacionado
    id: desigualdad-entre-medias
etiquetas:
  - función convexa
  - función cóncava
  - promedio de la función
  - función del promedio
resumen: >
  Para una función convexa, la media de la función es mayor o igual que la función de la media:
  E[g(X)] ≥ g(E[X]). Con funciones cóncavas la desigualdad se invierte. Explica por qué promediar
  y transformar no conmutan.
formula: 'g \text{ convexa} \ \Rightarrow\ \mathbb{E}[g(X)] \ge g\big(\mathbb{E}[X]\big)'
visualizacion:
  componente: InequalityBound
  parametros:
    modo: jensen
    funcion: cuadrado
    valores: [1, 2, 3, 4, 5, 6]
referencias:
  - clave: blitzstein-hwang
    capitulo: '10.1'
  - clave: cover-thomas
    capitulo: '2.6'
publicado: true
---

## Intuición

En la gráfica de una función convexa, cualquier segmento que une dos puntos de la curva queda por encima de ella. Un promedio ponderado de puntos de la curva es un punto de ese segmento (o, con más puntos, de la figura que encierran), así que también queda por encima. Si los puntos son $(x, g(x))$ para los valores de una variable aleatoria, ponderados por sus probabilidades, su promedio es $(\mathbb{E}[X],\ \mathbb{E}[g(X)])$, y el punto de la curva en la misma abscisa es $(\mathbb{E}[X],\ g(\mathbb{E}[X]))$. De ahí la **desigualdad de Jensen**: $\mathbb{E}[g(X)] \ge g(\mathbb{E}[X])$.

Tiene consecuencias por todas partes. La media de los cuadrados supera al cuadrado de la media (por eso la varianza es no negativa). El rendimiento medio de una inversión no es su rendimiento de largo plazo. La entropía y la divergencia de Kullback y Leibler son no negativas.

## Definición

:::teorema[Desigualdad de Jensen]
Si $g$ es convexa en un intervalo que contiene los valores de $X$ y $\mathbb{E}|X|$ y $\mathbb{E}|g(X)|$ son finitos, entonces
$$
\mathbb{E}[g(X)] \ge g\big(\mathbb{E}[X]\big).
$$
Si $g$ es cóncava, la desigualdad se invierte. Si $g$ es estrictamente convexa, hay igualdad solo cuando $X$ es constante con probabilidad 1.
:::

La prueba usa una recta de apoyo: para $g$ convexa existe $m$ tal que $g(x) \ge g(\mu) + m(x - \mu)$ para todo $x$, con $\mu = \mathbb{E}[X]$. Tomando esperanzas, el término $m(X - \mu)$ desaparece.

:::figura[Una función cóncava: con $g(x) = \log x$ y $X$ uniforme en 1, 2, 4 y 8, el promedio de los logaritmos es 1.04, menor que el logaritmo del promedio, $\log 3.75 = 1.32$.]{componente="InequalityBound"}
```yaml
modo: jensen
funcion: logaritmo
valores: [1, 2, 4, 8]
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria con media $\mu = \mathbb{E}[X]$.
- $g$: función convexa o cóncava.
- $\mathbb{E}[g(X)]$: media de la función; $g(\mathbb{E}[X])$: función de la media.
- $m$: pendiente de una recta de apoyo de $g$ en $\mu$.
- $R$: factor de crecimiento de una inversión en un año.
- $\operatorname{Var}(X)$: varianza; $M_X(t) = \mathbb{E}[e^{tX}]$: función generadora de momentos, con $t$ real.
- $r$, $s$: órdenes de momentos, con $0 < r < s$.
:::

## Cómo usar la visualización

Los puntos sobre la parábola $g(x) = x^2$ son las caras de un dado, todas del mismo tamaño porque tienen la misma probabilidad. La animación los suma uno por uno y el punto del promedio ponderado se mueve; al final queda en $(3.5,\ 15.17)$, por encima del punto de la curva $(3.5,\ 12.25)$. El segmento entre ambos es la brecha de Jensen, que en este caso es la varianza, 2.92.

El selector cambia la función. Con la exponencial la brecha crece mucho; con la raíz o el logaritmo, que son cóncavas, el promedio queda por debajo de la curva.

## Ejemplo

Una inversión multiplica su valor por $R = 1.5$ o por $R = 0.6$ cada año, con probabilidad 1/2 cada uno, de manera independiente.

1. El factor medio es $\mathbb{E}[R] = (1.5 + 0.6)/2 = 1.05$: en promedio, un 5 % de ganancia anual.
2. Pero el crecimiento de largo plazo lo da la media del logaritmo: $\mathbb{E}[\log R] = (\log 1.5 + \log 0.6)/2 = (0.405 - 0.511)/2 = -0.053$.
3. Por Jensen con el logaritmo, cóncavo, $\mathbb{E}[\log R] \le \log \mathbb{E}[R] = 0.049$; aquí la media del logaritmo incluso es negativa.
4. Tras muchos años, el capital típico se multiplica por cerca de $e^{-0.053} \approx 0.95$ por año: disminuye, aunque la media del factor sea mayor que 1.

:::figura[El ejemplo de la inversión: los dos factores sobre la curva del logaritmo. Su promedio, a la altura $-0.053$, queda por debajo de $\log 1.05 = 0.049$.]{componente="InequalityBound"}
```yaml
modo: jensen
funcion: logaritmo
valores: [0.6, 1.5]
```
:::

## Propiedades

- **Varianza:** con $g(x) = x^2$, $\mathbb{E}[X^2] \ge (\mathbb{E}[X])^2$, y la brecha es $\operatorname{Var}(X)$.
- **Desigualdad entre medias:** con $g = \log$, la media geométrica es menor o igual que la aritmética.
- **Funciones generadoras:** con $g(x) = e^{tx}$, $M_X(t) \ge e^{t\mathbb{E}[X]}$.
- **Teoría de la información:** con $g = -\log$ se prueba que la divergencia de Kullback y Leibler es no negativa.
- **Momentos:** $\big(\mathbb{E}|X|^r\big)^{1/r}$ crece con $r$, porque $x \mapsto x^{s/r}$ es convexa para $s > r$.

:::figura[La exponencial sobre valores entre $-1$ y 2: la media de $e^X$ supera claramente a $e^{\mathbb{E}[X]}$, porque la curva se dobla mucho hacia arriba en los valores grandes.]{componente="InequalityBound"}
```yaml
modo: jensen
funcion: exponencial
valores: [-1, 0, 1, 2]
probabilidades: [1, 2, 2, 1]
```
:::

## Errores comunes

- **Equivocar la dirección.** Para convexas la media de la función es mayor; para cóncavas, menor. Un dibujo de la curva con dos puntos lo aclara.
- **Aplicarla a funciones que no son convexas ni cóncavas.** Con $g(x) = x^3$ en una variable que toma valores positivos y negativos, la desigualdad puede ir en cualquier sentido.
- **Calcular $g(\mathbb{E}[X])$ creyendo obtener $\mathbb{E}[g(X)]$.** Es el error más común al transformar promedios: el promedio del cuadrado no es el cuadrado del promedio.

:::figura[El valor absoluto es convexo aunque tenga un pico: con valores $-2$, $-1$, 1 y 3, el promedio de $|X|$ es 1.75 y el valor absoluto del promedio es solo 0.25.]{componente="InequalityBound"}
```yaml
modo: jensen
funcion: valor-absoluto
valores: [-2, -1, 1, 3]
```
:::

## Conexiones

La desigualdad de Jensen compara la [[ley-del-estadistico-inconsciente]] con evaluar la función en la media, y depende de las [[funciones-convexas-y-concavas]]. Con $g(x) = x^2$ explica que la [[varianza]] sea no negativa, y con el logaritmo da la [[desigualdad-entre-medias]]. Es la herramienta que prueba que la [[funcion-generadora-de-momentos]] crece como $e^{t\mu}$ al menos, y la que da el orden de los momentos de Lyapunov, $(\mathbb{E}|X|^r)^{1/r} \le (\mathbb{E}|X|^s)^{1/s}$ para $r < s$. La [[desigualdad-de-holder]] y la [[desigualdad-de-cauchy-schwarz]] acotan, en cambio, la esperanza de un producto.

## Formulario

:::formula[Desigualdad de Jensen]
$$
g \text{ convexa} \ \Rightarrow\ \mathbb{E}[g(X)] \ge g\big(\mathbb{E}[X]\big)
$$

- $X$: variable aleatoria con $\mathbb{E}|X|$ finito; $\mathbb{E}$: esperanza.
- $g$: función convexa en un intervalo que contiene los valores de $X$, con $\mathbb{E}|g(X)|$ finito.
- Con $g$ cóncava la desigualdad se invierte.
:::

:::formula[Recta de apoyo]
$$
g(x) \ge g(\mu) + m\,(x - \mu)
$$

- $\mu = \mathbb{E}[X]$: media de $X$; $x$: cualquier punto del intervalo.
- $m$: pendiente de una recta que toca a $g$ en $\mu$ y queda debajo de su gráfica.
:::

:::formula[Caso cuadrático]
$$
\mathbb{E}[X^2] - (\mathbb{E}[X])^2 = \operatorname{Var}(X) \ge 0
$$

- $\operatorname{Var}(X)$: varianza de $X$, que es la brecha de Jensen para $g(x) = x^2$.
:::

:::formula[Logaritmo]
$$
\mathbb{E}[\log X] \le \log \mathbb{E}[X]
$$

- $X > 0$; $\log$: logaritmo natural, cóncavo.
- Da la desigualdad entre la media geométrica y la aritmética.
:::

:::formula[Función generadora de momentos]
$$
M_X(t) = \mathbb{E}\big[e^{tX}\big] \ge e^{t\,\mathbb{E}[X]}
$$

- $t$: número real donde $M_X(t)$ es finita; $e^{tx}$ es convexa en $x$.
:::

:::formula[Orden de los momentos]
$$
\big(\mathbb{E}|X|^r\big)^{1/r} \le \big(\mathbb{E}|X|^s\big)^{1/s}, \qquad 0 < r < s
$$

- $r$, $s$: órdenes de los momentos; se obtiene con la función convexa $y \mapsto y^{s/r}$ aplicada a $|X|^r$.
:::
