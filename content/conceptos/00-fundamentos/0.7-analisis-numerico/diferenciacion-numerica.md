---
id: diferenciacion-numerica
titulo: Diferenciación numérica
titulo_en: Numerical differentiation
alias:
  - diferencias finitas
  - diferencia centrada
  - extrapolación de Richardson
modulo: 0
submodulo: '0.7'
orden: 13
nivel: intermedio
prerrequisitos:
  - error-de-redondeo-y-error-de-truncamiento
etiquetas:
  - diferencias finitas
  - derivadas
  - orden de un método
  - paso óptimo
resumen: >
  La diferenciación numérica aproxima una derivada con valores de la función en puntos cercanos; la
  diferencia centrada tiene error de orden h² y el paso no puede bajar sin límite por el redondeo.
formula: 'f''(x) \approx \frac{f(x + h) - f(x - h)}{2h}, \qquad \text{error} = \frac{f''''''(\xi)}{6}h^2'
visualizacion:
  componente: NumericsLab
  parametros:
    modo: error-paso
    funcion: polinomio
    x0: 0.5
    esquema: centrada
referencias:
  - clave: goodfellow
    capitulo: '4'
publicado: true
---

## Intuición

Cuando una función se conoce solo por un programa que la evalúa, como la salida de una simulación o el valor de un modelo ajustado, no hay fórmula que derivar. Lo que sí se puede hacer es evaluarla en dos puntos cercanos y calcular la pendiente de la recta que los une. Si los puntos están cerca, esa pendiente se parece a la de la tangente.

La forma de elegir los puntos importa. La diferencia hacia adelante usa $x$ y $x + h$ y su recta está inclinada hacia un lado; la centrada usa $x - h$ y $x + h$, simétricos, y los errores de la curvatura de los dos lados se cancelan, así que con el mismo $h$ es mucho más exacta. El paso tampoco puede ser arbitrariamente pequeño: cuando $h$ es diminuto, los dos valores de la función son casi iguales y su resta conserva solo el ruido del redondeo, que luego se divide entre $h$.

## Definición

:::definicion[Fórmulas de diferencias finitas]
Para $h > 0$:
$$
D_h^{+} f(x) = \frac{f(x + h) - f(x)}{h}, \qquad D_h^{0} f(x) = \frac{f(x + h) - f(x - h)}{2h}, \qquad D_h^{2} f(x) = \frac{f(x + h) - 2f(x) + f(x - h)}{h^2}.
$$
Por la serie de Taylor, si $f$ es suficientemente derivable,
$$
D_h^{+} f(x) = f'(x) + \tfrac{1}{2}f''(\xi_1)\,h, \qquad D_h^{0} f(x) = f'(x) + \tfrac{1}{6}f'''(\xi_2)\,h^2, \qquad D_h^{2} f(x) = f''(x) + \tfrac{1}{12}f^{(4)}(\xi_3)\,h^2.
$$
:::

En punto flotante cada evaluación tiene un error relativo del orden de $\varepsilon$, que la fórmula divide entre $h$; el paso que equilibra ambos errores es del orden de $\sqrt{\varepsilon} \approx 10^{-8}$ para la diferencia hacia adelante y de $\sqrt[3]{\varepsilon} \approx 10^{-5}$ para la centrada.

:::nota[Qué significa cada símbolo]
- $f$: función que se deriva; $x$: punto donde se estima la derivada.
- $h$: paso, la distancia entre los puntos evaluados.
- $D_h^{+}$, $D_h^{0}$: diferencias hacia adelante y centrada; $D_h^{2}$: diferencia centrada de segundo orden para $f''$.
- $\xi_1$, $\xi_2$, $\xi_3$: puntos intermedios cerca de $x$ que da el teorema de Taylor.
- $f'''$, $f^{(4)}$: tercera y cuarta derivadas.
- $\varepsilon$: épsilon de máquina.
:::

## Cómo usar la visualización

El eje horizontal es el logaritmo del paso, de 1 a $10^{-16}$, y el vertical el logaritmo del error de la derivada de $x^3 - 2x + 1$ en $x = 0.5$, cuyo valor exacto es $-1.25$. La línea azul es el error medido y las punteadas son los modelos de truncamiento y redondeo. La reproducción recorre los pasos y el encabezado escribe el cociente, su error y los dos términos. El control cambia entre la diferencia centrada y la hacia adelante.

Con la diferencia centrada el error baja con pendiente 2: al reducir $h$ diez veces, el error se reduce cien. Con la hacia adelante la pendiente es 1. En los dos casos, por debajo de cierto paso el error vuelve a subir.

## Ejemplo

Se estima la derivada de $\sqrt{x}$ en $x = 0.5$, cuyo valor exacto es $1/(2\sqrt{0.5}) = 0.7071068$.

1. Hacia adelante con $h = 0.01$: $\dfrac{\sqrt{0.51} - \sqrt{0.5}}{0.01} = 0.7036062$, error $-0.0035$.
2. Centrada con $h = 0.01$: $\dfrac{\sqrt{0.51} - \sqrt{0.49}}{0.02} = 0.7071421$, error $3.5 \times 10^{-5}$, cien veces menor.
3. Con $h = 0.001$ los errores son $-3.5 \times 10^{-4}$ y $3.5 \times 10^{-7}$: el primero baja diez veces y el segundo cien, como predicen los órdenes 1 y 2.
4. Extrapolación de Richardson: $\dfrac{4D_{0.005}^{0} - D_{0.01}^{0}}{3} = 0.70710678$, con error $1.5 \times 10^{-9}$, porque elimina el término en $h^2$.

:::figura[La derivada de $\sqrt{x}$ en 0.5 con la diferencia hacia adelante y $h = 10^{-3}$: el error es $3.5 \times 10^{-4}$, sobre la recta de pendiente 1 del truncamiento.]{componente="NumericsLab"}
```yaml
modo: error-paso
funcion: raiz
x0: 0.5
esquema: adelante
paso: -3
```
:::

## Propiedades

- **Simetría:** la diferencia centrada cancela los términos pares del desarrollo de Taylor y gana un orden respecto a la hacia adelante con el mismo número de evaluaciones.

:::figura[La derivada de $e^x$ en 0 con la diferencia centrada y $h = 10^{-4}$: el error es $1.7 \times 10^{-9}$, mientras que la diferencia hacia adelante con el mismo paso se equivoca en $5 \times 10^{-5}$.]{componente="NumericsLab"}
```yaml
modo: error-paso
funcion: exponencial
x0: 0
esquema: centrada
paso: -4
```
:::

- **Exactitud en polinomios:** la diferencia centrada es exacta para polinomios de grado 2 y la de segundo orden para grado 3, salvo el redondeo.
- **Richardson:** combinar dos pasos, $\tfrac{4D_{h/2} - D_h}{3}$, elimina el término principal del error y sube el orden.
- **Gradientes:** con $n$ variables, un gradiente por diferencias hacia adelante cuesta $n + 1$ evaluaciones; por eso en aprendizaje automático se usa la diferenciación automática.
- **Comprobación de gradientes:** comparar un gradiente programado con diferencias centradas detecta errores de implementación.

## Errores comunes

- **Usar un paso diminuto.** Con $h = 10^{-15}$ la derivada de $x^3 - 2x + 1$ en 0.5 se equivoca en $0.03$, mientras que la diferencia centrada con $h = 10^{-6}$ acierta en 11 cifras.

:::figura[$h = 10^{-15}$ en la diferencia hacia adelante del polinomio: el punto queda arriba a la izquierda, sobre la línea del redondeo, con un error de $2.9 \times 10^{-2}$.]{componente="NumericsLab"}
```yaml
modo: error-paso
funcion: polinomio
x0: 0.5
esquema: adelante
paso: -15
```
:::

- **Derivar datos con ruido.** Si los valores de $f$ tienen ruido de tamaño $\sigma$, el error crece como $\sigma/h$ y conviene suavizar antes de derivar.
- **Usar el mismo paso para variables de escalas distintas.** El paso debe ser proporcional al tamaño de cada variable.
- **Confundirla con la diferenciación automática.** Las diferencias finitas aproximan; la diferenciación automática calcula la derivada exacta del programa, salvo redondeo.

## Conexiones

Aproxima la [[derivada-como-pendiente-y-razon-de-cambio]] y su error es el ejemplo típico del [[error-de-redondeo-y-error-de-truncamiento]]. La [[diferenciacion-automatica]] obtiene derivadas exactas sin elegir paso. Las mismas diferencias aparecen en los [[metodos-numericos-para-ecuaciones-diferenciales]] y en la [[regla-de-simpson]], que también gana orden por simetría.

## Formulario

:::formula[Diferencia hacia adelante]
$$
D_h^{+} f(x) = \frac{f(x + h) - f(x)}{h} = f'(x) + \tfrac{1}{2}f''(\xi_1)h
$$

- $h$: paso; $\xi_1$: punto entre $x$ y $x + h$.
:::

:::formula[Diferencia centrada]
$$
D_h^{0} f(x) = \frac{f(x + h) - f(x - h)}{2h} = f'(x) + \tfrac{1}{6}f'''(\xi_2)h^2
$$

- $\xi_2$: punto entre $x - h$ y $x + h$.
:::

:::formula[Segunda derivada]
$$
D_h^{2} f(x) = \frac{f(x + h) - 2f(x) + f(x - h)}{h^2} = f''(x) + \tfrac{1}{12}f^{(4)}(\xi_3)h^2
$$

- $f^{(4)}$: cuarta derivada; $\xi_3$: punto intermedio.
:::

:::formula[Extrapolación de Richardson]
$$
D_{\text{R}} = \frac{4D_{h/2}^{0} - D_{h}^{0}}{3} = f'(x) + O(h^4)
$$

- $D_{h}^{0}$, $D_{h/2}^{0}$: diferencias centradas con pasos $h$ y $h/2$.
:::

:::formula[Pasos óptimos]
$$
h^{+} \approx \sqrt{\varepsilon}, \qquad h^{0} \approx \sqrt[3]{\varepsilon}
$$

- $\varepsilon$: épsilon de máquina; valen cerca de $10^{-8}$ y $10^{-5}$ en precisión doble para funciones de tamaño 1.
:::
