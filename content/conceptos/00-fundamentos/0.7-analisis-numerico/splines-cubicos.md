---
id: splines-cubicos
titulo: Splines cúbicos
titulo_en: Cubic splines
alias:
  - spline cúbico natural
  - interpolación por tramos
  - trazadores cúbicos
modulo: 0
submodulo: '0.7'
orden: 9
nivel: intermedio
prerrequisitos:
  - interpolacion-polinomial
  - derivadas-de-orden-superior
etiquetas:
  - splines
  - interpolación por tramos
  - suavidad
  - curvatura
resumen: >
  Un spline cúbico une puntos con un polinomio de grado 3 en cada tramo, pegados de modo que el valor, la
  pendiente y la curvatura coincidan en los nudos; evita las oscilaciones de un polinomio de grado alto.
formula: '6\,\frac{y_{i+1} - 2y_i + y_{i-1}}{h} = h M_{i-1} + 4h M_i + h M_{i+1}, \qquad M_i = S''''(x_i)'
visualizacion:
  componente: NumericsLab
  parametros:
    modo: spline
    puntos: [[0, 1], [1, 3], [2, 2], [3, 3.5], [4, 0.5], [5, 1]]
    polinomio: true
referencias:
  - clave: hastie-esl
    capitulo: '5'
publicado: true
---

## Intuición

Antes de las computadoras, los dibujantes de barcos trazaban curvas suaves con una regla flexible de madera, llamada spline, sujeta con pesos en los puntos por donde debía pasar. La regla adopta la forma que menos se dobla, y entre dos pesos consecutivos esa forma es muy aproximadamente un polinomio de grado 3. El spline cúbico matemático imita esa regla.

En lugar de un solo polinomio de grado alto para todos los puntos, que tiende a oscilar, se usa un polinomio cúbico distinto entre cada par de puntos consecutivos. Para que la curva no tenga esquinas ni cambios bruscos de curvatura, se exige que en cada punto interior los dos tramos vecinos tengan el mismo valor, la misma pendiente y la misma segunda derivada. Con una condición extra en los extremos, por ejemplo curvatura cero, como la regla libre en sus puntas, la curva queda determinada y se calcula resolviendo un sistema lineal sencillo.

## Definición

:::definicion[Spline cúbico natural]
Dados nodos $x_0 < x_1 < \dots < x_n$ con valores $y_0, \dots, y_n$, un spline cúbico es una función $S$ que

1. en cada tramo $[x_i, x_{i+1}]$ es un polinomio de grado a lo más 3;
2. interpola: $S(x_i) = y_i$;
3. tiene $S$, $S'$ y $S''$ continuas en los nudos interiores.

Es **natural** si además $S''(x_0) = S''(x_n) = 0$.
:::

Las incógnitas son las curvaturas $M_i = S''(x_i)$. Con espaciamiento uniforme $h$ cumplen, para $i = 1, \dots, n - 1$,
$$
M_{i-1} + 4M_i + M_{i+1} = \frac{6}{h^2}\big(y_{i+1} - 2y_i + y_{i-1}\big),
$$
un sistema tridiagonal que se resuelve en $O(n)$ operaciones. En cada tramo, con $t$ la distancia relativa al nodo izquierdo, el spline se obtiene de los $y_i$ y los $M_i$.

:::nota[Qué significa cada símbolo]
- $x_0, \dots, x_n$: nodos o nudos; $y_i$: valores en los nodos.
- $S$: spline; $S'$, $S''$: su primera y segunda derivadas.
- $M_i$: segunda derivada del spline en el nodo $x_i$.
- $h$: separación entre nodos consecutivos, cuando es uniforme.
- $n$: número de tramos.
:::

## Cómo usar la visualización

La curva azul es el spline cúbico natural por los puntos marcados; la reproducción la dibuja tramo por tramo y el encabezado escribe la forma de cada pieza y la curvatura en el último nudo alcanzado, con las curvaturas nulas en los extremos. El interruptor superpone, en línea punteada, el polinomio de grado 5 por los mismos seis puntos.

El polinomio sube hasta casi 4 entre los dos primeros puntos y baja de $-1$ entre los dos últimos, mientras el spline se mantiene cerca de los datos. Los empalmes entre tramos no se notan: ni la pendiente ni la curvatura saltan.

## Ejemplo

Se construye el spline natural por $(0, 1)$, $(1, 3)$, $(2, 2)$ y $(3, 0)$, con $h = 1$.

1. Extremos naturales: $M_0 = M_3 = 0$.
2. Ecuaciones interiores: $4M_1 + M_2 = 6(2 - 6 + 1) = -18$ y $M_1 + 4M_2 = 6(0 - 4 + 3) = -6$.
3. Solución: $M_2 = -0.4$ y $M_1 = -4.4$.
4. Valores entre nodos: $S(0.5) = 2.275$, $S(1.5) = 2.8$ y $S(2.5) = 1.025$.
5. La curvatura es fuerte en el pico de $x = 1$, donde la curva da la vuelta, y casi nula en $x = 2$, donde pasa casi en línea recta.

:::figura[El spline del ejemplo dibujado tramo por tramo: las curvaturas en los nudos son 0, $-4.4$, $-0.4$ y 0, y la curva pasa por 2.275, 2.8 y 1.025 a la mitad de cada tramo.]{componente="NumericsLab"}
```yaml
modo: spline
puntos: [[0, 1], [1, 3], [2, 2], [3, 0]]
```
:::

## Propiedades

- **Mínima curvatura:** entre todas las funciones con segunda derivada integrable que pasan por los puntos, el spline natural minimiza $\int S''(x)^2\,dx$, la energía de flexión de la regla.
- **Reproducción de rectas:** si los puntos están sobre una recta, el spline natural es esa recta.

:::figura[Cuatro puntos sobre la recta $y = 2x + 1$ con separaciones distintas: todas las curvaturas valen 0 y el spline es la propia recta.]{componente="NumericsLab"}
```yaml
modo: spline
puntos: [[0, 1], [0.5, 2], [2, 5], [3, 7]]
```
:::

- **Localidad aproximada:** mover un punto cambia sobre todo los tramos cercanos; el efecto decae rápido con la distancia.
- **Convergencia:** con datos de una función suave y separación $h$, el error del spline es de orden $h^4$.
- **Otras condiciones de borde:** en lugar de curvatura cero se puede fijar la pendiente en los extremos o exigir que la tercera derivada sea continua en el segundo y penúltimo nodo.

## Errores comunes

- **Usar un polinomio de grado alto por muchos puntos.** Por nueve puntos de la función de Runge, el polinomio de grado 8 oscila cerca de los extremos y el spline no.

:::figura[Nueve muestras igualmente espaciadas de la función de Runge: el spline, en azul, sigue la campana con un error pequeño, mientras el polinomio punteado se sale del rango de los datos cerca de los extremos.]{componente="NumericsLab"}
```yaml
modo: spline
puntos: [[-1, 0.0385], [-0.75, 0.0664], [-0.5, 0.1379], [-0.25, 0.3902], [0, 1], [0.25, 0.3902], [0.5, 0.1379], [0.75, 0.0664], [1, 0.0385]]
polinomio: true
```
:::

- **Creer que el spline natural es exacto en los extremos.** Forzar $S'' = 0$ en los bordes introduce error ahí si la función verdadera tiene curvatura.
- **Confundir spline de interpolación con spline de suavizado.** El primero pasa por todos los puntos; el de suavizado, usado en estadística, sacrifica la interpolación para no seguir el ruido.
- **Ordenar mal los nodos.** Las abscisas deben ser distintas y estar ordenadas; dos puntos con la misma $x$ y distinta $y$ no pueden interpolarse con una función.

## Conexiones

Resuelve el problema del [[fenomeno-de-runge]] dentro de la [[interpolacion-polinomial]], usando la continuidad de las [[derivadas-de-orden-superior]] en los nudos. Su sistema tridiagonal es un caso fácil de los [[sistemas-de-ecuaciones-lineales]], y en estadística los splines son la base de las regresiones con funciones flexibles.

## Formulario

:::formula[Sistema de las curvaturas con paso uniforme]
$$
M_{i-1} + 4M_i + M_{i+1} = \frac{6}{h^2}\big(y_{i+1} - 2y_i + y_{i-1}\big), \qquad i = 1, \dots, n - 1
$$

- $M_i$: curvatura en el nodo $i$; $h$: separación; $y_i$: valores.
:::

:::formula[Condición natural]
$$
M_0 = M_n = 0
$$

- Curvatura nula en los dos extremos.
:::

:::formula[Tramo del spline]
$$
S(x) = A\,y_i + B\,y_{i+1} + \frac{(A^3 - A)M_i + (B^3 - B)M_{i+1}}{6}h^2, \qquad A = \frac{x_{i+1} - x}{h},\ B = \frac{x - x_i}{h}
$$

- $A$, $B$: pesos lineales del tramo; $h$: largo del tramo.
:::

:::formula[Mínima energía de flexión]
$$
\int_{x_0}^{x_n} S''(x)^2\,dx \le \int_{x_0}^{x_n} g''(x)^2\,dx
$$

- $g$: cualquier función con segunda derivada integrable que pase por los mismos puntos.
:::
