---
id: relaciones-de-recurrencia-lineales
titulo: Relaciones de recurrencia lineales
titulo_en: Linear recurrence relations
alias:
  - recurrencias lineales
  - ecuaciones en diferencias lineales
  - ecuación característica
  - sucesión de Fibonacci
modulo: 0
submodulo: '0.2'
orden: 24
nivel: intermedio
prerrequisitos:
  - induccion-matematica
relaciones:
  - tipo: relacionado
    id: funciones-generadoras-ordinarias
etiquetas:
  - recurrencias
  - ecuación característica
  - Fibonacci
  - crecimiento
resumen: >
  Una recurrencia lineal con coeficientes constantes define cada término como combinación fija de los
  anteriores. Se resuelve con las raíces de su ecuación característica, que determinan si crece, decae u oscila.
formula: 'a_n = c_1 a_{n-1} + c_2 a_{n-2},\qquad r^2 = c_1 r + c_2,\qquad a_n = A\,r_1^{n} + B\,r_2^{n}'
visualizacion:
  componente: RecurrenceViz
  parametros:
    c1: 1
    c2: 1
    a0: 1
    a1: 2
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

¿Cuántas cadenas binarias de longitud $n$ no tienen dos unos seguidos? Se puede pensar en el último símbolo. Si la cadena termina en 0, lo anterior es cualquier cadena válida de longitud $n - 1$. Si termina en 1, el penúltimo símbolo debe ser 0, y lo anterior es cualquier cadena válida de longitud $n - 2$. Así, el número $a_n$ de cadenas válidas cumple $a_n = a_{n-1} + a_{n-2}$, con $a_0 = 1$ (la cadena vacía) y $a_1 = 2$. Los valores son 1, 2, 3, 5, 8, 13, ..., los números de Fibonacci.

Una relación de recurrencia describe una sucesión por la regla que conecta cada término con los anteriores, en lugar de dar una fórmula directa. Las recurrencias lineales con coeficientes constantes tienen además una solución explícita: basta encontrar las raíces de un polinomio. Esas raíces dicen, sin calcular término por término, si la sucesión crece exponencialmente, se amortigua o oscila, y a qué ritmo.

## Definición

:::definicion[Recurrencia lineal homogénea de orden 2]
Es una relación $a_n = c_1 a_{n-1} + c_2 a_{n-2}$ para $n \ge 2$, con constantes $c_1, c_2$ y valores iniciales $a_0, a_1$. Su **ecuación característica** es $r^2 = c_1 r + c_2$.
:::

:::teorema[Solución]
Sean $r_1, r_2$ las raíces de la ecuación característica.

1. Si $r_1 \neq r_2$, entonces $a_n = A\,r_1^{n} + B\,r_2^{n}$.
2. Si $r_1 = r_2 = r \neq 0$, entonces $a_n = (A + Bn)\,r^{n}$.

Las constantes $A$ y $B$ se determinan con $a_0$ y $a_1$. Si las raíces son complejas conjugadas $\rho e^{\pm i\theta}$, la solución real es $a_n = \rho^{n}(A\cos n\theta + B\sin n\theta)$.
:::

:::demostracion
Si $r$ es raíz, $a_n = r^n$ cumple la recurrencia porque $r^n = c_1 r^{n-1} + c_2 r^{n-2}$ equivale a $r^{n-2}(r^2 - c_1 r - c_2) = 0$. Por linealidad, cualquier combinación $Ar_1^n + Br_2^n$ también la cumple, y con dos raíces distintas se pueden ajustar $A$ y $B$ a cualquier par de valores iniciales. Como la recurrencia determina la sucesión a partir de $a_0$ y $a_1$, esa es la solución.
:::

:::nota[Qué significa cada símbolo]
- $a_n$: término $n$ de la sucesión.
- $c_1, c_2$: coeficientes constantes de la recurrencia.
- $a_0, a_1$: valores iniciales.
- $r$: incógnita de la ecuación característica; $r_1, r_2$ sus raíces.
- $A, B$: constantes que se ajustan a los valores iniciales.
- $\rho e^{\pm i\theta}$: raíces complejas, con módulo $\rho$ y ángulo $\theta$.
- $\varphi, \psi$: raíces de la recurrencia de Fibonacci.
:::

## Cómo usar la visualización

Los puntos son los términos calculados con la recurrencia, uno por paso; los círculos huecos son los valores de la forma cerrada, que coinciden con ellos. A la derecha, las raíces características aparecen en el plano complejo junto al círculo unitario. Los controles cambian los coeficientes y los valores iniciales.

Con $c_1 = c_2 = 1$ las raíces son $1.618$ y $-0.618$: la de módulo mayor que 1 domina y la sucesión crece como $1.618^n$. Con $c_1 = 1$ y $c_2 = -0.5$ las raíces son complejas de módulo $0.707$ y la sucesión oscila amortiguándose. Con $c_1 = 1$ y $c_2 = -1$ las raíces están sobre el círculo unitario y la sucesión se repite cada 6 términos.

## Ejemplo

Se resuelve $a_n = 5a_{n-1} - 6a_{n-2}$ con $a_0 = 2$ y $a_1 = 5$, que modela una población con dos cohortes.

1. Ecuación característica: $r^2 - 5r + 6 = 0$, con raíces $r_1 = 3$ y $r_2 = 2$.
2. Solución general: $a_n = A\,3^n + B\,2^n$.
3. Condiciones iniciales: $A + B = 2$ y $3A + 2B = 5$, de donde $A = 1$ y $B = 1$.
4. Forma cerrada: $a_n = 3^n + 2^n$. Comprobación: $a_2 = 5 \cdot 5 - 6 \cdot 2 = 13 = 9 + 4$.

:::figura[La recurrencia del ejemplo, $a_n = 5a_{n-1} - 6a_{n-2}$, con raíces 3 y 2. Los términos calculados coinciden con la forma cerrada $3^n + 2^n$, y la raíz 3, fuera del círculo unitario, domina el crecimiento.]{componente="RecurrenceViz"}
```yaml
c1: 5
c2: -6
a0: 2
a1: 5
terminos: 12
```
:::

## Propiedades

- **Comportamiento a largo plazo:** lo determina la raíz de mayor módulo. Si es menor que 1, $a_n \to 0$; si es mayor que 1, $|a_n|$ crece exponencialmente (salvo que su coeficiente sea 0).
- **Fibonacci:** $F_n = \frac{\varphi^n - \psi^n}{\sqrt{5}}$ con $\varphi = \frac{1 + \sqrt{5}}{2}$ y $\psi = \frac{1 - \sqrt{5}}{2}$ (fórmula de Binet).
- **Orden $d$:** una recurrencia de orden $d$ tiene ecuación característica de grado $d$ y la solución es combinación de $n^j r^n$ para cada raíz $r$ de multiplicidad mayor que $j$.
- **No homogéneas:** $a_n = c_1 a_{n-1} + c_2 a_{n-2} + f(n)$ se resuelven sumando una solución particular a la solución homogénea.
- **Funciones generadoras:** la función generadora de una recurrencia lineal es un cociente de polinomios cuyo denominador es $1 - c_1 x - c_2 x^2$.

Los tres casos de la solución se ven en las raíces características.

:::figura[**Raíces complejas.** Con $a_n = a_{n-1} - 0.5\,a_{n-2}$ las raíces tienen módulo $0.707$: la sucesión oscila y se amortigua.]{componente="RecurrenceViz"}
```yaml
c1: 1
c2: -0.5
a0: 4
a1: 0
```
:::

:::figura[**Raíz doble.** Con $a_n = 2a_{n-1} - a_{n-2}$ la única raíz es 1 y la solución es $(A + Bn) \cdot 1^n$: una recta.]{componente="RecurrenceViz"}
```yaml
c1: 2
c2: -1
a0: 1
a1: 2
```
:::

:::figura[**Raíces sobre el círculo unitario.** Con $a_n = a_{n-1} - a_{n-2}$ las raíces son complejas de módulo 1 y la sucesión se repite cada 6 términos sin crecer ni decaer.]{componente="RecurrenceViz"}
```yaml
c1: 1
c2: -1
a0: 1
a1: 2
```
:::

## Errores comunes

- **Olvidar las condiciones iniciales.** La ecuación característica da la forma de la solución, pero $A$ y $B$ dependen de $a_0$ y $a_1$.
- **Usar $Ar^n + Br^n$ con una raíz doble.** Eso solo tiene una constante efectiva; hay que usar $(A + Bn)r^n$.
- **Confundir el signo de la ecuación característica.** Para $a_n = 5a_{n-1} - 6a_{n-2}$ la ecuación es $r^2 - 5r + 6 = 0$, no $r^2 + 5r - 6 = 0$.
- **Pensar que las raíces negativas o complejas no tienen sentido.** Producen oscilaciones, y los valores de la sucesión siguen siendo reales.

## Conexiones

Una recurrencia define una de las [[sucesiones]] término a término, y la validez de su forma cerrada se demuestra con [[induccion-matematica]]. Las [[funciones-generadoras-ordinarias]] ofrecen otra forma de resolverlas, y recurrencias como las de los [[desarreglos]], los [[numeros-de-catalan]] y el [[triangulo-de-pascal]] aparecen en todo el submódulo. En series de tiempo, los modelos autorregresivos son recurrencias lineales con ruido, y su estabilidad depende de las mismas raíces características.

## Formulario

:::formula[Recurrencia de orden 2 y ecuación característica]
$$
a_n = c_1 a_{n-1} + c_2 a_{n-2}, \qquad r^{2} = c_1 r + c_2
$$

- $c_1, c_2$: coeficientes.
- $r$: incógnita cuya solución da las raíces $r_1$, $r_2$.
:::

:::formula[Raíces distintas]
$$
a_n = A\,r_1^{n} + B\,r_2^{n}
$$

- $r_1 \neq r_2$: raíces de la ecuación característica.
- $A, B$: se obtienen de $a_0$ y $a_1$.
:::

:::formula[Raíz doble]
$$
a_n = (A + Bn)\,r^{n}
$$

- $r$: la raíz repetida.
:::

:::formula[Raíces complejas]
$$
a_n = \rho^{n}(A\cos n\theta + B\sin n\theta)
$$

- $\rho$: módulo de las raíces; decide si crece ($\rho > 1$) o se amortigua ($\rho < 1$).
- $\theta$: ángulo; decide la frecuencia de la oscilación.
:::

:::formula[Fórmula de Binet]
$$
F_n = \frac{\varphi^{n} - \psi^{n}}{\sqrt{5}}, \qquad \varphi = \frac{1 + \sqrt{5}}{2},\ \psi = \frac{1 - \sqrt{5}}{2}
$$

- $F_n$: número de Fibonacci $n$, con $F_0 = 0$ y $F_1 = 1$.
:::
