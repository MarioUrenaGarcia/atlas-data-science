---
id: metodos-numericos-para-ecuaciones-diferenciales
titulo: Métodos numéricos para ecuaciones diferenciales
titulo_en: Numerical methods for differential equations
alias:
  - método de Euler
  - Runge-Kutta
  - RK4
  - integración numérica de EDO
modulo: 0
submodulo: '0.7'
orden: 16
nivel: intermedio
prerrequisitos:
  - error-de-redondeo-y-error-de-truncamiento
etiquetas:
  - ecuaciones diferenciales
  - Euler
  - Runge-Kutta
  - estabilidad
resumen: >
  Para resolver y' = f(t, y) se avanza en pasos de tamaño h usando pendientes estimadas: Euler usa una
  sola pendiente y tiene error de orden h; Runge-Kutta 4 promedia cuatro y tiene error de orden h⁴.
formula: 'y_{k+1} = y_k + \frac{h}{6}\big(k_1 + 2k_2 + 2k_3 + k_4\big)'
visualizacion:
  componente: NumericsLab
  parametros:
    modo: edo
    ecuacion: logistica
    h: 0.5
    metodos: [euler, rk4]
referencias:
  - clave: murphy
publicado: true
---

## Intuición

Una ecuación diferencial dice cuál es la pendiente de una curva en cada punto, por ejemplo cuánto crece una población según su tamaño actual, pero no da la curva. Para dibujarla se puede caminar a pasos cortos: desde el punto actual se mira la pendiente, se avanza un paso en esa dirección y se repite. Ese es el método de Euler. Su defecto es que la pendiente cambia durante el paso, y usar solo la del inicio acumula un error que crece con el tamaño del paso.

Los métodos de Runge-Kutta hacen pasos más inteligentes: prueban la pendiente en varios puntos dentro del paso, por ejemplo al inicio, a la mitad y al final, y avanzan con un promedio ponderado. Con cuatro pendientes por paso, el método clásico es tan exacto que con pasos diez veces más grandes que Euler logra errores miles de veces menores. Hay una advertencia: si la solución decae muy rápido, un paso grande puede hacer que la solución numérica oscile y explote aunque la verdadera se vaya a cero.

## Definición

Se busca $y(t)$ con $y'(t) = f(t, y(t))$ y $y(t_0) = y_0$, sobre los tiempos $t_k = t_0 + k h$.

:::definicion[Métodos de Euler y de Runge-Kutta]
- **Euler:** $y_{k+1} = y_k + h\,f(t_k, y_k)$.
- **Heun (Runge-Kutta de orden 2):** $k_1 = f(t_k, y_k)$, $k_2 = f(t_k + h, y_k + h k_1)$, $y_{k+1} = y_k + \tfrac{h}{2}(k_1 + k_2)$.
- **Runge-Kutta de orden 4:**
$$
\begin{aligned}
k_1 &= f(t_k, y_k), & k_2 &= f\big(t_k + \tfrac{h}{2},\ y_k + \tfrac{h}{2}k_1\big),\\
k_3 &= f\big(t_k + \tfrac{h}{2},\ y_k + \tfrac{h}{2}k_2\big), & k_4 &= f(t_k + h,\ y_k + h k_3),
\end{aligned}
\qquad y_{k+1} = y_k + \tfrac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4).
$$
:::

Si $f$ es suave, el error global en un tiempo fijo es de orden $h$ para Euler, $h^2$ para Heun y $h^4$ para Runge-Kutta 4. En la ecuación de prueba $y' = \lambda y$ con $\lambda < 0$, Euler multiplica $y$ por $1 + h\lambda$ en cada paso y solo es estable si $|1 + h\lambda| < 1$, es decir, $h < 2/|\lambda|$.

:::nota[Qué significa cada símbolo]
- $y(t)$: solución buscada; $y'$: su derivada respecto a $t$.
- $f(t, y)$: lado derecho de la ecuación, la pendiente en $(t, y)$.
- $t_0$, $y_0$: condición inicial; $t_k$: tiempo del paso $k$.
- $h$: tamaño del paso; $y_k$: aproximación de $y(t_k)$.
- $k_1, \dots, k_4$: pendientes estimadas dentro del paso.
- $\lambda$: tasa de la ecuación de prueba $y' = \lambda y$.
:::

## Cómo usar la visualización

La curva azul es la solución exacta y los puntos de colores son los pasos de cada método, unidos por segmentos. La reproducción avanza un paso por cuadro y el encabezado escribe la ecuación, el paso y el valor exacto en el tiempo actual; las lecturas dan el error de cada método. El control cambia el tamaño del paso.

En la ecuación logística con $h = 0.5$, Euler queda visiblemente por debajo durante el crecimiento, con error final de $2 \times 10^{-3}$, mientras que Runge-Kutta 4 coincide con la curva a simple vista, con error de $9 \times 10^{-6}$. Al reducir el paso a la mitad, el error de Euler se reduce a la mitad y el de Runge-Kutta 4 unas 16 veces.

## Ejemplo

Un paso con $h = 0.1$ para $y' = -2y$, $y(0) = 1$, cuya solución es $e^{-2t}$.

1. Euler: $y_1 = 1 + 0.1 \cdot (-2) = 0.8$.
2. Runge-Kutta 4: $k_1 = -2$; $k_2 = -2(1 + 0.05 \cdot (-2)) = -1.8$; $k_3 = -2(1 + 0.05 \cdot (-1.8)) = -1.82$; $k_4 = -2(1 + 0.1 \cdot (-1.82)) = -1.636$.
3. $y_1 = 1 + \tfrac{0.1}{6}(-2 - 3.6 - 3.64 - 1.636) = 0.8187333$.
4. El valor exacto es $e^{-0.2} = 0.8187308$: Euler se equivoca en $0.019$ y Runge-Kutta 4 en $2.6 \times 10^{-6}$.
5. En $t = 3$, con 30 pasos, los errores son $1.2 \times 10^{-3}$ y $2.3 \times 10^{-7}$.

:::figura[$y' = -2y$ con $h = 0.1$: los puntos de Euler quedan siempre por debajo de la curva, porque usan la pendiente del inicio del paso, que es la más empinada; los de Runge-Kutta 4 están sobre ella.]{componente="NumericsLab"}
```yaml
modo: edo
ecuacion: decaimiento
h: 0.1
metodos: [euler, rk4]
```
:::

## Propiedades

- **Orden:** al dividir el paso entre 2, el error se divide entre $2^p$ con $p = 1$, 2 y 4 para Euler, Heun y Runge-Kutta 4.

:::figura[$y' = \cos t - y$ con $h = 0.4$ y los tres métodos: los errores en $t = 8$ son $0.11$, $0.024$ y $1.4 \times 10^{-4}$. Con $h = 0.2$ bajan a $0.052$, $0.0053$ y $7.4 \times 10^{-6}$: factores 2, 4.5 y 18.]{componente="NumericsLab"}
```yaml
modo: edo
ecuacion: forzada
h: 0.4
metodos: [euler, rk2, rk4]
```
:::

- **Costo:** Runge-Kutta 4 evalúa $f$ cuatro veces por paso, pero su mayor orden permite pasos mucho más grandes para la misma exactitud.
- **Paso adaptable:** comparar dos métodos de órdenes distintos en el mismo paso estima el error y permite ajustar $h$, como en los pares de Runge-Kutta-Fehlberg.
- **Estabilidad de Euler:** en $y' = \lambda y$ con $\lambda < 0$ requiere $h < 2/|\lambda|$; los métodos implícitos no tienen esa restricción.
- **Sistemas:** los mismos métodos se aplican a vectores $\mathbf{y}' = \mathbf{f}(t, \mathbf{y})$, y las ecuaciones de orden superior se escriben como sistemas de primer orden.

## Errores comunes

- **Usar un paso grande en una ecuación rígida.** En $y' = -30y$ con $h = 0.1$ cada paso de Euler multiplica por $1 - 3 = -2$ y tras 10 pasos el resultado es 1024, cuando la solución exacta es casi 0.

:::figura[$y' = -30y$ con Euler y $h = 0.1$: los puntos alternan de signo y su tamaño se duplica en cada paso, mientras la solución exacta $e^{-30t}$ cae a cero. Con $h$ menor que $2/30 = 0.067$ el método se estabiliza.]{componente="NumericsLab"}
```yaml
modo: edo
ecuacion: rigida
h: 0.1
metodos: [euler]
```
:::

- **Juzgar un método por un solo paso.** Lo que importa es el error acumulado en el tiempo final, que combina errores locales de todos los pasos.
- **Bajar el paso indefinidamente.** Con millones de pasos el redondeo acumulado termina por dominar, igual que en la diferenciación numérica.
- **Creer que una solución numérica suave es correcta.** Un método estable con paso grande puede dar una curva suave que se aleja de la verdadera.

## Conexiones

Usa la pendiente de la [[derivada-como-pendiente-y-razon-de-cambio]] y su análisis de error es el del [[error-de-redondeo-y-error-de-truncamiento]]. Integrar $y' = f(t)$ con Runge-Kutta 4 coincide con la [[regla-de-simpson]], y la condición de estabilidad de Euler es un caso de la [[estabilidad-numerica]]. Las mismas ideas sirven para simular ecuaciones diferenciales estocásticas y para entrenar modelos de difusión.

## Formulario

:::formula[Euler]
$$
y_{k+1} = y_k + h\,f(t_k, y_k)
$$

- $h$: paso; $f$: lado derecho de la ecuación.
:::

:::formula[Heun]
$$
y_{k+1} = y_k + \frac{h}{2}\big(f(t_k, y_k) + f(t_k + h,\ y_k + h f(t_k, y_k))\big)
$$

- Promedia la pendiente del inicio y la de un paso de Euler de prueba.
:::

:::formula[Runge-Kutta 4]
$$
y_{k+1} = y_k + \frac{h}{6}\big(k_1 + 2k_2 + 2k_3 + k_4\big)
$$

- $k_1, \dots, k_4$: pendientes al inicio, dos veces a la mitad y al final del paso.
:::

:::formula[Órdenes de error global]
$$
|y_N - y(t_N)| \approx C h^{p}, \qquad p_{\text{Euler}} = 1,\ p_{\text{Heun}} = 2,\ p_{\text{RK4}} = 4
$$

- $y_N$: aproximación final; $C$: constante del problema.
:::

:::formula[Estabilidad de Euler en la ecuación de prueba]
$$
y_{k+1} = (1 + h\lambda)\,y_k, \qquad |1 + h\lambda| < 1 \iff 0 < h < \frac{2}{|\lambda|}\ \ (\lambda < 0)
$$

- $\lambda$: tasa de decaimiento.
:::
