---
id: cuadratura-gaussiana
titulo: Cuadratura gaussiana
titulo_en: Gaussian quadrature
alias:
  - cuadratura de Gauss-Legendre
  - nodos de Gauss
modulo: 0
submodulo: '0.7'
orden: 12
nivel: avanzado
prerrequisitos:
  - regla-de-simpson
etiquetas:
  - integración numérica
  - polinomios de Legendre
  - nodos óptimos
  - pesos
resumen: >
  La cuadratura gaussiana elige los nodos y los pesos para integrar exactamente polinomios del mayor grado
  posible: con n puntos, hasta grado 2n - 1. Los nodos son las raíces del polinomio de Legendre de grado n.
formula: '\int_{-1}^{1} f(t)\,dt \approx \sum_{i=1}^{n} w_i\,f(t_i), \qquad P_n(t_i) = 0'
visualizacion:
  componente: NumericsLab
  parametros:
    modo: cuadratura
    funcion: seno
    reglas: [trapecio, simpson, gauss]
referencias:
  - clave: murphy
publicado: true
---

## Intuición

Las reglas del trapecio y de Simpson usan nodos igualmente espaciados y solo eligen los pesos. Si además se pueden elegir los nodos, hay el doble de libertad: con $n$ evaluaciones se pueden ajustar $n$ posiciones y $n$ pesos, $2n$ parámetros en total, suficientes para integrar exactamente cualquier polinomio de grado $2n - 1$. Dos puntos bien colocados integran sin error todos los cúbicos, algo que Simpson logra con tres puntos.

Los mejores nodos no están igualmente espaciados: se acumulan cerca de los extremos y son las raíces de una familia especial de polinomios, los de Legendre. Para funciones suaves la convergencia es rapidísima, porque cada punto agregado sube en dos el grado que se integra exactamente. Es la regla preferida cuando cada evaluación de la función es costosa, por ejemplo en el cálculo de esperanzas en modelos estadísticos. Su punto débil son las funciones con singularidades o picos, donde ningún polinomio de grado moderado es una buena aproximación.

## Definición

:::definicion[Cuadratura de Gauss-Legendre]
Con $n$ puntos en $[-1, 1]$,
$$
G_n(f) = \sum_{i=1}^{n} w_i\,f(t_i),
$$
donde los nodos $t_i$ son las $n$ raíces del polinomio de Legendre $P_n$ y los pesos son $w_i = \dfrac{2}{(1 - t_i^2)\,P_n'(t_i)^2}$. En un intervalo $[a, b]$ se cambia de variable con $x = \tfrac{a + b}{2} + \tfrac{b - a}{2}t$:
$$
\int_a^b f(x)\,dx \approx \frac{b - a}{2}\sum_{i=1}^{n} w_i\,f\Big(\frac{a + b}{2} + \frac{b - a}{2}t_i\Big).
$$
:::

:::teorema[Grado de exactitud]
$G_n$ integra exactamente todo polinomio de grado a lo más $2n - 1$, y ninguna regla con $n$ nodos integra exactamente todos los de grado $2n$.
:::

Los polinomios de Legendre cumplen $P_0 = 1$, $P_1 = t$ y $(k + 1)P_{k+1} = (2k + 1)\,t\,P_k - k\,P_{k-1}$; son ortogonales en $[-1, 1]$. Por ejemplo, $P_2 = \tfrac{1}{2}(3t^2 - 1)$ tiene raíces $\pm 1/\sqrt{3}$ y los pesos de $G_2$ son 1 y 1.

:::nota[Qué significa cada símbolo]
- $n$: número de puntos.
- $t_i$: nodos en $[-1, 1]$, raíces de $P_n$; $w_i$: pesos, todos positivos.
- $P_n$: polinomio de Legendre de grado $n$; $P_n'$: su derivada.
- $G_n(f)$: aproximación de la integral con $n$ puntos.
- $[a, b]$: intervalo de integración; $x$: variable original.
:::

## Cómo usar la visualización

A la izquierda, la regla elegida en el selector; para Gauss, cada nodo aparece como un punto sobre la curva y su peso como el ancho de un rectángulo de altura $f(t_i)$, y los rectángulos llenan exactamente el intervalo. A la derecha, el error de las tres reglas contra el número de evaluaciones. La reproducción aumenta $n$.

Con $\operatorname{sen} x$ en $[0, \pi]$, Gauss con 5 puntos tiene error $1.1 \times 10^{-7}$, diez veces menor que Simpson con 33 evaluaciones. En el panel derecho la línea de Gauss no es una recta: se curva hacia abajo, porque su error decae más rápido que cualquier potencia del número de evaluaciones.

## Ejemplo

Se aproxima $\int_0^2 e^x\,dx = 6.389056$ con 2 y con 3 puntos.

1. Con 2 puntos, $t = \pm 1/\sqrt{3} = \pm 0.57735$ y pesos 1. El cambio $x = 1 + t$ da nodos $0.42265$ y $1.57735$, y el factor $\tfrac{b - a}{2} = 1$.
2. $G_2 = e^{0.42265} + e^{1.57735} = 1.52601 + 4.84210 = 6.36811$, error $0.0209$.
3. Con 3 puntos, $t = 0, \pm\sqrt{3/5}$ y pesos $\tfrac{8}{9}, \tfrac{5}{9}, \tfrac{5}{9}$: $G_3 = 6.388878$, error $1.8 \times 10^{-4}$.
4. Simpson con 5 evaluaciones tiene error $2.2 \times 10^{-3}$; Gauss con 3 evaluaciones ya es doce veces mejor.

:::figura[$e^x$ en $[0, 2]$ con cuadratura de Gauss: los rectángulos de ancho proporcional a cada peso y altura $f(x_i)$ cubren el intervalo, y con 2 y 3 puntos la suma da 6.36811 y 6.388878.]{componente="NumericsLab"}
```yaml
modo: cuadratura
funcion: exponencial
intervalo: [0, 2]
reglas: [gauss]
```
:::

## Propiedades

- **Exactitud de grado $2n - 1$:** dos puntos integran exactamente cualquier cúbico; tres puntos, cualquier polinomio de grado 5.

:::figura[$x^3 - 2x + 1$ en $[-1.5, 1.5]$ con 2 puntos de Gauss: el error ya es 0, salvo redondeo, con solo dos evaluaciones.]{componente="NumericsLab"}
```yaml
modo: cuadratura
funcion: polinomio
reglas: [gauss]
```
:::

- **Pesos positivos:** todos los $w_i$ son positivos y suman 2, así que la regla no amplifica errores de redondeo.
- **Nodos entrelazados con los pesos:** cada nodo cae dentro del tramo que le corresponde al acumular los pesos, lo que se ve en los rectángulos de la figura.
- **Convergencia:** para funciones analíticas el error decae exponencialmente con $n$.
- **Otras familias:** con pesos $e^{-x^2}$ o $e^{-x}$ se obtienen las reglas de Gauss-Hermite y Gauss-Laguerre, para integrales sobre toda la recta o la semirrecta.

## Errores comunes

- **Esperar convergencia exponencial con singularidades.** Con $\sqrt{x}$ en $[0, 1]$ los errores son $7.2 \times 10^{-3}$, $2.5 \times 10^{-3}$ y $1.2 \times 10^{-3}$ con 2, 3 y 4 puntos: solo bajan como una potencia.

:::figura[$\sqrt{x}$ en $[0, 1]$ con Gauss: la derivada infinita en 0 hace que ningún polinomio la aproxime bien cerca del borde, y la línea del error baja despacio en lugar de curvarse hacia abajo.]{componente="NumericsLab"}
```yaml
modo: cuadratura
funcion: raiz
reglas: [gauss]
```
:::

- **Reutilizar evaluaciones al subir $n$.** Los nodos de $G_n$ y $G_{n+1}$ son distintos; para refinar reutilizando valores se usan variantes como Gauss-Kronrod.
- **Olvidar el cambio de intervalo.** Los nodos tabulados son para $[-1, 1]$; hay que trasladarlos y multiplicar por $\tfrac{b - a}{2}$.
- **Calcular los nodos resolviendo un sistema mal condicionado.** Se obtienen con la recurrencia de Legendre y el método de Newton, o como valores propios de una matriz tridiagonal.

## Conexiones

Supera a la [[regla-de-simpson]] y a la [[regla-del-trapecio]] eligiendo nodos y pesos; sus nodos, como los del [[fenomeno-de-runge]], se acumulan en los extremos. Los nodos se calculan con el [[metodo-de-newton-raphson]] sobre los polinomios de Legendre, y las reglas con peso $e^{-x^2}$ se usan para integrales con la densidad normal, como la [[integral-gaussiana]].

## Formulario

:::formula[Regla de Gauss-Legendre]
$$
\int_{-1}^{1} f(t)\,dt \approx \sum_{i=1}^{n} w_i f(t_i)
$$

- $t_i$: raíces de $P_n$; $w_i$: pesos.
:::

:::formula[Pesos]
$$
w_i = \frac{2}{(1 - t_i^2)\,P_n'(t_i)^2}
$$

- $P_n'$: derivada del polinomio de Legendre.
:::

:::formula[Cambio de intervalo]
$$
\int_a^b f(x)\,dx \approx \frac{b - a}{2}\sum_{i=1}^{n} w_i\,f\Big(\frac{a + b}{2} + \frac{b - a}{2}t_i\Big)
$$

- $[a, b]$: intervalo original.
:::

:::formula[Recurrencia de Legendre]
$$
(k + 1)P_{k+1}(t) = (2k + 1)\,t\,P_k(t) - k\,P_{k-1}(t), \qquad P_0 = 1,\ P_1 = t
$$

- $P_k$: polinomio de Legendre de grado $k$.
:::

:::formula[Reglas pequeñas]
$$
G_2:\ t = \pm\tfrac{1}{\sqrt{3}},\ w = 1, 1; \qquad G_3:\ t = 0, \pm\sqrt{\tfrac{3}{5}},\ w = \tfrac{8}{9}, \tfrac{5}{9}, \tfrac{5}{9}
$$

- Nodos y pesos en $[-1, 1]$.
:::
