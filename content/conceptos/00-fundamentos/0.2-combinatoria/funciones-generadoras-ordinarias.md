---
id: funciones-generadoras-ordinarias
titulo: Funciones generadoras ordinarias
titulo_en: Ordinary generating functions
alias:
  - función generadora ordinaria
  - series de potencias formales
  - FGO
modulo: 0
submodulo: '0.2'
orden: 22
nivel: intermedio
prerrequisitos:
  - particiones-de-enteros
  - serie-geometrica
etiquetas:
  - funciones generadoras
  - series de potencias
  - conteo
  - convolución
resumen: >
  La función generadora ordinaria de una sucesión a0, a1, a2, ... es la serie a0 + a1 x + a2 x^2 + ... .
  Multiplicar funciones generadoras combina elecciones, y el coeficiente de x^n cuenta las formas de sumar n.
formula: 'A(x) = \sum_{n \ge 0} a_n x^n,\qquad A(x)B(x) = \sum_{n \ge 0}\Big(\sum_{k=0}^{n} a_k b_{n-k}\Big)x^n'
visualizacion:
  componente: GeneratingFunctionViz
  parametros:
    modo: ordinaria
    partes: [1, 2, 5, 10]
    nombre: moneda
    objetivo: 20
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

¿De cuántas maneras se pueden pagar 20 pesos con monedas de 1, 2, 5 y 10? Una idea ingeniosa es escribir, para cada tipo de moneda, un "catálogo" de las cantidades que puede aportar: las monedas de 5 aportan 0, 5, 10, 15, ... pesos, lo que se anota como $1 + x^5 + x^{10} + x^{15} + \cdots$, donde el exponente es la cantidad aportada. Al multiplicar los catálogos de los cuatro tipos, cada término del producto elige una aportación de cada tipo, y los exponentes se suman. Así, el coeficiente de $x^{20}$ en el producto es exactamente el número de maneras de pagar 20 pesos.

La variable $x$ no representa ningún número: es una etiqueta que lleva la cuenta. La función generadora es un "tendedero" en el que se cuelga toda una sucesión de números, y las operaciones algebraicas con series (sumar, multiplicar, derivar) se traducen en operaciones de conteo.

## Definición

:::definicion[Función generadora ordinaria]
La **función generadora ordinaria** de una sucesión $(a_n)_{n \ge 0}$ es la serie de potencias formal
$$
A(x) = \sum_{n \ge 0} a_n x^n.
$$
Se escribe $[x^n]A(x) = a_n$ para el coeficiente de $x^n$.
:::

Las series formales se suman y multiplican término a término, sin preocuparse por la convergencia:

- $A(x) + B(x)$ corresponde a la sucesión $a_n + b_n$.
- $A(x)B(x)$ corresponde a la **convolución** $c_n = \sum_{k=0}^{n} a_k b_{n-k}$.

:::teorema[Regla del producto para funciones generadoras]
Si $a_k$ cuenta las formas de obtener un tamaño $k$ con un primer tipo de objeto y $b_j$ las formas de obtener un tamaño $j$ con un segundo tipo, entonces $[x^n]A(x)B(x)$ cuenta los pares de elecciones cuyos tamaños suman $n$.
:::

## Cómo usar la visualización

Cada barra es el coeficiente de $x^n$, el número de maneras de formar $n$ pesos con las monedas incorporadas hasta ese momento. La reproducción multiplica los factores uno por uno: primero solo monedas de 1 (todas las barras valen 1), luego se agregan las de 2, las de 5 y las de 10. El contorno punteado muestra los coeficientes antes del último factor. El panel indica el coeficiente del total buscado.

Con las cuatro monedas, el coeficiente de $x^{20}$ es 40. Al activar "Cada moneda a lo más una vez", cada factor se vuelve $1 + x^{s}$ y solo quedan unas cuantas formas de pagar, las sumas de denominaciones distintas. Al mover el total buscado se lee cualquier otro coeficiente en la misma gráfica.

## Ejemplo

Se cuentan las formas de pagar 10 pesos con monedas de 1, 2 y 5.

1. Funciones generadoras de cada tipo: $\frac{1}{1-x}$, $\frac{1}{1-x^2}$ y $\frac{1}{1-x^5}$, por la serie geométrica.
2. Solo con monedas de 1: un modo para cada total; coeficiente de $x^{10}$ igual a 1.
3. Con monedas de 1 y 2: el coeficiente de $x^n$ en $\frac{1}{(1-x)(1-x^2)}$ es $\lfloor n/2 \rfloor + 1$, que para $n = 10$ vale 6.
4. Con monedas de 5: se suman los casos de 0, 1 o 2 monedas de 5, con 10, 5 y 0 pesos restantes: $6 + 3 + 1 = 10$ formas.

## Propiedades

- **Serie geométrica:** $\frac{1}{1 - x} = \sum_{n} x^n$ y $\frac{1}{1 - cx} = \sum_n c^n x^n$.
- **Binomio:** $(1 + x)^m = \sum_k \binom{m}{k}x^k$ y $\frac{1}{(1-x)^m} = \sum_k \binom{m + k - 1}{k}x^k$, que es estrellas y barras.
- **Desplazamiento:** multiplicar por $x$ corre la sucesión: $xA(x)$ corresponde a $a_{n-1}$.
- **Sumas parciales:** $\frac{A(x)}{1 - x}$ corresponde a $\sum_{k \le n} a_k$.
- **Derivada:** $xA'(x)$ corresponde a $n\,a_n$.
- **Recurrencias:** toda recurrencia lineal con coeficientes constantes tiene una función generadora racional.
- **Probabilidad:** la función generadora de probabilidad de una variable entera no negativa es $\mathbb{E}[x^X] = \sum_n P(X = n)x^n$.

## Errores comunes

- **Tratar $x$ como un número.** En conteo, $x$ es una marca; la serie no necesita converger para ser útil.
- **Confundir producto de series con producto de coeficientes.** El coeficiente de $x^n$ en $A(x)B(x)$ es una convolución, no $a_n b_n$.
- **Usar funciones ordinarias con objetos etiquetados.** Cuando los objetos son distinguibles y se reparten posiciones, conviene la versión exponencial.

## Conexiones

La función generadora de las [[particiones-de-enteros]] es un producto de factores de [[serie-geometrica|series geométricas]], y la de las [[combinaciones-con-repeticion]] es una potencia de $\frac{1}{1-x}$. Las [[funciones-generadoras-exponenciales]] adaptan la idea a objetos etiquetados, y las [[relaciones-de-recurrencia-lineales]] se resuelven con funciones generadoras racionales. En probabilidad, las funciones generadoras de probabilidad y de momentos son la misma herramienta aplicada a distribuciones.
