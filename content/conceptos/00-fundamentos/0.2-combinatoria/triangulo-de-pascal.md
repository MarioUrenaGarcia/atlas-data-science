---
id: triangulo-de-pascal
titulo: Triángulo de Pascal
titulo_en: Pascal's triangle
alias:
  - triángulo de Tartaglia
  - triángulo aritmético
modulo: 0
submodulo: '0.2'
orden: 12
nivel: basico
prerrequisitos:
  - identidades-del-coeficiente-binomial
etiquetas:
  - coeficiente binomial
  - triángulo de Pascal
  - patrones
  - recursión
resumen: >
  El triángulo de Pascal acomoda los coeficientes binomiales en filas: la fila n contiene C(n, 0), ..., C(n, n)
  y cada entrada es la suma de las dos que tiene encima. Sus filas suman potencias de 2.
formula: '\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}'
visualizacion:
  componente: PascalTriangle
  parametros:
    modo: triangulo
    filas: 12
referencias:
  - clave: ross-probabilidad
    capitulo: '1'
publicado: true
---

## Intuición

El triángulo de Pascal se construye con una regla muy simple: se escribe un 1 en la cima; cada fila empieza y termina en 1; y cada número interior es la suma de los dos números que tiene justo encima. Las primeras filas son 1; 1 1; 1 2 1; 1 3 3 1; 1 4 6 4 1.

Lo notable es que esos números no son arbitrarios: la entrada $k$ de la fila $n$ (contando desde cero) es exactamente $\binom{n}{k}$, el número de formas de elegir $k$ objetos de $n$. La regla de construcción es la regla de Pascal: para elegir $k$ de $n$, o se incluye un objeto fijo y se eligen $k - 1$ de los demás, o no se incluye y se eligen $k$ de los demás.

El triángulo concentra muchas propiedades a la vista: la simetría izquierda derecha, las sumas de las filas que se duplican, las diagonales que contienen los números naturales y los números triangulares, y patrones sorprendentes cuando se colorean sus entradas pares e impares.

## Definición

:::definicion[Triángulo de Pascal]
Es el arreglo triangular $T(n, k)$ con $0 \le k \le n$ definido por
$$
T(n, 0) = T(n, n) = 1, \qquad T(n, k) = T(n-1, k-1) + T(n-1, k) \quad (0 < k < n).
$$
:::

:::teorema
$T(n, k) = \binom{n}{k}$ para todo $0 \le k \le n$.
:::

:::demostracion
Por inducción sobre $n$. Para $n = 0$ ambas valen 1. Si la igualdad vale para la fila $n - 1$, los bordes de la fila $n$ valen $1 = \binom{n}{0} = \binom{n}{n}$ y cada entrada interior es $\binom{n-1}{k-1} + \binom{n-1}{k}$, que por la regla de Pascal es $\binom{n}{k}$.
:::

## Cómo usar la visualización

El triángulo se construye celda por celda. Al calcular cada celda se resaltan sus dos celdas padre y el panel muestra la suma; también se indica la suma de su fila. El control de filas cambia el tamaño.

Al activar "Colorear por residuo" con módulo 2, las entradas impares se pintan y las pares quedan en gris: con 16 filas aparece un patrón de triángulos dentro de triángulos, el triángulo de Sierpinski. Con módulo 3 o 5 aparecen patrones autosemejantes distintos; con módulo 4, que no es primo, el patrón es menos regular.

## Ejemplo

Se usan las filas del triángulo para responder preguntas sobre un torneo de 6 equipos en el que cada par de equipos juega una vez.

1. La fila 6 es 1, 6, 15, 20, 15, 6, 1.
2. El número de partidos es $\binom{6}{2} = 15$, la tercera entrada.
3. El número de formas de elegir 3 equipos para una fase de grupos es $\binom{6}{3} = 20$, la entrada central y la mayor de la fila.
4. La suma de la fila es $1 + 6 + 15 + 20 + 15 + 6 + 1 = 64 = 2^6$: el número total de subconjuntos de equipos.

:::figura[Los 15 partidos del torneo de 6 equipos: cada tarjeta es una pareja de equipos, y el número de parejas es la entrada $\binom{6}{2}$ de la fila 6 del triángulo.]{componente="CombinatoricsBoard"}
```yaml
modo: combinaciones
objetos: [A, B, C, D, E, F]
k: 2
```
:::

## Propiedades

- **Simetría:** cada fila se lee igual de izquierda a derecha y de derecha a izquierda.
- **Suma de filas:** la fila $n$ suma $2^n$; la suma alternada es 0 para $n \ge 1$.
- **Diagonales:** la segunda diagonal contiene los naturales $1, 2, 3, \dots$; la tercera, los números triangulares $1, 3, 6, 10, \dots$
- **Palo de hockey:** la suma de las entradas de una diagonal, desde el borde hasta cierta fila, es la entrada que queda debajo y a un lado del final.
- **Fibonacci:** las sumas de las diagonales poco inclinadas dan los números de Fibonacci.
- **Paridad:** $\binom{n}{k}$ es impar si y solo si cada bit de $k$ es menor o igual que el bit correspondiente de $n$ (teorema de Lucas), lo que produce el patrón de Sierpinski.
- **Potencias de 11:** las filas 0 a 4 leídas como números dan $11^0, \dots, 11^4$.

## Errores comunes

- **Numerar desde 1.** La cima es la fila 0 y la primera entrada de cada fila es $k = 0$.
- **Sumar números que no son vecinos.** Cada entrada es la suma de las dos que están inmediatamente encima, a la izquierda y a la derecha.
- **Pensar que el triángulo es solo un truco de cálculo.** Cada entrada cuenta subconjuntos y su construcción es una demostración combinatoria.

## Conexiones

El triángulo organiza los valores del [[coeficiente-binomial]] y su regla de construcción es una de las [[identidades-del-coeficiente-binomial]]. Sus filas son los coeficientes del [[teorema-del-binomio]], y la versión en tres dimensiones corresponde al [[coeficiente-multinomial]]. La recursión que lo define es un ejemplo de [[relaciones-de-recurrencia-lineales|recurrencia]] con dos índices. En probabilidad, la fila $n$ dividida entre $2^n$ es la distribución binomial con $p = 1/2$.
