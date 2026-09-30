---
id: factorial
titulo: Factorial
titulo_en: Factorial
alias:
  - n factorial
  - fórmula de Stirling
  - aproximación de Stirling
modulo: 0
submodulo: '0.2'
orden: 3
nivel: basico
prerrequisitos:
  - principio-del-producto
etiquetas:
  - conteo
  - factorial
  - crecimiento
  - aproximación de Stirling
resumen: >
  El factorial n! es el producto de los enteros de 1 a n y cuenta las formas de ordenar n objetos
  distintos. Crece más rápido que cualquier exponencial y se aproxima con la fórmula de Stirling.
formula: 'n! = n (n-1) \cdots 2 \cdot 1,\qquad 0! = 1'
visualizacion:
  componente: CombinatoricsBoard
  parametros:
    modo: crecimiento
    nMax: 25
referencias:
  - clave: ross-probabilidad
    capitulo: '1'
publicado: true
---

## Intuición

Una biblioteca recibe 10 libros nuevos y los acomoda en un estante vacío. Para el primer lugar hay 10 libros posibles; una vez elegido, quedan 9 para el segundo, luego 8, y así hasta que para el último lugar queda un solo libro. Por el principio del producto, hay $10 \cdot 9 \cdots 1 = 3628800$ acomodos distintos. Ese producto es el factorial de 10.

El factorial crece de manera asombrosa. Con 20 libros ya hay más de dos trillones de acomodos, un número de 19 cifras; con 52 cartas de una baraja, el número de órdenes posibles tiene 68 cifras, tantas que es casi seguro que ningún orden de una baraja bien revuelta se haya repetido en la historia. Como calcular factoriales grandes directamente es impráctico, se usa la aproximación de Stirling, que da su tamaño con un error relativo muy pequeño.

## Definición

:::definicion[Factorial]
Para un entero $n \ge 1$,
$$
n! = \prod_{i=1}^{n} i = n(n-1)\cdots 2 \cdot 1,
$$
y por convención $0! = 1$. Equivalentemente, $0! = 1$ y $n! = n \cdot (n-1)!$ para $n \ge 1$.
:::

La convención $0! = 1$ corresponde a que hay una sola forma de ordenar cero objetos (no hacer nada) y es la que mantiene válida la recursión y las fórmulas de conteo.

:::teorema[Fórmula de Stirling]
$$
n! \sim \sqrt{2\pi n}\left(\frac{n}{e}\right)^{n}, \qquad \text{es decir,} \quad \lim_{n \to \infty} \frac{n!}{\sqrt{2\pi n}\,(n/e)^{n}} = 1.
$$
:::

:::nota[Qué significa cada símbolo]
- $n$: número de objetos distintos que se ordenan.
- $n!$: factorial de $n$, el producto $n(n-1)\cdots 1$.
- $\prod$: productoria, multiplicar todos los términos.
- $\pi \approx 3.1416$ y $e \approx 2.71828$: constantes que aparecen en la fórmula de Stirling.
- $\sim$: "es asintóticamente igual a", el cociente tiende a 1.
- $\Gamma$: función gamma, que extiende el factorial a los reales.
:::

## Cómo usar la visualización

La gráfica usa escala logarítmica en el eje vertical: su altura es el número de cifras. Las curvas muestran $n!$, la aproximación de Stirling, $2^n$ y $n^n$, y se dibujan conforme avanza la reproducción. El control marca un valor de $n$; el panel muestra $n!$, su aproximación, el error relativo y el número de cifras.

En $n = 5$ la aproximación de Stirling se queda corta en cerca de 1.6 %; en $n = 20$ el error baja a unas cuatro décimas de punto porcentual, aunque el número tiene 19 cifras. La curva de $n!$ queda siempre entre la de $2^n$ y la de $n^n$, y se separa de la exponencial cada vez más.

## Ejemplo

Un entrenador de natación decide el orden de salida de 8 nadadores en un relevo de práctica.

1. Hay $8! = 8 \cdot 7 \cdot 6 \cdot 5 \cdot 4 \cdot 3 \cdot 2 \cdot 1 = 40320$ órdenes posibles.
2. Si ya se decidió quién sale primero, los otros 7 se ordenan de $7! = 5040$ maneras, y en efecto $8! = 8 \cdot 7!$.
3. La aproximación de Stirling da $\sqrt{16\pi}\,(8/e)^{8} \approx 7.090 \cdot 5.628 \times 10^{3} \approx 39902$.
4. El error relativo es $(40320 - 39902)/40320 \approx 1.0\,\%$, cercano a $1/(12 \cdot 8) \approx 1.04\,\%$.

:::figura[El orden de salida de los 8 nadadores. Cada lugar tiene una opción menos que el anterior y el producto llega a $8! = 40320$; si el primer lugar ya está decidido, esa casilla tiene una sola opción y quedan $7! = 5040$ órdenes.]{componente="CombinatoricsBoard"}
```yaml
modo: casillas
escenarios:
  - nombre: Todos por decidir
    casillas:
      - etiqueta: lugar 1
        opciones: 8
      - etiqueta: lugar 2
        opciones: 7
      - etiqueta: lugar 3
        opciones: 6
      - etiqueta: lugar 4
        opciones: 5
      - etiqueta: lugar 5
        opciones: 4
      - etiqueta: lugar 6
        opciones: 3
      - etiqueta: lugar 7
        opciones: 2
      - etiqueta: lugar 8
        opciones: 1
  - nombre: Primero decidido
    casillas:
      - etiqueta: lugar 1
        opciones: 1
      - etiqueta: lugar 2
        opciones: 7
      - etiqueta: lugar 3
        opciones: 6
      - etiqueta: lugar 4
        opciones: 5
      - etiqueta: lugar 5
        opciones: 4
      - etiqueta: lugar 6
        opciones: 3
      - etiqueta: lugar 7
        opciones: 2
      - etiqueta: lugar 8
        opciones: 1
```
:::

## Propiedades

- **Recursión:** $n! = n \cdot (n-1)!$.
- **Cocientes:** $\frac{n!}{(n-k)!} = n(n-1)\cdots(n-k+1)$ tiene $k$ factores.
- **Crecimiento:** para todo $a > 0$ fijo, $a^n / n! \to 0$; y $n!/n^n \to 0$. Así, $a^n \ll n! \ll n^n$.
- **Error de Stirling:** $n! = \sqrt{2\pi n}(n/e)^n \left(1 + \frac{1}{12n} + O(n^{-2})\right)$, por lo que el error relativo es aproximadamente $1/(12n)$.
- **Función gamma:** $n! = \Gamma(n + 1)$, que extiende el factorial a números reales no enteros.
- **Logaritmo:** $\log n! = n\log n - n + \tfrac{1}{2}\log(2\pi n) + o(1)$; en cálculos con probabilidades se trabaja con $\log n!$ para evitar desbordamientos.

## Errores comunes

- **Pensar que $0! = 0$.** Por convención y por coherencia con las fórmulas, $0! = 1$.
- **Simplificar mal cocientes.** $\frac{10!}{8!} = 10 \cdot 9 = 90$, no $\frac{10}{8}$.
- **Calcular factoriales grandes directamente.** En una computadora, $171!$ ya excede el máximo de un número de punto flotante de doble precisión; conviene usar logaritmos.
- **Confundir $(2n)!$ con $2 \cdot n!$.** $(2 \cdot 3)! = 720$, mientras que $2 \cdot 3! = 12$.

## Conexiones

El factorial es el caso de ordenar todos los objetos en el [[principio-del-producto]]. Aparece en las [[permutaciones]], el [[coeficiente-binomial]] y el [[coeficiente-multinomial]], y su definición recursiva se estudia con [[induccion-matematica]]. En probabilidad, la fórmula de Stirling permite aproximar coeficientes binomiales grandes y explica la forma de la distribución de Poisson.

## Formulario

:::formula[Factorial]
$$
n! = n(n-1)\cdots 2 \cdot 1, \qquad 0! = 1
$$

- $n$: entero no negativo, número de objetos.
- $0! = 1$: una sola forma de ordenar cero objetos.
:::

:::formula[Recursión]
$$
n! = n \cdot (n-1)!
$$

- $(n-1)!$: órdenes de los objetos restantes una vez elegido el primero.
:::

:::formula[Fórmula de Stirling]
$$
n! \approx \sqrt{2\pi n}\left(\frac{n}{e}\right)^{n}, \qquad \text{error relativo} \approx \frac{1}{12n}
$$

- $n$: número grande.
- $e$: base de los logaritmos naturales.
- $\pi$: la constante del círculo.
:::

:::formula[Cociente de factoriales]
$$
\frac{n!}{(n-k)!} = n(n-1)\cdots(n-k+1)
$$

- $k$: número de factores que quedan, con $k \le n$.
:::
