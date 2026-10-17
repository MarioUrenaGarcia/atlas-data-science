---
id: metodo-de-newton-raphson
titulo: Método de Newton-Raphson
titulo_en: Newton-Raphson method
alias:
  - método de Newton para raíces
  - método de la tangente
modulo: 0
submodulo: '0.7'
orden: 6
nivel: intermedio
prerrequisitos:
  - derivada-como-pendiente-y-razon-de-cambio
relaciones:
  - tipo: contrasta
    id: metodo-de-biseccion
  - tipo: relacionado
    id: metodo-de-newton
etiquetas:
  - raíces
  - tangente
  - convergencia cuadrática
  - algoritmos
resumen: >
  Newton-Raphson aproxima una raíz siguiendo la recta tangente hasta el eje: x_(k+1) = x_k - f(x_k)/f'(x_k).
  Cerca de una raíz simple duplica las cifras correctas en cada paso, pero desde lejos puede divergir.
formula: 'x_{k+1} = x_k - \frac{f(x_k)}{f''(x_k)}'
visualizacion:
  componente: AlgorithmStepper
  parametros:
    algoritmo: newton-raphson
    valores:
      funcion: cubica
      x0: 1.5
      tolerancia: -12
referencias:
  - clave: boyd
publicado: true
---

## Intuición

Cerca de un punto, una curva suave se parece a su recta tangente. Encontrar dónde una recta corta el eje es fácil, así que Newton-Raphson reemplaza la curva por su tangente, calcula dónde corta el eje y usa ese punto como la siguiente aproximación. Repetido, este razonamiento acerca los puntos a la raíz cada vez con más fuerza.

La ventaja es la velocidad: cuando la aproximación ya está cerca, el error del paso siguiente es proporcional al cuadrado del error actual, de modo que el número de cifras correctas se duplica en cada paso. Una raíz con 15 cifras se obtiene en cuatro o cinco iteraciones. El costo es que se necesita la derivada y que el método no tiene la garantía de la bisección: si se empieza lejos, o si la tangente es casi horizontal, el siguiente punto puede saltar muy lejos y la sucesión puede oscilar o divergir.

## Definición

:::definicion[Método de Newton-Raphson]
Sea $f$ derivable y $x_0$ un punto inicial. Para $k = 0, 1, 2, \dots$
$$
x_{k+1} = x_k - \frac{f(x_k)}{f'(x_k)},
$$
mientras $f'(x_k) \ne 0$. Es el cero de la recta tangente $y = f(x_k) + f'(x_k)(x - x_k)$.
:::

:::teorema[Convergencia local cuadrática]
Si $f$ tiene segunda derivada continua, $f(r) = 0$ y $f'(r) \ne 0$, existe un intervalo alrededor de $r$ tal que para todo $x_0$ en él la sucesión converge a $r$ y
$$
|x_{k+1} - r| \approx \frac{|f''(r)|}{2|f'(r)|}\,|x_k - r|^2.
$$
:::

:::nota[Qué significa cada símbolo]
- $f$: función cuya raíz se busca; $f'$: su derivada; $f''$: su segunda derivada.
- $x_k$: aproximación en el paso $k$; $x_0$: punto inicial.
- $r$: raíz, con $f(r) = 0$.
- $|x_k - r|$: error de la aproximación $k$.
:::

## Cómo usar la visualización

A la izquierda, el pseudocódigo con la línea actual y los valores de $x_k$, $f(x_k)$ y $f'(x_k)$; a la derecha, la gráfica con la tangente en el punto actual y su cruce con el eje, que es el siguiente punto. La reproducción da un paso por cuadro. Los controles cambian la función, el punto inicial y la tolerancia.

Con $x^3 - x - 2$ desde 1.5, en tres pasos el error es menor que $10^{-13}$. Con $\arctan x$, desde 1.3 los puntos oscilan alrededor de 0 y convergen; desde 1.5 las tangentes los lanzan cada vez más lejos.

## Ejemplo

Se busca la raíz de $f(x) = x^3 - x - 2$, con $f'(x) = 3x^2 - 1$, desde $x_0 = 1.5$.

1. $f(1.5) = -0.125$ y $f'(1.5) = 5.75$: $x_1 = 1.5 + 0.125/5.75 = 1.52173913$.
2. $f(x_1) = 0.00214$ y $f'(x_1) = 5.947$: $x_2 = 1.52137981$.
3. $x_3 = 1.5213797068$, con $|f(x_3)| \approx 5 \times 10^{-14}$.
4. Los errores son $2.1 \times 10^{-2}$, $3.6 \times 10^{-4}$, $1.0 \times 10^{-7}$ y del orden de $10^{-14}$: cada uno es aproximadamente el cuadrado del anterior por $|f''(r)|/(2|f'(r)|) \approx 0.77$.
5. La bisección en $[1, 2]$ necesitaría 19 iteraciones para seis cifras; Newton llega a doce en tres.

:::figura[Newton-Raphson en $\cos x - x$ desde 1: las tangentes llevan a 0.750364, 0.739113 y 0.7390851, y en el cuarto paso el valor ya no cambia en 12 cifras.]{componente="AlgorithmStepper"}
```yaml
algoritmo: newton-raphson
valores:
  funcion: coseno
  x0: 1
  tolerancia: -12
```
:::

## Propiedades

- **Convergencia cuadrática:** en raíces simples el número de cifras correctas aproximadamente se duplica en cada paso.

:::figura[$e^x - 3$ desde $x_0 = 2$: los errores $3.1 \times 10^{-1}$, $4.3 \times 10^{-2}$, $9.0 \times 10^{-4}$, $4.1 \times 10^{-7}$ y $8 \times 10^{-14}$ duplican su número de ceros en cada paso.]{componente="AlgorithmStepper"}
```yaml
algoritmo: newton-raphson
valores:
  funcion: exponencial
  x0: 2
  tolerancia: -12
```
:::

- **Raíces múltiples:** si $f'(r) = 0$, la convergencia se vuelve lineal; en $x^2$ el error solo se reduce a la mitad en cada paso.
- **Interpretación como punto fijo:** es la iteración de $g(x) = x - f(x)/f'(x)$, con $g'(r) = 0$ en raíces simples.
- **Varias variables:** para sistemas $\mathbf{F}(\mathbf{x}) = \mathbf{0}$ se resuelve $\mathbf{J}(\mathbf{x}_k)\,\Delta = -\mathbf{F}(\mathbf{x}_k)$ en cada paso.
- **Optimización:** aplicado a $f'(x) = 0$ es el método de Newton para minimizar.

## Errores comunes

- **Esperar convergencia desde cualquier punto.** Con $\arctan x$ desde 1.5 los iterados son $-1.69$, $2.32$, $-5.11$, $32.3$: cada tangente es más plana y lanza el punto más lejos.

:::figura[Newton-Raphson en $\arctan x$ desde 1.5: los puntos saltan de un lado a otro con amplitud creciente y la sucesión diverge, aunque la raíz 0 está a 1.5 unidades. Desde 1.3 la misma función converge.]{componente="AlgorithmStepper"}
```yaml
algoritmo: newton-raphson
valores:
  funcion: arcotangente
  x0: 1.5
  tolerancia: -12
```
:::

- **Usar el método donde la derivada se anula.** Si $f'(x_k) \approx 0$, el paso $f(x_k)/f'(x_k)$ es enorme.
- **Calcular mal la derivada.** Con una derivada equivocada la convergencia cuadrática se pierde y el método puede no converger.
- **Detenerse solo porque $|f(x_k)|$ es pequeño.** En funciones muy planas, $|f|$ pequeño no garantiza estar cerca de la raíz; conviene vigilar también $|x_{k+1} - x_k|$.

## Conexiones

Usa la recta tangente de la [[derivada-como-pendiente-y-razon-de-cambio]] y su error se analiza con la [[serie-de-taylor-y-de-maclaurin]]. Es mucho más rápido que el [[metodo-de-biseccion]], que sí garantiza convergencia, y aplicado a la derivada se convierte en el [[metodo-de-newton]] de optimización.

## Formulario

:::formula[Paso de Newton-Raphson]
$$
x_{k+1} = x_k - \frac{f(x_k)}{f'(x_k)}
$$

- $x_k$: aproximación actual; $f$: función; $f'$: derivada.
:::

:::formula[Recta tangente]
$$
y = f(x_k) + f'(x_k)(x - x_k)
$$

- Su cruce con $y = 0$ es $x_{k+1}$.
:::

:::formula[Convergencia cuadrática]
$$
|x_{k+1} - r| \approx \frac{|f''(r)|}{2|f'(r)|}\,|x_k - r|^2
$$

- $r$: raíz simple; $f''$: segunda derivada.
:::
