---
id: funciones-generadoras-exponenciales
titulo: Funciones generadoras exponenciales
titulo_en: Exponential generating functions
alias:
  - función generadora exponencial
  - FGE
  - estructuras etiquetadas
modulo: 0
submodulo: '0.2'
orden: 23
nivel: intermedio
prerrequisitos:
  - funciones-generadoras-ordinarias
  - permutaciones-con-repeticion
etiquetas:
  - funciones generadoras
  - objetos etiquetados
  - palabras
  - convolución binomial
resumen: >
  La función generadora exponencial de a0, a1, ... es la serie de a_n x^n / n!. Es la adecuada para objetos
  etiquetados: su producto combina estructuras repartiendo las etiquetas, con coeficientes binomiales.
formula: '\hat{A}(x) = \sum_{n \ge 0} a_n \frac{x^n}{n!},\qquad \hat{A}(x)\hat{B}(x) = \sum_{n \ge 0} \Big(\sum_{k=0}^{n}\binom{n}{k}a_k b_{n-k}\Big)\frac{x^n}{n!}'
visualizacion:
  componente: GeneratingFunctionViz
  parametros:
    modo: exponencial
    letras:
      - letra: A
        regla: par
      - letra: C
        regla: cualquiera
      - letra: G
        regla: al-menos-uno
      - letra: T
        regla: cualquiera
    n: 6
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Un laboratorio genera secuencias cortas de ADN con las letras A, C, G y T, y se interesa en las secuencias de longitud 6 que tienen un número par de letras A y al menos una G. Contarlas directamente es tedioso. La diferencia con los problemas de monedas es que aquí las posiciones están etiquetadas: no es lo mismo que la A esté en la posición 1 o en la 4. Si una secuencia usa $k$ letras A y $n - k$ letras de otro tipo, hay $\binom{n}{k}$ formas de elegir las posiciones de las A.

La función generadora exponencial divide cada término entre $n!$ para que ese coeficiente binomial aparezca solo al multiplicar. Para una letra que puede aparecer cualquier número de veces se usa $\sum x^n/n! = e^x$; si debe aparecer un número par de veces, $\cosh x$; si al menos una vez, $e^x - 1$. El producto de las cuatro series codifica todas las secuencias, y el número buscado es $6!$ por el coeficiente de $x^6$.

## Definición

:::definicion[Función generadora exponencial]
La **función generadora exponencial** de $(a_n)_{n \ge 0}$ es
$$
\hat{A}(x) = \sum_{n \ge 0} a_n \frac{x^n}{n!}, \qquad a_n = n!\,[x^n]\hat{A}(x).
$$
:::

:::teorema[Producto de funciones exponenciales]
Si $\hat{C}(x) = \hat{A}(x)\hat{B}(x)$, entonces
$$
c_n = \sum_{k=0}^{n} \binom{n}{k} a_k b_{n-k}.
$$
Si $a_k$ cuenta las estructuras de un tipo sobre $k$ etiquetas y $b_j$ las de otro tipo sobre $j$ etiquetas, $c_n$ cuenta las formas de repartir $n$ etiquetas en dos grupos y poner una estructura de cada tipo en cada grupo.
:::

:::demostracion
El coeficiente de $x^n$ en el producto es $\sum_k \frac{a_k}{k!}\frac{b_{n-k}}{(n-k)!}$; al multiplicar por $n!$ se obtiene $\sum_k \frac{n!}{k!(n-k)!}a_k b_{n-k}$.
:::

## Cómo usar la visualización

Cada barra es el número de secuencias de una longitud dada que cumplen las condiciones de las letras incorporadas. La reproducción multiplica las funciones generadoras de las letras una por una: A con número par de apariciones, C libre, G al menos una vez y T libre. El panel compara el conteo que da la función generadora con el que se obtiene al listar todas las secuencias posibles.

Con las cuatro letras y longitud 6, ambos conteos coinciden en 1715. Tras incorporar solo A y C, las barras valen $2^{n-1}$ para $n \ge 1$: la mitad de las cadenas de A y C tienen un número par de A. Al aumentar la longitud máxima, la barra de la mayor longitud crece más o menos como $4^n$.

## Ejemplo

Se cuentan las secuencias de longitud $n$ con letras A, C, G, T que tienen un número par de A y al menos una G.

1. Funciones de cada letra: $\cosh x$ para A, $e^x$ para C y T, $e^x - 1$ para G.
2. Producto: $\cosh x \cdot e^{2x}(e^x - 1) = \tfrac{1}{2}(e^x + e^{-x})(e^{3x} - e^{2x}) = \tfrac{1}{2}\left(e^{4x} - e^{3x} + e^{2x} - e^{x}\right)$.
3. Como $n![x^n]e^{cx} = c^n$, se obtiene $a_n = \tfrac{1}{2}\left(4^n - 3^n + 2^n - 1\right)$.
4. Para $n = 6$: $\tfrac{1}{2}(4096 - 729 + 64 - 1) = \tfrac{3430}{2} = 1715$.
5. Comprobación por complemento: las secuencias con número par de A son $\tfrac{1}{2}(4^6 + 2^6) = 2080$, y las que además no tienen G son $\tfrac{1}{2}(3^6 + 1) = 365$; la diferencia es $2080 - 365 = 1715$.

:::figura[La función $\cosh x$ selecciona longitudes pares. Con una letra A que aparece un número par de veces y una letra B libre, el producto $\cosh x \, e^x$ cuenta $2^{n-1}$ palabras de cada longitud $n \ge 1$: la mitad de todas.]{componente="GeneratingFunctionViz"}
```yaml
modo: exponencial
letras:
  - letra: A
    regla: par
  - letra: B
    regla: cualquiera
n: 7
```
:::

## Propiedades

- **Series básicas:** $e^x \leftrightarrow (1, 1, 1, \dots)$; $\frac{1}{1-x} \leftrightarrow (n!)$, las permutaciones; $e^{cx} \leftrightarrow (c^n)$.
- **Paridad:** $\cosh x$ selecciona los tamaños pares y $\sinh x$ los impares.
- **Conjuntos de estructuras:** si $\hat{A}(x)$ cuenta estructuras conexas, $\exp(\hat{A}(x))$ cuenta conjuntos de ellas; por ejemplo, $e^{e^x - 1}$ genera los números de Bell.
- **Desarreglos:** $\sum_n D_n \frac{x^n}{n!} = \frac{e^{-x}}{1-x}$, porque toda permutación es un conjunto de puntos fijos junto con un desarreglo.
- **Derivada:** $\hat{A}'(x)$ corresponde a la sucesión desplazada $a_{n+1}$.

## Errores comunes

- **Usar la versión ordinaria con objetos etiquetados.** El producto ordinario olvida el factor $\binom{n}{k}$ que reparte las posiciones.
- **Olvidar multiplicar por $n!$ al final.** El número buscado es $a_n = n!\,[x^n]\hat{A}(x)$, no el coeficiente solo.
- **Confundir "al menos una vez" con "exactamente una vez".** La primera condición da $e^x - 1$ y la segunda da $x$.

## Conexiones

Las funciones generadoras exponenciales adaptan las [[funciones-generadoras-ordinarias]] a objetos etiquetados, y su producto reparte posiciones como en las [[permutaciones-con-repeticion]]. Generan los [[numeros-de-bell]] y los [[desarreglos]], y la función exponencial que las define es la misma que aparece en la serie de Taylor. En probabilidad, la función generadora de momentos $\mathbb{E}[e^{tX}]$ es una función generadora exponencial de los momentos de $X$.
