---
id: regla-del-trapecio
titulo: Regla del trapecio
titulo_en: Trapezoidal rule
alias:
  - trapecio compuesto
  - regla trapezoidal
modulo: 0
submodulo: '0.7'
orden: 10
nivel: intermedio
prerrequisitos:
  - sumas-de-riemann
  - error-de-redondeo-y-error-de-truncamiento
etiquetas:
  - integración numérica
  - cuadratura
  - orden 2
  - trapecios
resumen: >
  La regla del trapecio aproxima una integral sustituyendo la función por segmentos rectos entre nodos
  igualmente espaciados; su error es de orden h², así que duplicar los nodos lo divide entre cuatro.
formula: '\int_a^b f(x)\,dx \approx \frac{h}{2}\Big(f(x_0) + 2\sum_{i=1}^{n-1} f(x_i) + f(x_n)\Big), \qquad h = \frac{b - a}{n}'
visualizacion:
  componente: NumericsLab
  parametros:
    modo: cuadratura
    funcion: seno
    reglas: [trapecio]
referencias:
  - clave: murphy
publicado: true
---

## Intuición

Para medir el área de un terreno con un lindero curvo, un topógrafo clava estacas a lo largo de la curva, une cada estaca con la siguiente mediante un cordel recto y calcula el área de las franjas resultantes, que son trapecios. Mientras más juntas estén las estacas, más se parece la línea quebrada a la curva y mejor es la medición.

La regla del trapecio hace exactamente eso con una función: evalúa la función en puntos igualmente espaciados, une los valores consecutivos con segmentos rectos y suma las áreas de los trapecios. Cada trapecio comete un error pequeño, proporcional a lo curvada que está la función en esa franja y al cubo de su ancho; al sumar todas las franjas, el error total es proporcional al cuadrado del ancho. Por eso al duplicar el número de franjas el error se reduce cuatro veces, mucho mejor que las sumas con rectángulos.

## Definición

:::definicion[Regla del trapecio compuesta]
Sea $h = (b - a)/n$ y $x_i = a + i h$ para $i = 0, \dots, n$. Entonces
$$
T_n = \frac{h}{2}\Big(f(x_0) + 2f(x_1) + \dots + 2f(x_{n-1}) + f(x_n)\Big) \approx \int_a^b f(x)\,dx.
$$
:::

:::teorema[Error de la regla del trapecio]
Si $f''$ es continua en $[a, b]$, existe $\xi \in [a, b]$ con
$$
\int_a^b f(x)\,dx - T_n = -\frac{(b - a)\,h^2}{12}\,f''(\xi).
$$
:::

:::nota[Qué significa cada símbolo]
- $f$: función que se integra; $[a, b]$: intervalo.
- $n$: número de subintervalos; $h$: su ancho.
- $x_i$: nodos igualmente espaciados; $x_0 = a$ y $x_n = b$.
- $T_n$: aproximación del trapecio con $n$ subintervalos.
- $f''$: segunda derivada; $\xi$: punto intermedio.
:::

## Cómo usar la visualización

A la izquierda, la función y los trapecios que la reemplazan; a la derecha, el logaritmo del error contra el logaritmo del número de evaluaciones de la función. La reproducción duplica el número de subintervalos, de 2 a 64, y el encabezado escribe la fórmula con el valor obtenido y su error.

Con $\operatorname{sen} x$ en $[0, \pi]$, cuya integral es 2, el error pasa de $0.43$ con 2 trapecios a $0.0064$ con 16. En el panel derecho los puntos forman una recta de pendiente $-2$: cada duplicación divide el error entre 4.

## Ejemplo

Se aproxima $\int_0^2 e^x\,dx = e^2 - 1 = 6.389056$ con $n = 4$, es decir, $h = 0.5$.

1. Nodos: $0, 0.5, 1, 1.5, 2$ con valores $1$, $1.6487$, $2.7183$, $4.4817$ y $7.3891$.
2. $T_4 = \tfrac{0.5}{2}\big(1 + 2(1.6487 + 2.7183 + 4.4817) + 7.3891\big) = 0.25 \cdot 26.0865 = 6.5216$.
3. El error es $6.3891 - 6.5216 = -0.1326$: la regla sobreestima porque $e^x$ es convexa y los segmentos quedan por encima.
4. La fórmula del error da $-\tfrac{2 \cdot 0.25}{12}e^{\xi}$, que coincide con $-0.1326$ para $e^{\xi} = 3.18$, un valor entre $e^0$ y $e^2$.
5. Con $n = 8$ el error sería cerca de $-0.033$, la cuarta parte.

:::figura[Los trapecios del ejemplo bajo $e^x$ en $[0, 2]$: cada segmento queda por encima de la curva convexa y la suma con 4 subintervalos da 6.5216 contra 6.3891.]{componente="NumericsLab"}
```yaml
modo: cuadratura
funcion: exponencial
intervalo: [0, 2]
reglas: [trapecio]
```
:::

## Propiedades

- **Orden 2:** para $f$ con segunda derivada continua, el error es proporcional a $h^2$; en escala logarítmica, una recta de pendiente $-2$.

:::figura[$x^3 - 2x + 1$ en $[0, 1.5]$: el panel derecho muestra los errores del trapecio sobre una recta de pendiente $-2$, cuatro veces menores en cada duplicación.]{componente="NumericsLab"}
```yaml
modo: cuadratura
funcion: polinomio
intervalo: [0, 1.5]
reglas: [trapecio]
```
:::

- **Exacta para rectas:** integra sin error cualquier función lineal.
- **Signo del error:** sobreestima en funciones convexas y subestima en cóncavas.
- **Relación con Riemann:** es el promedio de las sumas de Riemann por la izquierda y por la derecha.
- **Funciones periódicas:** sobre un periodo completo de una función periódica suave, el error decae más rápido que cualquier potencia de $h$.
- **Extrapolación de Richardson:** $\tfrac{4T_{2n} - T_n}{3}$ elimina el término $h^2$ y da la regla de Simpson.

## Errores comunes

- **Esperar orden 2 con funciones no suaves.** Con $\sqrt{x}$ en $[0, 1]$ la derivada es infinita en 0 y el error baja más lento: $-0.0031$ con 16 subintervalos, y Simpson apenas mejora a $-0.0013$.

:::figura[$\sqrt{x}$ en $[0, 1]$ con el trapecio y Simpson: las dos rectas del panel derecho tienen pendiente cercana a $-1.5$ y casi se tocan, porque la singularidad de la derivada en 0 domina el error de ambas reglas.]{componente="NumericsLab"}
```yaml
modo: cuadratura
funcion: raiz
reglas: [trapecio, simpson]
```
:::

- **Olvidar el factor 2 en los nodos interiores.** Cada nodo interior pertenece a dos trapecios; solo los extremos llevan peso 1.
- **Contar mal los nodos.** Con $n$ subintervalos hay $n + 1$ nodos.
- **Usar $h$ fijo sin estimar el error.** Comparar $T_n$ y $T_{2n}$ da una estimación del error, $\tfrac{T_{2n} - T_n}{3}$, que indica si hace falta refinar.

## Conexiones

Refina las [[sumas-de-riemann]] cambiando rectángulos por trapecios, y su error es de truncamiento en el sentido del [[error-de-redondeo-y-error-de-truncamiento]]. La [[regla-de-simpson]] y la [[cuadratura-gaussiana]] logran órdenes mayores con el mismo número de evaluaciones. Aproxima la [[integral-definida-como-area]] cuando no hay antiderivada, como en la [[funcion-error]].

## Formulario

:::formula[Regla del trapecio compuesta]
$$
T_n = \frac{h}{2}\Big(f(x_0) + 2\sum_{i=1}^{n-1} f(x_i) + f(x_n)\Big), \qquad h = \frac{b - a}{n}
$$

- $x_i = a + ih$: nodos; $n$: subintervalos.
:::

:::formula[Error]
$$
\int_a^b f\,dx - T_n = -\frac{(b - a)h^2}{12}f''(\xi)
$$

- $f''$: segunda derivada; $\xi \in [a, b]$.
:::

:::formula[Estimación del error con dos refinamientos]
$$
\int_a^b f\,dx - T_{2n} \approx \frac{T_{2n} - T_n}{3}
$$

- $T_n$, $T_{2n}$: aproximaciones con $n$ y $2n$ subintervalos.
:::
