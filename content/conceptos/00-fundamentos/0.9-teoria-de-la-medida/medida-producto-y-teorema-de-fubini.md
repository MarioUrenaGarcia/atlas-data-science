---
id: medida-producto-y-teorema-de-fubini
titulo: Medida producto y teorema de Fubini
titulo_en: Product measure and Fubini's theorem
alias:
  - teorema de Fubini
  - teorema de Tonelli
  - medida producto
  - integrales iteradas
modulo: 0
submodulo: '0.9'
orden: 12
nivel: avanzado
prerrequisitos:
  - integral-de-lebesgue
relaciones:
  - tipo: generaliza
    id: integrales-dobles-y-triples
etiquetas:
  - medida producto
  - integrales iteradas
  - intercambio de orden
  - teoría de la medida
resumen: >
  La medida producto asigna a cada rectángulo el producto de las medidas de sus lados. Fubini y Tonelli
  dicen cuándo una integral doble se calcula integrando primero en una variable y luego en la otra, en cualquier orden.
formula: '\int_{X \times Y} f\,d(\mu \otimes \nu) = \int_X\Big(\int_Y f(x, y)\,d\nu(y)\Big)d\mu(x) = \int_Y\Big(\int_X f(x, y)\,d\mu(x)\Big)d\nu(y)'
visualizacion:
  componente: MeasureLab
  parametros:
    modo: fubini
    caso: contraejemplo
referencias:
  - clave: durrett
publicado: true
---

## Intuición

Para contar las butacas ocupadas de un teatro se puede recorrer fila por fila y sumar los totales de las filas, o columna por columna y sumar los totales de las columnas. Con un número finito de butacas, el resultado es el mismo. La pregunta es si esto sigue valiendo con infinitas filas y columnas, o con una función continua sobre un rectángulo, donde cada "fila" es una integral.

El teorema de Fubini responde que sí, siempre que la suma total de valores absolutos sea finita; el de Tonelli, que sí siempre que todos los valores sean no negativos. Sin esas condiciones el orden importa: hay arreglos infinitos en los que cada fila suma 0 y, sin embargo, las columnas suman 1 en total. La masa positiva y la negativa se cancelan de forma distinta según el orden, como ocurre con las series que no convergen absolutamente.

La medida producto es el objeto que hace preciso el "área": a cada rectángulo $A \times B$ le asigna $\mu(A)\,\nu(B)$, y de ahí se extiende a todos los conjuntos medibles del producto.

## Definición

:::definicion[Medida producto]
Sean $(X, \mathcal{A}, \mu)$ y $(Y, \mathcal{B}, \nu)$ espacios de medida sigma-finitos. Existe una única medida $\mu \otimes \nu$ sobre $\mathcal{A} \otimes \mathcal{B}$ tal que $(\mu \otimes \nu)(A \times B) = \mu(A)\,\nu(B)$ para todo rectángulo medible.
:::

:::teorema[Tonelli y Fubini]
Sea $f : X \times Y \to \mathbb{R}$ medible respecto de $\mathcal{A} \otimes \mathcal{B}$.

1. (Tonelli) Si $f \ge 0$, las integrales iteradas en los dos órdenes coinciden con $\int f\,d(\mu \otimes \nu)$, aunque valgan $\infty$.
2. (Fubini) Si $\int |f|\,d(\mu \otimes \nu) < \infty$, las integrales iteradas existen, son finitas y coinciden con la integral doble.
:::

Con la medida de conteo en $\mathbb{N} \times \mathbb{N}$, el teorema dice que $\sum_i \sum_j a_{ij} = \sum_j \sum_i a_{ij}$ si $\sum_{i,j} |a_{ij}| < \infty$.

:::nota[Qué significa cada símbolo]
- $(X, \mathcal{A}, \mu)$, $(Y, \mathcal{B}, \nu)$: espacios de medida de cada factor.
- $\mu \otimes \nu$: medida producto; $\mathcal{A} \otimes \mathcal{B}$: sigma-álgebra producto.
- $A \times B$: rectángulo medible.
- $f(x, y)$: función de dos variables.
- $a_{ij}$: términos de una serie doble.
- $\mathbb{N}$: números naturales.
:::

## Cómo usar la visualización

La tabla es la esquina superior izquierda del arreglo infinito con 1 en la diagonal y $-1$ justo a la derecha. La columna de la derecha da la suma completa de cada fila y el renglón de abajo, la de cada columna. La reproducción agranda la esquina de 2 a 7.

Cada fila tiene un 1 y un $-1$, así que suma 0: por filas, el total es 0. La primera columna solo tiene un 1 y las demás tienen un 1 y un $-1$: por columnas, el total es 1. La suma de valores absolutos de la esquina, $2n - 1$, crece sin cota: falta la hipótesis de Fubini.

## Ejemplo

Se calcula $\int_0^1\!\int_0^1 x y^2\,dy\,dx$ en los dos órdenes.

1. Primero en $y$: $\int_0^1 x y^2\,dy = x/3$; luego $\int_0^1 x/3\,dx = 1/6$.
2. Primero en $x$: $\int_0^1 x y^2\,dx = y^2/2$; luego $\int_0^1 y^2/2\,dy = 1/6$.
3. Como $x y^2 \ge 0$, Tonelli garantiza la igualdad sin más revisiones.
4. Con una rejilla de $n \times n$ celdas y la masa de cada celda evaluada en su centro, el total es $\tfrac{1}{2}\big(\tfrac{1}{3} - \tfrac{1}{12 n^2}\big)$: 0.15625 con $n = 2$ y 0.16582 con $n = 7$, en los dos órdenes.

:::figura[Masa de x y² en una rejilla que se refina de 2 a 7: las sumas por filas y por columnas coinciden en cada paso, 0.15625, 0.16204, 0.16406 y siguen hasta 0.16582, cerca de 1/6.]{componente="MeasureLab"}
```yaml
modo: fubini
caso: continua
```
:::

## Propiedades

- **Unicidad:** con factores sigma-finitos, la medida producto está determinada por los rectángulos.
- **Área de Lebesgue:** $\lambda \otimes \lambda$ en $\mathbb{R}^2$ es la medida de Lebesgue del plano.
- **Independencia:** dos variables aleatorias son independientes si y solo si su distribución conjunta es el producto de sus marginales; entonces $\mathbb{E}[g(X)h(Y)] = \mathbb{E}[g(X)]\,\mathbb{E}[h(Y)]$ por Fubini, donde $X$ y $Y$ son las variables, $g$ y $h$ funciones medibles con esperanzas finitas y $\mathbb{E}$ la esperanza.
- **Principio de Cavalieri:** $(\mu \otimes \nu)(E) = \int_X \nu(E_x)\,d\mu(x)$, con $E_x = \{y : (x, y) \in E\}$.

:::figura[Arreglo $2^{-(i+j)}$ con valores absolutos sumables: cada fila suma $2^{-i}$, cada columna $2^{-j}$ y los dos órdenes dan 1.]{componente="MeasureLab"}
```yaml
modo: fubini
caso: absoluta
```
:::

## Errores comunes

- **Intercambiar el orden sin revisar $\int |f|$.** En el arreglo de la visualización principal, cambiar el orden de suma cambia el resultado de 0 a 1.

:::figura[El contraejemplo desde la esquina de 2 por 2: las filas suman 0 y las columnas 1, mientras la suma de valores absolutos de la esquina crece como 3, 5, 7 y llega a 13 con la esquina de 7 por 7.]{componente="MeasureLab"}
```yaml
modo: fubini
caso: contraejemplo
```
:::

- **Revisar solo que las integrales iteradas existan.** En el contraejemplo las dos sumas iteradas existen y son finitas, pero distintas; lo que falla es la integrabilidad absoluta.
- **Olvidar la sigma-finitud.** En $[0, 1]^2$ con la medida de Lebesgue en el primer factor y la de conteo en el segundo, que no es sigma-finita, la indicadora de la diagonal $\{x = y\}$ tiene integrales iteradas 0 (primero respecto de Lebesgue) y 1 (primero respecto del conteo).
- **Usar Tonelli con funciones con signo.** Tonelli solo cubre funciones no negativas; con signo se necesita Fubini y su hipótesis de integrabilidad.

## Conexiones

Construye medidas sobre el [[producto-cartesiano]] a partir de la [[integral-de-lebesgue]] en cada factor. Justifica el cálculo de [[integrales-dobles-y-triples]] como integrales iteradas y, en probabilidad, las esperanzas de productos de variables independientes, como en la [[independencia-de-eventos]]. Las series dobles del contraejemplo muestran el mismo fenómeno que la [[series-y-convergencia-de-series|convergencia condicional]].

## Formulario

:::formula[Medida producto]
$$
(\mu \otimes \nu)(A \times B) = \mu(A)\,\nu(B)
$$

- $\mu$, $\nu$: medidas de cada factor; $A \times B$: rectángulo medible.
:::

:::formula[Fubini y Tonelli]
$$
\int f\,d(\mu\otimes\nu) = \int_X\!\int_Y f\,d\nu\,d\mu = \int_Y\!\int_X f\,d\mu\,d\nu
$$

- $X$, $Y$: espacios de cada factor; $\mu$, $\nu$: sus medidas; $f$: función medible en $X \times Y$.
- Válido si $f \ge 0$ (Tonelli) o si $\int |f|\,d(\mu\otimes\nu) < \infty$ (Fubini).
:::

:::formula[Series dobles]
$$
\sum_{i,j}|a_{ij}| < \infty \;\Longrightarrow\; \sum_i\sum_j a_{ij} = \sum_j\sum_i a_{ij}
$$

- $a_{ij}$: términos de la serie doble; la suma es respecto de la medida de conteo.
:::

:::formula[Rejilla del ejemplo]
$$
\sum_{i=1}^{n}\sum_{j=1}^{n} x_i y_j^2\,\Delta^2 = \frac{1}{2}\Big(\frac{1}{3} - \frac{1}{12 n^2}\Big), \qquad \Delta = \frac{1}{n}
$$

- $x_i$, $y_j$: centros de las celdas; $\Delta$: lado de cada celda; $n$: celdas por lado.
:::
