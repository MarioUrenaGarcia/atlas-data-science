---
id: regla-de-simpson
titulo: Regla de Simpson
titulo_en: Simpson's rule
alias:
  - Simpson compuesto
  - regla de Simpson 1/3
modulo: 0
submodulo: '0.7'
orden: 11
nivel: intermedio
prerrequisitos:
  - regla-del-trapecio
  - interpolacion-polinomial
etiquetas:
  - integración numérica
  - cuadratura
  - orden 4
  - parábolas
resumen: >
  La regla de Simpson integra parábolas que pasan por tres nodos consecutivos; con pesos 1, 4, 2, 4, ..., 4, 1
  su error es de orden h⁴, y es exacta para polinomios de grado 3.
formula: '\int_a^b f(x)\,dx \approx \frac{h}{3}\Big(f_0 + 4f_1 + 2f_2 + 4f_3 + \dots + 4f_{n-1} + f_n\Big)'
visualizacion:
  componente: NumericsLab
  parametros:
    modo: cuadratura
    funcion: seno
    reglas: [trapecio, simpson]
referencias:
  - clave: murphy
publicado: true
---

## Intuición

La regla del trapecio une los puntos con rectas, y las rectas no siguen la curvatura. Si en lugar de rectas se usan parábolas, cada una pasando por tres puntos consecutivos, la aproximación sigue la forma curva de la función y el error baja de manera drástica. Eso es la regla de Simpson: divide el intervalo en un número par de franjas, toma las franjas de dos en dos y en cada par integra la parábola que pasa por sus tres nodos.

Sorprendentemente, la regla resulta exacta no solo para parábolas sino también para polinomios de grado 3: el error de un cúbico se cancela por simetría entre las dos mitades de cada par de franjas. Por eso su error es proporcional a la cuarta potencia del ancho: al duplicar los nodos se divide entre 16. Con el mismo número de evaluaciones que el trapecio, Simpson suele dar varias cifras más.

## Definición

:::definicion[Regla de Simpson compuesta]
Sea $n$ par, $h = (b - a)/n$, $x_i = a + ih$ y $f_i = f(x_i)$. Entonces
$$
S_n = \frac{h}{3}\Big(f_0 + 4\sum_{\text{impares } i} f_i + 2\sum_{\text{pares interiores } i} f_i + f_n\Big).
$$
En cada par de franjas $[x_{2j}, x_{2j+2}]$ la regla integra exactamente la parábola que pasa por $x_{2j}$, $x_{2j+1}$ y $x_{2j+2}$.
:::

:::teorema[Error de la regla de Simpson]
Si $f^{(4)}$ es continua en $[a, b]$, existe $\xi$ con
$$
\int_a^b f(x)\,dx - S_n = -\frac{(b - a)\,h^4}{180}\,f^{(4)}(\xi).
$$
:::

:::nota[Qué significa cada símbolo]
- $f$: función; $[a, b]$: intervalo.
- $n$: número de subintervalos, par; $h$: su ancho.
- $x_i$: nodos; $f_i$: valores de la función en ellos.
- $S_n$: aproximación de Simpson.
- $f^{(4)}$: cuarta derivada; $\xi$: punto intermedio.
:::

## Cómo usar la visualización

A la izquierda se dibujan las parábolas de la regla elegida en el selector; a la derecha, el logaritmo del error contra el logaritmo de las evaluaciones de la función para el trapecio y para Simpson. La reproducción duplica los subintervalos de 2 a 64 y el encabezado escribe la fórmula, la aproximación y el error.

Con $\operatorname{sen} x$ en $[0, \pi]$, las parábolas casi no se distinguen de la curva desde 4 franjas. En el panel derecho la línea de Simpson tiene pendiente $-4$ y la del trapecio $-2$: con 17 evaluaciones Simpson tiene error $1.7 \times 10^{-5}$ y el trapecio $6.4 \times 10^{-3}$.

## Ejemplo

Se aproxima $\int_0^2 e^x\,dx = 6.389056$ con $n = 4$ y $h = 0.5$.

1. Valores: $f_0 = 1$, $f_1 = 1.6487$, $f_2 = 2.7183$, $f_3 = 4.4817$, $f_4 = 7.3891$.
2. Pesos 1, 4, 2, 4, 1: $1 + 6.5949 + 5.4366 + 17.9268 + 7.3891 = 38.3474$.
3. $S_4 = \tfrac{0.5}{3} \cdot 38.3474 = 6.39121$.
4. El error es $-0.00215$, sesenta veces menor que el del trapecio con los mismos cinco valores, $-0.1326$.
5. La fórmula del error da $-\tfrac{2 \cdot 0.0625}{180}e^{\xi}$, que coincide con $e^{\xi} = 3.1$.

:::figura[Las dos parábolas de Simpson bajo $e^x$ en $[0, 2]$ con cuatro franjas: casi coinciden con la curva y la suma da 6.39121 contra el valor exacto 6.38906.]{componente="NumericsLab"}
```yaml
modo: cuadratura
funcion: exponencial
intervalo: [0, 2]
reglas: [simpson]
```
:::

## Propiedades

- **Exactitud cúbica:** integra sin error todo polinomio de grado a lo más 3, aunque solo use parábolas.

:::figura[$x^3 - 2x + 1$ en $[-1.5, 1.5]$ con Simpson: desde la primera parábola el error es 0, salvo redondeo, porque la regla es exacta para cúbicas.]{componente="NumericsLab"}
```yaml
modo: cuadratura
funcion: polinomio
reglas: [simpson]
```
:::

- **Orden 4:** duplicar los subintervalos divide el error entre 16; con $\operatorname{sen} x$ los errores son $0.094$, $0.0046$, $2.7 \times 10^{-4}$ y $1.7 \times 10^{-5}$.
- **Relación con el trapecio:** $S_{2n} = \tfrac{4T_{2n} - T_n}{3}$, la extrapolación de Richardson del trapecio.
- **Pesos:** cada nodo impar tiene peso 4 porque es el centro de una parábola; cada par interior, peso 2 porque es extremo de dos parábolas.
- **Variante 3/8:** con grupos de tres franjas y pesos 1, 3, 3, 1 se obtiene otra regla de orden 4.

## Errores comunes

- **Confiar en pocos nodos con una función de pico angosto.** Con 2 franjas, Simpson en la función de Runge en $[-1, 1]$ se equivoca en $0.81$, más que la integral misma, $0.549$; el error de orden $h^4$ solo se nota cuando las franjas son más angostas que el pico.

:::figura[La función de Runge con el trapecio y Simpson: con pocas franjas Simpson es incluso peor que el trapecio, y solo a partir de 32 franjas su línea baja con pendiente $-4$, hasta $9 \times 10^{-9}$ con 64.]{componente="NumericsLab"}
```yaml
modo: cuadratura
funcion: runge
reglas: [trapecio, simpson]
```
:::

- **Usar un número impar de franjas.** La regla necesita pares de franjas; con $n$ impar sobra una que hay que tratar con otra regla.
- **Equivocar el patrón de pesos.** Los extremos llevan 1, los nodos impares 4 y los pares interiores 2; empezar con 4 en el extremo da un resultado sin sentido.
- **Esperar orden 4 sin cuarta derivada.** Con $\sqrt{x}$ en $[0, 1]$ el orden cae a 1.5 y Simpson apenas mejora al trapecio.

## Conexiones

Generaliza la [[regla-del-trapecio]] integrando el polinomio de la [[interpolacion-polinomial]] de grado 2 en cada par de franjas. La [[cuadratura-gaussiana]] obtiene más exactitud con menos evaluaciones eligiendo también los nodos. Integrar con Runge-Kutta de orden 4 una ecuación $y' = f(t)$ es aplicar Simpson, como se ve en los [[metodos-numericos-para-ecuaciones-diferenciales]].

## Formulario

:::formula[Regla de Simpson compuesta]
$$
S_n = \frac{h}{3}\big(f_0 + 4f_1 + 2f_2 + \dots + 2f_{n-2} + 4f_{n-1} + f_n\big)
$$

- $n$: número par de subintervalos; $h = (b - a)/n$; $f_i = f(a + ih)$.
:::

:::formula[Error]
$$
\int_a^b f\,dx - S_n = -\frac{(b - a)h^4}{180}f^{(4)}(\xi)
$$

- $f^{(4)}$: cuarta derivada; $\xi \in [a, b]$.
:::

:::formula[Relación con el trapecio]
$$
S_{2n} = \frac{4T_{2n} - T_n}{3}
$$

- $T_n$: regla del trapecio con $n$ subintervalos.
:::

:::formula[Simpson en un par de franjas]
$$
\int_{x_0}^{x_2} f(x)\,dx \approx \frac{h}{3}\big(f_0 + 4f_1 + f_2\big)
$$

- $x_1$: punto medio de $[x_0, x_2]$.
:::
