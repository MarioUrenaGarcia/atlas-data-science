---
id: cuando-el-tcl-falla
titulo: Cuando el TCL falla (Cauchy y varianza infinita)
titulo_en: When the central limit theorem fails
alias:
  - falla del teorema central del límite
  - colas pesadas y TCL
  - TCL generalizado
modulo: 3
submodulo: '3.1'
orden: 14
nivel: intermedio
prerrequisitos:
  - teorema-central-del-limite
etiquetas:
  - colas pesadas
  - distribución de Cauchy
  - varianza infinita
  - distribuciones estables
resumen: >
  Sin varianza finita el teorema central del límite no aplica: la media de datos Cauchy no se concentra
  y, con varianza infinita, unas pocas observaciones enormes dominan la suma y el límite no es normal.
formula: 'X_i \sim \operatorname{Cauchy}(0, 1) \ \Rightarrow\ \bar{X}_n \sim \operatorname{Cauchy}(0, 1)\ \ \forall n; \qquad P(X > x) \sim c\,x^{-\alpha},\ 0 < \alpha < 2 \ \Rightarrow\ \frac{S_n - b_n}{n^{1/\alpha}} \xrightarrow{d} \text{estable}(\alpha)'
visualizacion:
  componente: CentralLimit
  parametros:
    modo: falla
    poblacion: cauchy
    poblaciones:
      - cauchy
      - pareto
      - exponencial
    n: 50
referencias:
  - clave: durrett
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una plataforma de comercio electrónico quiere estimar el ingreso promedio por cliente. La mayoría compra poco, pero de vez en cuando un cliente corporativo hace un pedido gigantesco. Si la distribución de compras tiene colas suficientemente pesadas, el promedio de mil clientes puede depender casi por completo de uno solo de ellos, y el histograma de promedios de muchas muestras no tiene forma de campana: es asimétrico y salta con cada cliente extraordinario.

El teorema central del límite necesita varianza finita: que los valores enormes sean tan raros que, al sumar, ninguno pese más que el conjunto. Cuando la varianza es infinita esa compensación no ocurre. El caso extremo es la distribución de Cauchy, sin media: el promedio de cien observaciones tiene exactamente la misma distribución que una sola, así que promediar no reduce la incertidumbre en absoluto. Entre ambos extremos están las distribuciones con media finita y varianza infinita, como la Pareto de índice 1.5: el promedio sí converge, pero las fluctuaciones son de un orden mayor que $1/\sqrt{n}$ y, normalizadas, siguen una ley estable que no es normal.

## Definición

El teorema central del límite falla en dos situaciones típicas:

:::definicion[Sin media: Cauchy]
Si $X_1, \dots, X_n$ son independientes con distribución $\operatorname{Cauchy}(0, 1)$, de densidad $f(x) = \frac{1}{\pi(1 + x^2)}$, entonces para todo $n$
$$
\bar{X}_n = \frac{1}{n}\sum_{i=1}^n X_i \sim \operatorname{Cauchy}(0, 1).
$$
La media no se concentra, ninguna normalización la vuelve normal y la ley de los grandes números no aplica.
:::

:::definicion[Varianza infinita: colas de tipo potencia]
Si $P(|X| > x) \sim c\,x^{-\alpha}$ con $0 < \alpha < 2$ (y las colas izquierda y derecha guardan proporciones fijas), entonces existen constantes $b_n$ tales que
$$
\frac{S_n - b_n}{n^{1/\alpha}} \xrightarrow{d} Y_\alpha,
$$
donde $Y_\alpha$ tiene una **distribución estable** de índice $\alpha$, que no es normal. Si $1 < \alpha < 2$ la media existe y se puede tomar $b_n = n\mu$.
:::

En ambos casos la suma está dominada por sus términos más grandes: el cociente $\max_i |X_i| / \sum_i |X_i|$ no tiende a cero.

:::nota[Qué significa cada símbolo]
- $X_i$: observaciones independientes con la misma distribución.
- $\operatorname{Cauchy}(0, 1)$: distribución de Cauchy estándar, con densidad $\frac{1}{\pi(1 + x^2)}$.
- $\bar{X}_n$: media muestral; $S_n = \sum X_i$, la suma.
- $\alpha$: índice de cola; cuanto menor, más pesada la cola. Si $\alpha < 2$ la varianza es infinita; si $\alpha \le 1$, también la media.
- $c$: constante de la cola.
- $b_n$: constantes de centrado.
- $n^{1/\alpha}$: escala de las fluctuaciones, mayor que $\sqrt{n}$ cuando $\alpha < 2$.
- $Y_\alpha$: variable con distribución estable de índice $\alpha$.
:::

## Cómo usar la visualización

Cada paso toma una muestra de tamaño $n$ y agrega su media al histograma superior; el inferior acumula, para cada muestra, la fracción de la suma de valores absolutos que aporta la observación más grande. El panel compara el rango intercuartílico de las medias con lo que se esperaría sin colas pesadas.

Con la Cauchy el histograma coincide con la densidad de Cauchy para cualquier $n$ y el rango intercuartílico se queda cerca de 2, el de una sola observación. Con la exponencial, como contraste, el histograma se estrecha alrededor de 1 y el peso del mayor término se acerca a $1/n$. Con la Pareto de índice 1.5 las medias se agrupan cerca de 3 pero con una cola derecha larga, y el peso del mayor término se mantiene alto.

## Ejemplo

Los montos de compra de una plataforma siguen una Pareto con mínimo 1 y índice $\alpha = 1.5$ (en miles de pesos): $P(X > x) = x^{-1.5}$ para $x \ge 1$.

1. Media: $\mathbb{E}[X] = \frac{\alpha}{\alpha - 1} = 3$. Varianza: infinita, porque $\alpha < 2$.
2. Probabilidad de una compra mayor que 100: $100^{-1.5} = 0.001$. Entre $n = 1000$ clientes, la probabilidad de que al menos uno supere 100 es $1 - 0.999^{1000} = 0.632$.
3. Probabilidad de que alguno supere 1000: $1 - (1 - 1000^{-1.5})^{1000} = 0.031$. Una sola de esas compras equivale a un tercio de la suma esperada de los mil, que es 3000.
4. Las fluctuaciones de la suma alrededor de 3000 son de orden $n^{1/\alpha} = 1000^{2/3} = 100$, no de orden $\sqrt{n} = 31.6$, y su distribución es estable con índice 1.5, asimétrica hacia la derecha.
5. Un intervalo de confianza normal para el ingreso medio, construido con la desviación estándar muestral, tendrá cobertura menor que la nominal.

:::figura[El ejemplo de las compras: medias de muestras Pareto con índice 1.5. Se concentran cerca de 3, pero con una cola larga a la derecha que no es normal.]{componente="CentralLimit"}
```yaml
modo: falla
poblacion: pareto
n: 1000
```
:::

## Propiedades

- **Estabilidad de la Cauchy:** si $X_i \sim \operatorname{Cauchy}(0, 1)$ independientes y $\sum a_i = 1$ con $a_i \ge 0$, entonces $\sum a_i X_i \sim \operatorname{Cauchy}(0, 1)$. Su función característica es $e^{-|t|}$ y la de la media es $(e^{-|t|/n})^n = e^{-|t|}$.
- **Distribuciones estables:** son las únicas leyes que pueden ser límite de sumas normalizadas de variables independientes idénticas; la normal es la estable de índice 2.
- **Ley de grandes números con varianza infinita:** si $1 < \alpha < 2$ la media existe y $\bar{X}_n \to \mu$ casi seguramente, pero el error es de orden $n^{1/\alpha - 1}$, más lento que $n^{-1/2}$.
- **Dominio del máximo:** con $\alpha < 1$, la suma y el máximo son del mismo orden de magnitud.
- **Mediana:** para datos Cauchy la mediana muestral sí es consistente y aproximadamente normal, con varianza $\pi^2/(4n)$.

:::figura[Propiedad: el contraste con varianza finita. Con datos exponenciales las medias se concentran alrededor de 1 y el término mayor pesa cada vez menos.]{componente="CentralLimit"}
```yaml
modo: falla
poblacion: exponencial
n: 200
```
:::

:::figura[Propiedad: sin media no hay concentración. Las medias acumuladas de datos Cauchy saltan para siempre, aunque pase mucho tiempo.]{componente="LargeNumbers"}
```yaml
modo: debil
poblacion: cauchy
epsilon: 0.5
trayectorias: 30
horizonte: 5000
escalaLog: true
```
:::

:::demostracion
Para la Cauchy: la función característica de $X$ es $\varphi(t) = e^{-|t|}$. La de $\bar{X}_n$ es $\varphi(t/n)^n = e^{-n|t|/n} = e^{-|t|}$, que es la de $\operatorname{Cauchy}(0, 1)$. Por unicidad, $\bar{X}_n$ tiene la misma distribución que $X_1$.
:::

## Errores comunes

- **Aplicar el TCL por costumbre.** Con datos financieros, tamaños de archivos, ingresos o pérdidas por desastres, las colas pueden ser tan pesadas que la varianza no existe.
- **Confiar en la varianza muestral.** Siempre es finita aunque la poblacional sea infinita; crece de forma errática al agregar datos y da una falsa sensación de control.
- **Pensar que más datos siempre ayudan.** Para la Cauchy, promediar mil datos es tan informativo sobre el centro como uno solo; la mediana es mejor.
- **Confundir colas pesadas con valores atípicos.** Las observaciones enormes no son errores de captura: son parte de la distribución y determinan la suma.

:::figura[Error común: promediar datos Cauchy. Con n = 500 el histograma de medias sigue siendo la misma densidad de Cauchy de una sola observación.]{componente="CentralLimit"}
```yaml
modo: falla
poblacion: cauchy
n: 500
```
:::

## Conexiones

Marca el límite del [[teorema-central-del-limite]] y de la [[ley-debil-de-los-grandes-numeros]], que requieren varianza o media finitas. El [[teorema-de-berry-esseen]] tampoco aplica, porque el tercer momento es infinito. La [[convergencia-en-distribucion]] sigue siendo la noción correcta, pero hacia leyes estables. En estadística, la [[teoria-de-grandes-desviaciones]] y los métodos robustos ofrecen alternativas cuando las colas son pesadas.

## Formulario

:::formula[Media de datos Cauchy]
$$
X_i \sim \operatorname{Cauchy}(0, 1) \Rightarrow \bar{X}_n \sim \operatorname{Cauchy}(0, 1)
$$

- $X_i$: observaciones independientes de Cauchy estándar.
- $\bar{X}_n$: media de $n$ observaciones.
:::

:::formula[Función característica de la Cauchy]
$$
\varphi(t) = e^{-|t|}
$$

- $t$: argumento real.
:::

:::formula[Teorema central del límite generalizado]
$$
\frac{S_n - b_n}{n^{1/\alpha}} \xrightarrow{d} Y_\alpha, \qquad 0 < \alpha < 2
$$

- $S_n$: suma de $n$ observaciones con cola $P(|X| > x) \sim c\,x^{-\alpha}$.
- $b_n$: centrado; $b_n = n\mu$ si $1 < \alpha < 2$.
- $Y_\alpha$: ley estable de índice $\alpha$.
:::

:::formula[Pareto]
$$
P(X > x) = \Big(\frac{x_m}{x}\Big)^{\alpha},\ x \ge x_m;\qquad \mathbb{E}[X] = \frac{\alpha\,x_m}{\alpha - 1}\ (\alpha > 1)
$$

- $x_m$: valor mínimo.
- $\alpha$: índice de cola; la varianza es infinita si $\alpha \le 2$.
:::

:::formula[Probabilidad de algún valor extremo]
$$
P\Big(\max_{i \le n} X_i > x\Big) = 1 - \big(1 - P(X > x)\big)^n
$$

- $n$: número de observaciones.
- $x$: umbral.
:::
