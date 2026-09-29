---
id: numeros-de-catalan
titulo: Números de Catalan
titulo_en: Catalan numbers
alias:
  - número de Catalan
  - caminos de Dyck
  - paréntesis balanceados
modulo: 0
submodulo: '0.2'
orden: 20
nivel: intermedio
prerrequisitos:
  - coeficiente-binomial
etiquetas:
  - caminos en una rejilla
  - paréntesis balanceados
  - triangulaciones
  - recurrencias
resumen: >
  Los números de Catalan C(n) = C(2n, n)/(n + 1) cuentan caminos que nunca bajan del suelo, palabras de
  paréntesis balanceados, triangulaciones de polígonos y muchas otras estructuras recursivas.
formula: 'C_n = \frac{1}{n+1}\binom{2n}{n},\qquad C_{n+1} = \sum_{i=0}^{n} C_i\, C_{n-i}'
visualizacion:
  componente: CatalanViz
  parametros:
    vista: caminos
    n: 4
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Un corredor de montaña sube o baja un tramo a la vez, empieza al nivel del suelo, debe terminar también al nivel del suelo y nunca puede quedar por debajo. Con 4 subidas y 4 bajadas, ¿cuántos perfiles de montaña distintos hay? Sin la restricción de no bajar del suelo habría $\binom{8}{4} = 70$ perfiles; con ella quedan solo 14.

El mismo número 14 aparece en problemas que no parecen tener nada que ver: las formas de escribir 4 pares de paréntesis bien balanceados, como `(()())()`, las formas de dividir un hexágono en triángulos con diagonales que no se cruzan, o los árboles binarios con 4 nodos internos. Cada subida es un paréntesis que abre y cada bajada uno que cierra; no bajar del suelo significa no cerrar un paréntesis que no se abrió.

Todas estas familias se descomponen de la misma manera recursiva, y por eso comparten la sucesión $1, 1, 2, 5, 14, 42, \dots$, los números de Catalan.

## Definición

:::definicion[Número de Catalan]
El $n$-ésimo número de Catalan es
$$
C_n = \frac{1}{n+1}\binom{2n}{n} = \binom{2n}{n} - \binom{2n}{n+1}.
$$
:::

$C_n$ cuenta, entre otras familias: los caminos de Dyck de longitud $2n$ (sucesiones de $n$ pasos $+1$ y $n$ pasos $-1$ cuyas sumas parciales nunca son negativas); las palabras de $n$ pares de paréntesis balanceados; las triangulaciones de un polígono convexo de $n + 2$ lados; y los árboles binarios con $n$ nodos internos.

:::teorema[Recurrencia]
$C_0 = 1$ y $C_{n+1} = \sum_{i=0}^{n} C_i\,C_{n-i}$.
:::

:::demostracion
Un camino de Dyck no vacío regresa al suelo por primera vez después de $2(i + 1)$ pasos para un único $i$. El tramo inicial es una subida, un camino de Dyck de longitud $2i$ elevado un nivel y una bajada; lo que sigue es un camino de Dyck de longitud $2(n - i)$. Hay $C_i\,C_{n-i}$ caminos para cada $i$.
:::

## Cómo usar la visualización

La vista "Caminos de montaña" dibuja cada camino de Dyck como un perfil sobre el suelo. "Paréntesis" muestra el mismo camino con un paréntesis que abre en cada subida y uno que cierra en cada bajada. "Triangulaciones" dibuja las divisiones de un polígono de $n + 2$ lados. La reproducción lista todos los objetos de la vista elegida y el panel los compara con $C_n$.

Con $n = 4$ las tres vistas terminan en 14 objetos. Al pasar a $n = 5$ se obtienen 42 en cada una. En la vista de paréntesis se ve que la palabra nunca tiene más paréntesis de cierre que de apertura en ningún punto, que es la condición de no bajar del suelo.

## Ejemplo

Se calcula $C_5$ y se verifica con la recurrencia.

1. Fórmula cerrada: $C_5 = \frac{1}{6}\binom{10}{5} = \frac{252}{6} = 42$.
2. Por diferencia: $\binom{10}{5} - \binom{10}{6} = 252 - 210 = 42$. El término restado cuenta los caminos que bajan del suelo, mediante el principio de reflexión.
3. Recurrencia: $C_5 = C_0C_4 + C_1C_3 + C_2C_2 + C_3C_1 + C_4C_0 = 14 + 5 + 4 + 5 + 14 = 42$.
4. Interpretación: hay 42 formas de triangular un heptágono y 42 expresiones con 5 pares de paréntesis balanceados.

## Propiedades

- **Primeros valores:** $1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862$.
- **Función generadora:** $C(x) = \sum_{n} C_n x^n$ satisface $C(x) = 1 + x\,C(x)^2$, de donde $C(x) = \frac{1 - \sqrt{1 - 4x}}{2x}$.
- **Crecimiento:** $C_n \sim \frac{4^n}{n^{3/2}\sqrt{\pi}}$.
- **Principio de reflexión:** los caminos de $n$ subidas y $n$ bajadas que tocan el nivel $-1$ están en biyección con los caminos de $n - 1$ subidas y $n + 1$ bajadas, lo que da la fórmula por diferencia.
- **Recurrencia de primer orden:** $C_{n+1} = \frac{2(2n+1)}{n+2}C_n$.

## Errores comunes

- **Olvidar la restricción.** Sin la condición de no bajar del suelo, el conteo es $\binom{2n}{n}$, no $C_n$.
- **Confundir el tamaño del polígono.** $C_n$ cuenta triangulaciones de un polígono de $n + 2$ lados, no de $n$.
- **Aplicar la fórmula con $n$ desplazado.** $C_4 = 14$ corresponde a 4 pares de paréntesis, es decir, palabras de longitud 8.

## Conexiones

Los números de Catalan se expresan con el [[coeficiente-binomial]] y se interpretan como caminos en la rejilla con una restricción. Su recurrencia es un producto de convolución, típico de las [[funciones-generadoras-ordinarias]], y su crecimiento se estudia con [[relaciones-de-recurrencia-lineales|recurrencias]] y la [[factorial|aproximación de Stirling]]. En probabilidad, el principio de reflexión que da su fórmula es el mismo que se usa para estudiar máximos de caminatas aleatorias.
